# Suche & Nachweise

Öffnen Sie **Suche** in der Hauptnavigation. Die Suche verwendet den lokal verfügbaren Bestand und zeigt dessen Generation und Veröffentlichungsstand an. Sie umfasst in der aktuellen Generation auch historische Versionen und Konfliktzweige.

## Suchen und eine Version öffnen

1. Den **Suchbereich** wählen: **Aktuelle Generation** oder **Eigene archivierte Arbeit nach Reset**.
2. Fachliche ID, Bezeichnung, Operations-ID, CID oder Signatur eingeben und **Suchen** wählen.
3. Beim gewünschten Treffer **Öffnen** wählen.

Originaldatei-CIDs finden die zugehörigen signierten Versionen. Berechtigte Nutzer finden auch veröffentlichte Abrechnungen über Bericht-ID, Nachweis-CIDs und Autorisierungssignatur. Signaturen verwenden Base64url; bei Signaturpräfixen wird Groß- und Kleinschreibung unterschieden.

Die Detailansicht prüft CID und Nutzersignatur und zeigt Version, Generation, Autor, Schlüssel und vollständige Nutzdaten. Ausgangsversionen, gebundene Stammdaten und gemeinsam signierte Änderungen lassen sich direkt öffnen. Eine gültige Signatur allein bedeutet keine zentrale Übernahme; beachten Sie den angezeigten Zustand.

Mit **Signierte Originaloperation speichern** exportieren Sie die unveränderten Originalbytes. Zugehörige Originaldateien können exportiert werden, sofern sie lokal vorhanden sind. Ein Root-autorisierter Stub wird gesondert ausgewiesen und besitzt keine Nutzersignatur.

## Archivierte Arbeit nach einem Reset

Diese Ansicht enthält eigene lokale Änderungen früherer Generationen. Öffnen und Export verändern den aktiven Bestand nicht; die Operationen werden nicht automatisch erneut übertragen. Nach einem Reset fehlende Originaldateien können nicht aus dem neuen aktiven Serverbestand nachgeladen werden.

## Integritätsprüfungen

Unter **Administration → Audit** startet **Audit ausführen** einen gemeinsamen Prüflauf für Veröffentlichungskette, zentralen Fachbestand, eigene Arbeit und Abrechnungsnachweise. Beim Öffnen der Seite wird noch keine Prüfung gestartet. Eigene Arbeit umfasst auch lokale, konkurrierende, abgelehnte und archivierte Operationen.

Die Veröffentlichungskette wird standardmäßig lokal geprüft. Bei Online-Anmeldung können Sie **Veröffentlichungskette vom Server nachladen** auswählen. Die übrigen Prüfbereiche verwenden die vorhandenen Originaldaten; fehlende Dateien werden dadurch nicht nachgeladen.

Vier Ergebniskarten zeigen Prüfstatus und Zähler. Unter **Details** stehen Prüfstand, Befunde und weiterführende Angaben. Ein Fehler in einem Bereich verhindert die übrigen Prüfungen nicht. Fehlende Originaldateien, Schlüssel oder TSA-Nachweise ergeben einen unvollständigen Nachweis; ungültige Signaturen oder veränderte Originalbytes werden als Befunde gemeldet.

**Versionen und Nachweise** öffnet bei Bedarf die Versionssuche. Ein Befundlink öffnet direkt die betroffene Version im passenden Suchbereich. Die gemeinsame Erfolgsmeldung erscheint nur, wenn alle vier Bereiche ohne Befunde zum gleichen Stand geprüft wurden und sich die Datenrevision nicht geändert hat. Ein später veränderter Stand wird gekennzeichnet; mit **Audit ausführen** prüfen Sie erneut.

Unter **Administration → Audit-Trail** finden online angemeldete Administratoren Sicherheitsänderungen und Zugriffsereignisse. Bereich und Suche grenzen die Ereignisse ein. **Öffnen** zeigt den Nachweis und seinen Prüfstatus; Originalnachrichten und das vollständige Audit-Ereignis lassen sich in den Details aufklappen. Suchregeln und Hinweise zur historischen Reihenfolge stehen unter **Suchhinweise**. Zeitraumfilter und CSV-Export stehen hier derzeit nicht zur Verfügung.
