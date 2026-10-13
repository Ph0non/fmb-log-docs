# Datenmodell (Serverbetrieb)

Der zentrale Bestand liegt in PostgreSQL; jeder Arbeitsplatz besitzt lokale SQLite-Repliken. Fachliche IDs bleiben über Änderungen hinweg stabil. Unveränderliche Operationen und ihre CIDs bestimmen die Versionen. Die Tabellen sind Ansichten beziehungsweise Speicherorte dieses IPLD-Modells, nicht ein Ersatz für die signierten Originalbytes.

## Fachliche Beziehungen

FMK referenzieren versionierte Nuklidvektoren und Freigabewerte. Jahresfaktoren beziehen sich auf die passende FMK-Version. Gebinde binden ihre FMK; Messungen binden Gebinde, benötigte Stammdaten und ihr Originalprotokoll. Eine atomare Operation kann mehrere zusammengehörige Änderungen enthalten.

## Zentrale Tabellen

| Bereich | Wesentliche Tabellen |
| --- | --- |
| Dienstzustand | `service_state`, `server_migrations` |
| Fachliche Originale | `operations` mit kanonischen Bytes, Autor, Operations-ID und Übernahmeentscheidung |
| Versionsansichten | `versions`, `entity_heads`, `current_entities` |
| Originalobjekte | `objects`, `object_uploads`, `operation_objects` |
| Veröffentlichungen | `publication_log` mit festem Log-Präfix |
| Anmeldung und Rechte | `users`, `user_keys`, `sessions`, `security_groups`, `memberships`, `permissions` |
| Sicherheitsnachweise | `security_history`, `authentication_events` |
| Abrechnungen | `reports`, `report_objects`, `report_watches` |
| Reset | `reset_jobs`, `stub_manifests`, `stub_entities` |

Die verbindliche SQL-Definition steht in `server/migrations/`. Die lokalen Tabellen in `src/lib/serverSync/` bilden den Clientbestand samt Outbox, Versionszweigen und Suchnachweisen ab. Sicherheits- und Checkpointdateien liegen zusätzlich getrennt von den Repliken.

## IPLD und Signaturen

Operationen verwenden `fmblog-operation/v2` mit Schema 2. DAG-CBOR kodiert Verweise als IPLD-Links. Die Ed25519-Signatur bindet die kanonische Nutzlast; die CID wird anschließend aus der vollständigen signierten Hülle berechnet. Neue CIDs verwenden BLAKE3 mit 32 Byte Digest. Originaldateien und PDFs verwenden den `raw`-Codec.

## Abrechnungen und Reset-Stub

Eine Abrechnung bindet einen geprüften Snapshot konkreter Versionen, die Nutzerautorisierung, den TSA-Nachweis und die PDF-CID. Der zentrale Abschluss prüft Ausgangsstand und Rechte erneut. Nachträgliche fachliche Änderungen können die gespeicherte Abrechnung invalidieren; deren Originale werden nicht überschrieben.

Ein genehmigter Reset installiert einen versionierten Stub als Root-autorisierten Ausgangsbestand. Stub-Einträge besitzen eine Manifest-CID, aber keine Nutzersignatur. Eine spätere Bearbeitung referenziert den Stub als Ausgangsversion und erzeugt eine neue nutzersignierte Operation.

Historische Testdaten und Nachweise werden bei der einmaligen Übernahme gesondert erhalten. Die früheren SQLite-Tabellen und Diagramme des Datei-Hubs beschreiben nicht das zentrale PostgreSQL-Schema. Siehe [Architekturentscheidung](../architecture/adr-007-server-ipld.md).
