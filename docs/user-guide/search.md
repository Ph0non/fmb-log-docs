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

## Konflikte auflösen

Unter **Administration → Konflikte** steht jeder betroffene Eintrag einmal mit der Anzahl seiner Fassungen. **Unterschiede prüfen** öffnet den Vergleich im passenden Editor. Dieser Ablauf gilt für FMK, SW/KF-Jahresfaktoren, Nuklidvektoren, Freigabewerte, Gebinde und Messungen.

1. Eine **Ausgangsfassung** wählen. Standardmäßig werden nur unterschiedliche fachliche Werte angezeigt; gleiche Werte können eingeblendet werden.
2. Je Feld den gewünschten Wert auswählen. Zusammengehörige Angaben wie Referenzen, Pfadbestätigungen und importierte Messursprungsdaten werden gemeinsam übernommen.
3. **Auswahl übernehmen** wählen. Die Auswahl steht jetzt als Entwurf im gewohnten Formular und kann dort weiterbearbeitet werden. Fachliche Prüfungen gelten auch für zusammengestellte Werte, etwa die Summe der Nuklidanteile.
4. **Konflikt auflösen** wählen. Bei einer Löschung ist zusätzlich die Löschung zu bestätigen. Die Historie bleibt erhalten.

Eine lokal gespeicherte Auflösung bleibt bis zum erfolgreichen Abgleich ausstehend. Gibt es noch nicht übertragene eigene Änderungen, verwenden Sie zuerst **Jetzt abgleichen**. Fehlen Rechte oder muss zuerst die übergeordnete FMK beziehungsweise das Gebinde geklärt werden, zeigt der Editor den Grund.

Wenn sich die konkurrierenden Fassungen während der Bearbeitung ändern, bleibt der Entwurf erhalten und das Speichern wird gestoppt. **Vergleich neu laden** führt durch die Rückfrage zu ungespeicherten Eingaben, bevor der neue Vergleich geöffnet wird. Versionskennungen und vollständige Ursprungsdaten stehen bei Bedarf unter **Technische Details**.

## Integritätsprüfungen

Unter **Administration → Audit** startet **Audit ausführen** einen gemeinsamen Prüflauf für Veröffentlichungskette, zentralen Fachbestand, eigene Arbeit und Abrechnungsnachweise. Beim Öffnen der Seite wird noch keine Prüfung gestartet. Alle vier Prüfbereiche betreffen ausschließlich die aktuelle Generation. Eigene Arbeit umfasst lokale, konkurrierende und abgelehnte Operationen dieser Generation. Nach einem Reset bildet dessen Root-signierter Beleg den Startpunkt der Veröffentlichungskette; frühere Abrechnungsnachweise werden nicht mehr benötigt.

Die Veröffentlichungskette wird standardmäßig lokal geprüft. Bei Online-Anmeldung können Sie **Veröffentlichungskette vom Server nachladen** auswählen. Die übrigen Prüfbereiche verwenden die vorhandenen Originaldaten; fehlende Dateien werden dadurch nicht nachgeladen.

Vier Ergebniskarten zeigen Prüfstatus und Zähler. Unter **Details** stehen Prüfstand, Befunde und weiterführende Angaben. Ein Fehler in einem Bereich verhindert die übrigen Prüfungen nicht. Fehlende Originaldateien, Schlüssel oder TSA-Nachweise ergeben einen unvollständigen Nachweis; ungültige Signaturen oder veränderte Originalbytes werden als Befunde gemeldet.

**Versionen und Nachweise** öffnet bei Bedarf die Versionssuche. Ein Befundlink öffnet direkt die betroffene Version im passenden Suchbereich. Die gemeinsame Erfolgsmeldung erscheint nur, wenn alle vier Bereiche ohne Befunde zum gleichen Stand geprüft wurden und sich die Datenrevision nicht geändert hat. Ein später veränderter Stand wird gekennzeichnet; mit **Audit ausführen** prüfen Sie erneut.

Unter **Administration → Audit-Trail** finden online angemeldete Administratoren Sicherheitsänderungen und Zugriffsereignisse. Bereich und Suche grenzen die Ereignisse ein. **Öffnen** zeigt den Nachweis und seinen Prüfstatus; Originalnachrichten und das vollständige Audit-Ereignis lassen sich in den Details aufklappen. Suchregeln und Hinweise zur historischen Reihenfolge stehen unter **Suchhinweise**. Zeitraumfilter und CSV-Export stehen hier derzeit nicht zur Verfügung.
