# ADR‑001: CR‑SQLite (Local‑First + CRDT)

- **Status:** angenommen
- **Datum:** 2026‑01‑11

## Kontext

FMB Log muss auf Netzlaufwerken funktionieren und mehrere Nutzer sollen parallel arbeiten können. Reines SQLite direkt auf SMB‑Shares ist dabei oft fehleranfällig (Dateisperren, Latenz, konkurrierende Writes). Ein klassischer DB‑Server (z. B. Postgres) ist in diesem Projekt bewusst nicht vorgesehen.

## Entscheidung

FMB Log nutzt **CR‑SQLite** (CRDT‑basierte Replikation als SQLite‑Extension), um ein **Local‑First** Modell umzusetzen:

- jeder Client schreibt in eine **lokale Replica‑DB** (AppLocalData),
- ein optionaler **Hub** (Netzlaufwerk) dient als Austauschpunkt,
- Clients synchronisieren Änderungen **inkrementell** (Pull/Push) über `crsql_changes`.

Die Extension wird als Datei im Programm‑`resources/` gebündelt (Windows: `crsqlite.dll`) und vom SQL‑Layer geladen.

## Alternativen (abgewogen)

1. **SQLite direkt auf Netzlaufwerk (Single‑File)**
   - + sehr simpel
   - − hohe Wahrscheinlichkeit für Locking-/SMB‑Probleme und Datenkorruption bei Fehlkonfiguration
2. **DB‑Server (Postgres/MySQL)**
   - + robuste Concurrency
   - − Betrieb/Deployment/Firewall/Backups deutlich komplexer, widerspricht „kein Server“
3. **Dokumenten‑DB ohne Server (z. B. LiteDB)**
   - + keine SQL‑Migrations
   - − Parallelzugriff/Locking auf Netzlaufwerken ebenfalls schwierig; weniger Integration in bestehende SQLite‑Logik

## Konsequenzen

- **Schema‑Constraints (CRR‑Tauglichkeit):**
  - Primary Keys müssen **NOT NULL** sein.
  - `NOT NULL`‑Spalten benötigen **DEFAULT**‑Werte (Forward/Backward‑Compatibility).
- **IDs:** keine Auto‑Increments als alleinige Schlüssel; stattdessen App‑seitig eindeutige IDs (z. B. `nanoid`).
- **Migrations:** Schemaänderungen erfolgen weiterhin über App‑Migrations; CR‑SQLite setzt dafür zusätzliche Regeln voraus.
- **Fehlerklasse:** Sync ist „eventual consistent“. Konflikte werden CRDT‑konform gelöst; dadurch sind bestimmte Datenmodelle (z. B. Zähler) leichter als harte Unique‑Constraints.
- **Plattformabhängigkeit:** Die CR‑SQLite Extension ist ein natives Binary pro Plattform.

## Hinweise für Betrieb/IT

- Der Hub‑Ordner (Netzlaufwerk) muss für alle Clients **lesbar/schreibbar** sein.
- Die lokale Replica‑DB muss pro Benutzer im AppLocalData Verzeichnis gespeichert werden (offline‑fähig).
- Bei Diagnoseproblemen: zuerst prüfen, ob die Extension geladen wurde (`crsql_changes` verfügbar).

