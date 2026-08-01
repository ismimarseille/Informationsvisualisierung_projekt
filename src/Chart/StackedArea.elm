module Chart.StackedArea exposing (Config, view)

{-| Sicht 1 (Zeitreihen): gestapelte Erzeugung nach Quelle, Last als Linie.

Frage: Wie setzt sich die Erzeugung über die Zeit zusammen? Der Stapel zeigt
Zusammensetzung und Summe zugleich, die Fläche zur Last-Linie den Saldo.
Bausteine wie in Übung 5/6: `Shape`, `Path`, `Scale`, `Axis`.
-}

import Axis
import Color exposing (Color)
import Energy exposing (Band, Row)
import Path
import Scale exposing (ContinuousScale)
import Shape
import Time
import TypedSvg exposing (g, rect, svg)
import TypedSvg.Attributes as TA exposing (transform, viewBox)
import TypedSvg.Attributes.InPx as InPx
import TypedSvg.Core exposing (Svg)
import TypedSvg.Events as TE
import TypedSvg.Types exposing (Opacity(..), Paint(..), Transform(..))


type alias Config msg =
    { width : Float
    , height : Float
    , rows : List Row
    , focusedDay : Maybe Int
    , onHover : Maybe String -> msg
    , onPin : String -> msg
    }


pad : { left : Float, right : Float, top : Float, bottom : Float }
pad =
    { left = 48, right = 14, top = 12, bottom = 26 }


posix : Int -> Time.Posix
posix unix =
    Time.millisToPosix (unix * 1000)


view : Config msg -> Svg msg
view cfg =
    let
        plotW =
            cfg.width - pad.left - pad.right

        plotH =
            cfg.height - pad.top - pad.bottom

        unixList =
            List.map .unixSeconds cfg.rows

        tMin =
            List.minimum unixList |> Maybe.withDefault 0

        tMax =
            List.maximum unixList |> Maybe.withDefault 1

        xScale : ContinuousScale Time.Posix
        xScale =
            Scale.time Time.utc ( 0, plotW ) ( posix tMin, posix tMax )

        xOf : Row -> Float
        xOf r =
            Scale.convert xScale (posix r.unixSeconds)

        -- Stapeln: je Band die Werte über alle Zeilen.
        seriesData =
            List.map (\b -> ( b.name, List.map b.value cfg.rows )) Energy.bandsStacked

        stacked =
            Shape.stack
                { data = seriesData
                , offset = Shape.stackOffsetNone
                , order = identity
                }

        maxStack =
            Tuple.second stacked.extent

        maxLoad =
            List.maximum (List.map .load cfg.rows) |> Maybe.withDefault 0

        yMax =
            Basics.max 1 (Basics.max maxStack maxLoad * 1.05)

        yScale : ContinuousScale Float
        yScale =
            Scale.linear ( plotH, 0 ) ( 0, yMax )

        areaFor : Band -> List ( Float, Float ) -> Svg msg
        areaFor band pairs =
            let
                areaPts =
                    List.map2
                        (\r ( lo, hi ) ->
                            Just
                                ( ( xOf r, Scale.convert yScale lo )
                                , ( xOf r, Scale.convert yScale hi )
                                )
                        )
                        cfg.rows
                        pairs

            in
            Path.element (Shape.area Shape.linearCurve areaPts)
                [ TA.fill (Paint band.color)
                , TA.class [ "series", "s-" ++ Energy.bandKey band.name ]
                , TA.stroke PaintNone
                , TE.onMouseOver (cfg.onHover (Just band.name))
                , TE.onMouseOut (cfg.onHover Nothing)
                , TE.onClick (cfg.onPin band.name)
                ]

        areas =
            List.map2 areaFor Energy.bandsStacked stacked.values

        -- Differenz Erzeugung ↔ Last = Saldo (muss über Import/Export bzw.
        -- Speicher ausgeglichen werden). Defizit (Last > Erzeugung) rot über
        -- dem Stapel, Überschuss (Erzeugung > Last) grün unter der Last-Linie.
        diffArea : Bool -> Svg msg
        diffArea toImport =
            let
                pts =
                    List.map
                        (\r ->
                            let
                                gen =
                                    Energy.totalGeneration r

                                load =
                                    r.load

                                ( lo, hi ) =
                                    if toImport then
                                        ( Basics.min load gen, load )

                                    else
                                        ( load, Basics.max load gen )
                            in
                            Just
                                ( ( xOf r, Scale.convert yScale lo )
                                , ( xOf r, Scale.convert yScale hi )
                                )
                        )
                        cfg.rows
            in
            Path.element (Shape.area Shape.linearCurve pts)
                [ TA.class
                    [ if toImport then
                        "deficit"

                      else
                        "surplus"
                    ]
                , TA.stroke PaintNone
                ]

        loadLine =
            Path.element
                (Shape.line Shape.linearCurve
                    (List.map (\r -> Just ( xOf r, Scale.convert yScale r.load )) cfg.rows)
                )
                [ TA.class [ "load-line" ]
                , TA.fill PaintNone
                , InPx.strokeWidth 1.8
                , TA.strokeDasharray "5 3"
                ]

        focusRect =
            case cfg.focusedDay of
                Nothing ->
                    []

                Just d ->
                    let
                        clampX v =
                            Basics.max 0 (Basics.min plotW v)

                        x0 =
                            clampX (Scale.convert xScale (posix (d * 86400)))

                        x1 =
                            clampX (Scale.convert xScale (posix ((d + 1) * 86400)))
                    in
                    [ rect
                        [ InPx.x x0
                        , InPx.y 0
                        , InPx.width (Basics.max 0 (x1 - x0))
                        , InPx.height plotH
                        , TA.fill (Paint Color.black)
                        , TA.fillOpacity (Opacity 0.06)
                        , TA.stroke (Paint (Color.rgb255 90 90 90))
                        , TA.strokeDasharray "3 2"
                        ]
                        []
                    ]
    in
    svg
        [ viewBox 0 0 cfg.width cfg.height
        , TA.width (TypedSvg.Types.Percent 100)
        ]
        [ g [ transform [ Translate pad.left pad.top ] ]
            (areas ++ [ diffArea False, diffArea True ] ++ focusRect ++ [ loadLine ])
        , g
            [ transform [ Translate pad.left (pad.top + plotH) ]
            , InPx.fontSize 11
            , TA.class [ "axis" ]
            ]
            [ Axis.bottom [ Axis.tickCount 6 ] xScale ]
        , g
            [ transform [ Translate pad.left pad.top ]
            , InPx.fontSize 11
            , TA.class [ "axis" ]
            ]
            [ Axis.left [ Axis.tickCount 5 ] yScale ]
        ]
