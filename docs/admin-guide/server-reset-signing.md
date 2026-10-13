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

Übernehmen Sie das Script sowie `packages/protocol` einschließlich Lockfile in einen
geprüften Commit des Dokumentationsrepositorys. Schützen Sie den Hauptbranch und begrenzen
Sie das bestehende Environment `integrity-signing` auf diesen Branch. Das vorhandene Secret
`INTEGRITY_ROOT_PRIVATE_JWK_BASE64` bleibt ausschließlich in diesem Environment.

Die folgende Vorlage gehört nach `.github/workflows/integrity-authorize-reset.yml`.
Ersetzen Sie `AUDITED_COMMIT_SHA` durch die vollständige SHA des geprüften Commits.
Die Action-Versionen sind auf Commit-SHAs festgelegt; vor Übernahme deren Herkunft prüfen.

```yaml
name: Authorize FMB-Log reset
on:
  workflow_dispatch:
    inputs:
      request_base64url:
        description: Base64url-encoded reset-request.json (no padding)
        required: true
        type: string
permissions:
  contents: read
jobs:
  sign:
    runs-on: ubuntu-24.04
    environment: integrity-signing
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
        with:
          ref: AUDITED_COMMIT_SHA
          persist-credentials: false
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020
        with:
          node-version: '24'
      - run: npm ci --ignore-scripts
        working-directory: packages/protocol
      - name: Decode request
        env:
          RESET_REQUEST: ${{ inputs.request_base64url }}
        run: |
          node --input-type=module <<'JS'
          import { writeFileSync } from 'node:fs';
          const value = process.env.RESET_REQUEST;
          if (!value || value.length > 65536 || !/^[A-Za-z0-9_-]+$/.test(value)) process.exit(1);
          const bytes = Buffer.from(value, 'base64url');
          if (bytes.toString('base64url') !== value) process.exit(1);
          writeFileSync('reset-request.json', bytes, { flag: 'wx', mode: 0o600 });
          JS
      - name: Sign authorization
        env:
          INTEGRITY_ROOT_PRIVATE_JWK_BASE64: ${{ secrets.INTEGRITY_ROOT_PRIVATE_JWK_BASE64 }}
        run: node scripts/integrity_authorize_reset.mjs --request reset-request.json --out reset-authorization.json
      - uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02
        with:
          name: reset-authorization
          path: reset-authorization.json
          if-no-files-found: error
          retention-days: 1
```

Es gibt keine Trigger für Push, Pull Requests oder fremde Repository-Ereignisse. Eingabe
und Secret werden ausschließlich über Umgebungsvariablen übergeben, nicht in Shellcode
interpoliert. Das Script protokolliert weder Schlüssel noch Anforderung oder Autorisierung.
Das einzige hochgeladene Artefakt ist die Autorisierung. Das Laufzeit-Secret wird erst nach
Installation der gesperrten Abhängigkeiten an den Signierschritt übergeben.

Die Vorlage ist hier dokumentiert; es wurde keine Action im externen Repository veröffentlicht.
