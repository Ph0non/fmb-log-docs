# Architekturentscheidungen (ADR)

Dieses Kapitel sammelt **Architecture Decision Records (ADR)** für FMB Log. Ein ADR dokumentiert kurz und nachvollziehbar:

- **welches Problem** gelöst werden sollte (Kontext),
- **welche Option** gewählt wurde (Entscheidung),
- **warum** (Abwägung),
- **welche Konsequenzen** daraus folgen (Trade-offs/To-dos).

Die ADRs sind primär für Admins/Key‑User und technische Betreiber gedacht, um spätere Änderungen (z. B. Updates, IT‑Integration, Audits) leichter bewerten zu können.

## Aktuelle Architektur

- [ADR-007: PostgreSQL-Dienst mit IPLD und lokalem Offline-Bestand](./adr-007-server-ipld.md)

## Weitere und historische ADRs

ADR-001 bis ADR-003 dokumentieren den früheren Datei-Hub-Betrieb. Ihre Speicher- und Vertrauensarchitektur gilt nicht für die neuen Serverrepliken.

- [ADR‑001: CR‑SQLite (Local‑First + CRDT)](/architecture/adr-001-crsqlite)
- [ADR‑002: Integrität & Signaturen (Ed25519 + Delegation)](/architecture/adr-002-integrity-signing)
- [ADR‑003: Messprotokolle als Packfiles](/architecture/adr-003-protocol-packs)
- [ADR‑004: Historische TSA‑Vertrauensprofile und Erneuerungsnachweise](/architecture/adr-004-historical-tsa-validation)

- [ADR-005: Gebindeabrechnung mit Details und Maximalwerten](/architecture/adr-005-gebindeabrechnung)

- [ADR-006: Jahresbezogene FMK-Bestätigungen](./adr-006-jahresbezogene-fmk-bestaetigungen.md)
