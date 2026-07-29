module Api exposing
    ( getToken
    , getRecent
    , loadCountryRows
    , loadCountryByIdBlock
    , pageLimit
    )

{-| Zugriff auf die API über den lokalen Proxy (`proxy.js`, Port 3001).

Ein Land wird über `country_id = '<code>'` im `where_` geladen, also durch eine
explizite Bedingung und nicht über die Reihenfolge der Zeilen. `loadCountryRows`
ist der Normalfall.

`loadCountryByIdBlock` ist ein Notnagel für den Fall, dass die API den
String-Vergleich ignoriert (dann kämen fremde Länder in der Antwort zurück):
Es lädt über einen numerischen `id`-Bereich. Das setzt voraus, dass die Zeilen
eines Landes in einem zusammenhängenden `id`-Block liegen – eine Annahme, die
die DB nicht zusichert. Deshalb nur als Fallback und mit Filter auf der
Client-Seite.
-}

import Energy exposing (Row)
import Http
import Json.Decode as D exposing (Decoder)
import Json.Decode.Pipeline exposing (optional, required)
import Json.Encode as E


proxyBase : String
proxyBase =
    "http://localhost:3001"


tableName : String
tableName =
    "energycharts_publicpower"


limit : Int
limit =
    5000


{-| Maximale Zeilenzahl je Abfrage. `Main` seitet weiter, solange eine Antwort
genau so viele Zeilen liefert (längere Zeitfenster brauchen mehrere Seiten:
90 Tage × 96 Viertelstunden ≈ 8640 Zeilen). -}
pageLimit : Int
pageLimit =
    limit



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
-- ABFRAGEN
-- ============================================================


{-| Jüngste Daten ab `lbUnix` als `(country_id, id, unix_seconds)`-Tripel.
`Main` liest daraus `tmax` und je Land die größte `id` (Block-Obergrenze). -}
getRecent : String -> Int -> (Result Http.Error (List ( String, Int, Int )) -> msg) -> Cmd msg
getRecent token lbUnix toMsg =
    request token
        (queryBody [ whereInt "unix_seconds" ">" lbUnix ] [ orderBy "unix_seconds" "desc" ] limit 0)
        (D.list recentDecoder)
        toMsg


{-| Lädt eine Seite eines Landes ab `tmin`. Das Land steht als Bedingung im
`where_`; `offset` = 0 ist die erste Seite. Liefert die Antwort `pageLimit`
Zeilen, gibt es vermutlich weitere Seiten. -}
loadCountryRows : String -> String -> Int -> Int -> (Result Http.Error (List Row) -> msg) -> Cmd msg
loadCountryRows token code tmin offset toMsg =
    request token
        (queryBody
            [ whereStr "country_id" "=" code
            , whereInt "unix_seconds" ">=" tmin
            ]
            [ orderBy "unix_seconds" "asc" ]
            limit
            offset
        )
        (D.list rowDecoder)
        toMsg


{-| Fallback ohne String-Vergleich: numerischer `id`-Bereich `(lo, hi]`. -}
loadCountryByIdBlock : String -> ( Int, Int ) -> Int -> Int -> (Result Http.Error (List Row) -> msg) -> Cmd msg
loadCountryByIdBlock token ( lo, hi ) tmin offset toMsg =
    request token
        (queryBody
            [ whereInt "id" ">" lo
            , whereInt "id" "<=" hi
            , whereInt "unix_seconds" ">=" tmin
            ]
            [ orderBy "unix_seconds" "asc" ]
            limit
            offset
        )
        (D.list rowDecoder)
        toMsg



-- ============================================================
-- HTTP / BODY
-- ============================================================


request : String -> E.Value -> Decoder a -> (Result Http.Error a -> msg) -> Cmd msg
request token body decoder toMsg =
    Http.request
        { method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ token) ]
        , url = proxyBase ++ "/proxy"
        , body = Http.jsonBody body
        , expect = Http.expectJson toMsg decoder
        , timeout = Nothing
        , tracker = Nothing
        }


queryBody : List E.Value -> List E.Value -> Int -> Int -> E.Value
queryBody whereList orderList limit_ offset_ =
    E.object
        [ ( "p_table_name", E.string tableName )
        , ( "where_", E.list identity whereList )
        , ( "order_by", E.list identity orderList )
        , ( "limit_val", E.int limit_ )
        , ( "offset_val", E.int offset_ )
        ]


whereInt : String -> String -> Int -> E.Value
whereInt col op val =
    E.object
        [ ( "col", E.string col )
        , ( "op", E.string op )
        , ( "val", E.int val )
        , ( "logic", E.string "and" )
        ]


whereStr : String -> String -> String -> E.Value
whereStr col op val =
    E.object
        [ ( "col", E.string col )
        , ( "op", E.string op )
        , ( "val", E.string val )
        , ( "logic", E.string "and" )
        ]


orderBy : String -> String -> E.Value
orderBy col dir =
    E.object [ ( "col", E.string col ), ( "dir", E.string dir ) ]



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
