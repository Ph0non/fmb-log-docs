# Technische Dokumentation

## Laufzeit und gemeinsame Module

FMB-Log Server verwendet Node.js 24, TypeScript/Fastify und den PostgreSQL-Treiber `pg`. Die Desktop-Anwendung verwendet Tauri, Vue und lokale SQLite-Repliken. `packages/protocol` definiert kanonische DAG-CBOR-Daten, IPLD-Verweise, CIDs und Signaturprüfung. Berechnung und PDF-Erzeugung werden gemeinsam genutzt; der Rust-TSA-Prüfer wird als Bestandteil des Dienstpakets ausgeliefert.

## Daten am Arbeitsplatz

Im lokalen Anwendungsdatenverzeichnis liegen:

| Verzeichnis | Inhalt |
| --- | --- |
| `server-replicas/` | SQLite-Repliken je Datenbank/Nutzer mit Originalen, Ansichten, Outbox und lokalem Objektbestand |
| `server-security/` | `connection.json`, `credentials.sqlite` und `checkpoints.sqlite` |
| `server-vaults/` | Lokale Stronghold-Vaults |

Das Verzeichnis hängt von Betriebssystem, Nutzer und Anwendungskennung ab. Eine getrennte Abnahmeinstallation verwendet eine eigene Kennung und damit einen eigenen Datenbestand. Replikdateien dürfen nicht als beliebig löschbarer Cache behandelt werden: Sie können noch unbestätigte Arbeit enthalten. Die dafür vorgesehene Protokoll-Bereinigung schützt diese Originale.

## Daten auf dem Server

PostgreSQL speichert kanonische Originaloperationen und Objekte sowie relationale Ansichten. Das Runtime-Paket liegt unter `/usr/lib/fmblog`, die Dienst-/Archivkonfiguration unter `/etc/fmblog`; geprüfte Reset-Archive werden standardmäßig unter `/var/lib/fmblog/archives` abgelegt. Laufzeit, Migration und Archivierung besitzen getrennte Konten und Datenbankrechte.

Schemaänderungen des Dienstes stehen in `server/migrations/` und werden ausdrücklich über die CLI angewendet. Die bisherigen CR-SQLite-Migrationsdateien sind keine Quelle für das neue zentrale Schema. Die neuen Clienttabellen werden durch die Module unter `src/lib/serverSync/` verwaltet.

## Transport und Formatversionen

`server-security/connection.json` verwendet `fmblog-server-connection/v2` und bindet SSH-Adresse, Hostschlüssel-Fingerabdruck, Datenbank-/Dienstidentität und öffentlichen Root-Schlüssel. Die API meldet ihre unterstützten Versionen vor Schreiboperationen. Alte HTTPS-Konfigurationen verlangen eine bewusste Neueinrichtung, ohne lokale Daten zu löschen.

Die API wird innerhalb des gepinnten SSH-Subsystems angesprochen. Der Dienst bietet darüber weder Shell/SFTP noch Portweiterleitung an. Der administrative sshd ist davon unabhängig. Eine Freigabe für HTTP auf Port 80 ist kein Beweis für eine SSH-Freigabe.

Neue Fachoperationen verwenden `fmblog-operation/v2` mit Schema 2, CIDv1/BLAKE3 und kanonischem DAG-CBOR. Originalprotokolle und PDFs erhalten `raw`-CIDs über ihre Originalbytes. Historische TSA-/SHA-256-Nachweise werden nicht umgeschrieben. Details stehen in [ADR-007](../architecture/adr-007-server-ipld.md), [Datenmodell](../reference/data-model.md) und [Sicherheitsarchitektur](./security.md).

## Installation und Diagnose

Die vollständige Debian-Anleitung steht im Repository unter `server/debian/INSTALL.md`. Sie beschreibt Paketbau, PostgreSQL-17-Rollen und Peer-Zuordnung, Bootstrap, Hostschlüssel, systemd, Upgrade und Wiederanlauf. `server/README.md` dokumentiert Implementierung und konkrete Abnahmebelege einschließlich ihrer Grenzen.

Der native Client und der Dienst werden getrennt ausgeliefert. Die folgende Release-Infrastruktur beschreibt den bisherigen Desktop-Updatepfad; der dort genannte Update-Dialog ist im neuen Serverbereich nicht eingebunden. Ein neues Release oder eine Veröffentlichung wird durch diese Dokumentation nicht ausgelöst.

## 10) Auto‑Update (Tauri Updater)

FMB Log nutzt den **Tauri Updater** für In‑App‑Updates. Im Unterschied zum „Installer herunterladen und manuell ausführen“ kann die App Updates direkt finden, herunterladen und installieren.

### 10.1 Getrennte Schlüssel und Installationen

Client v2 wird als **FMB Log v2** mit eigener App-ID und eigenem Datenverzeichnis
parallel zu v1 installiert. Der neue Update-Signierschlüssel und der separate
Verschlüsselungsschlüssel gehören ausschließlich zu v2. Alte v1-Schlüssel und
GitLab-Variablen bleiben erhalten; es gibt keinen Schlüssel-Fallback.

Die neuen geschützten GitLab-Variablen heißen `FMB_CLIENT_V2_SIGNING_PRIVATE_KEY`,
`FMB_CLIENT_V2_SIGNING_PRIVATE_KEY_PASSWORD` und `FMB_CLIENT_V2_UPDATER_KEK_B64`.
Private Schlüssel gehören weder ins Repository noch in Logs oder Release-Artefakte.
Der öffentliche Schlüssel ist in der App eingebettet. Die Verschlüsselung der
Update-Dateien ersetzt nicht deren Signaturprüfung.

### 10.2 Release-Artefakte und Hosting

GitLab baut und prüft die Anwendungen; GitHub Releases in `Ph0non/fmb-log-docs`
verteilt sie. Client-Tags heißen `client-v2.0.0`, Server-Tags `server-v0.1.0`.
Die automatischen Hooks verstehen außerdem `cv2.0.0` beziehungsweise `sv0.1.0`.

- v1 bleibt auf `https://github.com/Ph0non/fmb-log-docs/releases/latest/download/latest.json`.
- v2 verwendet `https://github.com/Ph0non/fmb-log-docs/releases/download/client-v2-updates/latest.json`.
- Neue Client- und Server-Releases dürfen niemals das globale GitHub-Latest ersetzen.
- Client-Releases enthalten Installer, Signatur, verschlüsseltes Update und Manifest.
- Server-Releases enthalten Debian-Paket, Prüfsummen und Installationsanleitung.
  Der Server wird administrativ aktualisiert und verändert keinen Client-Update-Kanal.

Vollständige Einrichtung und Fehlerbehandlung stehen in `ci/RELEASES.md` im Repository.

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

Update‑Einstellungen werden **nur lokal** gespeichert. Client v2 speichert sie unabhängig von der fachlichen Datenbank im eigenen App-Verzeichnis.

::: info Zusammenfassung (Updater)
- Signierung: Private Key nur im Build/CI, Public Key in der App.
- Hosting: GitHub Releases (`latest.json` + Assets), optional zusätzlich verschlüsselt (`*.cha`).
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


## 12) Git LFS beim Release-Push

PNG-Dateien und die über `.gitattributes` erfassten DLLs liegen in Git LFS. GitLab
akzeptiert einen Release-Tag nur, wenn auch dessen LFS-Objekte hochgeladen sind.
Git LFS muss daher auf dem Rechner installiert sein, der den Push ausführt.

**Entscheidung:** Der aktive Husky-Hook `.husky/pre-push` ruft zuerst
`git lfs pre-push "$@"` auf. Ein LFS-Hook unter `.git/hooks` reicht nicht aus,
weil `core.hooksPath` auf `.husky/_` zeigt. Bei einem fehlgeschlagenen Upload
bricht der Push ab.

Der automatische Release-Tag-Push in `scripts/release_push_tag_pre_push.mjs`
verwendet weiterhin `--no-verify`, um eine rekursive Hook-Ausführung zu vermeiden.
Deshalb lädt er zuvor mit `git lfs push --all <Remote> <Tag>` ausdrücklich alle
vom Tag erreichbaren LFS-Objekte hoch. Die Einschränkung auf diesen Tag vermeidet
den Upload von Objekten aus anderen lokalen Zweigen.

Wurde ein Tag bereits mit „LFS objects are missing“ abgelehnt, lassen sich die
Objekte vor dem erneuten Push manuell nachladen, beispielsweise für `v1.10.0`:

```bash
git lfs push --all origin v1.10.0
git push origin refs/tags/v1.10.0
```

Ein Verschieben des Tags oder Umschreiben der Git-Historie ist dafür nicht nötig.
