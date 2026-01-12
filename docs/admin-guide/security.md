# Sicherheitsarchitektur

Dieses Kapitel beschreibt die in FMB Log umgesetzte Sicherheitsarchitektur und ordnet sie konkreten Risiko‑Szenarien zu. Ziel ist **kein absoluter Schutz vor lokaler Manipulation**, sondern eine praktikable Absicherung für den Mehrnutzerbetrieb mit einer gemeinsam genutzten SQLite‑Datenbasis (z. B. Netzlaufwerk).

## Ziel & Threat Model (Kurzfassung)

FMB Log wird typischerweise in einer Umgebung betrieben, in der mehrere Nutzer auf dieselben Daten zugreifen:

- Die Anwendung läuft als Desktop‑App unter dem Windows‑Benutzerkonto des jeweiligen Nutzers.
- Die Daten (SQLite‑DB und Vaults) können in einem gemeinsamen Ordner liegen.
- Ein Nutzer *kann* potentiell direkten Dateizugriff auf die DB haben (z. B. via SQLite‑Browser).

Damit ist “jemand kann den Inhalt der DB-Datei ändern” ein realistisches Szenario. Die Sicherheitsmaßnahmen sind darauf ausgelegt, **unbemerkte Rechte‑ und Benutzer‑Manipulationen zu verhindern** und **Passwort‑/Account‑Übernahmen über reine DB‑Manipulation deutlich zu erschweren**.

## Komponenten

### 1) Passwort‑Hashing (Argon2id) + Benutzer‑Pepper (Stronghold)

**Problem:** Wenn ein Passwort‑Hash nur vom Passwort abhängt, kann ein Angreifer (mit Schreibzugriff auf die DB) den eigenen Hash in das Konto eines anderen Nutzers kopieren und so dessen Passwort “ersetzen” (Hash‑Swap‑Angriff).

**Umsetzung in FMB Log:**

- Das Passwort wird per **Argon2id** gehasht (Backend/Rust, PHC‑String).
- Zusätzlich besitzt jeder Nutzer ein **zufälliges Pepper** (32 Byte).
- Das Pepper wird **nicht in der DB** gespeichert, sondern in einer **Stronghold‑Vault**:
  - Datei: `vaults/<user_id>.vault` (neben der DB im gemeinsamen Datenordner)
  - Die Vault ist verschlüsselt mit einem Key, der aus `user_id + password` per Argon2id abgeleitet wird.
- Der gespeicherte Hash ist **user‑gebunden**: Es wird nicht nur `password`, sondern `user_id:password:pepper` gehasht.

**Folge:** Ein Hash‑Swap aus der DB allein funktioniert nicht, weil das Pepper pro Nutzer verschieden und geheim ist.

### 2) Passwort‑Änderung und Admin‑Reset

- **Passwort ändern (Nutzer):** Das bestehende Pepper bleibt gleich, wird aber mit dem neuen Passwort neu verschlüsselt (Vault‑Re‑Keying). Anschließend wird der Hash neu berechnet.
- **Admin‑Reset:** Es wird ein **neues Pepper** und ein **temporäres Passwort** erzeugt; Vault + Hash werden ersetzt und das Flag `must_change_password` gesetzt.

### 3) Integritätsschutz für Benutzer/Gruppen/Rechte (Ed25519‑Signaturen)

**Problem:** Selbst mit sicherem Passwort‑Hashing könnte ein Nutzer mit Dateizugriff `is_admin=1` setzen oder Berechtigungen manipulieren.

**Umsetzung in FMB Log:**

- Für sicherheitsrelevante Tabellen wird pro Datensatz eine **Ed25519‑Signatur** gespeichert:
  - `users.signature`
  - `groups.signature`
  - `user_groups.signature`
  - `group_permissions.signature`
- Bei aktivem Integritätsschutz werden diese Signaturen **bei der Anmeldung und bei Rechtesync/Anzeige geprüft**.
- Ist eine Signatur ungültig, wird das als Manipulation interpretiert und der Zugriff wird blockiert.

### 4) DB‑Public‑Key und DB‑Key‑Zertifikat (Root‑Trust)

Damit die Signaturprüfung nicht durch Austausch des Public Keys ausgehebelt werden kann, gibt es zwei Stufen:

1. **DB Public Key** (neben der DB)
   - Datei: `<db>.integrity.pub.json`
   - Wird von der App erzeugt, wenn Integritätsschutz aktiviert wird.
2. **DB‑Key‑Zertifikat** (verpflichtend)
   - Datei: `<db>.integrity.dbkey.json`
   - Enthält den **DB‑Public‑Key** und eine **Root‑Signatur über diesen DB‑Key** (kein Root‑Public‑Key).
   - Die App enthält den **Root Public Key fest eingebaut** (Compile‑Time) und prüft damit die Root‑Signatur.

**Folge:** Ohne Zertifikat startet FMB Log den Integritätsschutz nicht (Fail‑Closed), da sonst ein Austausch des DB‑Public‑Keys durch reine Datei‑Manipulation möglich wäre.

::: tip Warum braucht man `<db>.integrity.dbkey.json`, obwohl der Root‑Public‑Key in der App steckt?
Der Root‑Public‑Key allein reicht nicht aus: Er sagt nur, **womit** eine Root‑Signatur geprüft wird.  
Das Zertifikat liefert zusätzlich **welcher DB‑Public‑Key** gültig sein soll *und* die dazugehörige Root‑Signatur. Ohne Zertifikat gibt es für die App keinen vertrauenswürdigen Bezug zwischen „dieser DB‑Public‑Key“ und „ist durch Root autorisiert“.
:::

### 5) Stronghold‑Vault für den Signierschlüssel (Admin‑Entsperren)

Der private Signierschlüssel der DB (Ed25519) wird **nicht in der DB** abgelegt:

- Datei: `vaults/<db>.integrity.vault`
- Verschlüsselt in **Stronghold**, entsperrt über ein **Signier‑Passwort** (session‑basiert).

::: tip Hinweis
- Das Signier‑Passwort wird beim Aktivieren des Integritätsschutzes festgelegt und gilt anschließend für alle Admins (shared secret), damit mehrere Admins signieren können.
- Es muss nicht identisch mit dem Login‑Passwort eines Admin‑Kontos sein.
:::

### 6) Tauri Capabilities / Permissions (Reduzierte Angriffsfläche)

Tauri erlaubt fein granulare Berechtigungen für native Aktionen (Dateizugriffe, opener, stronghold, SQL, …). Dadurch wird die Angriffsfläche reduziert, falls es zu:

- fehlerhaften UI‑Routen,
- unerwarteten Script‑Ausführungen,
- oder einer späteren Erweiterung mit externen Inhalten

kommt. Nicht benötigte native Aktionen werden nicht freigegeben.

### 7) SQL‑Injection‑Schutz (Parameter Binding)

SQL‑Statements werden über `@tauri-apps/plugin-sql` ausgeführt und verwenden gebundene Parameter (z. B. `$1`). Dadurch werden klassische **SQL‑Injection‑Angriffe über Eingabefelder** verhindert (sofern keine String‑Konkatenation zu SQL erfolgt).

## Risiko‑Szenarien: Was wird womit abgedeckt?

Die folgende Übersicht ist bewusst praxisnah: **welches Risiko** ist realistisch, **welche Komponente** wirkt dagegen, und **was bleibt** als Restrisiko.

| Risiko‑Szenario | Wirkung in der Praxis | Abdeckung durch | Restrisiko / Hinweise |
|---|---|---|---|
| Nutzer setzt sich in SQLite `is_admin=1` oder ändert Gruppen/Rechte | Privilegieneskalation | Integritätsschutz (Signaturen) | DoS bleibt möglich (z. B. Signaturen löschen → Login blockiert). Schutz gegen Schreibzugriff ist grundsätzlich nicht vollständig lösbar ohne Zugriffskontrolle auf Dateiebene. |
| Hash‑Swap: eigener Passwort‑Hash wird bei fremdem Nutzer eingetragen | Account‑Übernahme | Argon2id + per‑User Pepper in Stronghold | Wenn ein Angreifer **zusätzlich** die Pepper‑Vault des Zielusers überschreiben darf und Integrität deaktiviert ist, kann er trotzdem “resetten”. Integritätsschutz reduziert dieses Risiko deutlich. |
| Austausch des DB‑Public‑Keys, um manipulierte Datensätze selbst zu signieren | Integrität aushebeln | DB‑Key‑Zertifikat + Root Public Key in Binary | Ohne Zertifikat wird Integrität nicht als aktiv betrachtet (Fail‑Closed). Zertifikat + ACLs sind Pflicht. |
| Manipulation/Löschung von Vault‑Dateien (`vaults/*.vault`) | Login‑Probleme / “Passwort falsch” / DoS | Stronghold‑Verschlüsselung | DoS bleibt möglich, wenn Dateien gelöscht werden können. Empfehlung: Vault‑ACLs so eng wie möglich. |
| Admin‑Operation ohne Hub‑Zugriff (Netzlaufwerk offline) | Inkonsistente Zustände (z. B. Nutzer in DB ohne Vault) | UI‑Gating + transaktionale/„cleanup“‑Logik | Admin‑Funktionen sind in diesem Zustand bewusst deaktiviert. Fach‑/Messdaten können weiter über die lokale Replica bearbeitet und später synchronisiert werden. |
| SQL‑Injection über Eingabefelder | Datenverlust / Rechteänderung | Parameter Binding | Schutz gilt nur, solange SQL nicht per String‑Konkatenation gebaut wird. |
| Auslesen von Messdaten aus DB‑Datei | Vertraulichkeitsverlust | (keine, DB ist nicht verschlüsselt) | Schutz nur über Datei‑/Share‑Berechtigungen. Optional: separate Verschlüsselung wäre ein eigenes Projekt mit Trade‑offs. |
| Malware/Administrator auf dem Client | Vollzugriff | (keine) | Nicht im Scope: Ein kompromittiertes System kann immer Daten auslesen/manipulieren. |
| Manipulation von Fach‑/Messdaten (Gebinde, Messungen, FGW) | Falsche Freigabe / verfälschte Historie | Messdaten‑Signaturen (User‑Key), Stammdaten‑Signaturen (Delegation), Protokoll‑Integrität (BLAKE3) und Tagesabrechnungs‑Snapshot (BLAKE3 + optional TSA) | DoS bleibt möglich (Dateien löschen/überschreiben). Bei aktivem Integritätsschutz werden nicht verifizierbare Datensätze fail‑closed als ungültig behandelt. Tagesabrechnungen können nachträglich ungültig werden, wenn enthaltene Messungen später ungültig gesetzt werden. |

## Betriebsempfehlungen (Admin)

1. **DB‑Key‑Zertifikat verwenden (verpflichtend).** Ohne Zertifikat kann ein Angreifer bei Schreibzugriff auf den Ordner den Public Key austauschen.
2. **ACLs im gemeinsamen Ordner setzen:**
   - Public‑Key + Zertifikat: für normale Nutzer **read‑only**, für Admins write.
   - Integrity‑Vault: möglichst nur Admins (kein Grund, dass normale Nutzer diese Datei lesen).
   - Pepper‑Vaults: wenn möglich pro User einschränken (verhindert unnötige DoS‑/Manipulationsmöglichkeiten).
3. **Backups/Versionierung der Hub‑DB** (Netzlaufwerk): schützt vor versehentlichen Löschungen und ermöglicht Recovery.

## Admin entfernen / Signierrechte entziehen

Wenn ein Nutzer nicht mehr Admin sein soll, ist wichtig zu unterscheiden, **welches Risiko** vorliegt:

### 1) Nur Admin‑Rolle entziehen (kein Key‑Leak vermutet)

1. In **Administration → Benutzer** den Haken/Status **Admin** entfernen und speichern.
2. Den Nutzer abmelden lassen (oder App schließen), damit eine bestehende Session nicht weiter als Admin arbeitet.
3. Auf Dateiebene die Berechtigungen prüfen/anpassen (insbesondere `vaults/<db>.integrity.vault` und `<db>.integrity.*`).

> Hinweis: Eine laufende Session kann nicht “remote” beendet werden. Wenn das kritisch ist, Nutzer zusätzlich deaktivieren (`is_active=0`) und später wieder aktivieren.

### 2) Signier‑Passwort könnte bekannt sein (Zugriff entziehen)

Wenn der (ehemalige) Admin das **Signier‑Passwort** kennen könnte, reicht das reine Demoten nicht:

- In **Einstellungen → Integritätsschutz → Schlüsselmanagement** das **Signier‑Passwort ändern**.
- Danach müssen alle verbleibenden Admins das neue Signier‑Passwort kennen, um weiterhin signieren zu können.

### 3) Private Key könnte kompromittiert sein (stärkste Maßnahme)

Wenn nicht ausgeschlossen werden kann, dass der private Signierschlüssel kopiert wurde, hilft ein Passwortwechsel nicht mehr. Dann:

1. In **Einstellungen → Integritätsschutz → Schlüsselmanagement** den **Signierschlüssel rotieren**.
2. Die Anwendung signiert anschließend die Sicherheitsdaten neu (Benutzer/Gruppen/Rechte).
3. Falls ein **DB‑Key‑Zertifikat** verwendet wird (`<db>.integrity.dbkey.json`), muss es nach einer Rotation **neu erzeugt** werden:
   - `pnpm -s integrity:certify --db-public <db>.integrity.pub.json --out <db>.integrity.dbkey.json`

::: warning Wichtig
Ein vorhandenes DB‑Key‑Zertifikat ist nach einer Rotation technisch ungültig (weil es den alten DB‑Public‑Key zertifiziert). Bis zur Neu‑Zertifizierung behandelt FMB Log den Integritätsschutz als **nicht funktionsfähig** (Fail‑Closed) und blockiert sicherheitsrelevante Vorgänge, bis ein neues Zertifikat vorliegt.
:::

## Wiederherstellung: Public‑Key‑Datei fehlt

Wenn `<db>.integrity.pub.json` gelöscht wurde:

1. **Falls ein Zertifikat vorhanden ist** (`<db>.integrity.dbkey.json`):
   - Der DB‑Public‑Key steckt im Zertifikat und kann wiederhergestellt werden:
   - `pnpm -s integrity:restore-pub --cert <db>.integrity.dbkey.json --out <db>.integrity.pub.json`
2. **Falls kein Zertifikat vorhanden ist**:
   - Ohne Zertifikat kann die Anwendung den DB‑Key nicht gegen Root verifizieren.
   - FMB Log behandelt den Integritätsschutz dann als **nicht funktionsfähig** (Fail‑Closed) und blockiert sicherheitsrelevante Vorgänge (z. B. Login/Benutzer‑/Rechte‑Sync).
   - Empfehlung: Zertifikat konsequent verwenden und die Dateien per ACL schützen.

::: tip Hinweis
Der Root‑Private‑Key (`.secrets/integrity-root-private.jwk.json`) dient ausschließlich dazu, den DB‑Public‑Key zu zertifizieren. Er kann den DB‑Public‑Key nicht “wiederherstellen”, wenn dieser (und das Zertifikat) verloren gegangen sind.
:::

## Wiederherstellung / Re‑Init (Root‑Keys)

In der Praxis gibt es zwei unterschiedliche “Recovery”-Fälle. Entscheidend ist, **was** verloren ging.

### A) Zertifikat verloren (`<db>.integrity.dbkey.json`)

Das ist der häufigste Fall (z. B. Datei versehentlich gelöscht). Vorgehen:

1. Stellen Sie sicher, dass `<db>.integrity.pub.json` noch neben der DB existiert.
2. Erzeugen Sie das Zertifikat auf dem Admin‑Rechner (Root‑Private‑Key erforderlich):
   - `pnpm -s integrity:certify --db-public <db>.integrity.pub.json --out <db>.integrity.dbkey.json --root-private <pfad>`
3. Legen Sie `<db>.integrity.dbkey.json` wieder neben der DB ab und setzen Sie die ACLs (normale Nutzer read‑only).
4. Starten Sie FMB Log neu.

Hinweis: In diesem Fall müssen die Sicherheitsdaten **nicht** neu signiert werden, weil sich der DB‑Signierschlüssel nicht geändert hat. Optional kann in **Einstellungen → Integritätsschutz → Neu signieren** eine Voll‑Signierung ausgeführt werden, um fehlende Signaturen zu ergänzen.

### B) Integritäts‑Vault/Signier‑Passwort verloren (`vaults/<db>.integrity.vault`)

Wenn der private DB‑Signierschlüssel nicht mehr verfügbar/entsperrbar ist, können vorhandene Signaturen nicht mehr erneuert werden. Das ist ein **Notfall‑Szenario**:

1. Anwendung schließen.
2. DB und Vault‑Ordner sichern (Backup/Copy).
3. Integritäts‑Artefakte entfernen:
   - `vaults/<db>.integrity.vault`
   - `<db>.integrity.pub.json`
   - `<db>.integrity.dbkey.json` (falls vorhanden)
4. FMB Log starten und als Admin anmelden.
5. **Einstellungen → Integritätsschutz → Aktivieren** (neues Signier‑Passwort festlegen).
6. Neues Zertifikat erzeugen (Root‑Private‑Key):
   - `pnpm -s integrity:certify --db-public <db>.integrity.pub.json --out <db>.integrity.dbkey.json --root-private <pfad>`
7. FMB Log neu starten (damit Integrität wieder als “zertifiziert” gilt).
8. **Einstellungen → Integritätsschutz → Entsperren** und anschließend **Neu signieren**, um Benutzer/Gruppen/Rechte wieder konsistent zu signieren.

::: warning Wichtig
Eine Re‑Initialisierung stellt nur den Schutz für die Zukunft wieder her. Wenn Integrität zuvor “kaputt” war (fehlendes Zertifikat/Vault), können Manipulationen in der Zwischenzeit nicht mehr kryptografisch nachgewiesen werden. Im Zweifel DB aus Backup wiederherstellen.
:::

## Lokales Schlüsselmaterial (`.secrets/`)

Im Repository wird nur der **Root Public Key** mit ausgeliefert (in der Anwendung fest eingebaut).  
Alles andere ist lokales Admin‑Material und bleibt bewusst **außerhalb von Git**.

- `.secrets/integrity-root-private.jwk.json`: Root‑Private‑Key zum Signieren von DB‑Key‑Zertifikaten (Build-/Admin‑Tooling).
- `.secrets/integrity-db-private.jwk.json`: wird von FMB Log **nicht** verwendet (der DB‑Private‑Key liegt in `vaults/<db>.integrity.vault`). Diese Datei kann gelöscht werden, falls sie noch existiert.

::: info Zusammenfassung
- **Passwörter:** Argon2id + Stronghold‑Pepper pro Nutzer verhindert Hash‑Swap und erschwert DB‑basierte Account‑Übernahmen.
- **Rechte/Administratoren:** Signaturen (Ed25519) verhindern unbemerkte Manipulationen; mit Zertifikat ist auch Public‑Key‑Swap abgefangen.
- **Dateiebene bleibt entscheidend:** Ohne passende ACLs sind DoS‑Szenarien (Dateien löschen/überschreiben) in einem gemeinsamen Ordner grundsätzlich nicht vollständig verhinderbar.
:::

## Architekturdiagramm

![Sicherheitsarchitektur](../diagrams/security-architecture.svg)

## Integrität für Messdaten & Tagesabrechnung (Stand)

Neben Benutzer/Gruppen/Rechten werden in FMB Log inzwischen auch **fachliche Daten** (Stammdaten, Mess‑Revisionen, Protokolle) sowie die **Tagesabrechnung** selbst so abgesichert, dass Manipulationen an der SQLite‑Datei **auffallen** (tamper‑evident).

### Bedrohungsszenarien (Beispiele)

- Messwerte manipulieren (z. B. `gamma_sum_og`, `iso_unit`, Messdatum), um Freigabefähigkeit zu erzwingen.
- FMK-/NV-/FGW‑Stammdaten manipulieren (SW/KF/Freigabewerte), um Grenzwerte zu verschieben.
- Protokolldateien austauschen, sodass die Anzeige nicht mehr zu den gespeicherten Messwerten passt.
- Flags/Status verändern (z. B. „bereits abgerechnet“), um Nachvollziehbarkeit zu stören.

### Zielbild

Für alle Daten, die in die Tagesabrechnung einfließen, gilt:

- **Jede Änderung ist kryptografisch nachweisbar** (Signatur/HMAC) und kann nicht durch reine DB‑Manipulation „unsichtbar“ gemacht werden.
- **Offline‑Import bleibt möglich** (lokale DB), Manipulationen fallen aber beim nächsten Sync/bei der Anzeige auf.
- Die Tagesabrechnung kann optional als **signierter Snapshot** erzeugt werden (Nachweis, welche Datenbasis verwendet wurde).

### Umsetzung (phasenweise)

#### Phase 1: Protokoll‑Integrität (Dateien) hart machen

Die Protokolle liegen bereits als komprimierte Dateien im Hub‑Ordner (lokal gecacht). Um Manipulationen eindeutig zu erkennen:

- In der DB wird pro Protokoll eine **BLAKE3** über den komprimierten Bytes gespeichert (`measurement_protocols.blake3`, 32‑Byte‑BLOB; Anzeige als Hex).
- Beim Laden/Anzeigen wird der Hash erneut berechnet und mit der DB verglichen.
- Der Protokoll‑Hash wird zusätzlich in den signierten Datensatz der Mess‑Revision aufgenommen (Phase 2), damit ein Austausch des Hashs in SQLite nicht genügt.

#### Phase 2: Messdaten (Revisionen) signieren – ohne Admin‑Onlinepflicht

Messungen werden typischerweise von „normalen“ Nutzern importiert. Dafür ist ein **per‑User‑Signaturschlüssel** sinnvoll:

- Bei der Kontoanlage wird zusätzlich zum Pepper ein **Ed25519‑Keypair** erzeugt.
  - Private Key: im bestehenden `vaults/<user_id>.vault` (Stronghold), verschlüsselt durch `user_id + password`.
  - Public Key: in der DB, **zertifiziert** durch den DB‑Integritätsschlüssel (damit Public‑Key‑Swap erkennbar ist).
- Beim Import/Ändern einer Mess‑Revision wird eine kanonische Darstellung der fachlichen Felder gehasht (BLAKE3) und mit dem User‑Key signiert.
- Bei der Anzeige und bei Tagesabrechnungs‑Berechnungen wird diese Signatur geprüft. Ungültige/fehlende Signatur führt zu „ungültig“ (kein Freigabe‑Nachweis).

Damit bleibt Offline‑Import möglich (User‑Key ist lokal verfügbar, weil im User‑Vault).

#### Phase 3: Stammdaten (FGW/NV/FMK/SW/KF) signieren (Delegation)

Stammdaten werden in FMB Log als **User‑Signaturen mit Admin‑Delegation** umgesetzt:

- Tabellen wie `fgw_values`, `nuclide_vectors`, `nuclide_vector_nuclides`, `fmks`, `fmk_year_settings` usw. tragen pro Datensatz eine **User‑Signatur** + `capability_id`.
- Ein Admin erteilt dafür **Delegationen** (Capability‑Zertifikate, DB‑signiert). Dafür muss der DB‑Signierschlüssel entsperrt sein.
- Key‑User können danach Stammdaten pflegen, **ohne** Admin‑Signier‑Passwort zu kennen.
- Berechnungen (Dashboard/Preview/PDF) nutzen im Integritätsmodus nur **verifizierte** Stammdaten (Fail‑Closed für Freigabe‑Entscheidungen).

##### Erweiterung: Key‑User ohne Admin‑Signier‑Passwort

In der Praxis gibt es oft Nutzergruppen, die Stammdaten pflegen dürfen (FGW/NV/FMK/SW/KF), **ohne** Admin‑Rechte zu besitzen und **ohne** das Signier‑Passwort für Benutzer/Gruppen/Rechte zu kennen. Dafür braucht es eine **Trennung der Signier‑Berechtigungen** („Separation of Duties“).

Es gibt zwei praktikable Muster:

1. **Separater Stammdaten‑Signierschlüssel (Role Key)**
   - Eigener Ed25519‑Key + eigenes Stronghold‑Vault (z. B. `vaults/<db>.masterdata.vault`).
   - Entsperren erfolgt über ein **separates** Passwort, das nur die Stammdaten‑Key‑User kennen.
   - Vorteil: technisch einfach.
   - Nachteil: wenn ein Key‑User aus der Rolle entfernt wird, muss das Passwort/der Key **rotiert** werden (weil Wissen nicht „zurückgenommen“ werden kann).

2. **Per‑User‑Signaturen + Admin‑Delegation (Capability‑Zertifikate) (empfohlen)**
   - Jeder Nutzer besitzt einen **eigenen** Ed25519‑Key (Private Key in `vaults/<user_id>.vault`).
   - Ein Admin erteilt die Berechtigung zum Signieren von Stammdaten über ein **Delegations‑Zertifikat**, das mit dem DB‑Integritätsschlüssel signiert ist (Root‑Trust via `<db>.integrity.dbkey.json`).
   - Ein Stammdatensatz wird dann signiert mit:
     - `signed_by_user_id` + `user_signature`
     - optional: `capability_id` (Delegations‑Zertifikat)
   - Verifikation:
     1) User‑Signatur ist gültig (Public Key ist in der DB hinterlegt und selbst signiert/geschützt).  
     2) Delegations‑Zertifikat ist gültig und umfasst den Scope (z. B. `masterdata.fgw`, `masterdata.nv`, …).  
     3) Optional: Delegation ist nicht widerrufen / Signing‑Zeitpunkt liegt vor `revoked_at`.
   - Vorteile:
     - Kein Shared Secret unter Key‑Usern.
     - **Bessere Nachvollziehbarkeit** („wer hat unterschrieben“).
     - Entzug der Berechtigung ist über Widerruf/Expiry möglich, ohne sofortige Rotation eines Shared Keys.
   - Nachteil: etwas mehr Implementierungsaufwand (Zertifikate/Widerruf).

##### Umsetzung in FMB Log (aktuell)

**Scopes (Delegations‑Bereiche):**

- `masterdata.fgw`: Freigabewerte (FGW)
- `masterdata.nv`: Nuklidvektoren (NV)
- `masterdata.fmk`: Freimesskampagnen inkl. Pfad‑Reihenfolge und SW/KF (FMK/SW/KF)

**Ablauf: Admin delegiert Signierrechte an Key‑User**

1. Integritätsschutz ist aktiviert und das DB‑Key‑Zertifikat liegt neben der DB (`<db>.integrity.dbkey.json`).
2. Admin entsperrt den DB‑Signierschlüssel einmalig (Administration → Einstellungen → Integritätsschutz → „Entsperren“).
3. Admin vergibt Delegationen (Administration → Einstellungen → Delegationen):
   - Nutzer auswählen
   - Scope(s) erteilen (FGW/NV/FMK)
   - Optional: Ablaufdatum (Expiry) setzen
4. Die Delegation wird als Datensatz in `capability_certs` abgelegt und mit dem DB‑Signierschlüssel signiert.

**Ablauf: Key‑User ändert Stammdaten**

1. Key‑User meldet sich an.
2. Beim Speichern von FGW/NV/FMK wird der Datensatz mit dem **User‑Key** signiert und die zugehörige Delegation (`capability_id`) mitgeschrieben.
3. Die Anwendung nutzt für Berechnungen (insb. Tagesabrechnung/Preview/Dashboard) nur **verifizierte** Stammdaten:
   - User‑Signatur gültig
   - User‑Public‑Key ist DB‑signiert (Public‑Key‑Swap erkennbar)
   - Delegation gültig zum Signaturzeitpunkt (`issued_at`/`expires_at`/`revoked_at`)

**Widerruf / Entzug**

- Admin kann Delegationen widerrufen. Signaturen, die **nach** `revoked_at` erstellt wurden, gelten als ungültig.
- Signaturen, die **vor** `revoked_at` erstellt wurden, bleiben verifizierbar (Audit‑Trail).

#### Phase 4: Tagesabrechnung als signierter Snapshot

Zusätzlich zur laufenden Daten‑Integrität wird beim PDF‑Export ein **Snapshot‑Hash** erzeugt und in der PDF als **QR‑Code** ausgegeben.

**Umsetzung in FMB Log (aktuell):**

- Beim Export wird ein kanonischer Snapshot der tatsächlich exportierten Tabellenzeilen erstellt und als **BLAKE3** gehasht.
- Der Hash wird in `daily_reports.snapshot_hash` gespeichert (DATA‑Hash; 32‑Byte‑BLOB, Anzeige als Hex).
- Die PDF enthält unten rechts in der Fußzeile einen QR‑Code mit diesem Snapshot‑Hash (und optional weiteren Metadaten, siehe unten).
- Zusätzlich werden neben dem QR‑Code kurze **Fingerprints** angezeigt (z. B. `DATA: ABC-DEF-GHI`), damit Werte auch ohne Abtippen langer Hashes manuell gegengeprüft werden können.
- Zusätzlich wird der **PDF‑Hash** (BLAKE3 der finalen PDF‑Bytes; Spaltenname historisch `daily_reports.pdf_sha256`) in der Historie gespeichert. In der Historie kann das Original‑PDF über **PDF prüfen…** gegen diesen Hash geprüft werden.
- Wird eine enthaltene Mess‑Revision später **ungültig gesetzt** oder wird eine Tagesabrechnung manuell ungültig gemacht (`reports.invalidate`), wird eine **signierte Invalidierung** angelegt (`daily_report_invalidations`, User‑Key) und die Tagesabrechnung als **ungültig** markiert (`daily_reports.is_valid = 0`). Dabei werden Export‑Markierungen der enthaltenen Messungen zurückgesetzt, sodass eine erneute Abrechnung möglich bleibt.

##### Optional: RFC3161‑Zeitstempel (FreeTSA)

Gerade bei Tagesabrechnungen kann zusätzlich ein RFC3161‑Zeitstempel hinterlegt werden (TSA‑Signatur über den Snapshot‑Hash). Das ist besonders hilfreich, wenn eine Tagesabrechnung **nachweisbar zu einem Zeitpunkt** existiert haben soll.

- Aktivierung durch Admin: `Administration → Einstellungen → Tagesabrechnung → RFC3161‑Zeitstempel verpflichtend`
- Verhalten:
  - Ist die Option aktiv, wird beim PDF‑Export ein RFC3161‑Timestamp bei `https://freetsa.org/tsr` angefordert.
  - Ohne Internetverbindung schlägt der Export fehl (Fail‑Closed), damit keine „ungetimestampte“ Abrechnung entsteht.
- Speicherung in der Historie (`daily_reports`):
  - `tsa_provider`
  - `tsa_gen_time`
  - `tsa_snapshot_sha256` (der für TSA verwendete SHA‑256‑Imprint; siehe Hinweis)
  - `tsa_token_sha256`
  - `tsa_token_base64` (DER‑Token als Base64)
- QR‑Code in der PDF:
  - Enthält immer `snapshot_hash`
  - Wenn TSA aktiv: zusätzlich `tsa_token_sha256` (das Token selbst ist zu groß für QR und liegt in der DB‑Historie)

In der **Historie** kann FMB Log den TSA‑Token zusätzlich technisch prüfen („plausibel“):

- Token lässt sich parsen (TSTInfo)
- Hash‑Algorithmus ist SHA‑256
- Imprint im Token passt zu `tsa_snapshot_sha256`

Hinweis: Das ist keine vollständige PKI‑Vertrauensprüfung der TSA‑Signaturkette, erhöht aber die Konsistenzprüfung (Token/Imprint gehören zusammen).

::: tip Hinweis (warum TSA weiterhin SHA‑256 nutzt)
FreeTSA/RFC3161 erwartet einen Standard‑Hash (hier SHA‑256) als „Message Imprint“.  
Daher wird für TSA zusätzlich `tsa_snapshot_sha256` gespeichert. Der primäre DATA‑Hash (`daily_reports.snapshot_hash`) bleibt BLAKE3.
:::

### Hinweise zur CRDT‑Synchronisation (CR‑SQLite)

Die Signaturen sind normale Spalten/Datensätze und werden über CR‑SQLite repliziert. Wichtig ist:

- Primärschlüssel müssen non‑NULL sein; Signatur‑Spalten sollten **nullable** sein (Initialzustand kompatibel).
- Bei Konflikten („Last‑writer‑wins“) ist die Signatur nur für den finalen Datensatz gültig – das ist gewollt: ein Konflikt ohne passende Signatur wird als „ungültig“ sichtbar.

## Audit (Administration → Audit)

FMB Log enthält eine Audit‑Ansicht, mit der ein Admin den aktuellen Integritätsstatus prüfen kann.

Der Audit umfasst (je nach Einstellung) u. a.:

- **Security‑Tabellen** (DB‑Signatur/Integrität): Benutzer, Gruppen, Gruppenrechte, Delegations‑Zertifikate, Admin‑Einstellungen
- **Stammdaten** (User‑Signaturen + Delegation): FGW/NV/FMK inkl. SW/KF‑Tabellen
- **Messdaten** (User‑Signaturen): Mess‑Revisionen
- **Protokoll‑Integrität**: BLAKE3‑Prüfung der komprimierten Protokoll‑Bytes (Hub‑Packfiles)

Empfehlung: Audit nach Updates, nach Key‑Rotation und bei Verdacht auf Datenmanipulation ausführen.

## Audit-Trail Export (Administration → Audit-Trail Export)

Neben dem kryptografischen Audit gibt es einen **Audit‑Trail** als „Betriebsprotokoll“: Die Anwendung schreibt wichtige Aktionen (z. B. aus der Administration und aus den Stammdaten) als Ereignisse in die Tabelle `audit_trail`. Diese Einträge sind für externe Prüfungen gedacht und können als CSV exportiert werden.

Der Audit‑Trail ist **kein** Ersatz für den Audit‑Check (Signatur‑/Hash‑Verifikation), sondern ergänzt ihn:

- **Audit‑Trail** beantwortet: *Wer hat wann was geändert?* (Change‑Log / Nachvollziehbarkeit)
- **Audit** beantwortet: *Sind die aktuellen Daten unverändert und verifizierbar?* (Integritätsprüfung)

### Export nutzen

1. Öffnen Sie **Administration → Audit‑Trail Export**.
2. Wählen Sie optional einen Zeitraum („Von/Bis“) und/oder nutzen Sie die Suche.
3. Klicken Sie auf **CSV exportieren** und speichern Sie die Datei.

Die CSV enthält u. a. `event_at`, `user_id`, `username`, `action`, `entity_table`, `entity_id` sowie `before_json`/`after_json` (Vorher/Nachher als JSON‑Snapshot).

### Typische Aktionen (Beispiele)

- Benutzerverwaltung: `users.create`, `users.update`, `users.delete`, `users.reset_password`
- Gruppen/Rechte: `groups.create`, `groups.update`, `groups.delete`, `group_permissions.update`, `user_groups.update`
- Stammdaten: `fgw.update`, `fmks.create/update/delete`, `nuclide_vectors.create/update/delete`
- Tagesabrechnung: `daily_reports.invalidate`

::: tip Hinweis
Sensible Geheimnisse (z. B. temporäre Passwörter) werden **nicht** im Audit‑Trail gespeichert. Es werden nur die fachlich relevanten Metadaten und Vorher/Nachher‑Snapshots protokolliert.
:::
