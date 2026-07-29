module Energy exposing
    ( Row, Band, Group(..)
    , bands, bandsStacked, groupName, groupColor
    , bandInfo, bandColorByName
    , totalGeneration, bandValue
    , Metric(..), metricLabel, metricUnit, metricValue, metricInterpolator
    , hourOf, dayOf, dayLabel
    , HeatCell, slotsPerDay, slotsPerDayInts, heatCells, heatCellsValues, heatExtent, slotLabel
    , decimateTo
    , sumByBand
    , SubSource, bandSubs, sumBySub
    )

{-| Domänenmodell der `publicpower`-Daten.

Eine `Row` ist eine Messung (ein Land, ein Zeitpunkt). Die ~18 Quellen-Spalten
werden zu 8 Bändern zusammengefasst, die in allen Sichten dieselbe Reihenfolge
und Farbe haben. Dazu das Zellenraster der Heatmap und die Treemap-Summen.
-}

import Color exposing (Color)
import Dict exposing (Dict)
import Scale.Color
import Time



-- ============================================================
-- ROW
-- ============================================================


{-| Eine Zeile aus `energycharts_publicpower`. Werte in GW.
-}
type alias Row =
    { unixSeconds : Int
    , countryId : String
    , load : Float
    , solar : Float
    , windOnshore : Float
    , windOffshore : Float
    , hydroRor : Float
    , hydroReservoir : Float
    , hydroPumped : Float
    , biomass : Float
    , geothermal : Float
    , nuclear : Float
    , brownCoal : Float
    , hardCoal : Float
    , oil : Float
    , gas : Float
    , coalDerivedGas : Float
    , waste : Float
    , others : Float
    }



-- ============================================================
-- BÄNDER (8 zusammengefasste Quellen)
-- ============================================================


type Group
    = Renewable
    | Conventional


groupName : Group -> String
groupName g =
    case g of
        Renewable ->
            "Erneuerbar"

        Conventional ->
            "Konventionell"


{-| Hintergrundfarbe für die Gruppen-Beschriftung in der Treemap. -}
groupColor : Group -> Color
groupColor g =
    case g of
        Renewable ->
            Color.rgb255 35 80 45

        Conventional ->
            Color.rgb255 60 60 60


{-| Ein Band fasst mehrere Roh-Spalten zu einer Erzeugungsart zusammen. -}
type alias Band =
    { name : String
    , group : Group
    , color : Color
    , value : Row -> Float
    }


rgb : Int -> Int -> Int -> Color
rgb =
    Color.rgb255


{-| Kanonische Reihenfolge (Erneuerbare zuerst) – für Legende & Treemap. -}
bands : List Band
bands =
    [ solarBand
    , windBand
    , hydroBand
    , biomassBand
    , nuclearBand
    , coalBand
    , gasBand
    , otherBand
    ]


{-| Stapel-Reihenfolge von unten nach oben: Konventionelles unten,
Erneuerbare oben – so liegt der „grüne Deckel" sichtbar unter der Last-Linie.
-}
bandsStacked : List Band
bandsStacked =
    [ coalBand
    , gasBand
    , otherBand
    , nuclearBand
    , biomassBand
    , hydroBand
    , windBand
    , solarBand
    ]


solarBand : Band
solarBand =
    Band "Solar" Renewable (rgb 255 209 59) .solar


windBand : Band
windBand =
    Band "Wind" Renewable (rgb 79 163 209) (\r -> r.windOnshore + r.windOffshore)


hydroBand : Band
hydroBand =
    Band "Wasserkraft" Renewable (rgb 46 111 149) (\r -> r.hydroRor + r.hydroReservoir + r.hydroPumped)


biomassBand : Band
biomassBand =
    Band "Biomasse" Renewable (rgb 91 168 91) (\r -> r.biomass + r.geothermal)


nuclearBand : Band
nuclearBand =
    Band "Kernkraft" Conventional (rgb 184 111 184) .nuclear


coalBand : Band
coalBand =
    Band "Kohle" Conventional (rgb 74 74 74) (\r -> r.brownCoal + r.hardCoal + r.coalDerivedGas)


gasBand : Band
gasBand =
    Band "Gas/Öl" Conventional (rgb 156 122 91) (\r -> r.gas + r.oil)


otherBand : Band
otherBand =
    Band "Sonstige" Conventional (rgb 176 176 176) (\r -> r.waste + r.others)


bandValue : Band -> Row -> Float
bandValue b r =
    b.value r


{-| Kurze Erklärung je Quelle – für die Hover-Tooltips. -}
bandInfo : String -> String
bandInfo name =
    case name of
        "Solar" ->
            "Photovoltaik – erzeugt nur tagsüber, Maximum um die Mittagszeit."

        "Wind" ->
            "Wind an Land und auf See – wetterabhängig, oft nachts und im Winter stärker."

        "Wasserkraft" ->
            "Lauf-, Speicher- und Pumpspeicherkraft – gut regel- und speicherbar."

        "Biomasse" ->
            "Biomasse und Geothermie – planbare, grundlastfähige Erneuerbare."

        "Kernkraft" ->
            "Kernenergie – konstante Grundlast, kaum tageszeitliche Schwankung."

        "Kohle" ->
            "Braun- und Steinkohle – konventionell und CO₂-intensiv."

        "Gas/Öl" ->
            "Gas- und Ölkraftwerke – flexibel, decken Spitzen und Residuallast."

        "Sonstige" ->
            "Abfall und weitere, nicht separat ausgewiesene Quellen."

        _ ->
            ""


{-| Farbe einer Quelle über ihren Namen (für Legenden-/Tooltip-Punkte). -}
bandColorByName : String -> Color
bandColorByName name =
    bands
        |> List.filter (\b -> b.name == name)
        |> List.head
        |> Maybe.map .color
        |> Maybe.withDefault (Color.rgb255 148 163 184)


{-| Gesamte Erzeugung (Summe aller Bänder) – Basis für Anteile. -}
totalGeneration : Row -> Float
totalGeneration r =
    List.sum (List.map (\b -> b.value r) bands)



-- ============================================================
-- METRIK FÜR DIE HEATMAP
-- ============================================================


type Metric
    = SolarShare
    | RenewableShare
    | LoadMetric
    | Irradiance


metricLabel : Metric -> String
metricLabel m =
    case m of
        SolarShare ->
            "Solar-Anteil"

        RenewableShare ->
            "Erneuerbaren-Anteil"

        LoadMetric ->
            "Last"

        Irradiance ->
            "Globalstrahlung (DWD)"


metricUnit : Metric -> String
metricUnit m =
    case m of
        LoadMetric ->
            "GW"

        Irradiance ->
            "J/cm²"

        _ ->
            "%"


{-| Wert der gewählten Metrik für eine Zeile (Anteile in Prozent). -}
metricValue : Metric -> Row -> Float
metricValue m r =
    let
        total =
            totalGeneration r
    in
    case m of
        SolarShare ->
            if total <= 0 then
                0

            else
                100 * r.solar / total

        RenewableShare ->
            if total <= 0 then
                0

            else
                100 * List.sum (List.map (\b -> b.value r) (List.filter (\b -> b.group == Renewable) bands)) / total

        LoadMetric ->
            r.load

        Irradiance ->
            -- Aus den Wetterdaten getrennt gebildet (siehe heatCellsValues),
            -- nicht aus einer publicpower-Zeile ableitbar.
            0


{-| Farbskala je Metrik (0..1 -> Farbe). Perzeptuell gleichmäßige Skalen statt
einer Gelb-Rampe: Helligkeit steigt monoton und der Farbton wechselt mit. -}
metricInterpolator : Metric -> Float -> Color
metricInterpolator m =
    case m of
        SolarShare ->
            Scale.Color.plasmaInterpolator

        RenewableShare ->
            Scale.Color.viridisInterpolator

        LoadMetric ->
            Scale.Color.infernoInterpolator

        Irradiance ->
            Scale.Color.magmaInterpolator



-- ============================================================
-- ZEIT-HILFEN (UTC, aus unix_seconds)
-- ============================================================


hourOf : Int -> Int
hourOf unix =
    modBy 24 (unix // 3600)


{-| Absolute Tagesnummer seit Epoche (UTC) – als Spalten-Schlüssel. -}
dayOf : Int -> Int
dayOf unix =
    unix // 86400


{-| Kurzes Datums-Label "TT.MM." aus einer Tagesnummer. -}
dayLabel : Int -> String
dayLabel dayIndex =
    let
        posix =
            Time.millisToPosix (dayIndex * 86400 * 1000)

        d =
            Time.toDay Time.utc posix

        mon =
            monthNum (Time.toMonth Time.utc posix)

        pad n =
            if n < 10 then
                "0" ++ String.fromInt n

            else
                String.fromInt n
    in
    pad d ++ "." ++ pad mon ++ "."


monthNum : Time.Month -> Int
monthNum m =
    case m of
        Time.Jan -> 1
        Time.Feb -> 2
        Time.Mar -> 3
        Time.Apr -> 4
        Time.May -> 5
        Time.Jun -> 6
        Time.Jul -> 7
        Time.Aug -> 8
        Time.Sep -> 9
        Time.Oct -> 10
        Time.Nov -> 11
        Time.Dec -> 12



-- ============================================================
-- HEATMAP-RASTER  (native Auflösung, ohne Binning)
-- ============================================================


{-| Eine Zelle der Heatmap: Tagesnummer (x), Zeit-Slot innerhalb des Tages (y)
und der Metrikwert. Ein Slot entspricht **einem** Messintervall der Rohdaten –
bei viertelstündlichen Daten also 96 Slots je Tag, bei stündlichen 24. -}
type alias HeatCell =
    { day : Int
    , slot : Int
    , value : Float
    }


{-| Auflösung der Daten als Slots je Tag, aus dem kleinsten Messabstand
abgeleitet (144 = 10 min, 96 = 15 min, 48 = 30 min, 24 = 1 h). Damit ist kein
Binning nötig. -}
slotsPerDay : List Row -> Int
slotsPerDay rows =
    slotsPerDayInts (List.map .unixSeconds rows)


{-| Wie `slotsPerDay`, aber direkt auf Zeitstempeln (für die Wetterreihe). -}
slotsPerDayInts : List Int -> Int
slotsPerDayInts stampsRaw =
    let
        stamps =
            List.sort stampsRaw

        smallestGap =
            List.map2 (-) (List.drop 1 stamps) stamps
                |> List.filter (\d -> d > 0)
                |> List.minimum
    in
    case smallestGap of
        Just gap ->
            if gap <= 600 then
                144

            else if gap <= 900 then
                96

            else if gap <= 1800 then
                48

            else
                24

        Nothing ->
            24


{-| Slot-Index einer Uhrzeit im Tagesraster. -}
slotOf : Int -> Int -> Int
slotOf slots unix =
    modBy 86400 unix * slots // 86400


{-| Uhrzeit eines Slots als "HH:MM" – für Achse und Tooltip. -}
slotLabel : Int -> Int -> String
slotLabel slots slot =
    let
        minutesOfDay =
            slot * 1440 // slots

        pad n =
            if n < 10 then
                "0" ++ String.fromInt n

            else
                String.fromInt n
    in
    pad (minutesOfDay // 60) ++ ":" ++ pad (modBy 60 minutesOfDay)


{-| Ordnet jede Messung direkt einer Zelle (Tag, Slot) zu – **ohne** zeitliche
Aggregation. Der Mittelwert greift nur, falls zwei Messungen in denselben Slot
fallen (z. B. wenn ein Land feiner aufgelöst ist als das Raster). -}
heatCells : Metric -> Int -> List Row -> List HeatCell
heatCells metric slots rows =
    let
        step : Row -> Dict ( Int, Int ) ( Float, Int ) -> Dict ( Int, Int ) ( Float, Int )
        step r acc =
            let
                key =
                    ( dayOf r.unixSeconds, slotOf slots r.unixSeconds )

                v =
                    metricValue metric r
            in
            Dict.update key
                (\existing ->
                    case existing of
                        Just ( sum, n ) ->
                            Just ( sum + v, n + 1 )

                        Nothing ->
                            Just ( v, 1 )
                )
                acc
    in
    List.foldl step Dict.empty rows
        |> Dict.toList
        |> List.map
            (\( ( day, slot ), ( sum, n ) ) ->
                { day = day, slot = slot, value = sum / toFloat (max 1 n) }
            )


{-| Zellen direkt aus `(unix_seconds, Wert)`-Paaren – für die Wetterreihe, deren
Werte nicht aus einer publicpower-Zeile stammen. Fallen mehrere Werte (mehrere
Stationen) in denselben Slot, wird gemittelt – das ergibt das nationale Mittel je
Zeitpunkt. -}
heatCellsValues : Int -> List ( Int, Float ) -> List HeatCell
heatCellsValues slots pairs =
    let
        step : ( Int, Float ) -> Dict ( Int, Int ) ( Float, Int ) -> Dict ( Int, Int ) ( Float, Int )
        step ( unix, v ) acc =
            Dict.update ( dayOf unix, slotOf slots unix )
                (\existing ->
                    case existing of
                        Just ( sum, n ) ->
                            Just ( sum + v, n + 1 )

                        Nothing ->
                            Just ( v, 1 )
                )
                acc
    in
    List.foldl step Dict.empty pairs
        |> Dict.toList
        |> List.map
            (\( ( day, slot ), ( sum, n ) ) ->
                { day = day, slot = slot, value = sum / toFloat (max 1 n) }
            )


{-| Dünnt eine Zeitreihe auf höchstens `maxPoints` Werte aus. Nur fürs
Flächendiagramm, wo bei 90 Tagen mehrere Werte auf einem Pixel lägen. -}
decimateTo : Int -> List Row -> List Row
decimateTo maxPoints rows =
    let
        n =
            List.length rows

        stride =
            if maxPoints <= 0 then
                1

            else
                max 1 (ceiling (toFloat n / toFloat maxPoints))
    in
    if stride == 1 then
        rows

    else
        rows
            |> List.indexedMap Tuple.pair
            |> List.filter (\( i, _ ) -> modBy stride i == 0)
            |> List.map Tuple.second


{-| Wertebereich (min, max) über alle Zellen – für die Farbskala. -}
heatExtent : List HeatCell -> ( Float, Float )
heatExtent cells =
    let
        vals =
            List.map .value cells
    in
    ( List.minimum vals |> Maybe.withDefault 0
    , List.maximum vals |> Maybe.withDefault 1
    )



-- ============================================================
-- TREEMAP-SUMMEN
-- ============================================================


{-| Summe je Band über den Zeitraum (∝ Energie). Bänder mit Summe 0 fallen
raus, sonst entstehen Null-Flächen in der Treemap. -}
sumByBand : List Row -> List ( Band, Float )
sumByBand rows =
    bands
        |> List.map (\b -> ( b, List.sum (List.map b.value rows) ))
        |> List.filter (\( _, v ) -> v > 0)



-- ============================================================
-- ROHQUELLEN JE BAND (für interaktive Aufschlüsselung / Drill-down)
-- ============================================================


type alias SubSource =
    { name : String
    , color : Color
    , value : Row -> Float
    }


{-| Farbton aufhellen (t>0) bzw. abdunkeln (t<0), für Schattierungen eines Bandes. -}
tint : Float -> Color -> Color
tint t c =
    let
        { red, green, blue } =
            Color.toRgba c

        f x =
            if t >= 0 then
                x + (1 - x) * t

            else
                x * (1 + t)
    in
    Color.rgb (f red) (f green) (f blue)


{-| Rohquellen eines Bandes (Schattierungen der Bandfarbe). Leere Liste = das
Band besteht aus einer einzigen Rohquelle und ist nicht weiter aufteilbar. -}
bandSubs : String -> List SubSource
bandSubs name =
    case name of
        "Wind" ->
            [ SubSource "Onshore" (tint 0.12 (rgb 79 163 209)) .windOnshore
            , SubSource "Offshore" (tint -0.28 (rgb 79 163 209)) .windOffshore
            ]

        "Wasserkraft" ->
            [ SubSource "Laufwasser" (tint 0.22 (rgb 46 111 149)) .hydroRor
            , SubSource "Speicher" (rgb 46 111 149) .hydroReservoir
            , SubSource "Pumpspeicher" (tint -0.3 (rgb 46 111 149)) .hydroPumped
            ]

        "Biomasse" ->
            [ SubSource "Biomasse" (rgb 91 168 91) .biomass
            , SubSource "Geothermie" (tint -0.32 (rgb 91 168 91)) .geothermal
            ]

        "Kohle" ->
            [ SubSource "Braunkohle" (tint -0.18 (rgb 74 74 74)) .brownCoal
            , SubSource "Steinkohle" (tint 0.28 (rgb 74 74 74)) .hardCoal
            , SubSource "Kokereigas" (tint 0.55 (rgb 74 74 74)) .coalDerivedGas
            ]

        "Gas/Öl" ->
            [ SubSource "Gas" (tint 0.18 (rgb 156 122 91)) .gas
            , SubSource "Öl" (tint -0.32 (rgb 156 122 91)) .oil
            ]

        "Sonstige" ->
            [ SubSource "Abfall" (tint 0.16 (rgb 176 176 176)) .waste
            , SubSource "Sonstige" (tint -0.22 (rgb 176 176 176)) .others
            ]

        _ ->
            []


{-| Summe je Rohquelle über den Zeitraum (leere/0-Quellen entfernt). -}
sumBySub : List Row -> List SubSource -> List ( SubSource, Float )
sumBySub rows subs =
    subs
        |> List.map (\s -> ( s, List.sum (List.map s.value rows) ))
        |> List.filter (\( _, v ) -> v > 0)
