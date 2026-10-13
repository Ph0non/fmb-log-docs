# Admin Guide

Dieser Teil richtet sich an Administratoren und Key‑User. Er erklärt die Aufgaben, die für einen stabilen Betrieb notwendig sind: Ersteinrichtung, Nutzer‑ und Rechteverwaltung, Pflege von Freigabewerten sowie Dienstbetrieb und Reset.

## Inhalt

- [Ersteinrichtung](./setup.md)
- [Sicherheitsarchitektur](./security.md)
- [Benutzer](./users.md)
- [Gruppen & Rechte](./groups-permissions.md)
- [Freigabewerte (FGW)](./fgw.md)
- [Betrieb & Datenbank](./database.md)
- [Root-Freigabe für Reset](./server-reset-signing.md)
- [Technische Dokumentation](./technical.md)
- [Troubleshooting](./troubleshooting.md)

## Aufgabenverteilung

Der Betreiber installiert Dienst und PostgreSQL und stellt die Verbindung bereit. Administratoren pflegen danach Nutzer, Gruppen und Rechte in FMB Log. Fachliche Bearbeitung kann offline erfolgen; Sicherheitsänderungen und verbindliche Abrechnungen benötigen den Dienst.

::: info Zusammenfassung
- Admins legen die Grundstruktur fest: Gruppen, Rechte, Nutzer, Stammdaten.
- Danach können Endanwender im Tagesgeschäft (Import/Gebinde/Gebindeabrechnung) arbeiten.
- Änderungen an FGW und NV sind fachlich kritisch und sollten nur nach Freigabeprozess erfolgen.
:::
