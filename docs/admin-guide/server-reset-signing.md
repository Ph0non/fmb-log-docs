# Root-Freigabe für einen Server-Reset

Die Freigabe autorisiert genau eine vom Server vorbereitete Anforderung. Die Action führt
keinen Reset aus. Der angemeldete Administrator übergibt die Freigabe anschließend an den
Server. Die Freigabe ist höchstens 24 Stunden gültig und verfällt bei Änderungen am gebundenen
Daten- oder Sicherheitsstand.

Lokal mit Node.js 24:

```sh
node scripts/integrity_authorize_reset.mjs \
  --request reset-request.json \
  --out reset-authorization.json \
  --root-private /sicherer/pfad/integrity-root-private.jwk.json
```

Die Ausgabedatei darf noch nicht existieren. Script und Server importieren denselben
strikten Nachrichtenaufbau aus `packages/protocol/src/reset.ts`: UTF-8 einer festen
JSON-Array-Feldreihenfolge, signiert mit Ed25519. Weder JSON-Schlüsselreihenfolge noch
die Darstellung der äußeren Anforderung beeinflussen die Signatur. Zusätzliche Felder,
ungültige CIDs, ungültige Zeiten und ein anderer Reset-Umfang werden abgewiesen.

## Manuelle Action in `Ph0non/fmb-log-docs`

Der fertige Workflow liegt in `.github/workflows/integrity-authorize-reset.yml`.
Übernehmen Sie ihn zusammen mit `scripts/integrity_authorize_reset.mjs` und
`packages/protocol` (inklusive `package.json`, `package-lock.json` und `src`, ohne
`node_modules`) in das Dokumentationsrepository. Dort fehlen Script und Protokollpaket
bisher. Das Protokollpaket stellt sicher, dass Action und Anwendung exakt dieselben
Felder und Signaturdaten verwenden.

Wie der vorhandene Workflow `integrity-certify-dbkey.yml` verwendet die Action das
Environment `integrity-signing` und das Secret `INTEGRITY_ROOT_PRIVATE_JWK_BASE64`.
Es werden keine weiteren Secrets benötigt. Der Schlüssel muss zum konfigurierten
Root-Vertrauensanker des Servers passen. Schützen Sie `main` und begrenzen Sie das
Environment auf diesen Branch; konfigurieren Sie dort bei Bedarf Required Reviewers.
Die Action läuft ausschließlich manuell auf `main` und checkt den exakten Commit des
Workflow-Laufs aus. Node.js 24 kann die gemeinsamen TypeScript-Module direkt laden.

### Ablauf

1. In der Anwendung unter **Administration → Reset** eine Anforderung vorbereiten
   und als JSON exportieren.
2. In GitHub **Actions → Authorize FMB-Log reset → Run workflow** auf `main` öffnen.
3. Bei `nonce` die **Reset-Kennung (Nonce)** und bei `request_json` den vollständigen
   Inhalt der exportierten JSON-Datei einfügen. Keine Base64-Kodierung verwenden.
4. Nach erfolgreichem Lauf das Artefakt `reset-authorization` herunterladen und
   `reset-authorization.json` entpacken.
5. In der Anwendung die Root-Freigabe laden, die Vorschau prüfen und den Reset
   bestätigen. Bei abgelaufener oder inzwischen überholter Anforderung neu vorbereiten
   und signieren lassen.

Die Nonce allein genügt nicht: Die Signatur bindet die vollständige Anforderung.
Ein Abruf per Nonce über `/v1/admin/reset/status/:nonce` benötigt Serverzugriff und
eine aktuelle Administrator-Sitzung. Der Workflow verwendet deshalb den manuellen
JSON-Export und prüft, dass seine Nonce mit der separaten Eingabe übereinstimmt.
Die Anwendung und der Server prüfen beim Import beziehungsweise bei der Ausführung
Identität, Administrator, Signatur und aktuellen Stand erneut.

Eingaben und Secret werden über Umgebungsvariablen übergeben, nicht in Shellcode
interpoliert. Das Secret ist nur im Signierschritt verfügbar, nach der Installation
mit `npm ci --ignore-scripts`. Zusätzliche Felder, ungültige Nonces/CIDs und ungültige
oder abgelaufene Zeitfenster werden vor dem Signieren abgewiesen. Das Signierskript
gibt weder Schlüssel noch Anforderung oder Autorisierung aus. Der Workflow lädt nur
die Freigabedatei als Artefakt mit einem Tag Aufbewahrung hoch. Die manuell eingegebene
Anforderung ist kein Secret; GitHub erhält ihren Inhalt als Workflow-Eingabe und kann
ihn in der Anzeige der Schritt-Umgebungsvariablen im Laufprotokoll ausgeben.

Die Action erstellt ausschließlich die Freigabe. Der eigentliche Reset bleibt ein
separater, bestätigter Schritt in der Anwendung. Es wurde keine Action im externen
Repository veröffentlicht und kein Reset ausgeführt.
