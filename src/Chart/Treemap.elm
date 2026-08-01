module Chart.Treemap exposing (Config, view)

{-| Sicht 3 (Bäume): Treemap der Erzeugungsstruktur.

Die **vollständige Hierarchie wird ohne Interaktion** gezeigt: Wurzel →
{Erneuerbar, Konventionell} → Quelle → Rohquelle. Fläche ∝ Summe der Leistung im
Zeitraum ∝ Energie. Bänder mit mehreren Rohquellen (Wind, Wasserkraft, Kohle …)
sind intern weiter unterteilt; Bänder aus einer einzigen Quelle (Solar, Kernkraft)
bleiben ein Blatt. Squarified-Layout über `Hierarchy.treemap`, Palette wie im
Flächendiagramm. Hover hebt eine Quelle hervor (bandweise, konsistent zur Legende).
-}

import Color exposing (Color)
import Energy exposing (Band, Group(..), SubSource)
import Hierarchy
import Tree exposing (Tree)
import TypedSvg exposing (g, rect, svg, text_, title)
import TypedSvg.Attributes as TA exposing (transform, viewBox)
import TypedSvg.Attributes.InPx as InPx
import TypedSvg.Core exposing (Svg)
import TypedSvg.Events as TE
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), Transform(..))


type Kind
    = KRoot
    | KGroup
    | KBand
    | KLeaf


type alias TNode =
    { name : String
    , color : Color
    , value : Float
    , kind : Kind
    , band : String
    }


type alias Config msg =
    { width : Float
    , height : Float
    , nodes : List ( Band, Float, List ( SubSource, Float ) )
    , onHover : Maybe String -> msg
    , onPin : String -> msg
    }


round1 : Float -> String
round1 x =
    String.fromFloat (toFloat (round (x * 10)) / 10)


view : Config msg -> Svg msg
view cfg =
    let
        total =
            cfg.nodes |> List.map (\( _, v, _ ) -> v) |> List.sum

        -- Ein Band wird zum Blatt (keine Rohquellen) oder zum Unterbaum.
        bandTree : ( Band, Float, List ( SubSource, Float ) ) -> Tree TNode
        bandTree ( b, v, subs ) =
            case subs of
                [] ->
                    Tree.singleton (TNode b.name b.color v KLeaf b.name)

                _ ->
                    Tree.tree (TNode b.name b.color v KBand b.name)
                        (List.map
                            (\( s, sv ) -> Tree.singleton (TNode s.name s.color sv KLeaf b.name))
                            subs
                        )

        groupTree : Group -> Maybe (Tree TNode)
        groupTree grp =
            case List.filter (\( b, _, _ ) -> b.group == grp) cfg.nodes of
                [] ->
                    Nothing

                bs ->
                    Just
                        (Tree.tree
                            (TNode (Energy.groupName grp)
                                (Energy.groupColor grp)
                                (List.sum (List.map (\( _, v, _ ) -> v) bs))
                                KGroup
                                (Energy.groupName grp)
                            )
                            (List.map bandTree bs)
                        )

        root =
            Tree.tree (TNode "Erzeugung" (Color.rgb255 120 120 120) total KRoot "")
                (List.filterMap groupTree [ Renewable, Conventional ])

        layouted =
            root
                |> Tree.sortWith (\_ a b -> compare (Tree.label b).value (Tree.label a).value)
                |> Hierarchy.treemap
                    [ Hierarchy.tile Hierarchy.squarify
                    , Hierarchy.paddingInner (always 3)
                    , Hierarchy.paddingOuter (always 2)
                    -- paddingTop MUSS nach paddingOuter stehen (paddingOuter setzt
                    -- intern auch den oberen Rand).
                    , Hierarchy.paddingTop
                        (\n ->
                            case n.kind of
                                KRoot ->
                                    4

                                KGroup ->
                                    22

                                KBand ->
                                    17

                                KLeaf ->
                                    0
                        )
                    , Hierarchy.size cfg.width cfg.height
                    ]
                    .value

        -- ---- Kopfleisten je Ebene ---------------------------------------
        headerBar : Float -> Color -> String -> { a | x : Float, y : Float, width : Float } -> Svg msg
        headerBar h barColor label item =
            g []
                [ rect
                    [ InPx.x item.x, InPx.y item.y, InPx.width item.width, InPx.height h
                    , TA.fill (Paint barColor)
                    ]
                    []
                , text_
                    [ InPx.x (item.x + 8), InPx.y (item.y + h - 7), InPx.fontSize (h - 6)
                    , TA.fill (Paint Color.white)
                    ]
                    [ TypedSvg.Core.text label ]
                ]

        groupHeaders =
            Tree.children layouted
                |> List.map Tree.label
                |> List.map
                    (\it ->
                        headerBar 22
                            it.node.color
                            (it.node.name ++ "  ·  " ++ round1 (share it.node.value) ++ " %")
                            it
                    )

        bandHeaders =
            Tree.children layouted
                |> List.concatMap Tree.children
                |> List.map Tree.label
                |> List.filter (\it -> it.node.kind == KBand)
                |> List.map
                    (\it ->
                        -- „⊞" signalisiert: dieses Band ist in Rohquellen aufgeteilt
                        -- (im Vollbild besonders gut zu erkennen).
                        headerBar 17
                            it.node.color
                            (it.node.name ++ "  ·  " ++ round1 (share it.node.value) ++ " %   ⊞")
                            it
                    )

        share v =
            if total <= 0 then
                0

            else
                v / total * 100

        -- ---- Blätter (Rohquellen bzw. Bänder ohne Unterteilung) ---------
        leafSvg item =
            let
                node =
                    item.node

                labelFill =
                    TA.fill (Paint (textOn node.color))

                labels =
                    if item.width > 54 && item.height > 28 then
                        [ text_ [ InPx.x 7, InPx.y 17, InPx.fontSize 12, labelFill ] [ TypedSvg.Core.text node.name ]
                        , text_ [ InPx.x 7, InPx.y 31, InPx.fontSize 10.5, labelFill ] [ TypedSvg.Core.text (round1 (share node.value) ++ " %") ]
                        ]

                    else if item.height > 38 && item.width > 13 then
                        let
                            cx =
                                item.width / 2

                            cy =
                                item.height / 2
                        in
                        [ text_ [ InPx.x cx, InPx.y cy, InPx.fontSize 10.5, TA.textAnchor AnchorMiddle, labelFill, TA.transform [ Rotate -90 cx cy ] ]
                            [ TypedSvg.Core.text node.name ]
                        ]

                    else if item.width > 30 && item.height > 13 then
                        [ text_ [ InPx.x 6, InPx.y (item.height / 2 + 4), InPx.fontSize 10, labelFill ] [ TypedSvg.Core.text node.name ] ]

                    else
                        []
            in
            g [ TA.class [ "leaf" ], transform [ Translate item.x item.y ] ]
                (rect
                    [ InPx.width item.width
                    , InPx.height item.height
                    , TA.fill (Paint node.color)
                    , TA.class [ "tile", "s-" ++ Energy.bandKey node.band ]
                    , InPx.strokeWidth 1.2
                    , TE.onMouseOver (cfg.onHover (Just node.band))
                    , TE.onMouseOut (cfg.onHover Nothing)
                    , TE.onClick (cfg.onPin node.band)
                    ]
                    [ title []
                        [ TypedSvg.Core.text
                            (node.name
                                ++ (if node.name /= node.band then
                                        " (" ++ node.band ++ ")"

                                    else
                                        ""
                                   )
                                ++ " — "
                                ++ round1 (share node.value)
                                ++ " %"
                            )
                        ]
                    ]
                    :: labels
                )
    in
    if List.isEmpty cfg.nodes then
        svg [ viewBox 0 0 cfg.width cfg.height, TA.width (TypedSvg.Types.Percent 100) ]
            [ text_ [ InPx.x 8, InPx.y 20, InPx.fontSize 12 ] [ TypedSvg.Core.text "keine Daten" ] ]

    else
        svg
            [ viewBox 0 0 cfg.width cfg.height
            , TA.width (TypedSvg.Types.Percent 100)
            ]
            (groupHeaders
                ++ bandHeaders
                ++ List.map leafSvg (Tree.leaves layouted)
            )


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
