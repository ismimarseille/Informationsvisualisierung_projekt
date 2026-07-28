module Main exposing (main)

{-| EnergyCharts Visual Analytics – drei verbundene Sichten aus drei
verschiedenen Bereichen, anwendungsgetrieben aus `energycharts_publicpower`:

1.  Gestapeltes Flächendiagramm  (Bereich *Zeitreihen*)
2.  Stunde×Tag-Heatmap           (Bereich *Pixel-orientiert*)
3.  Treemap der Erzeugungsstruktur (Bereich *Bäume*)

Alle drei stammen aus **einer** Abfrage (ein Land, ein Zeitfenster) und sind
über gemeinsame Zustände verbunden: Hover hebt eine Quelle überall hervor,
Klick auf einen Tag in der Heatmap fokussiert Flächendiagramm und Treemap.
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
import Http



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
    , rows : List Row
    , status : Status
    , hovered : Maybe String
    , focusedDay : Maybe Int
    }


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
      , rows = []
      , status = NeedConnect
      , hovered = Nothing
      , focusedDay = Nothing
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
    | GotRows (Result Http.Error (List Row))
    | SelectCountry String
    | SelectWindow Int
    | SelectMetric Metric
    | HoverSource (Maybe String)
    | ClickDay Int
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


{-| Lädt das aktuell gewählte Land/Fenster in genau einer Abfrage. -}
loadCurrent : Model -> ( Model, Cmd Msg )
loadCurrent model =
    case ( model.token, model.latest ) of
        ( Just token, Just tmax ) ->
            ( { model | rows = [], status = LoadingRows, focusedDay = Nothing }
            , Api.loadCountryWindow token
                (boundsFor model.ceilings model.country)
                (tmax - model.windowDays * 86400)
                GotRows
            )

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
                ( { model | token = Just manual, status = LoadingBounds }
                , Api.getRecent manual (lbOf model) GotRecent
                )

            else
                ( { model | status = Connecting }, Api.getToken GotToken )

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
                    loadCurrent { model | latest = Just t, ceilings = ceilings }

                Nothing ->
                    ( { model | status = Failed "Keine aktuellen Daten gefunden (Zeitfenster zu eng?)." }, Cmd.none )

        GotRecent (Err e) ->
            ( { model | status = Failed (httpErr e) }, Cmd.none )

        GotRows (Ok rows) ->
            -- Server liefert bereits ein Land; Filter als Sicherheitsnetz.
            ( { model
                | rows = List.filter (\r -> r.countryId == model.country) rows
                , status = Ready
              }
            , Cmd.none
            )

        GotRows (Err e) ->
            ( { model | status = Failed (httpErr e) }, Cmd.none )

        SelectCountry c ->
            loadCurrent { model | country = c }

        SelectWindow d ->
            loadCurrent { model | windowDays = d }

        SelectMetric m ->
            ( { model | metric = m }, Cmd.none )

        HoverSource ms ->
            ( { model | hovered = ms }, Cmd.none )

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
            loadCurrent model


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
        -- Platzhalter-/Vorschau-Zeilen (alle Werte null -> 0) ausblenden.
        sortedRows =
            model.rows
                |> List.filter (\r -> Energy.totalGeneration r > 0 || r.load > 0)
                |> List.sortBy .unixSeconds
    in
    Html.div []
        [ appHeader model
        , Html.p [ HA.class "lead" ]
            [ Html.text "Stromerzeugung in Europa und einzelnen Ländern – Zusammensetzung über die Zeit, Tagesrhythmus und Strukturanteile in drei verbundenen Sichten. Eine Abfrage, drei Perspektiven auf dasselbe Stromsystem." ]
        , toolbar model
        , statusView model
        , if List.isEmpty sortedRows then
            emptyView model

          else
            chartsView model sortedRows
        ]


appHeader : Model -> Html Msg
appHeader model =
    Html.header [ HA.class "app-header" ]
        [ Html.div [ HA.class "brand" ]
            [ Html.div [ HA.class "brand-mark" ] [ Html.text "⚡" ]
            , Html.div [ HA.class "brand-text" ]
                [ Html.div [ HA.class "brand-title" ]
                    [ Html.text "EnergyCharts "
                    , Html.span [ HA.class "accent" ] [ Html.text "Visual Analytics" ]
                    ]
                , Html.div [ HA.class "brand-sub" ]
                    [ Html.text "Europas Stromsystem verstehen · drei verbundene Sichten" ]
                ]
            ]
        , Html.div [ HA.class "header-actions" ]
            [ Html.input
                [ HA.class "text-input"
                , HA.placeholder "Token (optional – sonst Proxy)"
                , HA.value model.tokenInput
                , HE.onInput TokenInput
                ]
                []
            , Html.button [ HA.class "btn btn-primary", HE.onClick Connect ]
                [ Html.text "🔗 Verbinden" ]
            , Html.button [ HA.class "btn btn-ghost btn-icon", HE.onClick Reload, HA.title "Aktuelle Auswahl neu laden" ]
                [ Html.text "↻" ]
            ]
        ]


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


toolbar : Model -> Html Msg
toolbar model =
    Html.div [ HA.class "toolbar" ]
        [ control "Land"
            (Html.select [ HA.class "select", HE.onInput SelectCountry, HA.value model.country ]
                (List.map (countryOption model.country) countries)
            )
        , control "Zeitfenster"
            (Html.div [ HA.class "segmented" ]
                (List.map (windowButton model.windowDays) [ 7, 14, 30 ])
            )
        , control "Heatmap-Metrik"
            (Html.select [ HA.class "select", HE.onInput (SelectMetric << metricFromString), HA.value (metricKey model.metric) ]
                (List.map (metricOption model.metric) [ SolarShare, RenewableShare, LoadMetric ])
            )
        ]


control : String -> Html Msg -> Html Msg
control labelText child =
    Html.label [ HA.class "control" ]
        [ Html.span [ HA.class "control-label" ] [ Html.text labelText ]
        , child
        ]


windowButton : Int -> Int -> Html Msg
windowButton current d =
    Html.button
        [ HA.classList [ ( "seg-btn", True ), ( "is-active", current == d ) ]
        , HE.onClick (SelectWindow d)
        ]
        [ Html.text (String.fromInt d ++ " Tage") ]


statusView : Model -> Html Msg
statusView model =
    let
        ( txt, cls ) =
            case model.status of
                NeedConnect ->
                    ( "Bereit – auf „Verbinden“ klicken, um Daten zu laden.", "is-idle" )

                Connecting ->
                    ( "Hole Zugriffs-Token …", "is-loading" )

                LoadingBounds ->
                    ( "Verbinde und ermittle Datenstruktur …", "is-loading" )

                LoadingRows ->
                    ( "Lade " ++ countryLabel model.country ++ " …", "is-loading" )

                Ready ->
                    ( countryLabel model.country
                        ++ " · "
                        ++ String.fromInt model.windowDays
                        ++ " Tage · "
                        ++ String.fromInt (List.length model.rows)
                        ++ " Messpunkte geladen"
                    , "is-ready"
                    )

                Failed e ->
                    ( e, "is-error" )
    in
    Html.div [ HA.class ("statusbar " ++ cls) ]
        [ Html.span [ HA.class "dot" ] []
        , Html.span [] [ Html.text txt ]
        ]


legend : Maybe String -> Html Msg
legend hovered =
    Html.div [ HA.class "legend" ]
        (Html.span [ HA.class "legend-title" ] [ Html.text "Quellen" ]
            :: List.map (legendChip hovered) Energy.bands
        )


legendChip : Maybe String -> Energy.Band -> Html Msg
legendChip hovered band =
    let
        dim =
            case hovered of
                Nothing ->
                    False

                Just h ->
                    h /= band.name
    in
    Html.span
        [ HA.classList [ ( "chip", True ), ( "is-dim", dim ) ]
        , HE.onMouseOver (HoverSource (Just band.name))
        , HE.onMouseOut (HoverSource Nothing)
        ]
        [ Html.span [ HA.class "swatch", HA.style "background" (Color.toCssString band.color) ] []
        , Html.text band.name
        ]


chartsView : Model -> List Row -> Html Msg
chartsView model sortedRows =
    let
        heatCells =
            Energy.binHourly model.metric sortedRows

        treemapRows =
            case model.focusedDay of
                Just d ->
                    List.filter (\r -> Energy.dayOf r.unixSeconds == d) sortedRows

                Nothing ->
                    sortedRows

        focusNote =
            case model.focusedDay of
                Just d ->
                    Just (" · Fokus auf " ++ Energy.dayLabel d ++ " (erneut klicken zum Aufheben)")

                Nothing ->
                    Nothing
    in
    Html.div []
        [ legend model.hovered
        , Html.div [ HA.class "chart-stack" ]
            [ chartCard "1" "Erzeugungsmix & Last im Zeitverlauf"
                "Gestapelte Erzeugung nach Quelle; die gestrichelte Linie ist die Last. Erreicht die Stapelhöhe die Linie, ist der Bedarf gedeckt."
                focusNote
                (StackedArea.view
                    { width = 960
                    , height = 340
                    , rows = sortedRows
                    , hovered = model.hovered
                    , focusedDay = model.focusedDay
                    , onHover = HoverSource
                    }
                )
            , Html.div [ HA.class "chart-grid" ]
                [ chartCard "2" (Energy.metricLabel model.metric ++ " nach Stunde & Tag")
                    "Jede Zelle ist ein Stunden-Pixel (x = Tag, y = Stunde). Klick auf einen Tag fokussiert die anderen beiden Sichten."
                    Nothing
                    (Heatmap.view
                        { width = 560
                        , height = 340
                        , cells = heatCells
                        , extent = Energy.heatExtent heatCells
                        , unit = Energy.metricUnit model.metric
                        , interpolator = Energy.metricInterpolator model.metric
                        , focusedDay = model.focusedDay
                        , onClickDay = ClickDay
                        }
                    )
                , chartCard "3" "Erzeugungsstruktur"
                    "Fläche ∝ Energieanteil im Zeitraum, gruppiert in Erneuerbar und Konventionell."
                    Nothing
                    (Treemap.view
                        { width = 560
                        , height = 340
                        , sums = Energy.sumByBand treemapRows
                        , hovered = model.hovered
                        , onHover = HoverSource
                        }
                    )
                ]
            ]
        ]


chartCard : String -> String -> String -> Maybe String -> Html Msg -> Html Msg
chartCard index title sub focusNote chart =
    Html.section [ HA.class "card" ]
        [ Html.div [ HA.class "card-head" ]
            [ Html.span [ HA.class "card-index" ] [ Html.text index ]
            , Html.h3 [ HA.class "card-title" ] [ Html.text title ]
            ]
        , Html.p [ HA.class "card-sub" ]
            (Html.text sub
                :: (case focusNote of
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


{-| Nur Einträge, die in der bereitgestellten Entwicklungs-DB tatsächlich
befüllt sind (viele Länder – u. a. DE, AT, NL, ES – enthalten dort nur
Null-Platzhalter). `all` ist das durchgehend gepflegte Europa-Aggregat und
daher die robuste Voreinstellung. DE bleibt wählbar, falls die vollständige
DB es führt; sonst greift der „keine Daten"-Hinweis.
-}
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
    , ( "de", "Deutschland" )
    ]


countryLabel : String -> String
countryLabel code =
    countries
        |> List.filter (\( c, _ ) -> c == code)
        |> List.head
        |> Maybe.map Tuple.second
        |> Maybe.withDefault (String.toUpper code)


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


main : Program Float Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
