# Verbindung, Synchronisation und lokaler Cache

## Serververbindung

Auf der Anmeldeseite öffnen Sie **Serververbindung ändern** und wählen die v3-Autoconf-Datei Ihrer Administration aus. **Prüfen und verwenden** prüft den Dienst, speichert die Verbindung und lädt die Anwendung neu. Danach melden Sie sich an.

Beispieladresse: `wss://server:2222/v1/transport/ws`. Der Client vertraut genau dem importierten öffentlichen Zertifikat und prüft Servername, Gültigkeit und TLS-Signaturen. Die Verbindung läuft direkt über WSS/TLS 1.3 ohne Proxy/PAC. Manuelle Einrichtung bietet eine Zertifikatsdateiauswahl; Adresse und öffentlichen Root-Schlüssel erhalten Sie ebenfalls von der Administration.

Nach einem ausdrücklich veranlassten Zertifikatswechsel benötigen Sie die neue Autoconf. Bis zum Import lehnt der Client das neue Zertifikat ab. Alte SSH-Konfigurationen benötigen einmalig einen v3-Import. Lokale Daten und ausstehende Änderungen bleiben erhalten. Verwenden Sie ausschließlich vertrauenswürdig erhaltene Dateien.

Ein Netzwerkabbruch meldet Sie nicht ab. Die Anwendung verbindet sich automatisch neu und erneuert eine noch gültige, entsperrte Sitzung. Ein unbekanntes Ergebnis einer Änderung wird nicht blind wiederholt; prüfen Sie nach Wiederverbindung den Serverstand.

## Synchronisationsstatus

Die Oberfläche liest aus der lokalen SQLite-Replik. Bei bestehender Verbindung werden Änderungen nach dem Speichern, beim Wiederverbinden und regelmäßig im Hintergrund abgeglichen. **Jetzt abgleichen** stößt den Abgleich manuell an.

| Zustand | Bedeutung |
| --- | --- |
| Lokal gespeichert | Die signierte Arbeit liegt dauerhaft auf diesem Arbeitsplatz; zentrale Übernahme steht aus. |
| Zentral bestätigt | Der Dienst hat die Operation übernommen. |
| Konflikt | Es gibt konkurrierende Versionen. Eine neue signierte Auflösung muss die betroffenen Zweige einbeziehen. |
| Übernahme abgelehnt | Der Dienst hat die Änderung nicht aktiviert. Die lokale Arbeit und der Fehler bleiben erhalten. |

**Zentral abgeglichen** beschreibt den letzten erfolgreichen Abgleich. **Abgleich unterbrochen** zeigt ein Verbindungs- oder Übernahmeproblem an. Prüfen Sie zusätzlich die Zustände der betroffenen Datensätze.

Nach einer ersten erfolgreichen Online-Anmeldung erlaubt **Offline entsperren** die Arbeit mit dem lokalen Bestand. Änderungen, Import und Signieren bleiben im Rahmen der zuletzt bekannten Rechte möglich. Nutzer-/Rechteverwaltung, Passwortwechsel und neue offizielle Abrechnungen erfordern eine Online-Anmeldung. Der Dienst prüft Rechte bei der späteren Übernahme erneut.

## Protokoll-Cache

Unter **Stammdaten → Lokaler Cache** sehen Sie die lokal vorhandenen Originaldateien und die entfernbaren Messprotokolle. **Bestätigte Protokolle aus Cache entfernen** entfernt nach Bestätigung nur dafür freigegebene lokale Protokolle. Für den erneuten Abruf ist eine Serververbindung erforderlich.

Originale aus ausstehenden, abgelehnten, konfliktbehafteten oder archivierten Änderungen sowie noch nicht zugeordnete Importdateien bleiben geschützt. PDFs, Zeitstempel, signierte Datenversionen und Versandwarteschlange werden nicht bereinigt. Die Größen beziehen sich auf Originalbytes; freier Platz innerhalb der SQLite-Datei wird für neue Daten wiederverwendet.

Löschen Sie lokale Datenbank-, Vault- oder Sicherheitsdateien nicht manuell als Ersatz für diese Funktion. Insbesondere enthält die lokale Replik auch Arbeit, die auf dem Server noch nicht vorhanden ist.

## Nach einem zentralen Reset

Die Anwendung prüft den Reset-Nachweis, archiviert unbestätigte Arbeit der alten Generation und lädt den neuen Bestand. Alte Operationen werden nicht automatisch erneut übertragen. Unter **Suche → Eigene archivierte Arbeit nach Reset** können Sie diese Arbeit öffnen und ihre Originaloperation exportieren.
