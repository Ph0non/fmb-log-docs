# Betrieb & Datenbank

## Speicherorte und Zuständigkeiten

| Bestandteil | Inhalt und Aufgabe |
| --- | --- |
| PostgreSQL auf dem Server | Zentraler Bestand, kanonische Originaloperationen, Signaturen, Objekte, Abrechnungen, Sicherheits- und Reset-Historie |
| Lokale SQLite-Replik | Ansichten für die Oberfläche, geladene Originale und dauerhaft gespeicherte lokale Operationen |
| Lokaler Sicherheitsbereich | Verschlüsselte Zugangsdaten und bestätigte Generations-/Logstände, getrennt vom löschbaren Cache |
| Lokale Reset-Archive auf dem Server | Geprüfter Export des Bestands vor einem ausgeführten Reset |

PostgreSQL ist ausschließlich für den Dienst und die administrativen Rollen erreichbar. Clients verbinden sich über die authentifizierte API im direkten SSH-Kanal. Die neuen lokalen Repliken verwenden keine CR-SQLite-Synchronisation und werden nicht gemeinsam über ein Netzlaufwerk geöffnet.

## Versionen und Synchronisation

Änderungen erzeugen unveränderliche, signierte Operationen. Diese binden Datenbank, Generation, Autor, Operations-ID, Ausgangsversionen und benötigte Referenzen. Strukturierte Daten verwenden kanonisches DAG-CBOR mit echten IPLD-Verknüpfungen; neue CIDs sind CIDv1 mit BLAKE3 und 32-Byte-Digest. Originaldateien und PDFs erhalten eine CID aus ihren unveränderten Bytes.

Der Server prüft Berechtigungen und Ausgangsversionen in derselben Transaktion wie die Übernahme. Zusammengehörige Änderungen und Abrechnungsinvalidierungen werden gemeinsam veröffentlicht. Ein transaktional gesperrter Veröffentlichungsstand verhindert, dass Clients später commitende Transaktionen überspringen.

Konkurrierende Versionen bleiben erhalten. Eine Konfliktauflösung ist eine neue signierte Operation mit Verweisen auf die betroffenen Zweige. Eine Wiederholung derselben gültigen Operation erzeugt keine zusätzlichen Historieneinträge. Abgelehnte Arbeit bleibt lokal zur Klärung verfügbar.

Die lokale Replik ist deshalb nicht vollständig entbehrlich: Ihre Outbox kann Originale enthalten, die noch nirgendwo sonst gespeichert sind. Verwenden Sie zum Entfernen heruntergeladener Protokolle die [Cache-Funktion](../user-guide/settings.md), nicht das manuelle Löschen von Replikdateien.

## Diagnose und Updates

`systemctl status fmblog-server`, `journalctl -u fmblog-server` und `fmblog-server diagnose` liefern Dienst- und Datenbankdiagnose. Die CLI-Diagnose läuft mit dem vorgesehenen Laufzeitkonto und dessen PostgreSQL-Verbindungsparametern. Sie prüft unter anderem freien Speicher, Transaktionsfehler, lange Transaktionen und die TSA-Prüfpolicy.

Ein Paketupgrade stoppt und deaktiviert den Dienst vor dem Dateiaustausch. Danach werden Konfiguration, Migrationen und Datenbankrechte geprüft beziehungsweise angewendet; der Betreiber startet den Dienst ausdrücklich wieder. Ein Paket-Downgrade macht SQL-Migrationen nicht rückgängig. Die genauen Befehle stehen in `server/debian/INSTALL.md`.

Dienst- und Clientversionen müssen kompatibel sein. Bei einer Kompatibilitätsmeldung beide Paketstände prüfen; lokale Arbeit erhalten, bis der Client wieder mit dem Dienst synchronisieren kann.

## Root-autorisierter Reset

Unter **Administration → Reset** erstellt ein online angemeldeter Administrator eine Vorschau mit signierbarer Anforderung. Diese bindet Datenbank und Dienst, Daten-/Sicherheitsstand, alte und neue Generation, Stub-CID, Umfang, Administrator, Nonce, Begründung und Ablaufzeit. Die Freigabe gilt höchstens 24 Stunden; Änderungen am gebundenen Stand machen sie unbrauchbar.

1. Vorschau und Stub prüfen und die Anforderung exportieren.
2. Die Anforderung außerhalb des Servers mit dem Root-Schlüssel signieren; siehe [Root-Freigabe](./server-reset-signing.md).
3. Die Autorisierung in FMB Log einlesen, prüfen und die Ausführung ausdrücklich bestätigen.
4. Der Dienst sperrt Schreiboperationen, exportiert den Bestand und stellt das Archiv in einer isolierten temporären Datenbank wieder her. Erst nach erfolgreichem Manifestvergleich darf der Reset committen.
5. Der Dienst übernimmt den Stub und die neue Generation atomar und speichert den Reset-Beleg. Der Client prüft anschließend den Generationswechsel.

Erhalten bleiben Nutzer, Gruppen, Mitgliedschaften, Rechte, Passwort-Prüfwerte, verschlüsselte Vaults, Schlüssel und ihre Nachweise, Datenbankidentität sowie Sicherheits- und Reset-Historie. Fachbestand, Abrechnungen, Konflikte und aktive fachliche Historie werden zurückgesetzt; Stammdaten kommen aus dem genehmigten Stub. Stub-Standardgruppen überschreiben keine bestehenden Rechte.

Bei Archivfehlern erfolgt kein Reset. Nach einem unbekannten Ergebnis den vorhandenen Vorgang anhand seiner Kennung nachschlagen. Ein hängender Reset wird erst nach Dienststopp und Prüfung durch das Migrationskonto mit `fmblog-server recover-reset` freigegeben. Wiederholte Status- oder Ausführungsanfragen ersetzen keine Prüfung des gespeicherten Belegs.

Alte Clients können keine Operationen in die neue Generation übernehmen. FMB Log archiviert unbestätigte lokale Arbeit der alten Generation separat; sie bleibt über die Archivsuche zugänglich und wird nicht automatisch wieder eingespielt.

## Grenzen der Sicherung

Lokale Reset-Archive gehören zur Reset-Funktion. Externe Backups, Netzlaufwerksicherung, Hochverfügbarkeit und deren Automatisierung sind in dieser Ausbaustufe nicht enthalten. Der Verlust des Serverdatenträgers kann auch diese Archive zerstören. Unbestätigte Arbeit auf getrennten Arbeitsplätzen ist nicht Bestandteil eines Serverarchivs.
