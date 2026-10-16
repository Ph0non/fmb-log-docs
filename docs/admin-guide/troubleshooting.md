# Fehlerbehebung

## Verbindung zum Dienst schlägt fehl

Prüfen Sie die WSS-Adresse einschließlich Port und `/v1/transport/ws`, die Systemzeit sowie die von der Administration erhaltene v3-Autoconf. Die Anwendung verbindet sich direkt über TLS 1.3 ohne Proxy/PAC. Die Firewall muss diesen Verkehr zulassen.

Bei abweichendem Zertifikat bricht die Verbindung vor der Anmeldung ab. Die Administration prüft, ob ein bewusster Zertifikatswechsel oder eine falsche Zieladresse vorliegt. Nach einem Wechsel die neue Autoconf importieren. Alte SSH-Konfigurationen benötigen ebenfalls einen v3-Import; lokale Daten bleiben erhalten.

Auf dem Server helfen `systemctl status fmblog-server`, `journalctl -u fmblog-server` und die CLI-Diagnose mit dem Laufzeitkonto. Eine laufende systemd-Unit allein beweist noch keine erfolgreiche API-Anmeldung.

## Offline-Entsperren funktioniert nicht

Offline-Zugriff setzt die erste erfolgreiche Online-Anmeldung auf genau diesem Arbeitsplatz voraus. Nach einer administrativen Zugangswiederherstellung müssen Sie das vorläufige Passwort online ändern und sich erneut anmelden. Nach einem Passwortwechsel auf einem anderen Arbeitsplatz muss dieser Rechner den neuen Vault ebenfalls online abrufen.

Löschen Sie lokale Vaults, Sicherheitsdateien oder Repliken nicht zur Fehlerbehebung. Dort können noch unbestätigte Änderungen liegen.

## Abgleich unterbrochen oder Übernahme abgelehnt

**Lokal gespeichert** bestätigt die Speicherung am Arbeitsplatz. **Zentral bestätigt** bestätigt die Übernahme durch den Dienst. Prüfen Sie die Fehlermeldung und den Zustand des betroffenen Datensatzes; nach behobener Verbindungsstörung können Sie **Jetzt abgleichen** wählen.

Bei einem Konflikt bleiben beide signierten Zweige erhalten. Lösen Sie ihn in der betreffenden Fachansicht durch eine neue signierte Version auf. Bei entzogenen Rechten oder einem widerrufenen Schlüssel muss die Administration den Zugang klären; wiederholtes Senden allein hebt die Ablehnung nicht auf.

Eine Kompatibilitätsmeldung verlangt zueinander passende Client-/Dienstversionen. Bei einem zurückliegenden oder nicht passenden Servernachweis lokale Checkpoints nicht löschen, sondern Datenbankidentität, Generation und Wiederherstellungsstand durch den Betreiber prüfen lassen.

## Nach Reset fehlen bisherige Daten

Ein genehmigter Reset ersetzt den aktiven Fachbestand durch den Stub und wechselt die Generation. Unbestätigte Arbeit der alten Generation liegt unter **Suche → Eigene archivierte Arbeit nach Reset**. Sie wird nicht automatisch in die neue Generation übernommen.

## Originalprotokoll oder PDF nicht offline verfügbar

Nur lokal gespeicherte Originale können offline geöffnet werden. Entfernte bestätigte Messprotokolle werden bei bestehender Verbindung erneut vom Server geladen. Noch nicht übertragene Importdateien befinden sich zunächst auf dem importierenden Arbeitsplatz; dieser muss seine Operation erfolgreich abgleichen.

Die vorgesehene Cache-Bereinigung schützt Originale lokaler, abgelehnter, konfliktbehafteter und archivierter Arbeit. Ein manuelles Löschen der Datenbankdateien umgeht diesen Schutz. PDF- und TSA-Nachweise werden durch die Protokoll-Cache-Funktion nicht entfernt.

## Neue Abrechnung kann nicht abgeschlossen werden

Neue offizielle Abrechnungen benötigen eine Online-Sitzung, einen erreichbaren Dienst und den TSA-Nachweis. Prüfen Sie Hinweise in der Vorschau sowie ausstehende Änderungen und Konflikte. Hat sich die Berechnungsgrundlage inzwischen geändert, muss eine neue Vorschau geprüft und autorisiert werden.

Bei unterbrochener Abschlussantwort verwenden Sie **Abschluss erneut abfragen** für die gespeicherte Anfrage. Erzeugen Sie nicht vorschnell eine zweite Abrechnung. Bereits zentral gespeicherte Dokumente stehen in der **Historie**.

## Signatur oder Integritätsnachweis auffällig

Öffnen Sie den konkreten Treffer unter **Suche und Nachweise** beziehungsweise **Sicherheits-Audit**. Fehlende Originale oder Schlüssel bedeuten einen unvollständigen Nachweis; manipulierte Bytes oder ungültige Signaturen sind Integritätsbefunde. Ein ausdrücklich Root-autorisierter Stub besitzt absichtlich keine Nutzersignatur.

Signieren Sie historische oder fehlerhafte Nachweise nicht pauschal neu, um den Befund zu verbergen. Bewahren Sie Originalbeleg, CID, betroffene Generation und Fehlermeldung für die Klärung auf.

## Desktop-Funktion oder Dateidialog fehlt

Dateidialoge, lokale Vaults, SQLite und der direkte WSS-Transport benötigen die Tauri-Desktop-Anwendung. Ein normaler Browser mit der Entwicklungsoberfläche ersetzt sie nicht. Bei einem nativen Fehler prüfen Entwickler die zugehörigen Tauri-Berechtigungen; Zugangsdaten, private Schlüssel und Sitzungstoken gehören nicht in Fehlerberichte.
