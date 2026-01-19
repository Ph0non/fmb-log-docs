# Technische Dokumentation

Dieses Kapitel ergänzt den Admin Guide um technische Details für Betrieb, IT‑Integration und Fehlersuche. Es beschreibt, **wo** FMB Log Daten ablegt, **welche** Dateien „außerhalb der Datenbank“ existieren und **wie** Signaturen/Authentifizierung technisch funktionieren.

> Zielgruppe: Admins/Key‑User und IT‑Betreiber (z. B. wenn FMB Log auf mehreren Arbeitsplätzen gegen einen gemeinsamen Hub betrieben wird).

## 1) Datenablage: `resources` vs. Hub‑Datenordner vs. AppLocalData

FMB Log unterscheidet drei Speicherbereiche:

1. **Programm‑Ressourcen (`resources/` im Programmordner)**  
   Enthält gebündelte Dateien, die zur App gehören (Extensions, Dictionaries, Logo, Stub‑DB).
2. **Hub‑Datenordner (gemeinsam, z. B. Netzlaufwerk)**  
   Enthält die **Hub‑DB** sowie **Vaults** und **Protokoll‑Archive**. Dieser Ordner ist die „Quelle der Wahrheit“ für den gemeinsamen Betrieb.
3. **AppLocalData (pro Windows‑Benutzer, lokal)**  
   Enthält die **lokale Replica‑DB** und den **lokalen Protokoll‑Cache**, damit die App offline weiter nutzbar bleibt.

Typische Struktur (vereinfacht):

- **Programmordner** (lokal)
  - `resources/`
    - `extensions/crsqlite.dll` (CR‑SQLite Extension)
    - `zstd-dicts/rpt-v1.dict` (optional, Zstd‑Dictionary für RPT‑Kompression)
    - `Logo_EWN_RGB.png` (Logo für Tagesabrechnung)
    - `fmblog.stub.db` (Stub‑DB als „Baseline“; wird nur kopiert, wenn noch keine DB existiert)
- **Hub‑Datenordner** (gemeinsam)
  - `<db>.db` (Hub‑DB; Name frei wählbar)
  - `<db>.integrity.pub.json` (DB‑Public‑Key)
  - `<db>.integrity.dbkey.json` (DB‑Key‑Zertifikat; Root‑signiert)
  - `vaults/`
    - `<user_id>.vault` (Pepper + User‑Signierschlüssel)
    - `<db>.integrity.vault` (DB‑Signierschlüssel; Admin‑Entsperren)
  - `protocols/`
    - `<site-id-hex>/pack-*.bin` (Packfiles für komprimierte Protokolle)
    - `<site-id-hex>/state.json` (merkt „aktuelles“ Packfile)
- **AppLocalData** (lokal)
  - `replicas/fmblog.<hash>.db` (Replica‑DB)
  - `protocols-cache/<hub-hash>/` (lokaler Protokoll‑Cache; Dateien nach Protokoll‑BLAKE3 benannt)

::: info Zusammenfassung (Speicherorte)
- `resources/` enthält „App‑Ressourcen“ (Extension/Dictionaries/Logo/Stub), nicht die produktiven Daten.
- Produktive Daten liegen im Hub‑Datenordner: Hub‑DB + `vaults/` + `protocols/` + Integritätsdateien.
- AppLocalData ist pro Nutzer lokal: Replica‑DB + Cache (offline‑fähig).
:::

::: tip Stub‑DB aktualisieren (bei Schema‑Änderungen)
Die Stub‑DB ist die „Baseline“ für neue DB‑Dateien (Hub/Replica). Wenn sich das Schema durch neue Migrationen ändert, sollte die Stub‑DB aktualisiert werden:

`pnpm -s db:stub:update`

Wichtig: Das Skript muss auf **Windows** ausgeführt werden (nicht in WSL), da es die lokal installierten Build‑Tools/Abhängigkeiten nutzt.
:::

## 2) Messprotokolle: zstd‑Kompression, Packfiles und lokaler Cache

Messprotokolle werden aus Performance‑ und Sync‑Gründen **nicht** als BLOB in der CR‑SQLite‑Datenbank synchronisiert. Stattdessen:

1. Die Protokoll‑Bytes werden **zstd‑komprimiert** (optional mit Dictionary, z. B. `rpt-v1.dict`).
2. Die komprimierten Bytes werden als **Packfile‑Eintrag** in den Hub geschrieben (append‑only).
3. In der DB wird nur eine **Referenz** gespeichert (`measurement_protocols`):
   - `pack_file`, `pack_offset`, `pack_length` (wo liegt das Protokoll im Packfile?)
   - `blake3` (Integritäts‑Hash über die komprimierten Bytes; gespeichert als 32‑Byte‑BLOB, angezeigt als Hex)
   - `dict_id` (welches Dictionary wurde verwendet, falls vorhanden?)
4. Zusätzlich wird das Protokoll lokal im **Protokoll‑Cache** abgelegt, damit es offline gelesen werden kann.

### Offline‑Import (Hub nicht erreichbar)

Offline‑Import ist erlaubt. In diesem Fall:

- Die DB enthält zunächst eine „ausstehende“ Referenz (`pack_file=''` und/oder `pack_length=0`).
- Das Protokoll liegt bereits im lokalen Cache des Import‑Clients (unter dem `blake3`‑Namen).
- Zusätzlich wird lokal eine Outbox geführt (`protocol_upload_outbox`), die Upload‑Versuche, Backoff und Fehlerstatus verwaltet.
- Sobald der Hub wieder erreichbar ist, lädt der Import‑Client das Protokoll automatisch in den Hub hoch (Outbox‑Flush) und ergänzt `pack_file/offset/length`. Der Status ist in der UI auf der Import‑Seite unter „Ausstehende Uploads“ sichtbar und kann dort manuell per „Jetzt synchronisieren“ angestoßen werden.

Wichtig: Wenn ein Protokoll **noch nicht** im Hub archiviert wurde, können andere Clients die Messung sehen, aber das Protokoll erst öffnen, nachdem der Import‑Client wieder online war und der Upload erfolgt ist.

### Cache‑Reset

Der lokale Protokoll‑Cache ist ein Performance‑/Offline‑Feature. Ein „Cache leeren“ löscht nur lokale Dateien. Beachten Sie:

- Der Cache ist als **LRU** mit einem Größenlimit ausgelegt (aktuell ~100 MB pro Hub). Bei Bedarf werden ältere, nicht mehr benötigte Einträge automatisch entfernt.
- Wurde ein Protokoll offline importiert und noch nicht in den Hub hochgeladen, darf der Cache **nicht** geleert werden, da sonst der spätere Upload nicht mehr möglich ist.
  Prüfen Sie vorher „Ausstehende Uploads“ (Import‑Seite): wenn dort ausstehende/pausierte Uploads angezeigt werden, darf der Cache nicht geleert werden.
  Zusätzlich zeigt die Seite „Cache leeren“ an, ob noch ausstehende Uploads existieren; in diesem Fall ist „Cache leeren“ deaktiviert.

### Dictionary‑Training (optional)

Da RPT‑Protokolle oft sehr ähnlich sind, kann ein Zstd‑Dictionary den Speicherbedarf und die I/O‑Last deutlich reduzieren. Das Dictionary kann bei Bedarf neu trainiert werden:

- `pnpm -s dict:train:rpt`  
  Trainiert `src-tauri/res/zstd-dicts/rpt-v1.dict` aus den Beispieldateien unter `./RPT`.

::: info Zusammenfassung (Protokolle)
- Protokolle liegen als zstd‑Bytes in `protocols/...` (Hub) – nicht als DB‑BLOB.
- Integrität wird über `measurement_protocols.blake3` geprüft (BLAKE3 über komprimierte Bytes).
- Offline‑Import: Protokoll zuerst lokal, Upload in den Hub wird später nachgeholt.
- Cache nur leeren, wenn keine „pending“ Protokolle mehr existieren.
:::

## 3) CR‑SQLite/CRDT: Warum es gebraucht wird (technisch)

CR‑SQLite behandelt Tabellen als **CRR** und protokolliert Änderungen in `crsql_changes`. Daraus ergibt sich:

- Die App kann lokal schreiben (Replica), ohne File‑Locks im Hub „dauerhaft“ zu halten.
- Der Sync ist „best effort“ und führt zu **eventual consistency**: nach erfolgreichem Sync konvergieren alle Replicas deterministisch.

Technisch wichtig sind Schema‑Constraints von CR‑SQLite:

- Primary Keys müssen non‑NULL sein.
- `NOT NULL`‑Spalten benötigen Defaults (Forward/Backward‑Compatibility).
- Schema‑Änderungen erfolgen über App‑Migrations.

Wichtig für Updates im Mehrplatzbetrieb:

- **Replica‑DBs** (lokal) werden wie bisher im App‑Code migriert.
- **Hub‑DB** (Netzlaufwerk) wird **Rust‑seitig** migriert: beim Verbinden mit einer Datenquelle führt das Backend
  `crsqlitehubprepare(...)` aus und bringt die Hub‑DB auf die neueste Migration (Tabelle `schema_migrations`).
  Das ist notwendig, weil CR‑SQLite **kein DDL synchronisiert**.

Die CR‑SQLite Extension wird als Datei `resources/extensions/crsqlite.dll` gebündelt und vom SQL‑Plugin geladen.

::: info Zusammenfassung (CR‑SQLite)
- Lokale Replica reduziert Locking‑Probleme auf Netzlaufwerken.
- CR‑SQLite stellt Anforderungen an das Schema → IDs/Defaults sind wichtig.
- Extension liegt als `crsqlite.dll` im App‑`resources`‑Ordner.
:::

## 4) Authentifizierung: Passwort + Pepper + Stronghold (technisch)

FMB Log nutzt zwei Ebenen:

- **Passwort‑Hash in der DB:** Argon2id über `password + pepper` (Pepper ist pro Nutzer zufällig).
- **Pepper in Stronghold:** Das Pepper liegt nicht in SQLite, sondern in `vaults/<user_id>.vault`.

Login‑Ablauf (vereinfacht):

1. Aus eingegebenem Passwort + `user_id` wird ein **Vault‑Key** abgeleitet (Argon2id, 32‑Byte‑Key).
2. Mit diesem Key wird die Stronghold‑Vault entschlüsselt.
3. Wenn Entschlüsselung fehlschlägt → Passwort falsch.
4. Wenn Entschlüsselung gelingt → Pepper wird gelesen → Hash wird geprüft.

::: info Zusammenfassung (Auth)
- Hash‑Swap‑Angriffe via DB werden durch user‑spezifisches Pepper verhindert.
- Pepper liegt in Stronghold‑Vault, nicht in SQLite.
- Vault‑Key ist an `user_id + password` gebunden.
:::

## 5) Signaturen & Delegation: was wird womit signiert?

FMB Log signiert verschiedene Datenklassen, um Manipulationen in einer „Datei‑DB“ zu erkennen.

### 5.1 Root‑Trust und DB‑Signierschlüssel (Admin)

- **Root Public Key** ist **fest in der App** eingebaut (Compile‑Time).
- Der **DB‑Public‑Key** liegt als Datei neben der DB: `<db>.integrity.pub.json`.
- Das **DB‑Key‑Zertifikat** `<db>.integrity.dbkey.json` ist Root‑signiert und muss vorhanden sein (Fail‑Closed).
- Der **DB‑Private‑Key** liegt in Stronghold: `vaults/<db>.integrity.vault` und wird per Signier‑Passwort entsperrt.

Damit werden u. a. signiert:

- `users`, `groups`, `user_groups`, `group_permissions`
- `capability_certs` (Delegations‑Zertifikate)
- Admin‑Security‑Einstellungen

### 5.2 User‑Signaturen (Key‑User, ohne Admin‑Signier‑Passwort)

Jeder Nutzer besitzt zusätzlich einen **User‑Signierschlüssel** (Ed25519) im eigenen Vault:

- `vaults/<user_id>.vault` enthält neben Pepper auch den User‑Signing‑Key.
- Der Key‑User kann Stammdaten signieren, ohne den DB‑Signier‑Key zu kennen.

Damit ein Key‑User wirklich „nur in seinem Scope“ signieren kann, wird die Berechtigung über **Capability‑Zertifikate** delegiert:

- Tabelle: `capability_certs`
- Signiert vom DB‑Signier‑Key (Admin‑Aktion)
- Gültigkeit: `issued_at`, optional `expires_at`, optional `revoked_at`

Ein Key‑User darf z. B. Stammdaten nur signieren, wenn ein gültiges Zertifikat für den Scope existiert (z. B. `masterdata.fgw`, `masterdata.nv`, `masterdata.fmk`).

::: info Zusammenfassung (Signaturen)
- Root‑Trust: Root Public Key ist in der App eingebaut, DB‑Key wird per Zertifikat an Root gebunden.
- Admin‑Key (DB‑Key) signiert Security‑kritische Daten und Delegationen.
- Key‑User signieren Stammdaten per User‑Key + Admin‑Delegation (Capability‑Zertifikat).
:::

### 5.3 Signatur‑Metadaten deduplizieren (`signing_metas`)

In vielen Tabellen wiederholen sich Signatur‑Metadaten sehr häufig (z. B. `signed_by_user_id`, `signed_by_key_id`, `capability_id`, `signed_at`). Das ist für eine Datei‑DB und insbesondere für CR‑SQLite‑Sync unnötige Datenmenge.

FMB Log reduziert diese Redundanz über eine zentrale Tabelle:

- `signing_metas`: enthält eindeutige Tupel aus `(signed_by_user_id, signed_by_key_id, capability_id, signed_at)`
- `signing_meta_id`: referenziert das Tupel in den signierten Tabellen

Dadurch muss pro signiertem Datensatz nur noch die `signing_meta_id` gespeichert werden – die Metadaten selbst stehen einmalig in `signing_metas`. Für Abwärtskompatibilität existieren die ursprünglichen Spalten weiterhin, können aber (je nach Tabelle) leer/`NULL` sein, wenn `signing_meta_id` gesetzt ist.
In aktuellen Datenbanken werden diese ursprünglichen Metadaten‑Spalten nach der Umstellung entfernt, sodass Signatur‑Metadaten ausschließlich über `signing_meta_id` + `signing_metas` abgebildet werden.

Typisch betroffen sind u. a.:
- Stammdaten‑Tabellen (FGW/NV/FMK inkl. Untertabellen)
- `containers` (Gebinde‑Signaturen)
- `measurement_revisions` (Messdaten‑Signaturen)
- `daily_report_invalidations` (Invalidierungen)

## 6) Hash‑Algorithmen: BLAKE3 vs. SHA‑256

In FMB Log werden zwei Hash‑Algorithmen bewusst parallel genutzt:

- **BLAKE3** (schnell, parallelisierbar):  
  Für Integrität/Signaturen und Protokoll‑Integrität im Betrieb (Audit, Packfiles, Audit‑Cache).
- **SHA‑256** (Standard für externe Systeme):  
  Für RFC3161‑TSA (FreeTSA erwartet SHA‑256) – der Imprint (`tsa_snapshot_sha256`) und der Token‑Hash (`tsa_token_sha256`) bleiben SHA‑256.

::: info Zusammenfassung (Hashes)
- BLAKE3: intern, schnell (Audit/Protokolle/Signatur‑Workflows).
- SHA‑256: extern kompatibel (TSA).
:::

## 7) Tagesabrechnung: Snapshot, QR‑Code, TSA (technisch)

Beim PDF‑Export wird ein **Snapshot** der exportierten Inhalte gebildet und gehasht:

- `daily_reports.snapshot_hash`: BLAKE3 des Snapshots (DATA‑Hash)
- `daily_reports.pdf_sha256`: BLAKE3 der finalen PDF‑Bytes (PDF‑Hash; Spaltenname historisch)
- `daily_report_invalidations`: signierte Invalidierungs‑Events (wer/wann/warum; referenziert Report + Snapshot/PDF‑Hash zum Zeitpunkt der Invalidierung)
- Optional (TSA):
  - `tsa_provider`, `tsa_gen_time`, `tsa_snapshot_sha256`, `tsa_token_sha256`, `tsa_token_base64`

Hinweis: Hashes (32 Byte) und Signaturen (Ed25519, 64 Byte) werden in SQLite als **BLOB** gespeichert (I/O‑sparend). Im Frontend werden BLOBs als **Base64‑Strings** transportiert (keine JSON‑Byte‑Arrays), in der UI werden Hashes aber als **Hex/Fingerprint** angezeigt.

Die PDF enthält in der Fußzeile:

- einen QR‑Code mit kompakter Payload (u. a. Snapshot‑Hash, optional TSA‑Token‑Hash)
- daneben kurze Fingerprints (`DATA: …` und optional `TSA: …`) für manuelle Gegenprüfung

::: info Zusammenfassung (Tagesabrechnung)
- Snapshot‑Hash ist BLAKE3 (schnell, in QR/Fingerprint als DATA).
- PDF‑Hash ist BLAKE3 (schnell, als Referenz in der Historie).
- Für TSA wird zusätzlich `tsa_snapshot_sha256` gespeichert (RFC3161‑kompatibler Imprint).
- QR‑Code + Fingerprints ermöglichen schnelle Verifikation in der Historie/Audit.
:::

## 8) Audit & Performance (technisch)

Der Audit prüft Security‑Signaturen, Delegationen, Stammdaten‑Signaturen, Messdaten‑Signaturen und Protokoll‑Integrität. Um die Laufzeit zu reduzieren, nutzt FMB Log ein lokales Cache‑Konzept:

- Tabellen: `audit_cache`, `known_keys`, `known_deps`
- Enthält BLAKE3‑basierte „Deps/Message/Signature“ Hashes pro Scope/Entity.
- `audit_cache` ist **lokal** (nicht CRR) und wird nicht in den Hub synchronisiert.
- Zusätzlich wird `row_db_version` gespeichert, damit sich Audits auf geänderte Zeilen beschränken können.
- Um Platz/I/O zu sparen, werden wiederkehrende Hashes (Verify‑Key und Deps) dedupliziert und in `audit_cache` nur als FK (`*_id`) referenziert.

::: info Zusammenfassung (Audit)
- Audit ist vollständig, aber kann teuer sein → Cache + Inkrementalität reduziert Laufzeit.
- `audit_cache` ist pro Client lokal und wird nicht mit dem Hub synchronisiert.
:::

## 9) Phasenzeiten & Performance-Log

Bei langen Operationen zeigt FMB Log **Phasenzeiten** im UI an und schreibt dieselben Informationen zusätzlich als strukturierte Einträge (`[perf]`) in die Diagnose‑Logdatei.

Betroffene Aktionen:

- **Administration → Audit** (prüft Security/Stammdaten/Messdaten/Protokolle)
- **Administration → Einstellungen → Stammdaten neu signieren**
- **Administration → Einstellungen → Fehlende Signaturen nachholen**
- **Tagesabrechnung → PDF exportieren**

Die Logzeilen enthalten JSON mit `action`, `ok`, `total_ms` und `phases` (je Phase: `name`, `ms`). So können Sie bei Performance‑Problemen nachvollziehen, ob z. B. **I/O (Hub/Protokolle)**, **Hashing** oder **DB‑Zugriffe** dominieren.

## 10) Auto‑Update (Tauri Updater)

FMB Log nutzt den **Tauri Updater** für In‑App‑Updates. Im Unterschied zum „Installer herunterladen und manuell ausführen“ kann die App Updates direkt finden, herunterladen und installieren.

### 10.1 Schlüssel (Update‑Signatur)

Der Updater verlangt ein Signatur‑Keypair. **Der Private Key bleibt geheim** (nur Build‑Server/Release‑Pipeline), der **Public Key ist in der App eingebettet** (`src-tauri/tauri.conf.json`).

Key‑Generierung (Windows):

`pnpm tauri signer generate --password "<PASSWORT>" --write-keys .secrets\\tauri-updater.key --force --ci`

Dabei entstehen:

- `.secrets/tauri-updater.key` (Private Key, niemals committen)
- `.secrets/tauri-updater.key.pub` (Public Key, wird in `tauri.conf.json` hinterlegt)
- `.secrets/tauri-updater.key.password` (Passwort, niemals committen; wird für CI benötigt)

Build‑Zeit‑Variablen:

- `TAURI_SIGNING_PRIVATE_KEY` (**Base64‑String** des Private‑Key‑Inhalts; z. B. Inhalt aus `.secrets/tauri-updater.key`)
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` (Passwort für den Private Key)

### 10.2 Release‑Artefakte & Hosting (GitHub)

Der Update‑Server ist in FMB Log auf GitHub Releases konfiguriert:

- Endpoint: `https://github.com/Ph0non/fmb-log-docs/releases/latest/download/latest.json`

Beim Release‑Build erzeugt Tauri die **Installer‑Artefakte** und (bei gesetztem Signier‑Key) die **Signaturdatei** `*.exe.sig` (Windows/NSIS). Die Datei `latest.json` wird **nicht automatisch** von Tauri generiert. Stattdessen erstellt GitLab CI das `latest.json` im Release‑Step (Script `scripts/github_publish_updater.mjs`) und lädt anschließend **alle Updater‑Assets** in das Repo `Ph0non/fmb-log-docs` hoch (Release‑Tag = Git‑Tag):

- NSIS‑Installer `*.exe`
- Signatur `*.exe.sig`
- `latest.json` (statisches Updater‑Manifest für `@tauri-apps/plugin-updater`)

Wichtig: Damit `latest.json` korrekt ist, müssen die Artefakte im selben GitHub Release (Assets) liegen.

### 10.3 Client‑Verhalten (UI)

- Beim Start (Release‑Build) prüft FMB Log optional automatisch auf Updates.
- Wenn ein Update verfügbar ist, erscheint ein Dialog mit:
  - **Jetzt installieren**
  - **Beim nächsten Start erinnern**
  - **Nicht mehr erinnern** (ignoriert die gefundene Version lokal)
- Einstellungen: Benutzer‑Menü → **Updates**
  - Auto‑Check beim Start aktivieren/deaktivieren
  - manuell prüfen
  - ignorierte Version zurücksetzen

Update‑Einstellungen werden **nur lokal** gespeichert (Replica‑DB) und nicht über den Hub synchronisiert.

::: info Zusammenfassung (Updater)
- Signierung: Private Key nur im Build/CI, Public Key in der App.
- Hosting: GitHub Releases (`latest.json` + Assets).
- Nutzer: Start‑Check + Dialog + manuelle Prüfung in **Updates**.
:::

## 11) GitLab CI – optimiertes Build‑Image

Auf Build‑Runnern mit begrenztem Speicherplatz (z. B. ~15 GB) ist es sinnvoll, ein eigenes Docker‑Image zu verwenden, das die nötigen System‑Pakete bereits enthält. Dadurch muss GitLab CI nicht in jedem Job große `apt-get install` Schritte ausführen.

### 11.1 Repository‑Dateien

- Dockerfile: `ci/Dockerfile`
- Anleitung: `ci/README.md`

### 11.2 Verwendung in GitLab CI

Die Pipeline kann über eine Variable auf ein eigenes Image umgestellt werden:

- `FMB_CI_NODE_IMAGE = $CI_REGISTRY_IMAGE/ci-node:node22-bookworm` (lint/tests/docs)
- `FMB_CI_IMAGE = $CI_REGISTRY_IMAGE/ci:bookworm-22-nightly` (Rust/Tauri/Release)

Wenn die Images existieren, kann `.gitlab-ci.yml` deutlich schlanker bleiben, weil:

- Build‑Tools (cmake/ninja/clang/llvm/nsis …) bereits im Image vorhanden sind.
- pnpm bereits verfügbar ist (oder schnell via corepack aktiviert werden kann).

::: tip Hinweis
Für spätere Playwright‑Tests (B1) ist meist ein separates Image sinnvoll (Browser + deps). Das kann als eigener Job‑Image‑Override umgesetzt werden, ohne das Build‑Image unnötig aufzublähen.
:::
