# Schnellstart

FMB Log arbeitet am Arbeitsplatz mit einem lokalen Datenbestand. Der gemeinsame Bestand liegt auf dem **FMB-Log Server**. Die vertrauten Bereiche für Gebinde, Messungen, Stammdaten und Abrechnungen bleiben die Einstiege für die tägliche Arbeit.

## 1) Arbeitsplatz verbinden

Beim ersten Start wählen Sie **Serververbindung einrichten**. Die Administration stellt drei Angaben bereit:

| Feld | Eingabe |
| --- | --- |
| Serveradresse | Adresse einschließlich Port, etwa `wss://server:2222/v1/transport/ws` |
| TLS-Zertifikat | Öffentliches PEM-Zertifikat aus der vertrauenswürdig erhaltenen v3-Autoconf |
| Öffentlicher Root-Schlüssel | Von der Administration bereitgestellter Base64url-Wert |

Mit **Prüfen und verwenden** wird die Verbindung geprüft und die Anwendung neu geladen. Einen Datenbankpfad oder ein Linux-/SSH-Benutzerkonto benötigen Sie nicht. Den ersten Administrator richtet der Betreiber am Dienst ein; weitere Nutzer legt die Administration in FMB Log an.

## 2) Anmelden

Geben Sie Benutzername und Passwort ein und wählen Sie **Am Server anmelden**. Auf einem neuen Arbeitsplatz ist dafür eine Verbindung zum Dienst erforderlich. Der eigene verschlüsselte Schlüsselspeicher wird abgerufen und lokal entsperrt.

Nach der ersten erfolgreichen Anmeldung können Sie denselben Arbeitsplatz mit **Offline entsperren** verwenden. Bereits geladene Daten und lokal verfügbare Originalprotokolle stehen dann ohne Serververbindung bereit. Neue Passwörter müssen mindestens acht Zeichen haben.

**Bestehenden Zugang aktivieren** ist ausschließlich für zuvor registrierte Altzugänge bestimmt. Dafür werden das bisherige Passwort und die unverändert benannte Nutzer-Vault-Datei benötigt. Ein neu angelegter Zugang verwendet die normale Anmeldung.

## 3) Daten bearbeiten und abgleichen

Die **Übersicht** zeigt den lokal verfügbaren Stand. Sichtbare Bereiche und Aktionen hängen von Ihren Rechten ab.

1. Stammdaten und FMK prüfen beziehungsweise auswählen.
2. Gebinde anlegen oder öffnen.
3. Messprotokolle importieren und Messungen prüfen.
4. Änderungen speichern. Die Anwendung signiert sie und bewahrt sie lokal bis zur Übernahme auf.
5. Bei Verbindung den Abgleich abwarten oder **Jetzt abgleichen** wählen.

**Lokal gespeichert** bedeutet noch keine zentrale Bestätigung. Bei konkurrierenden Änderungen zeigt die Anwendung einen Konflikt; bei fehlenden Rechten oder anderen Übernahmefehlern bleibt die lokale Arbeit zur Klärung erhalten. Details stehen unter [Einstellungen und Synchronisation](./settings.md).

## 4) Verbindlich abrechnen

Für eine neue offizielle Abrechnung müssen Sie online angemeldet sein. Unter **Abrechnungen** wählen Sie die Gebinde und erstellen die Vorschau. Prüfen Sie die Hinweise und autorisieren Sie genau diesen Datenstand. **Signieren, zeitstempeln und zentral abschließen** veröffentlicht die geprüfte Abrechnung auf dem Server.

Erst nach zentralem Abschluss steht das verbindliche PDF zur Ausgabe bereit. Bereits gespeicherte Abrechnungen finden Sie unter **Historie**. Lokal vorhandene PDF- und Nachweisdaten können Sie auch offline prüfen und speichern. Siehe [Gebindeabrechnung](./reports.md).
