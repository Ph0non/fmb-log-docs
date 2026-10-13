---
layout: home
title: FMB Log – Benutzeranleitung
hero:
  name: FMB Log
  text: Benutzer- & Admin-Handbuch
  tagline: Erfassung, Auswertung und Gebindeabrechnung mit lokalem Offline-Bestand und FMB-Log Server.
  actions:
    - theme: brand
      text: User Guide
      link: /user-guide/
    - theme: alt
      text: Admin Guide
      link: /admin-guide/
    - theme: alt
      text: Referenz
      link: /reference/
features:
  - title: Offline-first
    details: Lokale SQLite-Repliken und signierte Offline-Arbeit; zentraler Abgleich mit PostgreSQL über den Dienst.
  - title: Nachvollziehbarkeit
    details: Unveränderliche signierte Versionen, DAG-CBOR/IPLD und CIDs für Originaldaten und PDFs.
  - title: Rollen & Rechte
    details: Online-Verwaltung von Nutzern, Gruppen und Schlüsseln; Passwortanmeldung und lokal entsperrte Vaults.
---

## Zielgruppe

- **User Guide**: Endanwender (Messungen importieren, Gebinde prüfen, Gebindeabrechnung exportieren).
- **Admin Guide**: Admins/Key-User (Ersteinrichtung, Nutzer & Rechte, FGW-Pflege, Dienstbetrieb und Reset).

## Versionshinweis

Die Betriebs- und Einrichtungsanleitung beschreibt den neuen Serverbetrieb. Die fachliche Oberfläche baut auf Version 1.10.5 auf; ältere Abbildungen können daher bei Bezeichnungen und Statusanzeigen abweichen. Frühere Datei-Hub-Entscheidungen bleiben als historische ADRs erhalten.

Die Implementierung wird noch abgenommen. Konkrete Prüfstände und offene Zielnetz-/Zielservernachweise stehen in `server/README.md`; diese Anleitung ist keine Erklärung einer abgeschlossenen Produktionsfreigabe.

