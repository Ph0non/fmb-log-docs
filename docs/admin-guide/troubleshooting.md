# Troubleshooting

## App schließt sich ohne Meldung / „Crash“

Im Production‑Build läuft Rust mit `panic = "abort"`. Das bedeutet: Ein Panic beendet die Anwendung sofort, ohne dass ein Fehlerdialog angezeigt wird.

FMB Log schreibt deshalb eine Logdatei mit Crash‑Hinweisen und Backtrace:

- Öffnen über **Administration → Einstellungen → Diagnose → Log öffnen**
- Pfad (Windows): `%LOCALAPPDATA%\\com.ewn.fmblog\\logs\\fmb-log.log`

Wenn die Anwendung beim Start erkennt, dass der letzte Start unerwartet endete, erscheint zusätzlich ein Hinweis auf der Anmeldeseite.

## „Diese Seite funktioniert nur in der Tauri-Desktop-App“

Einige Funktionen (Dateidialoge, Zugriff auf Ressourcenpfade, PDF‑Export, Datenbankzugriff) benötigen Tauri‑APIs. Wenn Sie die Web‑UI im Browser starten (z. B. mit `pnpm dev`), sind diese APIs nicht verfügbar und die Anwendung zeigt entsprechend einen Hinweis.

Für Desktop-Tests:

- `pnpm tauri dev`

## Export/Dateidialoge funktionieren nicht

Dateidialoge und das Öffnen/exportieren von Dateien funktionieren nur in der Desktop‑App und sind zusätzlich durch das Tauri‑Permissions‑System abgesichert. Wenn Sie eine Meldung wie „not allowed“ oder „Permission … not found“ sehen, prüfen Sie:

- ob Sie die Funktion in der Desktop‑App ausführen (nicht im Browser),
- ob das passende Plugin (z. B. `opener`) aktiviert ist,
- ob die Berechtigung in `src-tauri/capabilities/default.json` erlaubt ist (z. B. `opener:allow-open-path`).

## Netzwerk-DB: sporadische Locks/Fehler

Wenn die Datenbank auf einem Netzlaufwerk liegt, können sporadische Sperren oder Zugriffsfehler auftreten. Ursache ist meist das Zusammenspiel aus SMB‑Locking, OpLocks und gleichzeitigen Schreibzugriffen. Typische Maßnahmen:

Prüfen:

- Schreibrechte im Zielordner und Stabilität der Verbindung
- Share/SMB‑Konfiguration (Locking/OpLocks)
- ob mehrere Nutzer gleichzeitig schreiben (z. B. paralleler Import)

Wenn Fehler reproduzierbar unter Last auftreten, ist ein lokaler DB‑Pfad pro Nutzer die robustere Variante.

## Protokoll kann nicht geladen werden

Wenn beim Öffnen eines Messprotokolls eine Fehlermeldung erscheint, sind die häufigsten Ursachen:

1. **Hub nicht erreichbar** (Netzlaufwerk offline / Pfad falsch)  
   Protokolle werden im Hub‑Ordner als Packfiles unter `protocols/…` gespeichert. Ist der Hub nicht erreichbar, kann die App Protokolle nur laden, wenn sie bereits im lokalen Cache liegen.

2. **Offline‑Import auf anderem Rechner**  
   Wurde eine Messung importiert, während der Hub nicht erreichbar war, ist das Protokoll zunächst nur auf dem importierenden Rechner im lokalen Cache verfügbar. Der Upload in `protocols/…` wird automatisch nach dem nächsten erfolgreichen Sync nachgeholt. Bis dahin können andere Clients die Messung sehen, das Protokoll aber nicht öffnen.

3. **Lokaler Cache wurde geleert**  
   Wenn ein Protokoll noch nicht in das Hub‑Archiv hochgeladen war und der lokale Cache gelöscht wurde, kann es ggf. nicht mehr automatisch hochgeladen werden. In diesem Fall muss das Protokoll erneut importiert werden (oder aus einem Backup wiederhergestellt werden).

## Import hängt / Import beendet nicht

Wenn ein Import scheinbar „endlos“ läuft, zeigt die Import‑Seite unter dem Button **Importieren** den aktuellen Schritt (z. B. „Schritt: Protokoll speichern…“). Das hilft, den Engpass einzugrenzen.

FMB Log verwendet außerdem Timeouts, damit ein Import nicht unbegrenzt hängen bleibt. Falls eine Zeitüberschreitung auftritt, enthält die Fehlermeldung den betroffenen Schritt.

Typische Ursachen je Schritt:

- **„Protokoll speichern…“**: Zugriff auf den Hub‑Ordner (Schreibrechte/SMB/Antivirus) oder Initialisierung der zstd‑Kompression.
- **„Gebinde signieren…“ / „Signatur (neu/alt)…“**: Stronghold‑Vault nicht erreichbar (liegt im Hub‑Ordner) oder falsches Signier‑/Vault‑Passwort.
- **„Messung speichern…“**: lokale Replica‑DB ist blockiert (z. B. durch parallele Aktionen) oder Hub/Sync verursacht Locking unter Last.

Für die Diagnose ist die Logdatei hilfreich:

- Öffnen über **Administration → Einstellungen → Diagnose → Log öffnen**
- Pfad (Windows): `%LOCALAPPDATA%\\com.ewn.fmblog\\logs\\fmb-log.log`

## „Signatur fehlt“ / „Signatur ungültig“ (nach Update oder Datenübernahme)

Wenn in **Administration → Audit** oder in Stammdaten‑Ansichten Meldungen wie „Signatur fehlt“ oder „Signatur ungültig“ erscheinen, sind typische Ursachen:

1. **Falsche Datenquelle** (z. B. noch lokale Stub‑DB statt Hub‑DB).
2. **Integritätsschutz nicht vollständig aktiv** (Zertifikat `<db>.integrity.dbkey.json` fehlt/inkonsistent).
3. **Nach Update wurden neue Signatur‑Felder eingeführt**, aber bestehende Datensätze wurden noch nicht nachgezogen.

Vorgehen (empfohlen):

1. Als Admin anmelden.
2. **Administration → Einstellungen → Integritätsschutz** prüfen:
   - Status muss **„aktiviert (zertifiziert)“** sein.
3. Falls Signaturen wirklich fehlen: **Administration → Einstellungen → Fehlende Signaturen nachholen** ausführen.
   - Signiert nur Datensätze, bei denen `user_signature`/`signing_meta_id` fehlen.
   - Schreibt einen Audit‑Trail‑Eintrag und erstellt einen Audit‑Trail‑Pin (mit TSA, falls verfügbar; sonst ohne TSA).

::: info Kurzcheck
- Browser‑Modus (`pnpm dev`) eignet sich für UI‑Layout, nicht für Tauri‑Funktionen.
- Desktop‑Tests immer mit `pnpm tauri dev`.
- „not allowed“ deutet meist auf fehlende Tauri‑Permissions hin.
:::
