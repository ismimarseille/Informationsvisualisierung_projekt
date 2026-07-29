module Api exposing
    ( getToken
    , getRecent
    , loadCountryRows
    , loadCountryByIdBlock
    , loadSolar
    , solarStations
    , pageLimit
    )

{-| Zugriff auf die Datenbank über den lokalen Proxy (`proxy.js`, Port 3001).

Die Daten liegen in den PostgREST-Schemas **energycharts** (Stromerzeugung) und
**dwd** (Wetter). Der Proxy wählt das Schema über den ersten Pfad-Abschnitt und
setzt daraus den `Accept-Profile`-Header:

    GET /db/energycharts/v_publicpower?country_id=eq.all&order=unix_seconds.asc&limit=5000
    GET /db/dwd/v_solar?station_id=in.(1975,3987)&timestamp=gte.2026-05-21T00:00:00

Ein Land wird über die explizite Bedingung `country_id=eq.<code>` geladen (klare
SQL-Bedingung, keine Reihenfolge-Annahme). `loadCountryByIdBlock` bleibt als
Notnagel für den Fall, dass der String-Vergleich serverseitig ignoriert würde.
-}

import Energy exposing (Row)
import Http
import Json.Decode as D exposing (Decoder)
import Json.Decode.Pipeline exposing (optional, required)
import Time


proxyBase : String
proxyBase =
    "http://localhost:3001"


{-| View der öffentlichen Stromerzeugung im Schema energycharts. -}
publicpowerUrl : String -> String
publicpowerUrl query =
    proxyBase ++ "/db/energycharts/v_publicpower?" ++ query


{-| Globalstrahlungs-View im Schema dwd. -}
solarUrl : String -> String
solarUrl query =
    proxyBase ++ "/db/dwd/v_solar?" ++ query


limit : Int
limit =
    5000


{-| Maximale Zeilenzahl je Erzeugungs-Abfrage. `Main` seitet weiter, solange eine
Antwort genau so viele Zeilen liefert. -}
pageLimit : Int
pageLimit =
    limit


{-| Repräsentative DWD-Stationen (über Deutschland verteilt), deren Globalstrahlung
zu einem nationalen Mittel je Zeitpunkt zusammengefasst wird: Hamburg, Potsdam,
Köln/Bonn, Frankfurt/Main, Nürnberg, Stuttgart. -}
solarStations : List Int
solarStations =
    [ 1975, 3987, 2667, 1420, 3668, 4928 ]



-- ============================================================
-- TOKEN
-- ============================================================


getToken : (Result Http.Error String -> msg) -> Cmd msg
getToken toMsg =
    Http.post
        { url = proxyBase ++ "/token"
        , body = Http.emptyBody
        , expect = Http.expectJson toMsg (D.field "token" D.string)
        }



-- ============================================================
-- ERZEUGUNG (Schema energycharts)
-- ============================================================


{-| Jüngste Zeilen ab `lbUnix` als `(country_id, id, unix_seconds)`-Tripel.
`Main` liest daraus `tmax` und je Land die größte `id`. -}
getRecent : String -> Int -> (Result Http.Error (List ( String, Int, Int )) -> msg) -> Cmd msg
getRecent token lbUnix toMsg =
    get token
        (publicpowerUrl
            (params
                [ ( "unix_seconds", "gte." ++ String.fromInt lbUnix )
                , ( "order", "unix_seconds.desc" )
                , ( "select", "country_id,id,unix_seconds" )
                , ( "limit", String.fromInt limit )
                ]
            )
        )
        (D.list recentDecoder)
        toMsg


{-| Eine Seite eines Landes ab `tmin`, über `country_id=eq.<code>`. -}
loadCountryRows : String -> String -> Int -> Int -> (Result Http.Error (List Row) -> msg) -> Cmd msg
loadCountryRows token code tmin offset toMsg =
    get token
        (publicpowerUrl
            (params
                [ ( "country_id", "eq." ++ code )
                , ( "unix_seconds", "gte." ++ String.fromInt tmin )
                , ( "order", "unix_seconds.asc" )
                , ( "limit", String.fromInt limit )
                , ( "offset", String.fromInt offset )
                ]
            )
        )
        (D.list rowDecoder)
        toMsg


{-| Fallback ohne String-Vergleich: numerischer `id`-Bereich `(lo, hi]`. -}
loadCountryByIdBlock : String -> ( Int, Int ) -> Int -> Int -> (Result Http.Error (List Row) -> msg) -> Cmd msg
loadCountryByIdBlock token ( lo, hi ) tmin offset toMsg =
    get token
        (publicpowerUrl
            (params
                [ ( "id", "gt." ++ String.fromInt lo )
                , ( "id", "lte." ++ String.fromInt hi )
                , ( "unix_seconds", "gte." ++ String.fromInt tmin )
                , ( "order", "unix_seconds.asc" )
                , ( "limit", String.fromInt limit )
                , ( "offset", String.fromInt offset )
                ]
            )
        )
        (D.list rowDecoder)
        toMsg



-- ============================================================
-- WETTER (Schema dwd)
-- ============================================================


{-| Lädt die Globalstrahlung der Referenzstationen im Zeitfenster `[from, to)` als
`(unix_seconds, J/cm²)`-Paare. `Main` mittelt daraus je Zeitpunkt (nationales
Mittel) und bildet daraus die Heatmap-Zellen. Ein hohes Limit deckt bis ~30 Tage
in einer Abfrage ab (6 Stationen × 144 Zehn-Minuten-Werte/Tag). -}
loadSolar : String -> Int -> Int -> (Result Http.Error (List ( Int, Float )) -> msg) -> Cmd msg
loadSolar token from to toMsg =
    let
        idList =
            "in.(" ++ String.join "," (List.map String.fromInt solarStations) ++ ")"
    in
    get token
        (solarUrl
            (params
                [ ( "station_id", idList )
                , ( "timestamp", "gte." ++ unixToIso from )
                , ( "timestamp", "lt." ++ unixToIso to )
                , ( "globale_solarstrahlung", "not.is.null" )
                , ( "select", "timestamp,globale_solarstrahlung" )
                , ( "order", "timestamp.asc" )
                , ( "limit", "30000" )
                ]
            )
        )
        (D.list solarDecoder)
        toMsg



-- ============================================================
-- HTTP / QUERY-STRING
-- ============================================================


get : String -> String -> Decoder a -> (Result Http.Error a -> msg) -> Cmd msg
get token url decoder toMsg =
    Http.request
        { method = "GET"
        , headers = [ Http.header "Authorization" ("Bearer " ++ token) ]
        , url = url
        , body = Http.emptyBody
        , expect = Http.expectJson toMsg decoder
        , timeout = Nothing
        , tracker = Nothing
        }


{-| Baut einen Query-String. PostgREST erlaubt einen Schlüssel mehrfach (z. B. zwei
`id`-Bedingungen), deshalb eine Liste von Paaren statt eines Dicts. -}
params : List ( String, String ) -> String
params pairs =
    pairs
        |> List.map (\( k, v ) -> k ++ "=" ++ v)
        |> String.join "&"



-- ============================================================
-- DECODER
-- ============================================================


recentDecoder : Decoder ( String, Int, Int )
recentDecoder =
    D.map3 (\c i u -> ( c, i, u ))
        (D.field "country_id" D.string)
        (D.field "id" D.int)
        (D.field "unix_seconds" D.int)


num : Decoder Float
num =
    D.oneOf [ D.float, D.null 0 ]


rowDecoder : Decoder Row
rowDecoder =
    D.succeed Row
        |> required "unix_seconds" D.int
        |> optional "country_id" D.string ""
        |> optional "load_in_gw" num 0
        |> optional "solar_in_gw" num 0
        |> optional "wind_onshore_in_gw" num 0
        |> optional "wind_offshore_in_gw" num 0
        |> optional "hydro_run_of_river_in_gw" num 0
        |> optional "hydro_water_reservoir_in_gw" num 0
        |> optional "hydro_pumped_storage_in_gw" num 0
        |> optional "biomass_in_gw" num 0
        |> optional "geothermal_in_gw" num 0
        |> optional "nuclear_energy_in_gw" num 0
        |> optional "fossil_brown_coal_lignite_in_gw" num 0
        |> optional "fossil_hard_coal_in_gw" num 0
        |> optional "fossil_oil_in_gw" num 0
        |> optional "fossil_gas_in_gw" num 0
        |> optional "fossil_coal_derived_gas_in_gw" num 0
        |> optional "waste_in_gw" num 0
        |> optional "others_in_gw" num 0


{-| Eine Solarzeile: Zeitstempel (Text, ohne Zeitzone → als UTC gelesen) und
Globalstrahlung in J/cm². -}
solarDecoder : Decoder ( Int, Float )
solarDecoder =
    D.map2 (\ts v -> ( isoToUnix ts, v ))
        (D.field "timestamp" D.string)
        (D.field "globale_solarstrahlung" num)



-- ============================================================
-- ZEIT: unix <-> ISO (UTC, ohne Zeitzone), für die dwd-Query
-- ============================================================


{-| Unix-Sekunden -> "YYYY-MM-DDTHH:MM:SS" (UTC) für den timestamp-Filter. -}
unixToIso : Int -> String
unixToIso unix =
    let
        p =
            Time.millisToPosix (unix * 1000)

        pad n =
            String.padLeft 2 '0' (String.fromInt n)

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
    in
    String.fromInt (Time.toYear Time.utc p)
        ++ "-"
        ++ pad (monthNum (Time.toMonth Time.utc p))
        ++ "-"
        ++ pad (Time.toDay Time.utc p)
        ++ "T"
        ++ pad (Time.toHour Time.utc p)
        ++ ":"
        ++ pad (Time.toMinute Time.utc p)
        ++ ":"
        ++ pad (Time.toSecond Time.utc p)


{-| "YYYY-MM-DDTHH:MM:SS" (als UTC) -> Unix-Sekunden. -}
isoToUnix : String -> Int
isoToUnix s =
    case String.split "T" s of
        [ datePart, timePart ] ->
            let
                ymd =
                    String.split "-" datePart |> List.filterMap String.toInt

                hms =
                    String.split ":" timePart |> List.filterMap (String.toFloat >> Maybe.map floor)
            in
            case ( ymd, hms ) of
                ( [ y, mo, d ], h :: mi :: rest ) ->
                    daysFromCivil y mo d * 86400 + h * 3600 + mi * 60 + (List.head rest |> Maybe.withDefault 0)

                _ ->
                    0

        _ ->
            0


{-| Tage seit 1970-01-01 (proleptischer gregorianischer Kalender, Hinnant). -}
daysFromCivil : Int -> Int -> Int -> Int
daysFromCivil y0 m d =
    let
        y =
            if m <= 2 then
                y0 - 1

            else
                y0

        era =
            (if y >= 0 then
                y

             else
                y - 399
            )
                // 400

        yoe =
            y - era * 400

        mp =
            if m > 2 then
                m - 3

            else
                m + 9

        doy =
            (153 * mp + 2) // 5 + d - 1

        doe =
            yoe * 365 + yoe // 4 - yoe // 100 + doy
    in
    era * 146097 + doe - 719468
