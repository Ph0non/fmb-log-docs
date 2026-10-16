# Ersteinrichtung

FMB Log und FMB-Log Server werden getrennt installiert. Der Betreiber richtet den zentralen Dienst ein; die Arbeitsplatzanwendung verbindet sich anschließend mit ihm. Der gemeinsame Bestand liegt in PostgreSQL auf dem Serverdatenträger. Arbeitsplätze erhalten keine SQL-Zugangsdaten.

## Dienst bereitstellen

Die vollständigen Paket-, Rollen-, Migrations- und systemd-Befehle stehen in `server/debian/INSTALL.md` im Repository beziehungsweise in der mitgelieferten Debian-Installationsanleitung. Voraussetzungen sind Debian 13 und PostgreSQL 17. Das Dienstpaket enthält Node.js 24, die Anwendung und den Rust-TSA-Prüfer.

Der Betreiber richtet ein:

1. PostgreSQL-Datenbank und getrennte Laufzeit-, Migrations- und Archivrechte über den Unix-Socket.
2. Dienstadresse und freien TCP-Port sowie die Freigabe für das vorgesehene LAN.
3. Ein dauerhaftes selbstsigniertes ECDSA-P-256-Zertifikat unter `/etc/fmblog/tls/` und dessen vertrauenswürdig verteilte v3-Autoconf.
4. Den öffentlichen Integritäts-Root und das genehmigte kanonische DAG-CBOR-Stub-Manifest.
5. Den ersten Administrator über die CLI `fmblog-server bootstrap` mit einem vorbereiteten, geprüften Nutzerschlüssel und verschlüsselten Vault.
6. Archivhelfer, Diagnose und ausdrücklich aktivierten systemd-Dienst.

Die Bootstrap-Datei enthält Zugangsdaten, muss geschützt sein und wird nach der Einrichtung entfernt. Der private Root-Schlüssel verbleibt am Signierarbeitsplatz. Er gehört weder auf den Server noch in die Arbeitsplatzkonfiguration.

Port 80 ist möglich, wenn dieselbe Server-IP dort noch keinen Listener besitzt. Der Port ist konfigurierbar. Der administrative SSH-Zugang auf Port 22 bleibt davon unabhängig. Die Arbeitsplatzverbindung verwendet direkt WSS/TLS 1.3; prüfen Sie die Freigabe im Zielnetz.

Der Dienst lässt 32 gleichzeitige TCP-Verbindungen je Quell-IP und 64 insgesamt zu; acht API-Aufrufe je Verbindung und höchstens 32 insgesamt werden gleichzeitig bearbeitet. Auch 20 Clients hinter derselben NAT-/VPN-Adresse oder auf einem Terminalserver können dadurch arbeiten. Fachliche Anfragen sind auf 120 je Minute pro geprüfter vollständiger Sitzung begrenzt. Anonyme Anfragen, Anmeldung und Sicherheitsänderungen teilen weiterhin 120 Anfragen je Minute und Quell-IP; Passwortanmeldungen sind zusätzlich auf zehn je Minute und Nutzername begrenzt. Prüfen Sie die tatsächliche Netzstruktur bei der Mehrplatzabnahme.

## Arbeitsplatz verbinden

Die Administration übergibt die unsignierte v3-Autoconf vertrauenswürdig. In FMB Log wählen Sie **Serververbindung einrichten → Autoconf-Datei auswählen** und bestätigen **Prüfen und verwenden**. Ein Zertifikatswechsel erfolgt ausschließlich mit `sudo fmblog-server rotate-tls-certificate` und verlangt einen erneuten Import auf allen Clients; Neustarts und Updates ersetzen das Zertifikat nicht.

Danach erfolgt die Anmeldung mit Benutzername und Passwort. Ein neuer Arbeitsplatz benötigt weder eine gemeinsam geöffnete SQLite-Datei noch einen kopierten Vault-Ordner. Nach der ersten erfolgreichen Anmeldung kann der Nutzer diesen Arbeitsplatz auch offline entsperren. Siehe [Schnellstart](../user-guide/quickstart.md).

## Gruppen, Rechte und Nutzer

Melden Sie sich als Administrator online an und öffnen Sie **Administration → Benutzer und Rechte**. Legen Sie zuerst die benötigten Gruppen mit ihren Berechtigungen an, dann die Nutzer und Gruppenzuordnungen. Für neu gesetzte Passwörter gelten mindestens acht Zeichen.

Bei der Nutzeranlage erzeugt der Client den Schlüssel und den verschlüsselten Vault lokal. Der Server speichert den verschlüsselten Vault und den Passwort-Prüfwert. Einzelheiten stehen unter [Benutzer](./users.md) und [Gruppen & Rechte](./groups-permissions.md).

## Ausgangsbestand und bisherige Testdaten

Ein Reset übernimmt ausschließlich den ausdrücklich genehmigten Stub. Dessen Stammdaten werden als **Root-autorisierter Ausgangsbestand** ausgewiesen; sie erhalten keine vorgetäuschten Nutzersignaturen. Erst eine spätere Bearbeitung erzeugt eine nutzersignierte Folgeversion.

Für bisherige Testdaten gibt es eine einmalige Übernahme in das neue IPLD-Modell. Historische Originale und bekannte Signaturfehler müssen dabei sichtbar erhalten bleiben. Alte Clients und CR-SQLite dürfen nicht parallel in den neuen zentralen Bestand schreiben. Ein Server-Reset ist kein Migrationsverfahren; Ablauf und Schutzumfang stehen unter [Betrieb & Datenbank](./database.md).
