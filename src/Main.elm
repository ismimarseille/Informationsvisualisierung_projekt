port module Main exposing (main)

{-| Drei verbundene Sichten auf `energycharts_publicpower`: Flächendiagramm
(Zeitreihen), Heatmap (pixel-orientiert), Treemap (Bäume).

Verbunden über gemeinsamen Zustand: Hover hebt eine Quelle überall hervor,
Klick auf einen Tag in der Heatmap fokussiert die beiden anderen Sichten.
-}

import Api
import Browser
import Chart.Heatmap as Heatmap
import Chart.StackedArea as StackedArea
import Chart.Treemap as Treemap
import Color
import Dict exposing (Dict)
import Energy exposing (Metric(..), Row)
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Html.Lazy
import Http
import Json.Decode as Decode
import Time


-- ============================================================
-- PORTS
-- ============================================================


{-| Scroll-Position aus JS (für die automatisch ein-/ausblendende Navbar). -}
port onScroll : (Float -> msg) -> Sub msg


-- ============================================================
-- MODEL
-- ============================================================


type Status
    = NeedConnect
    | Connecting
    | LoadingBounds
    | LoadingRows
    | Ready
    | Failed String


type alias Model =
    { tokenInput : String
    , token : Maybe String
    , nowSeconds : Int
    , country : String
    , windowDays : Int
    , metric : Metric
    , latest : Maybe Int
    , ceilings : Dict String Int
    , rowsByCountry : Dict String (List Row)
    , loadedDays : Dict String Int
    , status : Status
    , hovered : Maybe String
    , pinned : List String
    , focusedDay : Maybe Int
    , mouse : ( Float, Float )
    , navHidden : Bool
    , navPinned : Bool
    , lastScroll : Float
    , previewMetric : Maybe Metric
    , previewCountry : Maybe String
    , treemapFocus : Maybe String
    , elapsed : Float
    }


{-| Aktuell dargestelltes Land: das per Hover vorgeschaute (sofern schon
geladen), sonst das ausgewählte. So bleibt beim Hover das bisherige Bild
stehen, bis die Vorschau-Daten da sind (kein Flackern/Leerstand). -}
activeCountry : Model -> String
activeCountry model =
    case model.previewCountry of
        Just p ->
            if Dict.member p model.rowsByCountry then
                p

            else
                model.country

        Nothing ->
            model.country


activeRows : Model -> List Row
activeRows model =
    Dict.get (activeCountry model) model.rowsByCountry |> Maybe.withDefault []


{-| Flag = `Date.now()` aus dem Browser (Millisekunden), um die jüngsten Daten
ohne langsame Voll-Tabellen-Abfrage einzugrenzen. -}
init : Float -> ( Model, Cmd Msg )
init nowMillis =
    ( { tokenInput = ""
      , token = Nothing
      , nowSeconds = round (nowMillis / 1000)
      , country = "all"
      , windowDays = 7
      , metric = SolarShare
      , latest = Nothing
      , ceilings = Dict.empty
      , rowsByCountry = Dict.empty
      , loadedDays = Dict.empty
      , status = NeedConnect
      , hovered = Nothing
      , pinned = []
      , focusedDay = Nothing
      , mouse = ( 0, 0 )
      , navHidden = False
      , navPinned = False
      , lastScroll = 0
      , previewMetric = Nothing
      , previewCountry = Nothing
      , treemapFocus = Nothing
      , elapsed = 0
      }
    , Cmd.none
    )


-- ============================================================
-- UPDATE
-- ============================================================


type Msg
    = TokenInput String
    | Connect
    | GotToken (Result Http.Error String)
    | GotRecent (Result Http.Error (List ( String, Int, Int )))
      -- Land, Tage, Offset, ob bereits über den id-Fallback geladen wird
    | GotCountryRows String Int Int Bool (Result Http.Error (List Row))
    | SelectCountry String
    | SelectWindow Int
    | SelectMetric Metric
    | HoverSource (Maybe String)
    | PinSource String
    | MouseMove Float Float
    | ClickDay Int
    | Scrolled Float
    | ToggleNavPin
    | HoverMetric (Maybe Metric)
    | HoverCountry (Maybe String)
    | DrillBand (Maybe String)
    | Tick
    | Reload


{-| Untergrenze für die „jüngste Daten"-Abfrage: Browser-Jetzt minus 90 Tage
(großzügige Marge über den Daten-Verzug; vermeidet die langsame
Voll-Tabellen-Abfrage). -}
lbOf : Model -> Int
lbOf model =
    model.nowSeconds - 90 * 86400


{-| `id`-Block `(lo, hi]` des Landes aus den Block-Obergrenzen ableiten:
`hi` = Obergrenze des Landes, `lo` = nächstkleinere Obergrenze (Blöcke sind
zusammenhängend und nach `id` geordnet). Unbekanntes Land -> ganzer Bereich. -}
boundsFor : Dict String Int -> String -> ( Int, Int )
boundsFor ceilings code =
    case Dict.get code ceilings of
        Just hi ->
            let
                lo =
                    Dict.values ceilings
                        |> List.filter (\v -> v < hi)
                        |> List.maximum
                        |> Maybe.withDefault 0
            in
            ( lo, hi )

        Nothing ->
            ( 0, Dict.values ceilings |> List.maximum |> Maybe.withDefault 2000000000 )


{-| Lädt `days` Tage eines Landes (erste Seite) in den Cache. Bei `isPrimary`
(das aktuell gewählte Land) wird der Ladezustand angezeigt; Vorschau-Lädungen
laufen still im Hintergrund. -}
loadCountry : Bool -> Int -> String -> Model -> ( Model, Cmd Msg )
loadCountry isPrimary days code model =
    case ( model.token, model.latest ) of
        ( Just token, Just tmax ) ->
            ( if isPrimary then
                { model | status = LoadingRows, focusedDay = Nothing, elapsed = 0 }

              else
                model
            , pageCmd model code days 0 False
            )

        _ ->
            ( model, Cmd.none )


{-| Eine Seite anfordern – normal über `country_id = code`, im Fallback über den
numerischen id-Bereich. -}
pageCmd : Model -> String -> Int -> Int -> Bool -> Cmd Msg
pageCmd model code days offset viaIdBlock =
    case ( model.token, model.latest ) of
        ( Just token, Just tmax ) ->
            let
                tmin =
                    tmax - days * 86400
            in
            if viaIdBlock then
                Api.loadCountryByIdBlock token
                    (boundsFor model.ceilings code)
                    tmin
                    offset
                    (GotCountryRows code days offset True)

            else
                Api.loadCountryRows token code tmin offset (GotCountryRows code days offset False)

        _ ->
            Cmd.none


{-| Reicht der Cache eines Landes für das aktuell gewählte Zeitfenster? -}
hasEnough : String -> Model -> Bool
hasEnough code model =
    (Dict.get code model.loadedDays |> Maybe.withDefault 0) >= model.windowDays


{-| Lädt ein Land nur, wenn der Cache für das gewählte Fenster nicht reicht
(Hover-Vorschau). -}
ensureCountry : String -> Model -> ( Model, Cmd Msg )
ensureCountry code model =
    if hasEnough code model then
        ( model, Cmd.none )

    else
        loadCountry False model.windowDays code model


{-| Lädt beim Verbinden **alle** Länder parallel in den Cache, damit der
Hover-Wechsel danach ohne Verzögerung sofort erfolgt. -}
loadAllCountries : Model -> ( Model, Cmd Msg )
loadAllCountries model =
    let
        days =
            max prefetchDays model.windowDays
    in
    ( { model | status = LoadingRows, elapsed = 0, focusedDay = Nothing }
    , countries
        |> List.map (\( code, _ ) -> pageCmd model code days 0 False)
        |> Cmd.batch
    )


{-| Vorrat, der beim Verbinden für **jedes** Land geholt wird: 7/14/30 Tage sind
daraus clientseitig geschnitten und ohne Nachladen umschaltbar. Das 90-Tage-
Fenster wird erst bei Bedarf und nur für das gewählte Land nachgeladen. -}
prefetchDays : Int
prefetchDays =
    30


{-| Wählbare Zeitfenster in Tagen. -}
windowOptions : List Int
windowOptions =
    [ 7, 14, 30, 90 ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        TokenInput s ->
            ( { model | tokenInput = s }, Cmd.none )

        Connect ->
            let
                manual =
                    String.trim model.tokenInput
            in
            if manual /= "" then
                ( { model | token = Just manual, status = LoadingBounds, elapsed = 0 }
                , Api.getRecent manual (lbOf model) GotRecent
                )

            else
                ( { model | status = Connecting, elapsed = 0 }, Api.getToken GotToken )

        GotToken (Ok t) ->
            ( { model | token = Just t, status = LoadingBounds }
            , Api.getRecent t (lbOf model) GotRecent
            )

        GotToken (Err e) ->
            ( { model | status = Failed ("Token konnte nicht geholt werden – läuft der Proxy? (" ++ httpErr e ++ ")") }
            , Cmd.none
            )

        GotRecent (Ok triples) ->
            let
                tmax =
                    triples |> List.map (\( _, _, u ) -> u) |> List.maximum

                ceilings =
                    List.foldl
                        (\( c, i, _ ) d -> Dict.update c (\m -> Just (max i (Maybe.withDefault 0 m))) d)
                        Dict.empty
                        triples
            in
            case tmax of
                Just t ->
                    loadAllCountries { model | latest = Just t, ceilings = ceilings }

                Nothing ->
                    ( { model | status = Failed "Keine aktuellen Daten gefunden (Zeitfenster zu eng?)." }, Cmd.none )

        GotRecent (Err e) ->
            ( { model | status = Failed (httpErr e) }, Cmd.none )

        GotCountryRows code days offset viaIdBlock (Ok rows) ->
            let
                -- Fremde Länder in der Antwort heißen: die API hat den
                -- country_id-Vergleich ignoriert. Dann einmalig auf den
                -- id-Bereich ausweichen, statt stillschweigend Zeilen zu verlieren.
                filterIgnored =
                    not viaIdBlock && List.any (\r -> r.countryId /= code) rows

                fresh =
                    List.filter (\r -> r.countryId == code) rows

                -- Erste Seite ersetzt den alten Stand, Folgeseiten hängen an.
                merged =
                    if offset == 0 then
                        fresh

                    else
                        (Dict.get code model.rowsByCountry |> Maybe.withDefault []) ++ fresh

                -- Volle Seite ⇒ es gibt vermutlich noch weitere.
                morePages =
                    List.length rows >= Api.pageLimit

                nextOffset =
                    offset + Api.pageLimit

                m2 =
                    { model
                        | rowsByCountry = Dict.insert code merged model.rowsByCountry
                        , loadedDays =
                            if morePages then
                                model.loadedDays

                            else
                                Dict.insert code days model.loadedDays
                        , status =
                            if code == model.country && not morePages then
                                Ready

                            else
                                model.status
                    }
            in
            if filterIgnored then
                ( model, pageCmd model code days 0 True )

            else if morePages then
                ( m2, pageCmd model code days nextOffset viaIdBlock )

            else
                ( m2, Cmd.none )

        GotCountryRows code _ _ _ (Err e) ->
            ( { model
                | status =
                    if code == model.country then
                        Failed (httpErr e)

                    else
                        model.status
              }
            , Cmd.none
            )

        SelectCountry c ->
            let
                m2 =
                    { model | country = c, previewCountry = Nothing }
            in
            if hasEnough c m2 then
                ( { m2 | status = Ready }, Cmd.none )

            else
                loadCountry True m2.windowDays c m2

        HoverCountry mc ->
            case mc of
                Just code ->
                    ensureCountry code { model | previewCountry = Just code }

                Nothing ->
                    ( { model | previewCountry = Nothing }, Cmd.none )

        SelectWindow d ->
            -- 7/14/30 Tage stecken schon im Vorrat; 90 Tage werden für das
            -- gewählte Land nachgeladen (mehrseitig).
            let
                m2 =
                    { model | windowDays = d }

                code =
                    activeCountry m2
            in
            if hasEnough code m2 then
                ( m2, Cmd.none )

            else
                loadCountry True d code m2

        SelectMetric m ->
            ( { model | metric = m, previewMetric = Nothing }, Cmd.none )

        HoverMetric mm ->
            ( { model | previewMetric = mm }, Cmd.none )

        DrillBand mb ->
            ( { model | treemapFocus = mb }, Cmd.none )

        Tick ->
            ( { model | elapsed = model.elapsed + 0.1 }, Cmd.none )

        HoverSource ms ->
            ( { model | hovered = ms }, Cmd.none )

        PinSource name ->
            ( { model
                | pinned =
                    if List.member name model.pinned then
                        List.filter ((/=) name) model.pinned

                    else
                        name :: model.pinned
              }
            , Cmd.none
            )

        MouseMove x y ->
            ( { model | mouse = ( x, y ) }, Cmd.none )

        Scrolled y ->
            let
                delta =
                    y - model.lastScroll

                hidden =
                    if y < 90 then
                        False

                    else if delta > 6 then
                        True

                    else if delta < -6 then
                        False

                    else
                        model.navHidden
            in
            ( { model | lastScroll = y, navHidden = hidden }, Cmd.none )

        ToggleNavPin ->
            ( { model | navPinned = not model.navPinned }, Cmd.none )

        ClickDay d ->
            ( { model
                | focusedDay =
                    if model.focusedDay == Just d then
                        Nothing

                    else
                        Just d
              }
            , Cmd.none
            )

        Reload ->
            loadAllCountries model


httpErr : Http.Error -> String
httpErr err =
    case err of
        Http.BadUrl u ->
            "BadUrl " ++ u

        Http.Timeout ->
            "Timeout"

        Http.NetworkError ->
            "Netzwerkfehler (läuft der Proxy auf Port 3001?)"

        Http.BadStatus s ->
            "Status " ++ String.fromInt s

        Http.BadBody b ->
            "Antwort nicht lesbar: " ++ String.left 120 b


-- ============================================================
-- VIEW
-- ============================================================


view : Model -> Html Msg
view model =
    let
        rows =
            activeRows model

        -- Platzhalter-/Vorschau-Zeilen (alle Werte null -> 0) ausblenden.
        visibleRows =
            rows
                |> List.filter (\r -> Energy.totalGeneration r > 0 || r.load > 0)
    in
    Html.div [ HA.class "app", onMouseMove MouseMove ]
        [ topNav model
        , Html.div [ HA.class "page" ]
            [ if List.isEmpty visibleRows then
                emptyView model

              else
                -- Charts in `lazy` gekapselt: bei reiner Mausbewegung (Tooltip)
                -- werden sie nicht neu gezeichnet – nur bei Hover/Pin/Metrik/Fenster/Land/Daten.
                Html.Lazy.lazy7 chartsView
                    model.hovered
                    model.pinned
                    (Maybe.withDefault model.metric model.previewMetric)
                    model.focusedDay
                    model.windowDays
                    model.treemapFocus
                    rows
            ]
        , tooltipView model
        ]


{-| Menge der hervorgehobenen Quellen: die fixierten (angeklickten) dominieren;
ist nichts fixiert, wird die gerade überfahrene hervorgehoben. Leere Liste =
alles normal. Mehrere Quellen können parallel fixiert sein. -}
activeOf : List String -> Maybe String -> List String
activeOf pinned hovered =
    if not (List.isEmpty pinned) then
        pinned

    else
        case hovered of
            Just h ->
                [ h ]

            Nothing ->
                []


onMouseMove : (Float -> Float -> msg) -> Html.Attribute msg
onMouseMove tagger =
    HE.on "mousemove"
        (Decode.map2 tagger
            (Decode.field "clientX" Decode.float)
            (Decode.field "clientY" Decode.float)
        )


tooltipView : Model -> Html Msg
tooltipView model =
    case model.hovered of
        Just name ->
            let
                ( x, y ) =
                    model.mouse
            in
            Html.div
                [ HA.class "tooltip"
                , HA.style "left" (String.fromFloat x ++ "px")
                , HA.style "top" (String.fromFloat y ++ "px")
                ]
                [ Html.div [ HA.class "tt-head" ]
                    [ Html.span
                        [ HA.class "tt-dot"
                        , HA.style "background" (Color.toCssString (Energy.bandColorByName name))
                        ]
                        []
                    , Html.text name
                    ]
                , Html.div [ HA.class "tt-body" ] [ Html.text (Energy.bandInfo name) ]
                , Html.div [ HA.class "tt-hint" ]
                    [ Html.text
                        (if List.member name model.pinned then
                            "Klick: Fixierung lösen"

                         else
                            "Klick: fixieren"
                        )
                    ]
                ]

        Nothing ->
            Html.text ""


topNav : Model -> Html Msg
topNav model =
    Html.node "nav"
        [ HA.class (navClass model) ]
        [ Html.div [ HA.class "topnav-inner" ]
            -- Marken-Säule links (volle Höhe)
            [ Html.div [ HA.class "brand-col" ]
                [ Html.div [ HA.class "brand-name" ] [ Html.text "EnergyCharts" ] ]

            -- Rechts: eine flache Zeile – Steuerungen · Quellen · Status/Aktionen/CTA
            , Html.div [ HA.class "nav-main" ]
                [ Html.div [ HA.class "nav-line" ]
                    [ controlCluster model
                    , Html.div [ HA.class "nav-actions" ]
                        [ Html.div [ HA.class "action-group" ]
                            [ iconToggle model.navPinned ToggleNavPin "ico-pin" "Leiste dauerhaft einblenden" ]
                        , primaryButton model
                        ]
                    ]
                , Html.div [ HA.class "nav-sub" ] [ legend model ]
                ]
            ]
        ]


{-| Verbinden **und** Aktualisieren in einem Button – zeigt live, was gerade
im Hintergrund passiert und wie lange es dauert. -}
primaryButton : Model -> Html Msg
primaryButton model =
    let
        busy =
            isBusy model.status

        ( label, iconClass ) =
            case model.status of
                Connecting ->
                    ( "Token", "ico-refresh" )

                LoadingBounds ->
                    ( "Struktur", "ico-refresh" )

                LoadingRows ->
                    ( "Lädt", "ico-refresh" )

                Ready ->
                    ( "Aktualisieren", "ico-refresh" )

                _ ->
                    ( "Verbinden", "ico-link" )

        action =
            if model.latest == Nothing then
                Connect

            else
                Reload

        -- Batterie-Füllstand je Ladephase
        fillPct =
            case model.status of
                Connecting ->
                    "30%"

                LoadingBounds ->
                    "62%"

                LoadingRows ->
                    "88%"

                _ ->
                    "100%"
    in
    Html.button
        [ HA.classList [ ( "btn", True ), ( "btn-primary", True ), ( "is-busy", busy ) ]
        , HE.onClick action
        , HA.disabled busy
        , HA.style "--fill" fillPct
        ]
        [ Html.span [ HA.class "btn-fill" ] []
        , Html.span [ HA.class "btn-face" ]
            [ Html.span
                [ HA.class
                    ("ico "
                        ++ iconClass
                        ++ (if busy then
                                " spin"

                            else
                                ""
                           )
                    )
                ]
                []
            , Html.span [ HA.class "btn-label" ] [ Html.text label ]
            , if busy then
                Html.span [ HA.class "btn-time" ] [ Html.text (oneDecimal model.elapsed ++ "s") ]

              else
                Html.text ""
            ]
        ]


oneDecimal : Float -> String
oneDecimal x =
    String.fromFloat (toFloat (round (x * 10)) / 10)


navClass : Model -> String
navClass model =
    String.join " "
        (List.filterMap identity
            [ Just "topnav"
            , if model.navHidden && not model.navPinned then
                Just "is-hidden"

              else
                Nothing
            , if model.navPinned then
                Just "is-pinned"

              else
                Nothing
            ]
        )


iconToggle : Bool -> Msg -> String -> String -> Html Msg
iconToggle active msg iconClass tip =
    Html.button
        [ HA.classList [ ( "icon-btn", True ), ( "is-on", active ) ]
        , HE.onClick msg
        , HA.title tip
        ]
        [ Html.span [ HA.class ("ico " ++ iconClass) ] [] ]


emptyHint : Model -> String
emptyHint model =
    case model.status of
        Ready ->
            "Keine Daten für " ++ countryLabel model.country ++ " im gewählten Zeitfenster – in dieser Entwicklungs-DB enthält das Land evtl. nur Platzhalter. Bitte ein anderes Land wählen."

        _ ->
            "Noch keine Daten geladen – bitte oben rechts auf „Verbinden“ klicken."


emptyView : Model -> Html Msg
emptyView model =
    Html.div [ HA.class "empty" ]
        [ Html.span [ HA.class "empty-emoji" ] [ Html.text "📭" ]
        , Html.span [] [ Html.text (emptyHint model) ]
        ]


controlCluster : Model -> Html Msg
controlCluster model =
    Html.div [ HA.class "control-cluster" ]
        [ control "ico-globe" "Land"
            (Html.div [ HA.class "land-wrap" ]
                [ dropdown [ HE.onMouseLeave (HoverCountry Nothing) ]
                    (countryFlag model.country ++ "  " ++ countryLabel model.country)
                    (List.map
                        (\( code, name ) ->
                            dropdownItem (code == model.country)
                                [ HE.onMouseOver (HoverCountry (Just code)) ]
                                (SelectCountry code)
                                (countryFlag code ++ "  " ++ name)
                        )
                        countries
                    )
                , Html.div [ HA.class "count-slot" ] [ countBadge model ]
                ]
            )
        , control "ico-calendar" "Zeitfenster"
            (Html.div [ HA.class "segmented" ]
                (List.map (windowButton model.windowDays) windowOptions)
            )
        , control "ico-gauge" "Metrik"
            (dropdown
                [ HE.onMouseLeave (HoverMetric Nothing) ]
                (Energy.metricLabel model.metric)
                (List.map
                    (\m ->
                        dropdownItem (m == model.metric)
                            [ HE.onMouseOver (HoverMetric (Just m)) ]
                            (SelectMetric m)
                            (Energy.metricLabel m)
                    )
                    [ SolarShare, RenewableShare, LoadMetric ]
                )
            )
        ]


control : String -> String -> Html Msg -> Html Msg
control iconClass labelText child =
    Html.div [ HA.class "control" ]
        [ Html.span [ HA.class "control-label" ]
            [ Html.span [ HA.class ("ico ico-sm " ++ iconClass) ] []
            , Html.text labelText
            ]
        , child
        ]


{-| Custom-Dropdown: öffnet automatisch beim Hover (CSS), schließt beim Verlassen.
Für die Metrik löst Hover eine Live-Vorschau aus (siehe `HoverMetric`). -}
dropdown : List (Html.Attribute Msg) -> String -> List (Html Msg) -> Html Msg
dropdown extra current items =
    Html.div (HA.class "dropdown" :: extra)
        [ Html.div [ HA.class "dropdown-trigger", HA.tabindex 0 ]
            [ Html.span [ HA.class "dropdown-value" ] [ Html.text current ]
            , Html.span [ HA.class "ico ico-sm ico-caret" ] []
            ]
        , Html.div [ HA.class "dropdown-menu" ] items
        ]


dropdownItem : Bool -> List (Html.Attribute Msg) -> Msg -> String -> Html Msg
dropdownItem active extra clickMsg label =
    Html.div
        (HA.classList [ ( "dropdown-item", True ), ( "is-active", active ) ]
            :: HE.onClick clickMsg
            :: extra
        )
        [ Html.span [ HA.class "di-check" ] []
        , Html.text label
        ]


windowButton : Int -> Int -> Html Msg
windowButton current d =
    Html.button
        [ HA.classList [ ( "seg-btn", True ), ( "is-active", current == d ) ]
        , HE.onClick (SelectWindow d)
        ]
        [ Html.text (String.fromInt d ++ " T") ]


{-| Elegant ins „Land" integrierte Anzeige: geladene Messpunkte (Ready),
sonst ein Fehler-Hinweis. Während des Ladens bleibt sie leer (der Button zeigt
den Fortschritt). -}
countBadge : Model -> Html Msg
countBadge model =
    let
        count =
            Dict.get (activeCountry model) model.rowsByCountry
                |> Maybe.withDefault []
                |> List.length
    in
    case model.status of
        Ready ->
            if count > 0 then
                Html.span
                    [ HA.class "count-badge"
                    , HA.title (String.fromInt count ++ " Messpunkte · " ++ String.fromInt model.windowDays ++ " Tage geladen")
                    ]
                    [ Html.span [ HA.class "count-dot" ] []
                    , Html.text (String.fromInt count ++ " Pkt")
                    ]

            else
                Html.text ""

        Failed e ->
            Html.span [ HA.class "count-badge is-error", HA.title e ] [ Html.text "Fehler" ]

        _ ->
            Html.text ""


legend : Model -> Html Msg
legend model =
    let
        hl =
            activeOf model.pinned model.hovered
    in
    Html.div [ HA.class "legend", HA.tabindex 0 ]
        [ Html.span [ HA.class "legend-kicker" ] [ Html.text "Quellen" ]
        , Html.span [ HA.class "ico ico-sm ico-caret legend-caret" ] []
        , Html.div [ HA.class "legend-chips" ]
            (List.map (legendChip hl model.pinned) Energy.bands)
        ]


legendChip : List String -> List String -> Energy.Band -> Html Msg
legendChip hl pinned band =
    let
        dim =
            not (List.isEmpty hl) && not (List.member band.name hl)

        isPinned =
            List.member band.name pinned
    in
    Html.span
        [ HA.classList
            [ ( "chip", True )
            , ( "is-dim", dim )
            , ( "is-pinned", isPinned )
            ]
        , HE.onMouseOver (HoverSource (Just band.name))
        , HE.onMouseOut (HoverSource Nothing)
        , HE.onClick (PinSource band.name)
        ]
        [ Html.span [ HA.class "swatch", HA.style "background" (Color.toCssString band.color) ] []
        , Html.text band.name
        ]


chartsView : Maybe String -> List String -> Metric -> Maybe Int -> Int -> Maybe String -> List Row -> Html Msg
chartsView hovered pinned metric focusedDay windowDays treemapFocus rows =
    let
        hl =
            activeOf pinned hovered

        allSorted =
            rows
                |> List.filter (\r -> Energy.totalGeneration r > 0 || r.load > 0)
                |> List.sortBy .unixSeconds

        -- 7/14/30 Tage clientseitig aus den geladenen 30-Tage-Daten schneiden.
        tmaxLoaded =
            allSorted |> List.map .unixSeconds |> List.maximum |> Maybe.withDefault 0

        sortedRows =
            List.filter (\r -> r.unixSeconds >= tmaxLoaded - windowDays * 86400) allSorted

        -- Pixel-Sicht in der nativen Auflösung der Daten (kein Binning):
        -- i. d. R. 96 Viertelstunden-Zellen je Tag.
        slots =
            Energy.slotsPerDay sortedRows

        heatCells =
            Energy.heatCells metric slots sortedRows

        treemapRows =
            case focusedDay of
                Just d ->
                    List.filter (\r -> Energy.dayOf r.unixSeconds == d) sortedRows

                Nothing ->
                    sortedRows

        focusNote =
            case focusedDay of
                Just d ->
                    Just (" · Fokus auf " ++ Energy.dayLabel d ++ " (erneut klicken zum Aufheben)")

                Nothing ->
                    Nothing

        treemapSubSums =
            case treemapFocus of
                Just band ->
                    Energy.sumBySub treemapRows (Energy.bandSubs band)

                Nothing ->
                    []
    in
    Html.div [ HA.class "chart-stack" ]
        [ chartCard "1" "Erzeugungsmix & Saldo im Zeitverlauf"
            [ Html.text "Gestapelte Erzeugung nach Quelle; gestrichelt = Last. Rote Fläche = Defizit (durch Import/Speicher zu decken), grüne Fläche = Überschuss (Export/Einspeicherung)." ]
            focusNote
            (StackedArea.view
                { width = 1120
                , height = 450

                -- Für die Verlaufskurve reicht ein Wert je Bildschirm-Pixel;
                -- die Heatmap unten bekommt weiterhin alle Messwerte.
                , rows = Energy.decimateTo 1200 sortedRows
                , active = hl
                , focusedDay = focusedDay
                , onHover = HoverSource
                , onPin = PinSource
                }
            )
        , Html.div [ HA.class "chart-grid" ]
            [ chartCard "2" (Energy.metricLabel metric ++ " nach Uhrzeit & Tag")
                [ Html.text
                    ("Jede Zelle ist ein einzelner Messwert in Originalauflösung ("
                        ++ slotDuration slots
                        ++ ", x = Tag, y = Uhrzeit) – "
                        ++ String.fromInt (List.length heatCells)
                        ++ " Pixel, ohne zeitliche Zusammenfassung. Klick auf einen Tag fokussiert die anderen beiden Sichten."
                    )
                ]
                Nothing
                (Heatmap.view
                    { width = 660
                    , height = 480
                    , cells = heatCells
                    , extent = Energy.heatExtent heatCells
                    , unit = Energy.metricUnit metric
                    , interpolator = Energy.metricInterpolator metric
                    , slotsPerDay = slots
                    , focusedDay = focusedDay
                    , onClickDay = ClickDay
                    }
                )
            , chartCard "3" "Erzeugungsstruktur"
                [ Html.text "Fläche "
                , propSign
                , Html.text " Energieanteil; Ebenen Erneuerbar/Konventionell → Quelle. Klick auf ein Band (z. B. Wind, Kohle) schlüsselt es in seine Rohquellen auf."
                ]
                Nothing
                (Treemap.view
                    { width = 660
                    , height = 480
                    , sums = Energy.sumByBand treemapRows
                    , subSums = treemapSubSums
                    , focus = treemapFocus
                    , active = hl
                    , onHover = HoverSource
                    , onPin = PinSource
                    , onDrill = DrillBand
                    }
                )
            ]
        ]


{-| Proportionalzeichen „∝“ in Textgröße: das Zeichen sitzt in den meisten
UI-Schriften auf x-Höhe und wirkt daher winzig; die Klasse `prop-sign` hebt es
auf Versalhöhe an. `title` erklärt es zusätzlich im Klartext. -}
propSign : Html Msg
propSign =
    Html.span
        [ HA.class "prop-sign", HA.title "proportional zu" ]
        [ Html.text "∝" ]


{-| Dauer eines Heatmap-Slots als Klartext für den Untertitel. -}
slotDuration : Int -> String
slotDuration slots =
    case slots of
        96 ->
            "15 Minuten"

        48 ->
            "30 Minuten"

        _ ->
            "1 Stunde"


{-| `sub` ist bewusst eine Knotenliste (statt eines Strings), damit einzelne
Zeichen – z. B. das Proportionalzeichen „∝“ – eigens ausgezeichnet und in
Textgröße dargestellt werden können. -}
chartCard : String -> String -> List (Html Msg) -> Maybe String -> Html Msg -> Html Msg
chartCard index title sub focusNote chart =
    Html.section [ HA.class "card" ]
        [ Html.div [ HA.class "card-head" ]
            [ Html.span [ HA.class "card-index" ] [ Html.text index ]
            , Html.h3 [ HA.class "card-title" ] [ Html.text title ]
            ]
        , Html.p [ HA.class "card-sub" ]
            (sub
                ++ (case focusNote of
                        Just n ->
                            [ Html.span [ HA.class "focus-note" ] [ Html.text n ] ]

                        Nothing ->
                            []
                   )
            )
        , Html.div [ HA.class "card-body" ] [ chart ]
        ]


-- ============================================================
-- LÄNDER & METRIK-AUSWAHL
-- ============================================================


{-| Länder, die in der Entwicklungs-DB befüllt sind; viele andere (DE, AT,
NL, ES) enthalten dort nur Null-Platzhalter. `all` ist das Europa-Aggregat und
daher die Voreinstellung. -}
countries : List ( String, String )
countries =
    [ ( "all", "Europa (gesamt)" )
    , ( "fr", "Frankreich" )
    , ( "it", "Italien" )
    , ( "pl", "Polen" )
    , ( "cz", "Tschechien" )
    , ( "ch", "Schweiz" )
    , ( "be", "Belgien" )
    , ( "se", "Schweden" )
    , ( "no", "Norwegen" )
    , ( "dk", "Dänemark" )
      -- DE ist in den Daten die Gebotszone DE-LU, also Deutschland samt Luxemburg.
    , ( "de", "Deutschland (DE-LU)" )
    ]


countryLabel : String -> String
countryLabel code =
    countries
        |> List.filter (\( c, _ ) -> c == code)
        |> List.head
        |> Maybe.map Tuple.second
        |> Maybe.withDefault (String.toUpper code)


{-| Flaggen-Emoji je Land (Europa-Aggregat = 🇪🇺). -}
countryFlag : String -> String
countryFlag code =
    case code of
        "all" ->
            "🇪🇺"

        "fr" ->
            "🇫🇷"

        "it" ->
            "🇮🇹"

        "pl" ->
            "🇵🇱"

        "cz" ->
            "🇨🇿"

        "ch" ->
            "🇨🇭"

        "be" ->
            "🇧🇪"

        "se" ->
            "🇸🇪"

        "no" ->
            "🇳🇴"

        "dk" ->
            "🇩🇰"

        "de" ->
            "🇩🇪"

        _ ->
            "🏳️"


countryOption : String -> ( String, String ) -> Html Msg
countryOption current ( code, name ) =
    Html.option [ HA.value code, HA.selected (code == current) ]
        [ Html.text name ]


metricKey : Metric -> String
metricKey m =
    case m of
        SolarShare ->
            "solar"

        RenewableShare ->
            "ee"

        LoadMetric ->
            "load"


metricFromString : String -> Metric
metricFromString s =
    case s of
        "ee" ->
            RenewableShare

        "load" ->
            LoadMetric

        _ ->
            SolarShare


metricOption : Metric -> Metric -> Html Msg
metricOption current m =
    Html.option [ HA.value (metricKey m), HA.selected (m == current) ]
        [ Html.text (Energy.metricLabel m) ]


-- ============================================================
-- MAIN
-- ============================================================


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ onScroll Scrolled
        , if isBusy model.status then
            Time.every 100 (\_ -> Tick)

          else
            Sub.none
        ]


isBusy : Status -> Bool
isBusy status =
    case status of
        Connecting ->
            True

        LoadingBounds ->
            True

        LoadingRows ->
            True

        _ ->
            False


main : Program Float Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }
