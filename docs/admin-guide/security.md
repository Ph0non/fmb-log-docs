# Sicherheitsarchitektur

Im Serverbetrieb entscheidet der zentrale Dienst über Anmeldung, Rechte und Übernahme. PostgreSQL ist über den lokalen Unix-Socket nur für die vorgesehenen Dienst- und Administrationsrollen erreichbar. Die Arbeitsplatzanwendung erhält keine SQL-Zugangsdaten und verarbeitet ihre lokale SQLite-Replik.

## Drei unterschiedliche Schlüsselaufgaben

| Schlüssel | Aufgabe |
| --- | --- |
| SSH-Hostschlüssel des Dienstes | Verschlüsselte Verbindung und Prüfung des erwarteten Servers anhand des hinterlegten Fingerabdrucks |
| Nutzerschlüssel im verschlüsselten Vault | Signatur der eigenen Operationen und Nachweis des Schlüsselbesitzes bei der Anmeldung |
| Integritäts-Root | Autorisierung eines genau gebundenen Resets; nur sein öffentlicher Schlüssel liegt auf dem Server und im Client |

Ein gültiger SSH-Fingerabdruck ersetzt keine Nutzeranmeldung. Eine gültige Nutzersignatur ersetzt keine aktuelle Berechtigung. Eine Root-Freigabe ersetzt keine aktuelle Administrator-Sitzung.

## Passwort, Vault und Sitzung

Die Anmeldung überträgt Benutzername und Passwort im direkten verschlüsselten SSH-Kanal. Der Dienst prüft einen gesalzenen Argon2id-Prüfwert. Die zunächst eingeschränkte Sitzung erlaubt ausschließlich den Abruf des eigenen verschlüsselten Vaults. Erst nach lokaler Entschlüsselung und Antwort auf eine einmalige Signatur-Challenge entsteht die vollständige Sitzung.

Der private Nutzerschlüssel wird nicht im Klartext an den Server gesendet. Anmeldung und sensible Endpunkte sind begrenzt; Passwörter, private Schlüssel und Sitzungstoken gehören nicht in Logs. Neue und geänderte Passwörter benötigen mindestens acht Zeichen. Die Aktivierung zuvor registrierter Altzugänge erlaubt das bisherige Passwort und verlangt den Nachweis mit dem bisherigen Vault.

Ein Passwortwechsel aktualisiert Server-Prüfwert und neu verschlüsselten Vault atomar. Gleichzeitige Sicherheitsänderungen werden über eine Sicherheitsversion erkannt. Bei unklarer Abschlussantwort wird der Zustand online geklärt; lokale Zugangsdaten dürfen dafür nicht gelöscht werden.

## Rechte und Offline-Zugriff

Nutzer, Gruppen, Mitgliedschaften, Rechte und Schlüssel werden online verwaltet. Der Dienst prüft die aktuellen Rechte erneut, wenn eine fachliche Operation übernommen oder eine Abrechnung veröffentlicht wird. Ein Widerruf verhindert neue Übernahmen mit dem betroffenen Schlüssel, ohne historische Signaturen umzuschreiben.

Nach der ersten erfolgreichen Anmeldung kann der lokale Vault offline entsperrt werden. Ein bereits getrennter Arbeitsplatz kennt nur seine zuletzt bestätigten Rechte. Zentraler Widerruf oder Passwortwechsel können einen solchen Arbeitsplatz nicht sofort sperren. Bei der nächsten Verbindung gelten die aktuellen zentralen Regeln; abgewiesene Arbeit bleibt lokal erhalten.

Bei einer administrativen [Zugangswiederherstellung](./users.md) werden aktive alte Schlüssel widerrufen und ein neuer Schlüssel samt Vault angelegt. Der Nutzer muss das vorläufige Passwort online ändern. Unbestätigte Arbeit mit alten Schlüsseln wird dadurch nicht nachträglich autorisiert.

## Signierte Originale und Inhaltsadressen

Fachliche Operationen verwenden das gemeinsame versionierte Protokoll mit kanonischem DAG-CBOR. Verweise auf andere Versionen sind IPLD-Links. Signiert wird die Nutzlast einschließlich Protokollkennung, Datenbank, Generation, Operations-ID, Autor, Ausgangsversionen, Referenzen und Änderungen. Die CID der vollständigen Hülle umfasst auch die Signatur.

Neue Inhaltsadressen verwenden CIDv1 und BLAKE3 mit 32-Byte-Digest: DAG-CBOR für strukturierte Daten, `raw` für Originaldateien und PDFs. Die kleingeschriebene Base32-Darstellung ist die Textform. Eine Speicherkompression ändert die CID des Originals nicht. Historische SHA-256-/DATA-/TSA-Nachweise werden nicht auf ein anderes Verfahren umgeschrieben.

PostgreSQL erhält die kanonischen Originalbytes. Relationale Tabellen liefern daraus Ansichten; Typkonvertierungen ersetzen keine signierten Originale. Bearbeitung erzeugt eine neue Version. Konkurrierende Zweige werden ausdrücklich aufgelöst und nicht anhand des jüngsten Zeitstempels überschrieben.

## Veröffentlichungen und Nachweise

Die Übernahme sperrt den Veröffentlichungsstand innerhalb der Transaktion. Dadurch entspricht der Synchronisationscursor der tatsächlich veröffentlichten Reihenfolge. Ein normaler Sequenzzähler allein würde diese Eigenschaft nicht garantieren.

Clients bewahren bestätigte Generation und Logspitze zusätzlich außerhalb des bereinigbaren Caches auf. Eigene Repliknachweise pro Nutzer erlauben ältere Offline-Bestände; vor einem Push muss der Server trotzdem den gemeinsam bereits bekannten Stand erreichen. Ein zurückliegender Server wird nicht durch Löschen dieser Nachweise akzeptabel.

Unter **Suche** lassen sich fachliche Versionen, Konfliktzweige und eigene archivierte Arbeit öffnen. **Administration → Audit** bündelt die Prüfungen der Veröffentlichungskette, des zentralen Fachbestands, eigener Arbeit und der Abrechnungs-/TSA-Nachweise in einem manuell gestarteten Lauf. Die vier Bereiche behalten ihren jeweiligen Prüfstatus und Prüfstand; Teilfehler oder unterschiedliche Datenstände ergeben keine gemeinsame Erfolgsmeldung. Unter **Administration → Audit-Trail** stehen online angemeldeten Administratoren Sicherheitsänderungen und Zugriffsereignisse mit einzeln prüfbaren Nachweisen zur Verfügung. Diese Ereignisprüfung ist nicht Teil des gemeinsamen Audit-Laufs.

Fehlende Originale oder Schlüssel bedeuten einen unvollständigen Nachweis. Ungültige Signaturen und veränderte Originalbytes ergeben Integritätsbefunde. Root-autorisierte Stub-Daten sind als solche gekennzeichnet und besitzen keine erfundene Nutzersignatur.

## Reset und Schutzgrenzen

Ein [Reset](./database.md#root-autorisierter-reset) verlangt aktuelle Administratorrechte und eine einmalige Root-Autorisierung des konkreten Daten- und Sicherheitsstands. Ein konsistenter Export mit isolierter Wiederherstellungsprüfung geht dem Reset voraus. Sicherheitsbestand und Reset-Historie bleiben erhalten; alte lokale Arbeit wird separat archiviert.

Signaturen erkennen Änderungen an gebundenen Inhalten, verhindern aber nicht deren Löschung oder den Verlust eines Datenträgers. Ein kompromittierter entsperrter Arbeitsplatz kann den dort verfügbaren Schlüssel missbrauchen. Betriebssystemzugriff, Zugangswiederherstellung und Schlüsselwiderruf bleiben deshalb administrative Aufgaben. Lokale Reset-Archive ersetzen keine externe Sicherung; deren Automatisierung und Hochverfügbarkeit gehören nicht zu dieser Ausbaustufe.
