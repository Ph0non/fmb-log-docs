# Datenmodell (vereinfacht)

Die Anwendung nutzt SQLite. Das Modell ist auf Nachvollziehbarkeit ausgelegt (Revisionen statt Überschreiben).

![Datenmodell (vereinfacht)](../diagrams/data-model.svg)

## Entitäten & Beziehungen (fachlich)

Zusätzlich gibt es eine vereinfachte fachliche Sicht auf die Hauptentitäten und deren Beziehungen:

![Datenmodell (ER – Entitäten & Beziehungen)](../diagrams/data-model-er.svg)

## SQL-Schema (ER)

Zusätzlich ist das SQL-Schema als Entity-Relationship-Diagramm (D2 `sql_table`) verfügbar:

![SQL-Schema (ER)](../diagrams/sql-schema.svg)

Hinweis: Die tatsächlichen Tabellen-/Spaltennamen können abweichen; diese Seite dient als Orientierung.

## Gebindeabrechnung

`daily_reports` speichert weiterhin die Exporte. Neue Snapshots (Version 4) ergänzen die eindeutigen Messrevisionen um Chargen-/Stoffklassenblätter und Maximalwertzeilen; `daily_report_measurements` enthält jede verwendete Revision nur einmal. Die vorhandenen `material_masses_json` und `batches_json` liefern Reststoffanteile und eindeutige Chargenzuordnungen. Version-3-Snapshots bleiben unverändert lesbar. Siehe [ADR-005](../architecture/adr-005-gebindeabrechnung.md).
