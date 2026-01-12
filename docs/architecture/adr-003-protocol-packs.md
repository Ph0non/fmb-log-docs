# ADR‑003: Messprotokolle als Packfiles

- **Status:** angenommen
- **Datum:** 2026‑01‑11

## Kontext

Messprotokolle (RPT) sind reine Textdateien, können aber in Summe groß werden und sind oft sehr ähnlich. Wenn Protokolle direkt als BLOB in der CR‑SQLite‑DB gespeichert würden, steigt die Sync‑Last erheblich (große `crsql_changes`‑Mengen, mehr I/O auf dem Hub).

Zusätzlich soll **Offline‑Import** möglich sein: Protokolle können lokal importiert werden, auch wenn der Hub kurzfristig nicht erreichbar ist.

## Entscheidung

FMB Log speichert Messprotokolle **außerhalb der Datenbank** in einem Hub‑Ordner `protocols/` als **append‑only Packfiles**:

- Protokoll‑Bytes werden **zstd‑komprimiert** (optional mit Dictionary, z. B. `rpt-v1.dict`).
- Die komprimierten Bytes werden in ein Packfile geschrieben (Append).
- In SQLite wird nur eine Referenz gespeichert (`measurement_protocols`):
  - `pack_file`, `pack_offset`, `pack_length` (Position im Packfile)
  - `blake3` (32‑Byte‑BLOB; Integrität über komprimierte Bytes)
  - `dict_id` (optional)
- Zusätzlich wird ein lokaler **LRU‑Cache** genutzt, um Protokolle offline verfügbar zu halten und wiederholtes Lesen zu beschleunigen.

## Offline‑Import (Hub nicht erreichbar)

Wenn der Hub nicht erreichbar ist:

- das Protokoll wird **lokal** in den Cache geschrieben,
- in der DB wird eine „ausstehende“ Referenz abgelegt (`pack_file=''`/`pack_length=0`),
- eine Outbox (`protocol_upload_outbox`) merkt sich Upload‑Aufgaben,
- sobald der Hub wieder erreichbar ist, werden ausstehende Uploads automatisch nachgeholt.

## Alternativen (abgewogen)

1. **BLOB in SQLite (CR‑SQLite sync)**
   - + sehr einfache Referenzierung
   - − hohe Sync‑Last, langsamer auf Netzlaufwerk, größere Konfliktflächen
2. **Eine Datei pro Protokoll**
   - + einfaches Lesen
   - − sehr viele kleine Dateien (Overhead, Scans/Indexing, SMB‑Performance)
3. **Großes Archiv, bei jedem Insert repacken**
   - + ggf. bessere Kompression
   - − hoher Rewrite‑Aufwand; schlecht für parallele Clients

## Konsequenzen

- **Integrität:** Protokoll‑Integrität wird über BLAKE3 gesichert; Abweichungen werden beim Lesen erkannt.
- **Backup:** Hub‑Backups müssen `protocols/` enthalten (nicht nur die DB).
- **Dictionary‑Training:** Zstd‑Dictionaries können (optional) nachtrainiert werden, um Speicher/I/O weiter zu reduzieren.

