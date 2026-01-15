# Ersteinrichtung

## Administrator anlegen (einmalig)

Beim ersten Start ist die Anwendung im Setup‑Modus. In diesem Schritt wird der **erste Administrator** angelegt. Dieser Account ist notwendig, weil ohne Admin niemand Nutzer, Gruppen und Stammdaten verwalten kann.

Nach dem Anlegen des Administrators führt FMB Log zusätzlich eine einmalige Initialisierung durch (kann einige Sekunden dauern):

- RFC3161‑Zeitstempel für Tagesabrechnungen wird als **verpflichtend** aktiviert.
- Delegations‑Zertifikate für den Admin werden erstellt (Scopes: `masterdata.fgw`, `masterdata.nv`, `masterdata.fmk`).
- Die bereits vorhandenen Stammdaten aus der Stub‑DB werden mit dem Admin‑Signierschlüssel signiert (FGW/NV/FMK/SW/KF).
- Die Sicherheitsdaten in der DB (Benutzer/Gruppen/Rechte/Delegationen/Admin‑Einstellungen) werden mit dem DB‑Signierschlüssel signiert.

Anschließend wechselt die Anwendung zur Anmeldung. Ab diesem Zeitpunkt können weitere Nutzer und Gruppen angelegt werden.

Technischer Hinweis: Die Anwendung erkennt „Ersteinrichtung erforderlich“, wenn in der Datenbank noch **kein** Benutzer existiert.

::: warning Empfehlung
- Legen Sie mindestens einen zweiten Admin an, sobald die Grundkonfiguration steht (Single‑Admin‑Risiko).
:::

## Datenquelle wählen (wenn bereits eine produktive DB existiert)

Wenn FMB Log auf mehreren Arbeitsplätzen betrieben wird, existiert in der Regel bereits eine produktive Hub‑Datenquelle (DB + `vaults/` + `protocols/` im gemeinsamen Ordner).

In diesem Fall muss auf einem neuen Client **keine Ersteinrichtung** durchgeführt werden. Stattdessen:

1. Im Setup‑Modus auf **Datenquelle ändern** klicken.
2. Den Pfad zur bestehenden Hub‑DB auswählen (z. B. im Netzlaufwerk).
3. Die Anwendung lädt die Datenquelle; wenn bereits Benutzer existieren, wechselt FMB Log automatisch in den normalen **Anmeldemodus**.

::: info Kurzfassung
- **Nur einmal** im Betrieb: Ersteinrichtung + erster Admin.
- **Alle weiteren Clients**: Datenquelle ändern → anmelden.
:::

## Erstkonfiguration (empfohlen)

Nach der Ersteinrichtung empfiehlt sich eine kurze Grundkonfiguration, damit das Tagesgeschäft sauber getrennt ist (Messung/Prüfung/Administration):

1. Legen Sie mindestens eine **Benutzergruppe** an (z. B. „Messung“, „Auswertung“, „Key‑User“).
2. Weisen Sie den Gruppen die benötigten Rechte in der **Rechte‑Matrix** zu.
3. Legen Sie Nutzer an und ordnen Sie sie den Gruppen zu.

Warum dieser Schritt wichtig ist: In der Praxis sollen kritische Aktionen (z. B. FGW ändern, Passwörter zurücksetzen) nur wenigen Personen möglich sein, während der Import und die Arbeit mit Gebinden breiter verfügbar sein kann.

::: info Kurzfassung
- Admin anlegen → anmelden → Gruppen/Rechte/Nutzer einrichten
- Rechte steuern Sichtbarkeit und Bearbeitung in der UI
:::

## Integritätsschutz – DB‑Key‑Zertifikat (verpflichtend)

Der Integritätsschutz verhindert, dass Manipulationen an **Benutzern/Gruppen/Rechten** in der SQLite‑Datei unbemerkt bleiben. Technisch werden die relevanten Datensätze signiert.

Damit ein Angreifer den Schutz nicht durch einen einfachen Austausch des DB‑Public‑Keys aushebeln kann, ist ein **DB‑Key‑Zertifikat** verpflichtend: Der DB‑Public‑Key wird durch eine Root‑Signatur autorisiert und die Anwendung prüft diese Signatur gegen den fest eingebauten Root‑Public‑Key.

Dabei gilt:

- Der **Root‑Public‑Key** ist fest in der Anwendung hinterlegt (Compile‑Time).
- Der **Root‑Private‑Key** bleibt beim Administrator und wird nur zum Erstellen des Zertifikats benötigt (z. B. beim Build/Deployment).

### Vorgehen

1. Root‑Schlüssel erzeugen (einmalig, nur auf dem Admin‑Build‑Rechner):
   - `pnpm -s integrity:rootkey`
   - Ergebnis: Public Key in `src/lib/security/rootPublicKey.jwk.json`, Private Key in `.secrets/…` (darf nicht committed werden)
2. In der Anwendung: **Einstellungen → Integritätsschutz → Aktivieren**
   - Dadurch wird `<db>.integrity.pub.json` neben der DB erzeugt.
3. Zertifikat für den DB‑Public‑Key erzeugen:
   - `pnpm -s integrity:certify --db-public <db>.integrity.pub.json --out <db>.integrity.dbkey.json`
4. Auf dem Netzlaufwerk: Die Dateien gegen Änderungen schützen (ACL/Schreibrechte):
   - `<db>.integrity.dbkey.json` (Zertifikat)
   - `<db>.integrity.pub.json` (Public Key)

::: warning Hinweise
- Ohne `<db>.integrity.dbkey.json` gilt der Integritätsschutz als **nicht funktionsfähig** (Fail‑Closed) und FMB Log blockiert sicherheitsrelevante Vorgänge, bis das Zertifikat wieder vorhanden ist.
- Bewahren Sie den Root‑Private‑Key außerhalb des Repos sicher auf.
- Das Zertifikat ist nicht geheim, aber wichtig für Recovery/Deployment: Sie können es zusätzlich separat sichern.
:::

## Smoke‑Test (nach der Ersteinrichtung)

Diese kurze Checkliste hilft, eine frische Installation in wenigen Minuten zu verifizieren – besonders wichtig vor dem Rollout auf weitere Clients.

### 1) Integritätsschutz / Dateien prüfen

1. Als Admin anmelden.
2. **Administration → Einstellungen → Integritätsschutz**
   - Status muss **„aktiviert (zertifiziert)“** sein.
3. Neben der Hub‑DB müssen (im gleichen Ordner) vorhanden sein:
   - `<db>.integrity.pub.json`
   - `<db>.integrity.dbkey.json`
   - `vaults/<db>.integrity.vault`

::: tip Warum ist das wichtig?
Ohne Zertifikat (dbkey) läuft FMB Log fail‑closed und blockiert sicherheitsrelevante Funktionen. Fehlende Vaults führen zu „Passwort falsch“/DoS‑Symptomen.
:::

### 2) Stammdaten‑Signaturen (FGW/NV/FMK) prüfen

1. **Stammdaten → Freigabewerte (FGW)** öffnen → Tabelle muss ohne Signatur‑Fehler laden.
2. **Stammdaten → Nuklidvektoren** öffnen → NV‑Liste/Detail muss ohne Signatur‑Fehler laden.
3. **Stammdaten → FMK** öffnen → FMK‑Liste/Detail muss ohne Signatur‑Fehler laden.

::: info Hinweis
Bei der Ersteinrichtung signiert FMB Log die vorhandenen Stammdaten automatisch. Wenn hier Fehlermeldungen auftreten, ist meist der Integritätsschutz nicht korrekt aktiv (Zertifikat fehlt/inkonsistent) oder die Datenquelle zeigt auf eine nicht initialisierte DB.
:::

### 3) Delegation (Capability‑Zertifikate) prüfen

1. **Administration → Einstellungen → Stammdaten‑Delegation**:
   - Für den Admin sollten Delegationen für `masterdata.fgw`, `masterdata.nv` und `masterdata.fmk` sichtbar sein.

### 4) Audit / Tagesabrechnung (kurzer Funktionscheck)

1. **Administration → Audit → Audit ausführen**
   - Erwartung: Audit läuft durch und meldet keine kritischen Fehler.
2. **Tagesabrechnung**
   - Vorschau erstellen (mit Testdaten).
   - Optional: **PDF exportieren**.
3. **Administration → Einstellungen → Tagesabrechnung**
   - „RFC3161‑Zeitstempel verpflichtend“ sollte **aktiviert** sein (Default nach Ersteinrichtung).

::: warning Hinweis
Wenn RFC3161 verpflichtend ist, benötigt der PDF‑Export eine Internetverbindung (FreeTSA). Ohne Verbindung schlägt der Export fehl – die Vorschau funktioniert weiterhin.
:::
