# ADR‑002: Integrität & Signaturen (Ed25519 + Delegation)

- **Status:** angenommen
- **Datum:** 2026‑01‑11

## Kontext

Wenn die Hub‑DB auf einem Netzlaufwerk liegt, können Nutzer (oder Malware im Benutzerkontext) Dateien direkt verändern. Ohne zusätzliche Maßnahmen wären Manipulationen an Stammdaten oder Messdaten ggf. nicht erkennbar (z. B. Rechte eskalieren, Freigabewerte ändern, Messungen nachträglich verändern).

Gleichzeitig sollen bestimmte nicht‑Admin Rollen (Key‑User) **fachliche Stammdaten** pflegen dürfen, ohne Zugriff auf Admin‑Signier‑Passwörter zu erhalten.

## Entscheidung

FMB Log implementiert einen mehrstufigen Integritätsschutz:

1. **Root‑Trust (Compile‑Time)**
   - Der **Root Public Key** ist fest in der Anwendung enthalten.
   - Damit kann die App bestimmte Zertifikate verifizieren, ohne auf veränderliche Dateien zu vertrauen.
2. **DB‑Key‑Zertifikat (Root‑signiert)**
   - Eine Datei `<db>.integrity.dbkey.json` enthält den **DB‑Public‑Key** und eine **Root‑Signatur** darüber.
   - Damit kann der DB‑Key wiederhergestellt und verifiziert werden (auch wenn `<db>.integrity.pub.json` fehlt).
3. **DB‑Signierschlüssel in Stronghold**
   - Der **DB‑Private Key** liegt verschlüsselt im Stronghold‑Vault (`vaults/<db>.integrity.vault`).
   - Admins entsperren den Vault (Signier‑Passwort) für Signier‑Operationen.
4. **Per‑User‑Signaturen + Delegation**
   - Nutzer besitzen zusätzlich einen **User‑Signierschlüssel** (ebenfalls im Stronghold‑Vault `vaults/<user_id>.vault`).
   - Ein Admin kann per **Capability‑Zertifikat** delegieren, dass ein Nutzer innerhalb eines Scopes (z. B. `masterdata.fgw`) signieren darf.
   - So können Key‑User fachliche Daten pflegen, ohne Admin‑Signier‑Passwort.
5. **Audit**
   - Ein Audit prüft (und cached) die Integrität der signierten Bereiche und macht Abweichungen sichtbar.

## Hashing

- Für interne Integritäts‑Fingerprints und Snapshot‑Hashes wird **BLAKE3** verwendet (schnell, parallelisierbar).
- Für RFC‑3161 TSA‑Requests wird weiterhin **SHA‑256** genutzt (TSA‑Standard).

## Alternativen (abgewogen)

1. **Nur ACLs / Dateirechte**
   - + simpel
   - − schützt nicht vor Manipulationen im gültigen Benutzerkontext
2. **DB‑Verschlüsselung**
   - + erschwert direkten Zugriff
   - − Key‑Management schwierig; kann Concurrency/CRDT‑Setup verschärfen
3. **Signaturen nur für PDFs**
   - + Endprodukt geschützt
   - − Stammdaten/Messdaten in der DB wären weiterhin manipulierbar und würden erst spät auffallen

## Konsequenzen

- **Betriebsprozess:** Das DB‑Key‑Zertifikat ist verpflichtend (Backup/Recovery). Die Datei muss separat gesichert werden.
- **Rollenmodell:** Admin‑Entsperren bleibt seltene Aktion; fachliche Signaturen können per Delegation erfolgen.
- **Fail‑Closed:** Wenn Integrität aktiviert ist, werden nicht verifizierbare Daten als kritisch behandelt (z. B. nicht freigabefähig / Blocken bestimmter Admin‑Operationen).

## Offene Punkte / spätere Ausbaustufen

- Optionale RFC‑3161 Zeitstempelung für Tagesabrechnungen (erfordert Internet; TSA‑Token in Historie/QR).
- Erweiterte Integrität über Protokoll‑Packfiles (Packfile‑Hash/Index signieren).

