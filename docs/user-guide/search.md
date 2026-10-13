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

Der Bereich **Veröffentlichungskette prüfen** bietet die Prüfung des zentralen Log-Nachweises. Ergänzend können der zentrale Fachbestand und **Eigene gespeicherte Arbeit** geprüft werden. Letzteres umfasst auch lokale, konkurrierende, abgelehnte und archivierte Operationen.

Fehlende Originaldateien oder Schlüssel ergeben einen unvollständigen Nachweis. Ungültige Signaturen oder veränderte Originalbytes werden als Befunde gemeldet; betroffene Versionen lassen sich öffnen. Ein gespeicherter Prüfstand kann durch spätere Änderungen veralten. Abrechnungs-/TSA-Nachweise prüfen Sie gesondert in der **Historie**, Sicherheitsänderungen im **Sicherheits-Audit**.
