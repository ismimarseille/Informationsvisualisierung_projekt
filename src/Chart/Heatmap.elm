module Chart.Heatmap exposing (Config, view)

{-| Sicht 2 (pixel-orientiert): Heatmap, x = Tag, y = Uhrzeit.

Frage: Welche täglichen und saisonalen Rhythmen hat die Erzeugung? Jede Zelle
codiert einen Wert als Farbe, so werden Mittagsband und Saisondrift lesbar.
Das Raster hat die native Auflösung der Rohdaten (`slotsPerDay`, i. d. R. 96
Viertelstunden je Tag) – kein Binning, eine Zelle ist eine Messung.
Farbskala über `Scale.Color` wie in Übung 7.
-}

import Color exposing (Color)
import Dict exposing (Dict)
import Energy exposing (HeatCell)
import List.Extra
import TypedSvg exposing (g, rect, svg, text_, title)
import TypedSvg.Attributes as TA exposing (transform, viewBox)
import TypedSvg.Attributes.InPx as InPx
import TypedSvg.Core exposing (Svg)
import TypedSvg.Events as TE
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), Transform(..))


type alias Config msg =
    { width : Float
    , height : Float
    , cells : List HeatCell
    , extent : ( Float, Float )
    , unit : String
    , interpolator : Float -> Color
    , slotsPerDay : Int
    , zoom : Int
    , focusedDay : Maybe Int
    , onClickDay : Int -> msg
    }


pad : { left : Float, right : Float, top : Float, bottom : Float }
pad =
    { left = 34, right = 10, top = 8, bottom = 22 }


view : Config msg -> Svg msg
view cfg =
    let
        -- Beim Zoomen wird das SVG in Pixeln breiter als die Karte; der
        -- umgebende Container scrollt dann horizontal (siehe .heat-scroll).
        zf =
            toFloat (Basics.max 1 cfg.zoom)

        contentW =
            cfg.width * zf

        plotW =
            contentW - pad.left - pad.right

        plotH =
            cfg.height - pad.top - pad.bottom

        cellDict : Dict ( Int, Int ) Float
        cellDict =
            cfg.cells
                |> List.map (\c -> ( ( c.day, c.slot ), c.value ))
                |> Dict.fromList

        presentDays =
            cfg.cells |> List.map .day |> List.Extra.unique |> List.sort

        -- Lückenlose Tagesspanne -> vollständiges Rechteck ohne Treppenränder.
        days =
            case ( List.minimum presentDays, List.maximum presentDays ) of
                ( Just lo, Just hi ) ->
                    List.range lo hi

                _ ->
                    presentDays

        nDays =
            List.length days

        cellW =
            if nDays == 0 then
                plotW

            else
                plotW / toFloat nDays

        nSlots =
            Basics.max 1 cfg.slotsPerDay

        cellH =
            plotH / toFloat nSlots

        dayCol : Dict Int Int
        dayCol =
            days |> List.indexedMap (\i d -> ( d, i )) |> Dict.fromList

        ( vmin, vmax ) =
            cfg.extent

        norm v =
            if vmax <= vmin then
                0.5

            else
                Basics.max 0 (Basics.min 1 ((v - vmin) / (vmax - vmin)))

        cellSvg : Int -> Int -> Int -> Svg msg
        cellSvg col day slot =
            let
                base =
                    [ InPx.x (toFloat col * cellW)
                    , InPx.y (toFloat slot * cellH)
                    , InPx.width (cellW + 0.6)
                    , InPx.height (cellH + 0.6)
                    , TE.onClick (cfg.onClickDay day)
                    ]
            in
            case Dict.get ( day, slot ) cellDict of
                Just v ->
                    let
                        tip =
                            Energy.dayLabel day
                                ++ "  "
                                ++ Energy.slotLabel nSlots slot
                                ++ "  ·  "
                                ++ String.fromFloat (toFloat (round (v * 10)) / 10)
                                ++ " "
                                ++ cfg.unit
                    in
                    rect (TA.class [ "cell" ] :: TA.fill (Paint (cfg.interpolator (norm v))) :: base)
                        [ title [] [ TypedSvg.Core.text tip ] ]

                Nothing ->
                    -- Slot ohne Messwert (angebrochener Randtag oder Datenlücke):
                    -- dezente Klasse, Farbe kommt aus dem CSS.
                    rect (TA.class [ "cell", "cell-empty" ] :: base) []

        gridCells =
            days
                |> List.indexedMap Tuple.pair
                |> List.concatMap
                    (\( col, day ) ->
                        List.range 0 (nSlots - 1) |> List.map (cellSvg col day)
                    )

        frame =
            rect
                [ InPx.x 0
                , InPx.y 0
                , InPx.width plotW
                , InPx.height plotH
                , TA.fill PaintNone
                , TA.class [ "hm-frame" ]
                , InPx.strokeWidth 1
                ]
                []

        focusOutline =
            case cfg.focusedDay |> Maybe.andThen (\d -> Dict.get d dayCol) of
                Just col ->
                    [ rect
                        [ InPx.x (toFloat col * cellW)
                        , InPx.y 0
                        , InPx.width cellW
                        , InPx.height plotH
                        , TA.fill PaintNone
                        , TA.class [ "focus-outline" ]
                        , InPx.strokeWidth 1.6
                        ]
                        []
                    ]

                Nothing ->
                    []

        hourLabels =
            [ 0, 6, 12, 18 ]
                |> List.map
                    (\h ->
                        text_
                            [ InPx.x -8
                            , InPx.y (toFloat (h * nSlots // 24) * cellH + 4)
                            , TA.textAnchor AnchorEnd
                            , InPx.fontSize 11
                            , TA.class [ "axis-label" ]
                            ]
                            [ TypedSvg.Core.text (String.fromInt h ++ "h") ]
                    )

        step =
            Basics.max 1 (nDays // 10)

        dayLabels =
            days
                |> List.indexedMap Tuple.pair
                |> List.filterMap
                    (\( i, d ) ->
                        if modBy step i == 0 then
                            Just
                                (text_
                                    [ InPx.x (toFloat i * cellW + cellW / 2)
                                    , InPx.y (plotH + 14)
                                    , TA.textAnchor AnchorMiddle
                                    , InPx.fontSize 11
                                    , TA.class [ "axis-label" ]
                                    ]
                                    [ TypedSvg.Core.text (Energy.dayLabel d) ]
                                )

                        else
                            Nothing
                    )
    in
    svg
        [ viewBox 0 0 contentW cfg.height
        , if cfg.zoom <= 1 then
            TA.width (TypedSvg.Types.Percent 100)

          else
            InPx.width contentW
        ]
        [ g [ transform [ Translate pad.left pad.top ] ]
            (gridCells ++ [ frame ] ++ focusOutline ++ hourLabels ++ dayLabels)
        ]
