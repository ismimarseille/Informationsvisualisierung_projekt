module Chart.Treemap exposing (Config, view)

{-| Sicht 3 (Bäume): Treemap der Erzeugungsstruktur.

Frage: Welchen Energieanteil hat jede Quelle? Die Hierarchie Wurzel →
{Erneuerbar, Konventionell} → Quellen wird flächenproportional gefüllt
(Fläche ∝ Summe der Leistung im Zeitraum ∝ Energie), Quellen einer Gruppe
liegen beieinander. Squarified-Layout über `Hierarchy.treemap` (Übung 9/10),
Palette wie im Flächendiagramm.
-}

import Color exposing (Color)
import Energy exposing (Band, Group(..))
import Hierarchy
import Tree exposing (Tree)
import TypedSvg exposing (g, rect, svg, text_, title)
import TypedSvg.Attributes as TA exposing (transform, viewBox)
import TypedSvg.Attributes.InPx as InPx
import TypedSvg.Core exposing (Svg)
import TypedSvg.Events as TE
import TypedSvg.Types exposing (AnchorAlignment(..), Opacity(..), Paint(..), Transform(..))


type alias TNode =
    { name : String
    , color : Color
    , value : Float
    }


type alias Config msg =
    { width : Float
    , height : Float
    , sums : List ( Band, Float )
    , subSums : List ( Energy.SubSource, Float )
    , focus : Maybe String
    , active : List String
    , onHover : Maybe String -> msg
    , onPin : String -> msg
    , onDrill : Maybe String -> msg
    }


view : Config msg -> Svg msg
view cfg =
    let
        leavesOf : Group -> List (Tree TNode)
        leavesOf grp =
            cfg.sums
                |> List.filter (\( b, _ ) -> b.group == grp)
                |> List.map (\( b, v ) -> Tree.singleton (TNode b.name b.color v))

        groupNode : Group -> Maybe (Tree TNode)
        groupNode grp =
            case leavesOf grp of
                [] ->
                    Nothing

                kids ->
                    Just
                        (Tree.tree
                            (TNode (Energy.groupName grp)
                                (Energy.groupColor grp)
                                (List.sum (List.map (\t -> (Tree.label t).value) kids))
                            )
                            kids
                        )

        children =
            List.filterMap groupNode [ Renewable, Conventional ]

        total =
            List.sum (List.map (\t -> (Tree.label t).value) children)

        root =
            Tree.tree (TNode "Erzeugung" (Color.rgb255 120 120 120) total) children

        layouted =
            root
                |> Tree.sortWith (\_ a b -> compare (Tree.label b).value (Tree.label a).value)
                |> Hierarchy.treemap
                    [ Hierarchy.tile Hierarchy.squarify
                    , Hierarchy.paddingInner (always 4)
                    , Hierarchy.paddingOuter (always 2)
                    -- paddingTop MUSS nach paddingOuter stehen: paddingOuter setzt
                    -- intern auch den oberen Rand und würde ihn sonst überschreiben.
                    , Hierarchy.paddingTop (\n -> if n.name == "Erzeugung" then 4 else 27)
                    , Hierarchy.size cfg.width cfg.height
                    ]
                    .value

        round1 x =
            String.fromFloat (toFloat (round (x * 10)) / 10)

        leafSvg item =
            let
                node =
                    item.node

                dimmed =
                    not (List.isEmpty cfg.active) && not (List.member node.name cfg.active)

                pct =
                    if total <= 0 then
                        0

                    else
                        node.value / total * 100

                tip =
                    node.name ++ " — " ++ round1 pct ++ " %"

                labelFill =
                    TA.fill (Paint (textOn node.color))

                labelNodes =
                    if item.width > 54 && item.height > 28 then
                        -- genug Platz: Name + Prozent horizontal
                        [ text_ [ InPx.x 7, InPx.y 17, InPx.fontSize 12.5, labelFill ]
                            [ TypedSvg.Core.text node.name ]
                        , text_ [ InPx.x 7, InPx.y 32, InPx.fontSize 11, labelFill ]
                            [ TypedSvg.Core.text (round1 pct ++ " %") ]
                        ]

                    else if item.height > 40 && item.width > 13 then
                        -- schmale, hohe Kachel: Name vertikal, um die Kachelmitte gedreht
                        let
                            cx =
                                item.width / 2

                            cy =
                                item.height / 2
                        in
                        [ text_
                            [ InPx.x cx
                            , InPx.y cy
                            , InPx.fontSize 11
                            , TA.textAnchor AnchorMiddle
                            , labelFill
                            , TA.transform [ Rotate -90 cx cy ]
                            ]
                            [ TypedSvg.Core.text node.name ]
                        ]

                    else if item.width > 30 && item.height > 14 then
                        -- flach & breit: nur der Name, horizontal
                        [ text_ [ InPx.x 7, InPx.y (item.height / 2 + 4), InPx.fontSize 10.5, labelFill ]
                            [ TypedSvg.Core.text node.name ]
                        ]

                    else
                        []
            in
            g [ TA.class [ "leaf" ], transform [ Translate item.x item.y ] ]
                (rect
                    [ InPx.width item.width
                    , InPx.height item.height
                    , TA.fill (Paint node.color)
                    , TA.class
                        (if dimmed then
                            [ "tile", "is-dim" ]

                         else
                            [ "tile" ]
                        )
                    , InPx.strokeWidth 1.5
                    , TE.onMouseOver (cfg.onHover (Just node.name))
                    , TE.onMouseOut (cfg.onHover Nothing)
                    , TE.onClick
                        (if List.isEmpty (Energy.bandSubs node.name) then
                            cfg.onPin node.name

                         else
                            cfg.onDrill (Just node.name)
                        )
                    ]
                    [ title [] [ TypedSvg.Core.text (drillTip node.name tip) ] ]
                    :: labelNodes
                )

        -- Jede Gruppe erhält eine eigene Kopfleiste (Band + Titel), damit der
        -- Gruppentitel nie mehr über den Kacheln liegt.
        groupHeader item =
            let
                node =
                    item.node
            in
            [ rect
                [ InPx.x item.x
                , InPx.y item.y
                , InPx.width item.width
                , InPx.height 22
                , TA.fill (Paint node.color)
                ]
                []
            , text_
                [ InPx.x (item.x + 9)
                , InPx.y (item.y + 15)
                , InPx.fontSize 12
                , TA.fill (Paint Color.white)
                ]
                [ TypedSvg.Core.text (node.name ++ "  ·  " ++ round1 (groupPct total node.value) ++ " %") ]
            ]

        groupHeaders =
            Tree.children layouted
                |> List.map Tree.label
                |> List.concatMap groupHeader
    in
    case ( cfg.focus, cfg.subSums ) of
        ( Just band, (_ :: _) as subs ) ->
            drillView cfg band subs

        _ ->
            if List.isEmpty cfg.sums then
                svg [ viewBox 0 0 cfg.width cfg.height, TA.width (TypedSvg.Types.Percent 100) ]
                    [ text_ [ InPx.x 8, InPx.y 20, InPx.fontSize 12 ] [ TypedSvg.Core.text "keine Daten" ] ]

            else
                svg
                    [ viewBox 0 0 cfg.width cfg.height
                    , TA.width (TypedSvg.Types.Percent 100)
                    ]
                    (groupHeaders ++ List.map leafSvg (Tree.leaves layouted))


{-| Drill-down: die Rohquellen eines Bandes als eigene Treemap, mit anklickbarer
Kopfleiste „← zurück". -}
drillView : Config msg -> String -> List ( Energy.SubSource, Float ) -> Svg msg
drillView cfg band subs =
    let
        headerH : Float
        headerH =
            30

        total =
            List.sum (List.map Tuple.second subs)

        round1 x =
            String.fromFloat (toFloat (round (x * 10)) / 10)

        leaves =
            subs |> List.map (\( s, v ) -> Tree.singleton (TNode s.name s.color v))

        root =
            Tree.tree (TNode band (Color.rgb255 90 90 90) total) leaves

        layouted =
            root
                |> Tree.sortWith (\_ a b -> compare (Tree.label b).value (Tree.label a).value)
                |> Hierarchy.treemap
                    [ Hierarchy.tile Hierarchy.squarify
                    , Hierarchy.paddingInner (always 4)
                    , Hierarchy.paddingOuter (always 2)
                    , Hierarchy.paddingTop
                        (\n ->
                            if n.name == band then
                                headerH

                            else
                                0
                        )
                    , Hierarchy.size cfg.width cfg.height
                    ]
                    .value

        subLeaf item =
            let
                node =
                    item.node

                pct =
                    if total <= 0 then
                        0

                    else
                        node.value / total * 100

                labelFill =
                    TA.fill (Paint (textOn node.color))

                labels =
                    if item.width > 54 && item.height > 28 then
                        [ text_ [ InPx.x 7, InPx.y 17, InPx.fontSize 12.5, labelFill ] [ TypedSvg.Core.text node.name ]
                        , text_ [ InPx.x 7, InPx.y 32, InPx.fontSize 11, labelFill ] [ TypedSvg.Core.text (round1 pct ++ " %") ]
                        ]

                    else if item.height > 40 && item.width > 13 then
                        let
                            cx =
                                item.width / 2

                            cy =
                                item.height / 2
                        in
                        [ text_ [ InPx.x cx, InPx.y cy, InPx.fontSize 11, TA.textAnchor AnchorMiddle, labelFill, TA.transform [ Rotate -90 cx cy ] ]
                            [ TypedSvg.Core.text node.name ]
                        ]

                    else if item.width > 30 && item.height > 14 then
                        [ text_ [ InPx.x 7, InPx.y (item.height / 2 + 4), InPx.fontSize 10.5, labelFill ] [ TypedSvg.Core.text node.name ] ]

                    else
                        []
            in
            g [ TA.class [ "leaf" ], transform [ Translate item.x item.y ] ]
                (rect
                    [ InPx.width item.width
                    , InPx.height item.height
                    , TA.fill (Paint node.color)
                    , TA.class [ "tile" ]
                    , InPx.strokeWidth 1.5
                    , TE.onClick (cfg.onDrill Nothing)
                    ]
                    [ title [] [ TypedSvg.Core.text (node.name ++ " — " ++ round1 pct ++ " %") ] ]
                    :: labels
                )

        backBar =
            [ rect
                [ InPx.x 0, InPx.y 0, InPx.width cfg.width, InPx.height headerH, TA.fill (Paint (Color.rgb255 51 65 85)), TE.onClick (cfg.onDrill Nothing) ]
                []
            , text_
                [ InPx.x 11, InPx.y 20, InPx.fontSize 12.5, TA.fill (Paint Color.white), TE.onClick (cfg.onDrill Nothing) ]
                [ TypedSvg.Core.text ("← " ++ band ++ " · zurück zur Übersicht") ]
            ]
    in
    svg [ viewBox 0 0 cfg.width cfg.height, TA.width (TypedSvg.Types.Percent 100) ]
        (List.map subLeaf (Tree.leaves layouted) ++ backBar)


drillTip : String -> String -> String
drillTip name tip =
    if List.isEmpty (Energy.bandSubs name) then
        tip

    else
        tip ++ "  ·  klicken zum Aufschlüsseln"


groupPct : Float -> Float -> Float
groupPct total v =
    if total <= 0 then
        0

    else
        v / total * 100


{-| Lesbare Textfarbe je nach Helligkeit der Hintergrundfarbe. -}
textOn : Color -> Color
textOn c =
    let
        { red, green, blue } =
            Color.toRgba c

        lum =
            0.2126 * red + 0.7152 * green + 0.0722 * blue
    in
    if lum > 0.6 then
        Color.rgb255 30 30 30

    else
        Color.rgb255 250 250 250
