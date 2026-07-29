# EnergyCharts · Visual Analytics (Elm)

Interaktive Visual-Analytics-Anwendung zum europäischen Stromsystem: drei verbundene
Sichten – gestapeltes Flächendiagramm mit Saldo (Zeitreihen), Uhrzeit×Tag-Heatmap
(pixel-/matrixorientiert) und Treemap der Erzeugungsstruktur (Bäume) – aus den
EnergyCharts-Daten, ergänzt um die DWD-Globalstrahlung.

## Starten

1. `index.html` im Browser öffnen.
2. Oben rechts auf **„Verbinden"** klicken – die Daten werden direkt aus der
   Datenbank geladen.

## Datenquellen (PostgREST)

- Stromerzeugung: Schema `energycharts`, View `v_publicpower`.
- Wetter: Schema `dwd`, View `v_solar` (Globalstrahlung; sechs über Deutschland
  verteilte Referenzstationen werden je Zeitpunkt zum nationalen Mittel gemittelt).

Das Schema wird je Abfrage über den `Accept-Profile`-Header gewählt; ein Bearer-Token
wird per Basic-Auth (`demo_user`) am `/token`-Endpunkt geholt. Die Datenbank setzt die
nötigen CORS-Header, sodass der Browser direkt zugreifen kann.

## Quellcode (Elm)

- `src/Main.elm` – Steuerung (TEA), Model/Update, verbundene Sichten, Layout
- `src/Api.elm` – Datenzugriff: Token, publicpower, DWD-Solar
- `src/Energy.elm` – Domäne: Erzeugungsbänder, Metriken, Heatmap-Zellen, Treemap-Summen
- `src/Chart/StackedArea.elm`, `Heatmap.elm`, `Treemap.elm` – die drei Sichten

Build: `elm make src/Main.elm --output=elm.js`
