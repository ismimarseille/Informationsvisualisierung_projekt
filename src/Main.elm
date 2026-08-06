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
    , tz : Int
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
    , heatSpan : Int
    , heatOffset : Int
    , infoTip : Maybe ( String, String )
    , calOpen : Bool
    , calAnchor : Maybe Int
    , areaSpan : Int
    , areaOffset : Int
    , treemapFull : Bool
    , solar : List ( Int, Float )
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


{-| Flags aus dem Browser: `now` (Millisekunden) grenzt die jüngsten Daten ein,
`tz` ist der Zeitzonen-Versatz in Sekunden östlich von UTC. -}
type alias Flags =
    { now : Float, tz : Int }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { tokenInput = ""
      , token = Nothing
      , tz = flags.tz
      , nowSeconds = round (flags.now / 1000)
      , country = "all"
      , windowDays = 7
      , metric = SolarShare
      , latest = Nothing
      , ceilings = Dict.empty
      , rowsByCountry = Dict.empty
      , loadedDays = Dict.empty
      , status = Connecting
      , hovered = Nothing
      , pinned = []
      , focusedDay = Nothing
      , mouse = ( 0, 0 )
      , navHidden = False
      , navPinned = False
      , lastScroll = 0
      , previewMetric = Nothing
      , previewCountry = Nothing
      , heatSpan = 0
      , heatOffset = 0
      , infoTip = Nothing
      , calOpen = False
      , calAnchor = Nothing
      , areaSpan = 7 * 24
      , areaOffset = 0
      , treemapFull = False
      , solar = []
      , elapsed = 0
      }
      -- Automatisch verbinden: Beim Öffnen (auch nach einem Browser-Reload/
      -- Tab-Verwerfen) lädt die App die Daten selbst, ohne Klick auf „Verbinden".
    , Api.getToken GotToken
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
    | GotSolar (Result Http.Error (List ( Int, Float )))
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
    | SetHeatSpan Int
    | SetHeatOffset Int
    | HoverInfo (Maybe ( String, String ))
    | ResetFilters
    | ToggleCalendar
    | SetCalendar Bool
    | CalShift Int
    | PickDay Int
    | SetAreaSpan Int
    | SetAreaOffset Int
    | ToggleTreemapFull
    | NoOp
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
    [ 7, 14, 30, 90, 180, 365 ]


{-| Lädt die DWD-Globalstrahlung für das aktuelle Fenster (auf 30 Tage begrenzt,
damit die Abfrage klein bleibt). Wetter ist national (Deutschland) und daher
unabhängig vom gewählten Land. -}
ensureSolar : Model -> ( Model, Cmd Msg )
ensureSolar model =
    case ( model.token, model.latest ) of
        ( Just token, Just tmax ) ->
            let
                days =
                    min 30 model.windowDays
            in
            ( model, Api.loadSolar token (tmax - days * 86400) tmax GotSolar )

        _ ->
            ( model, Cmd.none )


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

        GotSolar (Ok pairs) ->
            ( { model | solar = pairs }, Cmd.none )

        GotSolar (Err _) ->
            -- Ohne Wetterdaten bleibt die Heatmap in dieser Metrik leer; die
            -- übrigen Sichten sind davon unberührt.
            ( { model | solar = [] }, Cmd.none )

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
                    { model | windowDays = d, areaSpan = d * 24, areaOffset = 0, heatSpan = 0, heatOffset = 0 }

                code =
                    activeCountry m2

                ( m3, cmd1 ) =
                    if hasEnough code m2 then
                        ( m2, Cmd.none )

                    else
                        loadCountry True d code m2
            in
            -- Bei aktiver DWD-Metrik das Wetter fürs neue Fenster nachladen.
            if m3.metric == Irradiance then
                let
                    ( m4, cmd2 ) =
                        ensureSolar m3
                in
                ( m4, Cmd.batch [ cmd1, cmd2 ] )

            else
                ( m3, cmd1 )

        SelectMetric m ->
            let
                m2 =
                    { model | metric = m, previewMetric = Nothing }
            in
            if m == Irradiance then
                ensureSolar m2

            else
                ( m2, Cmd.none )

        HoverMetric mm ->
            let
                m2 =
                    { model | previewMetric = mm }
            in
            if mm == Just Irradiance && List.isEmpty model.solar then
                ensureSolar m2

            else
                ( m2, Cmd.none )

        SetHeatSpan d ->
            ( { model | heatSpan = max 1 d, heatOffset = 0 }, Cmd.none )

        SetHeatOffset o ->
            ( { model | heatOffset = max 0 o }, Cmd.none )

        HoverInfo t ->
            ( { model | infoTip = t }, Cmd.none )

        ResetFilters ->
            -- Alles auf den Ausgangszustand: Auswahl, Hervorhebungen, Fokus und
            -- die Ausschnitte beider Zeitsichten. Geladene Daten bleiben im Cache.
            let
                m2 =
                    { model
                        | country = "all"
                        , windowDays = 7
                        , metric = SolarShare
                        , hovered = Nothing
                        , pinned = []
                        , focusedDay = Nothing
                        , areaSpan = 7 * 24
                        , areaOffset = 0
                        , heatSpan = 0
                        , heatOffset = 0
                        , treemapFull = False
                        , calOpen = False
                        , calAnchor = Nothing
                        , previewMetric = Nothing
                        , previewCountry = Nothing
                        , infoTip = Nothing
                    }
            in
            if hasEnough "all" m2 then
                ( { m2 | status = Ready }, Cmd.none )

            else
                loadCountry True m2.windowDays "all" m2

        ToggleCalendar ->
            ( { model | calOpen = not model.calOpen }, Cmd.none )

        SetCalendar open ->
            if model.calOpen == open then
                ( model, Cmd.none )

            else
                ( { model | calOpen = open }, Cmd.none )

        CalShift months ->
            -- Monat blättern: vom aktuell gezeigten Monat aus 31 Tage weiter/zurück
            -- und von dort auf den Monatsanfang normalisieren.
            let
                anchor =
                    Maybe.withDefault (lastLoadedDay model) model.calAnchor
            in
            ( { model | calAnchor = Just (firstOfMonth (anchor + months * 31)) }, Cmd.none )

        PickDay d ->
            -- Kalendertag anspringen: beide Zeitsichten auf diesen Tag setzen und
            -- ihn hervorheben. Der Kalender bleibt offen, die Diagramme aktualisieren
            -- sich sofort.
            let
                tmin =
                    firstLoadedStamp model

                dmin =
                    Energy.localDayOf model.tz tmin

                offH =
                    max 0 ((d * 86400 - model.tz - tmin) // 3600)
            in
            ( { model
                | focusedDay = Just d
                , areaOffset = clamp 0 (max 0 (model.windowDays * 24 - model.areaSpan)) offH
                , heatOffset = max 0 (d - dmin)
              }
            , Cmd.none
            )

        SetAreaSpan h ->
            -- Ausschnitt (in Stunden) ändern und die Position so begrenzen, dass
            -- der Ausschnitt vollständig im geladenen Fenster bleibt.
            let
                span =
                    clamp 3 (model.windowDays * 24) h
            in
            ( { model
                | areaSpan = span
                , areaOffset = clamp 0 (max 0 (model.windowDays * 24 - span)) model.areaOffset
              }
            , Cmd.none
            )

        SetAreaOffset h ->
            ( { model | areaOffset = clamp 0 (max 0 (model.windowDays * 24 - model.areaSpan)) h }, Cmd.none )

        ToggleTreemapFull ->
            ( { model | treemapFull = not model.treemapFull }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )

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
            -- Die Mausposition wird nur für den Quellen-Tooltip gebraucht. Ohne
            -- aktiven Tooltip das Model nicht anfassen, damit reines Mausbewegen
            -- (z. B. über die Navbar) kein Update/Rerender auslöst.
            if model.hovered == Nothing && model.infoTip == Nothing then
                ( model, Cmd.none )

            else
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


{-| Erster/letzter Zeitstempel bzw. Tag der aktuell geladenen Daten. -}
firstLoadedStamp : Model -> Int
firstLoadedStamp model =
    windowRows model.windowDays (activeRows model)
        |> List.map .unixSeconds
        |> List.minimum
        |> Maybe.withDefault 0


lastLoadedDay : Model -> Int
lastLoadedDay model =
    windowRows model.windowDays (activeRows model)
        |> List.map .unixSeconds
        |> List.maximum
        |> Maybe.withDefault 0
        |> Energy.localDayOf model.tz


{-| Tagesnummer -> Kalenderfelder (die Tagesnummer ist bereits lokal, daher UTC). -}
dayPosix : Int -> Time.Posix
dayPosix d =
    Time.millisToPosix (d * 86400 * 1000)


dayOfMonth : Int -> Int
dayOfMonth d =
    Time.toDay Time.utc (dayPosix d)


{-| Erster Tag des Monats, in dem `d` liegt (max. 31 Schritte rückwärts). -}
firstOfMonth : Int -> Int
firstOfMonth d =
    if dayOfMonth d == 1 then
        d

    else
        firstOfMonth (d - 1)


{-| Wochentag als Spalte, 0 = Montag. -}
weekdayCol : Int -> Int
weekdayCol d =
    case Time.toWeekday Time.utc (dayPosix d) of
        Time.Mon -> 0
        Time.Tue -> 1
        Time.Wed -> 2
        Time.Thu -> 3
        Time.Fri -> 4
        Time.Sat -> 5
        Time.Sun -> 6


monthName : Int -> String
monthName d =
    case Time.toMonth Time.utc (dayPosix d) of
        Time.Jan -> "Januar"
        Time.Feb -> "Februar"
        Time.Mar -> "März"
        Time.Apr -> "April"
        Time.May -> "Mai"
        Time.Jun -> "Juni"
        Time.Jul -> "Juli"
        Time.Aug -> "August"
        Time.Sep -> "September"
        Time.Oct -> "Oktober"
        Time.Nov -> "November"
        Time.Dec -> "Dezember"


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
        [ Html.Lazy.lazy topNav model
        , Html.div [ HA.class "page" ]
            [ guideView
            , if List.isEmpty visibleRows then
                emptyView model

              else
                chartsView model rows
            ]
        , tooltipView model
        , if model.treemapFull then
            treemapOverlay model rows

          else
            Html.text ""
        ]


{-| Vollbild-Ansicht der Treemap: gleiche verschachtelte Hierarchie, aber groß, damit
die Rohquellen nicht gequetscht wirken. Klick auf den Hintergrund bzw. „✕" schließt. -}
treemapOverlay : Model -> List Row -> Html Msg
treemapOverlay model rows =
    let
        sortedRows =
            windowRows model.windowDays rows

        treemapRows =
            case model.focusedDay of
                Just d ->
                    List.filter (\r -> Energy.localDayOf model.tz r.unixSeconds == d) sortedRows

                Nothing ->
                    sortedRows
    in
    Html.div [ HA.class "modal-overlay", HE.onClick ToggleTreemapFull ]
        [ Html.div
            [ HA.classList (( "modal-card", True ) :: ( "charts", True ) :: highlightClasses model)
            , HE.stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
            ]
            [ Html.div [ HA.class "modal-head" ]
                [ Html.h3 [ HA.class "modal-title" ] [ Html.text "Erzeugungsstruktur" ]
                , Html.button [ HA.class "modal-close", HE.onClick ToggleTreemapFull ] [ Html.text "✕" ]
                ]
            , Html.div [ HA.class "modal-body" ]
                [ Treemap.view
                    { width = 1600
                    , height = 860
                    , nodes = Energy.sumHierarchy treemapRows
                    , onHover = HoverSource
                    , onPin = PinSource
                    }
                ]
            ]
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
    case ( model.hovered, model.infoTip ) of
        -- Erklärung zu den Saldo-Flächen (Defizit/Überschuss)
        ( Nothing, Just ( heading, body ) ) ->
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
                        , HA.style "background"
                            (if heading == "Defizit" then
                                "#ef4444"

                             else
                                "#16a34a"
                            )
                        ]
                        []
                    , Html.text heading
                    ]
                , Html.div [ HA.class "tt-body" ] [ Html.text body ]
                ]

        ( Just name, _ ) ->
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

        _ ->
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
                        , Html.button
                            [ HA.class "btn btn-reset"
                            , HE.onClick ResetFilters
                            , HA.title "Land, Zeitfenster, Metrik, Hervorhebungen und Ausschnitte zurücksetzen"
                            ]
                            [ Html.text "Filter zurücksetzen" ]
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


{-| Orientierungsleiste für die Zielgruppe (Studierende/Lehrende): rahmt die App
als Lernwerkzeug und macht die drei Aufgaben aus dem Bericht (IB1–IB3) sichtbar –
je Aufgabe eine Leitfrage, die zugehörige Sicht und ein „worauf achten"-Hinweis. -}
guideView : Html Msg
guideView =
    Html.section [ HA.class "guide" ]
        [ Html.div [ HA.class "guide-head" ]
            [ Html.h2 [ HA.class "guide-title" ] [ Html.text "Was kann ich hier analysieren?" ]
            , Html.p [ HA.class "guide-lead" ]
                [ Html.text "Verschaffe dir schnell einen Überblick über ein Land und einen Zeitraum und finde die relevanten Muster und Auffälligkeiten. Drei verbundene Sichten beantworten drei Analysefragen:" ]
            ]
        , Html.div [ HA.class "guide-tasks" ]
            [ guideCard "gc-flow"
                "1"
                "Sicht 1 · Verlauf & Saldo"
                "Wie steht es um die Deckung – und wann kippt der Saldo?"
                "Grüne Fläche = Überschuss (Export/Einspeicherung), rote = Defizit (Import/Ausspeicherung). So erkennst du Über- und Unterdeckung im Zeitverlauf."
            , guideCard "gc-rhythm"
                "2"
                "Sicht 2 · Rhythmus"
                "Welche Tage fallen aus dem Rhythmus?"
                "Das helle Mittagsband der Sonne ist der Takt; Lücken sind bewölkte Tage bzw. Dunkelflauten. Per Zoom einzelne Tage prüfen; die Metrik „Globalstrahlung (DWD)“ liefert den Beleg."
            , guideCard "gc-struct"
                "3"
                "Sicht 3 · Struktur"
                "Woraus setzt sich der Mix der aktuellen Auswahl zusammen?"
                "Die Fläche ist proportional zur erzeugten Energie; die Rohquellen (z. B. Wind → On-/Offshore) sind direkt sichtbar. Für Vergleiche Land oder Zeitfenster wechseln."
            ]
        ]


guideCard : String -> String -> String -> String -> String -> Html Msg
guideCard accent index viewLabel question hint =
    Html.div [ HA.class ("guide-card " ++ accent) ]
        [ Html.div [ HA.class "gc-top" ]
            [ Html.span [ HA.class "gc-index" ] [ Html.text index ]
            , Html.span [ HA.class "gc-view" ] [ Html.text viewLabel ]
            ]
        , Html.div [ HA.class "gc-q" ] [ Html.text question ]
        , Html.div [ HA.class "gc-hint" ] [ Html.text hint ]
        ]


controlCluster : Model -> Html Msg
controlCluster model =
    Html.div [ HA.class "control-cluster" ]
        [ control "ico-globe" "Land"
            (Html.div [ HA.class "land-wrap" ]
                [ dropdown []
                    (countryFlag model.country ++ "  " ++ countryLabel model.country)
                    (List.map
                        (\( code, name ) ->
                            dropdownItem (code == model.country)
                                []
                                (SelectCountry code)
                                (countryFlag code ++ "  " ++ name)
                        )
                        countries
                    )
                , Html.div [ HA.class "count-slot" ] [ countBadge model ]
                ]
            )
        , controlWith
            [ HE.onMouseEnter (SetCalendar True)
            , HE.onMouseLeave (SetCalendar False)
            ]
            "ico-calendar"
            "Zeitfenster"
            (Html.div [ HA.class "cal-wrap" ]
                [ Html.button
                    [ HA.classList [ ( "cal-trigger", True ), ( "is-open", model.calOpen ) ]
                    , HE.onClick ToggleCalendar
                    ]
                    [ Html.span [ HA.class "dropdown-value" ] [ Html.text (windowLabel model.windowDays) ]
                    , Html.span [ HA.class "ico ico-sm ico-caret" ] []
                    ]
                , if model.calOpen then
                    calendarPanel model

                  else
                    Html.text ""
                ]
            )
        , control "ico-gauge" "Metrik"
            (dropdown []
                (Energy.metricLabel model.metric)
                (List.map
                    (\m ->
                        dropdownItem (m == model.metric)
                            []
                            (SelectMetric m)
                            (Energy.metricLabel m)
                    )
                    [ SolarShare, RenewableShare, LoadMetric, Irradiance ]
                )
            )
        ]


control : String -> String -> Html Msg -> Html Msg
control =
    controlWith []


{-| Wie `control`, aber mit zusätzlichen Attributen am ganzen Reiter – damit z. B.
das Zeitfenster-Panel schon beim Überfahren des Reiters aufklappt. -}
controlWith : List (Html.Attribute Msg) -> String -> String -> Html Msg -> Html Msg
controlWith extra iconClass labelText child =
    Html.div (HA.class "control" :: extra)
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


{-| Aufklappbares Zeitfenster-Panel: oben die Länge des geladenen Zeitraums,
darunter ein Monatskalender. Ein Klick auf einen Tag springt sofort dorthin –
das Panel bleibt offen, sodass sich die Wirkung direkt beobachten lässt. -}
calendarPanel : Model -> Html Msg
calendarPanel model =
    let
        rows =
            windowRows model.windowDays (activeRows model)

        stamps =
            List.map .unixSeconds rows

        dmin =
            stamps |> List.minimum |> Maybe.withDefault 0 |> Energy.localDayOf model.tz

        dmax =
            stamps |> List.maximum |> Maybe.withDefault 0 |> Energy.localDayOf model.tz

        anchor =
            Maybe.withDefault dmax model.calAnchor

        first =
            firstOfMonth anchor

        -- Führende Leerfelder bis zum ersten Wochentag, dann die Tage des Monats.
        lead =
            List.repeat (weekdayCol first) (Html.span [ HA.class "cal-cell is-blank" ] [])

        monthDays =
            List.range 0 31
                |> List.map (\i -> first + i)
                |> List.filter (\d -> firstOfMonth d == first)

        cell d =
            let
                inRange =
                    d >= dmin && d <= dmax
            in
            Html.button
                [ HA.classList
                    [ ( "cal-cell", True )
                    , ( "is-on", inRange )
                    , ( "is-sel", model.focusedDay == Just d )
                    ]
                , HA.disabled (not inRange)
                , HE.onClick (PickDay d)
                ]
                [ Html.text (String.fromInt (dayOfMonth d)) ]
    in
    Html.div [ HA.class "cal-panel" ]
        [ Html.div [ HA.class "cal-section" ]
            [ Html.span [ HA.class "zoom-label" ] [ Html.text "Geladener Zeitraum" ]
            , windowSlider model.windowDays
            ]
        , Html.div [ HA.class "cal-head" ]
            [ Html.button [ HA.class "cal-nav", HE.onClick (CalShift -1) ] [ Html.text "‹" ]
            , Html.span [ HA.class "cal-title" ]
                [ Html.text (monthName first ++ " " ++ String.fromInt (Time.toYear Time.utc (dayPosix first))) ]
            , Html.button [ HA.class "cal-nav", HE.onClick (CalShift 1) ] [ Html.text "›" ]
            ]
        , Html.div [ HA.class "cal-grid" ]
            (List.map (\w -> Html.span [ HA.class "cal-wd" ] [ Html.text w ])
                [ "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So" ]
                ++ lead
                ++ List.map cell monthDays
            )
        , Html.div [ HA.class "cal-hint" ]
            [ Html.text "Tag anklicken – die Diagramme springen sofort dorthin." ]
        ]


{-| Zeitfenster als Regler statt Knopfreihe: erlaubt auch lange Fenster
(bis 365 Tage), ohne die Navbar mit Buttons zu füllen. Der Regler läuft über die
Stufen in `windowOptions`. -}
windowSlider : Int -> Html Msg
windowSlider current =
    let
        lastIdx =
            List.length windowOptions - 1
    in
    Html.span [ HA.class "win-ctl" ]
        [ Html.input
            [ HA.type_ "range"
            , HA.class "zoom-slider win-slider"
            , HA.min "0"
            , HA.max (String.fromInt lastIdx)
            , HA.step "1"
            , HA.value (String.fromInt (windowIndexOf current))
            , HE.onInput (\v -> SelectWindow (windowAt (Maybe.withDefault 0 (String.toInt v))))
            ]
            []
        , Html.span [ HA.class "zoom-val win-val" ] [ Html.text (windowLabel current) ]
        ]


windowIndexOf : Int -> Int
windowIndexOf d =
    windowOptions
        |> List.indexedMap Tuple.pair
        |> List.filter (\( _, v ) -> v == d)
        |> List.head
        |> Maybe.map Tuple.first
        |> Maybe.withDefault 0


windowAt : Int -> Int
windowAt i =
    windowOptions |> List.drop i |> List.head |> Maybe.withDefault 7


windowLabel : Int -> String
windowLabel d =
    if d >= 365 then
        "1 Jahr"

    else if d >= 30 && modBy 30 d == 0 then
        String.fromInt (d // 30) ++ " Mon."

    else
        String.fromInt d ++ " Tage"


{-| Elegant ins „Land" integrierte Anzeige: geladene Messpunkte (Ready),
sonst ein Fehler-Hinweis. Während des Ladens bleibt sie leer (der Button zeigt
den Fortschritt). -}
countBadge : Model -> Html Msg
countBadge model =
    let
        -- Nur tatsächlich darstellbare Punkte zählen: Länder wie DE-LU liefern
        -- zwar Zeilen, aber reine Null-Platzhalter. Ohne diesen Filter zeigte der
        -- Zähler „2881 Punkte", während die Sicht (zu Recht) leer bleibt.
        count =
            Dict.get (activeCountry model) model.rowsByCountry
                |> Maybe.withDefault []
                |> List.filter (\r -> Energy.totalGeneration r > 0 || r.load > 0)
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


{-| Layout der drei Sichten. Jede Sicht ist **einzeln** in `lazy` gekapselt und
bekommt nur die Argumente, von denen sie wirklich abhängt. Dadurch löst ein Hover
(ändert nur `hovered`) kein Neuzeichnen der teuren Heatmap aus – die hängt gar
nicht von `hovered`/`pinned` ab. Das behebt die Trägheit (u. a. in Chrome). -}
chartsView : Model -> List Row -> Html Msg
chartsView model rows =
    let
        metric =
            Maybe.withDefault model.metric model.previewMetric
    in
    -- Das Hervorheben/Abdunkeln beim Hover läuft rein über CSS-Klassen an diesem
    -- Container (siehe `.charts.has-hl …` in styles.css). Deshalb hängen die
    -- Karten NICHT von `hovered`/`pinned` ab und werden beim Hover nicht neu
    -- gezeichnet – nur die Container-Klasse ändert sich.
    Html.div [ HA.classList (( "chart-stack", True ) :: ( "charts", True ) :: highlightClasses model) ]
        [ Html.Lazy.lazy6 areaCard model.tz model.focusedDay model.windowDays model.areaSpan model.areaOffset rows
        , Html.div [ HA.class "chart-grid" ]
            [ Html.Lazy.lazy8 heatCard model.tz metric model.focusedDay model.windowDays model.solar model.heatSpan model.heatOffset rows
            , Html.Lazy.lazy4 treeCard model.tz model.focusedDay model.windowDays rows
            ]
        ]


{-| Hervorhebungs-Klassen für den Chart-Container: `has-hl` plus je aktiver Quelle
`hl-<key>`. Das CSS dunkelt dann alle Serien/Kacheln ab und hebt die aktiven wieder
an – ohne Neuzeichnen der SVGs. -}
highlightClasses : Model -> List ( String, Bool )
highlightClasses model =
    let
        hl =
            activeOf model.pinned model.hovered
    in
    ( "has-hl", not (List.isEmpty hl) )
        :: List.map (\b -> ( "hl-" ++ Energy.bandKey b, True )) hl


{-| Sichtbare Zeilen im gewählten Fenster: Platzhalter raus, nach Zeit sortiert,
auf die letzten `windowDays` Tage geschnitten. Wird je Karte aus der stabilen
`rows`-Referenz frisch berechnet (billiger als die Lazy-Memoisierung zu brechen). -}
windowRows : Int -> List Row -> List Row
windowRows windowDays rows =
    let
        allSorted =
            rows
                |> List.filter (\r -> Energy.totalGeneration r > 0 || r.load > 0)
                |> List.sortBy .unixSeconds

        tmax =
            allSorted |> List.map .unixSeconds |> List.maximum |> Maybe.withDefault 0
    in
    List.filter (\r -> r.unixSeconds >= tmax - windowDays * 86400) allSorted


focusNoteOf : Maybe Int -> Maybe String
focusNoteOf focusedDay =
    case focusedDay of
        Just d ->
            Just (" · Fokus auf " ++ Energy.dayLabel d ++ " (erneut klicken zum Aufheben)")

        Nothing ->
            Nothing


areaCard : Int -> Maybe Int -> Int -> Int -> Int -> List Row -> Html Msg
areaCard tz focusedDay windowDays span offset rows =
    let
        all =
            windowRows windowDays rows

        tmin =
            all |> List.map .unixSeconds |> List.minimum |> Maybe.withDefault 0

        spanH =
            clamp 3 (windowDays * 24) span

        off =
            clamp 0 (max 0 (windowDays * 24 - spanH)) offset

        from =
            tmin + off * 3600

        to =
            from + spanH * 3600

        -- Nur der gewählte Ausschnitt wird gezeichnet; dadurch skaliert die
        -- y-Achse automatisch auf diesen Zeitraum (kleinerer Wertebereich).
        sliced =
            List.filter (\r -> r.unixSeconds >= from && r.unixSeconds <= to) all

        shown =
            if List.isEmpty sliced then
                all

            else
                sliced
    in
    chartCard "1"
        "Erzeugungsmix & Saldo im Zeitverlauf"
        [ Html.text "Gestapelte Erzeugung nach Quelle; gestrichelt = Last. Rote Fläche = Defizit (durch Import/Speicher zu decken), grüne Fläche = Überschuss (Export/Einspeicherung)."
        , areaControls windowDays spanH off
        , rangeBadge tz from to
        ]
        (focusNoteOf focusedDay)
        (StackedArea.view
            { width = 1120
            , height = 450
            , rows = Energy.decimateTo 1200 shown
            , tz = tz
            , focusedDay = focusedDay
            , onHover = HoverSource
            , onPin = PinSource
            , onInfo = HoverInfo
            }
        )


{-| Sichtbarer Zeitraum als eigene Anzeige – so muss der Tages-/Monatswechsel
nicht in die Zeitachse gemischt werden. -}
rangeBadge : Int -> Int -> Int -> Html Msg
rangeBadge tz from to =
    Html.span [ HA.class "range-badge" ]
        [ Html.span [ HA.class "ico ico-sm ico-calendar" ] []
        , Html.text (Energy.stampLabel tz from ++ "  –  " ++ Energy.stampLabel tz to)
        ]


{-| Ausschnittsbreite als Text: Stunden bei kurzen, Tage bei langen Ausschnitten. -}
spanLabel : Int -> String
spanLabel h =
    if h < 48 then
        String.fromInt h ++ " h"

    else
        String.fromInt (h // 24) ++ " T"


{-| Ausschnitt-Regler für das Flächendiagramm: „Ausschnitt" bestimmt die Breite
des sichtbaren Zeitraums (Zoom), „Position" verschiebt ihn durch das geladene
Fenster. Die y-Achse passt sich dem Ausschnitt an. -}
areaControls : Int -> Int -> Int -> Html Msg
areaControls windowDays span offset =
    let
        maxH =
            windowDays * 24

        maxOff =
            max 0 (maxH - span)
    in
    Html.span [ HA.class "zoom-ctl" ]
        [ Html.span [ HA.class "zoom-label" ] [ Html.text "Ausschnitt" ]
        , Html.input
            [ HA.type_ "range"
            , HA.class "zoom-slider"
            , HA.min "3"
            , HA.max (String.fromInt maxH)
            , HA.step "1"
            , HA.value (String.fromInt span)
            , HE.onInput (\v -> SetAreaSpan (Maybe.withDefault maxH (String.toInt v)))
            ]
            []
        , Html.span [ HA.class "zoom-val" ] [ Html.text (spanLabel span) ]
        , Html.span [ HA.class "zoom-label" ] [ Html.text "Position" ]
        , Html.input
            [ HA.type_ "range"
            , HA.class "zoom-slider"
            , HA.min "0"
            , HA.max (String.fromInt maxOff)
            , HA.step "1"
            , HA.value (String.fromInt offset)
            , HA.disabled (maxOff == 0)
            , HE.onInput (\v -> SetAreaOffset (Maybe.withDefault 0 (String.toInt v)))
            ]
            []
        ]


heatCard : Int -> Metric -> Maybe Int -> Int -> List ( Int, Float ) -> Int -> Int -> List Row -> Html Msg
heatCard tz metric focusedDay windowDays solar span offset rows =
    let
        sortedRows =
            windowRows windowDays rows

        tmax =
            sortedRows |> List.map .unixSeconds |> List.maximum |> Maybe.withDefault 0

        -- Bei der DWD-Metrik stammen die Zellen aus der Wetterreihe (nationales
        -- Mittel je Zeitpunkt), sonst aus den publicpower-Zeilen.
        ( allCells, slots ) =
            if metric == Irradiance then
                let
                    windowed =
                        List.filter (\( u, _ ) -> u >= tmax - windowDays * 86400) solar

                    s =
                        Energy.slotsPerDayInts (List.map Tuple.first windowed)
                in
                ( Energy.heatCellsValues tz s windowed, s )

            else
                let
                    s =
                        Energy.slotsPerDay sortedRows
                in
                ( Energy.heatCells tz metric s sortedRows, s )
    in
    let
        dmin =
            allCells |> List.map .day |> List.minimum |> Maybe.withDefault 0

        dmax =
            allCells |> List.map .day |> List.maximum |> Maybe.withDefault 0

        totalDays =
            max 1 (dmax - dmin + 1)

        -- span = 0 bedeutet „alles anzeigen"
        spanD =
            if span <= 0 then
                totalDays

            else
                clamp 1 totalDays span

        off =
            clamp 0 (max 0 (totalDays - spanD)) offset

        heatCells =
            List.filter (\c -> c.day >= dmin + off && c.day < dmin + off + spanD) allCells
    in
    chartCard "2"
        (Energy.metricLabel metric ++ " nach Uhrzeit & Tag")
        [ Html.text
            ("Jede Zelle ist ein einzelner Messwert in Originalauflösung ("
                ++ slotDuration slots
                ++ ", x = Tag, y = Uhrzeit in Ortszeit). Klick auf einen Tag fokussiert die anderen beiden Sichten."
            )
        , heatControls totalDays spanD off
        , rangeBadge tz ((dmin + off) * 86400 - tz) ((dmin + off + spanD) * 86400 - tz)
        ]
        Nothing
        (Html.div []
            [ Heatmap.view
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
            ]
        )


{-| Ausschnitt- und Positions-Regler der Heatmap – bewusst dieselbe Bedienung wie
im Flächendiagramm. Der Ausschnitt wird geschnitten statt gescrollt, dadurch
bleibt die Uhrzeit-Achse immer sichtbar. -}
heatControls : Int -> Int -> Int -> Html Msg
heatControls totalDays span offset =
    let
        maxOff =
            max 0 (totalDays - span)
    in
    Html.span [ HA.class "zoom-ctl" ]
        [ Html.span [ HA.class "zoom-label" ] [ Html.text "Ausschnitt" ]
        , Html.input
            [ HA.type_ "range"
            , HA.class "zoom-slider"
            , HA.min "1"
            , HA.max (String.fromInt totalDays)
            , HA.step "1"
            , HA.value (String.fromInt span)
            , HE.onInput (\v -> SetHeatSpan (Maybe.withDefault totalDays (String.toInt v)))
            ]
            []
        , Html.span [ HA.class "zoom-val" ] [ Html.text (String.fromInt span ++ " T") ]
        , Html.span [ HA.class "zoom-label" ] [ Html.text "Position" ]
        , Html.input
            [ HA.type_ "range"
            , HA.class "zoom-slider"
            , HA.min "0"
            , HA.max (String.fromInt maxOff)
            , HA.step "1"
            , HA.value (String.fromInt offset)
            , HA.disabled (maxOff == 0)
            , HE.onInput (\v -> SetHeatOffset (Maybe.withDefault 0 (String.toInt v)))
            ]
            []
        ]


treeCard : Int -> Maybe Int -> Int -> List Row -> Html Msg
treeCard tz focusedDay windowDays rows =
    let
        sortedRows =
            windowRows windowDays rows

        treemapRows =
            case focusedDay of
                Just d ->
                    List.filter (\r -> Energy.localDayOf tz r.unixSeconds == d) sortedRows

                Nothing ->
                    sortedRows
    in
    chartCard "3"
        "Erzeugungsstruktur"
        [ Html.text "Fläche "
        , propSign
        , Html.text " Energieanteil; Hierarchie Erneuerbar/Konventionell → Quelle → Rohquelle direkt sichtbar. Ein „⊞“ markiert weiter aufgeteilte Bänder."
        , Html.button [ HA.class "card-action", HE.onClick ToggleTreemapFull ]
            [ Html.text "⤢ Vergrößern" ]
        ]
        (focusNoteOf focusedDay)
        (Treemap.view
            { width = 660
            , height = 480
            , nodes = Energy.sumHierarchy treemapRows
            , onHover = HoverSource
            , onPin = PinSource
            }
        )


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
        144 ->
            "10 Minuten"

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
      -- DE (Gebotszone DE-LU) wird aus v_totalpower geladen; v_publicpower ist für DE leer.
    , ( "de", "Deutschland" )
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

        Irradiance ->
            "dwd"


metricFromString : String -> Metric
metricFromString s =
    case s of
        "ee" ->
            RenewableShare

        "load" ->
            LoadMetric

        "dwd" ->
            Irradiance

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


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }
