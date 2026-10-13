# ADR-007: PostgreSQL-Dienst mit IPLD und lokalem Offline-Bestand

Status: angenommen und implementiert; die noch offenen Betriebsabnahmen sind in `server/README.md` dokumentiert. Diese Entscheidung ersetzt die Datei-Hub-/CR-SQLite-Architektur aus ADR-001 bis ADR-003 für den neuen Serverbetrieb. Fachliche Berechnungs- und Darstellungsentscheidungen bleiben davon unabhängig.

## Aufgabenverteilung

FMB Log bleibt die Desktop-Anwendung für Bedienung, lokale SQLite-Datenhaltung, Offline-Bearbeitung, Import, Nutzersignaturen und Administration. FMB-Log Server verwendet TypeScript/Fastify, Node.js 24 und PostgreSQL über `pg`. Gemeinsame Module liefern Datenvalidierung, Berechnung und PDF-Erzeugung; der Rust-TSA-Prüfer wird mit dem Serverpaket ausgeliefert.

PostgreSQL und Dienst laufen zunächst gemeinsam auf Debian 13. PostgreSQL ist nur über den Unix-Socket für die vorgesehenen Dienst-/Administrationsrollen erreichbar. Clients erhalten keine SQL-Zugangsdaten. Die neuen Repliken verwenden keine CR-SQLite-Synchronisation.

## Datenformat und Übernahme

Strukturierte Originale verwenden kanonisches DAG-CBOR mit nativen IPLD-Links, CIDv1, BLAKE3 und 32-Byte-Digest. Dateien und PDFs verwenden `raw`. Die Signatur bindet die Nutzlast mit versionierter Protokollkennung; erst die vollständige signierte Hülle erhält ihre eigene CID. Historische Verfahren und Nachweise bleiben unverändert.

Zusammengehörige Änderungen werden als atomare Operation gespeichert. Lokale Operation und Outbox werden dauerhaft gemeinsam abgelegt. Der Server prüft Berechtigungen und Ausgangsversionen innerhalb derselben Transaktion wie Übernahme und Veröffentlichung. Ein transaktional gesperrter Veröffentlichungsstand schützt die Cursorreihenfolge.

Konkurrierende Versionen bleiben erhalten. Konfliktauflösung erzeugt eine neue signierte Version mit ausdrücklichen Verweisen auf die aufgelösten Zweige. Wiederholung derselben Operation ist idempotent. Der Client bewahrt abgelehnte und unbestätigte Arbeit auf.

## Transport und Anmeldung

Aufgrund der Proxybedingungen im vorgesehenen Netz verwendet die aktuelle Umsetzung einen direkten SSH-Kanal mit fest konfiguriertem Ed25519-Hostschlüssel. Der Port ist frei konfigurierbar; Port 80 ist möglich, sofern frei und für SSH zugelassen. HTTP-/HTTPS-Proxy und PAC sind nicht beteiligt. Bei Sperre oder falschem Schlüssel gibt es keinen Transport-Fallback.

Im Kanal laufen Passwortprüfung, Abruf ausschließlich des eigenen verschlüsselten Vaults und eine einmalige Signatur-Challenge. Der private Nutzerschlüssel wird lokal entsperrt. Sicherheitsänderungen sind online und versioniert. Offline sind nur zuletzt bestätigte Rechte bekannt; bei der Übernahme entscheidet erneut der Server.

## Abrechnung und Reset

Neue offizielle Abrechnungen verlangen einen erreichbaren Dienst. Dieser erstellt einen geprüften Snapshot, empfängt Nutzerautorisierung und TSA-Nachweis und erzeugt das PDF. Externe TSA-Anfragen und PDF-Erzeugung halten keine Datenbanktransaktion offen. Vor dem atomaren Abschluss werden Ausgangsstand und Rechte erneut geprüft.

Ein Reset bindet per einmaliger Root-Signatur den konkreten Stand und den genehmigten Stub. Erst nach Export, isolierter Wiederherstellung und Manifestvergleich wird der Fachbestand atomar zurückgesetzt. Sicherheitsbestand und Reset-Historie bleiben erhalten. Clients archivieren alte unbestätigte Arbeit, bevor die neue Generation aktiv wird.

## Konsequenzen

IPLD allein würde keinen zentralen Dienst erzwingen. Der Dienst ist hier wegen zentral verbindlicher Rechte, Transaktionen, Abrechnungen und Reset-Autorisierung gewählt. Eine Variante ohne Dienst wäre eine andere Betriebs- und Vertrauensarchitektur.

Die Anwendung bleibt offline bearbeitbar; zentrale Freigaben erfordern Verbindung. Externe Backups und Hochverfügbarkeit sind nicht enthalten. Lokale Reset-Archive schützen nicht vor Verlust des Serverdatenträgers. Die schwache Abnahme-VM blockiert bei verfehltem Leistungsziel nicht die Funktionsintegration; der vorgesehene Server und das tatsächliche Zielnetz benötigen eigene Abnahme. Rust-Auslagerungen werden nur für belegte, lohnende Engpässe erwogen.
