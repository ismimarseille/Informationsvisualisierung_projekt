/**
 * Lokaler CORS-Proxy + Token-Mint für die EnergyCharts-/ScienceData-API.
 *
 * Starten:  node proxy.js
 *
 * Endpunkte:
 *   POST /token          -> holt mit Basic-Auth (demo_user:hallo) ein Bearer-Token
 *                           und gibt { "token": "..." } zurück. So muss im Browser
 *                           kein Token manuell eingefügt werden (Ein-Klick "Verbinden").
 *   GET  /db/<schema>/... -> PostgREST-Passthrough. Der erste Pfad-Abschnitt ist
 *                           das DB-Schema (energycharts, dwd), das als
 *                           Accept-Profile-Header gesetzt wird; der Rest (View +
 *                           Query-String) geht unverändert an .../sciencedata/...
 *                           Beispiel:
 *                             /db/energycharts/v_publicpower?country_id=eq.all&limit=100
 *                             /db/dwd/v_solar?station_id=in.(1975,3987)&limit=50
 *   GET  /health         -> { "status": "ok" }
 *
 * Der Proxy umgeht die fehlenden CORS-Header der externen API.
 */

const http = require("http");
const https = require("https");

const PORT = 3001;
const BASE = "dbs.informatik.uni-halle.de";
const TOKEN_PATH = "/sciencedata/token";
const RPC_PATH = "/sciencedata/rpc/user_table_get";

// Demo-Zugang aus der Aufgabenstellung.
const DEMO_USER = "demo_user";
const DEMO_PASS = "hallo";

function setCors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

const server = http.createServer((req, res) => {
    setCors(res);

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    // --- Token holen -------------------------------------------------------
    if (req.url === "/token" && req.method === "POST") {
        const basic = Buffer.from(`${DEMO_USER}:${DEMO_PASS}`).toString("base64");
        const options = {
            hostname: BASE,
            path: TOKEN_PATH,
            method: "POST",
            headers: { Authorization: "Basic " + basic, "Content-Length": 0 },
        };
        const upstream = https.request(options, (up) => {
            res.writeHead(up.statusCode, { "Content-Type": "application/json" });
            up.pipe(res);
        });
        upstream.on("error", (err) => {
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "token request failed", message: err.message }));
        });
        upstream.end();
        return;
    }

    // --- Tabellen-Abfrage weiterleiten ------------------------------------
    if (req.url === "/proxy" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => (body += chunk.toString()));
        req.on("end", () => {
            const options = {
                hostname: BASE,
                path: RPC_PATH,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body),
                    Authorization: req.headers.authorization || "",
                },
            };
            const upstream = https.request(options, (up) => {
                res.writeHead(up.statusCode, up.headers);
                up.pipe(res);
            });
            upstream.on("error", (err) => {
                res.writeHead(502, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "proxy error", message: err.message }));
            });
            upstream.write(body);
            upstream.end();
        });
        return;
    }

    // --- PostgREST-Passthrough mit Accept-Profile -------------------------
    // GET /db/<schema>/<view>?<query>  ->  /sciencedata/<view>?<query>
    // Der erste Abschnitt wählt das DB-Schema (Accept-Profile), der Rest wird
    // inkl. Query-String unverändert durchgereicht.
    if (req.method === "GET" && req.url.startsWith("/db/")) {
        const rest = req.url.slice("/db/".length); // "<schema>/<view>?<query>"
        const slash = rest.indexOf("/");
        if (slash < 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "erwartet /db/<schema>/<view>" }));
            return;
        }
        const schema = rest.slice(0, slash);
        const upstreamPath = "/sciencedata/" + rest.slice(slash + 1);
        const options = {
            hostname: BASE,
            path: upstreamPath,
            method: "GET",
            headers: {
                Authorization: req.headers.authorization || "",
                "Accept-Profile": schema,
                Accept: "application/json",
            },
        };
        const upstream = https.request(options, (up) => {
            res.writeHead(up.statusCode, { "Content-Type": "application/json" });
            up.pipe(res);
        });
        upstream.on("error", (err) => {
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "proxy error", message: err.message }));
        });
        upstream.end();
        return;
    }

    if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));
        return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
    console.log(`\n✅ Proxy läuft auf http://localhost:${PORT}`);
    console.log(`   POST /token   -> Bearer-Token holen (demo_user)`);
    console.log(`   POST /proxy   -> user_table_get weiterleiten`);
    console.log("\nMit Ctrl+C beenden\n");
});
