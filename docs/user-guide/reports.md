# Gebindeabrechnung

Die Gebindeabrechnung erzeugt ein PDF im A4-Querformat mit **Tagesabrechnung – Maximalwerte** und anschließend **Gebindeabrechnung – Details**. Vorschau und PDF verwenden denselben eingefrorenen Datenstand.

## Auswahl und zentraler Abschluss

Neue offizielle Abrechnungen erfordern eine Online-Anmeldung und einen erreichbaren Dienst. Gleichen Sie lokale Änderungen vorher ab und klären Sie konkurrierende Versionen.

1. Unter **Abrechnungen** optional nach FMK filtern und Gebinde sowie Abrechnungsdatum wählen. **Nur vollständig gemessene Gebinde** ist standardmäßig aktiv.
2. **Vorschau erstellen** und beide Teile einschließlich der Hinweise prüfen. Der Dienst erfasst dafür konkrete zentrale Datenversionen.
3. Die Autorisierung genau dieser Vorschau bestätigen und **Signieren, zeitstempeln und zentral abschließen** wählen.
4. Nach zentralem Abschluss das PDF ausgeben beziehungsweise unter **Historie → PDF prüfen und speichern** exportieren.

Einbezogen werden die aktuellen gültigen Messversionen der ausgewählten Gebinde, auch bereits abgerechnete Messungen. Der Dienst prüft Ausgangsstand und Rechte vor Veröffentlichung erneut. Hat sich der Stand geändert, muss eine neue Vorschau geprüft werden.

Bei unterbrochener Abschlussantwort bleibt die autorisierte Anfrage lokal erhalten. **Abschluss erneut abfragen** setzt denselben Vorgang fort, auch nach einem Neustart; eine bereits gespeicherte Abrechnung wird nicht erneut erzeugt. Die Ausgabe erfolgt erst nach zentraler Bestätigung. Eine neue Abrechnung kann offline nicht verbindlich abgeschlossen werden.

Die folgenden Abbildungen zeigen die fachliche Darstellung; ältere Aufnahmen enthalten noch die frühere Exportbeschriftung.

![Vorschau einer Gebindeabrechnung](../screenshots/gebindeabrechnung-vorschau.png)

## Blattaufteilung und Kopfzeilen

Im PDF stehen Logo, mittiger Titelblock und Angaben zu Datum/Prüfung/Seite nebeneinander mit gemeinsamem oberen Abstand. Die Fingerprints stehen im rechten Fußbereich untereinander unmittelbar links vom QR-Code; die Fußnoten stehen links.

Die Hauptüberschriften lauten **Tagesabrechnung** und **Gebindeabrechnung**, ohne Teilnummer oder Datum im Titel. Darunter steht **Maximalwerte** beziehungsweise **Details**. Das Erstellungsdatum bleibt im bisherigen Kopfzeilenblock neben „Geprüft“. Beide Abrechnungen haben eine eigene Seitennummerierung `1/N`, die jeweils über alle zugehörigen Blätter läuft.

Die Blätter werden nach FMK, Charge und Freigabepfad aufgeteilt. **SON und NEM werden zusätzlich nach Stoffklasse getrennt.** Beispiele:

| Blattüberschrift | Umfang |
| --- | --- |
| `F050.01 \| CST` | Alle CST-Stoffklassen dieser Charge |
| `F152.01 \| SON \| SON13` | Nur SON13 |
| `F152.02 \| NEM \| NEM02` | Nur NEM02 |

Pro FMK ist eine Charge je Stoffart erforderlich. Mehrere Chargen derselben Stoffart müssen vor der Abrechnung korrigiert werden. Bestandsdaten bleiben hierfür bearbeitbar.

„Nicht freigabefähig“ bleibt ein eigener Abschnitt; danach folgen die Freigabepfade in FMK-Reihenfolge. Jeder Abschnitt beginnt auf einer neuen Seite. PDF und Vorschau enthalten zuerst alle Tagesabrechnungsabschnitte mit Maximalwerten, danach alle Gebindeabrechnungsabschnitte mit Details in derselben Blattreihenfolge.

**Mischgebinde** erscheinen auf jedem betroffenen Blatt. Die Messwerte bleiben gleich, Reststoffmasse und Gesamtaktivität beziehen sich jeweils ausschließlich auf die zugehörigen Stoffanteile. Die Gebindeanzahlen unterschiedlicher Materialblätter dürfen deshalb nicht zu einer eindeutigen Gesamtgebindeanzahl addiert werden.

## Gebindeabrechnung – Details

Dieser Teil enthält jede ausgewertete Messung. **Masse und Fläche gehören zur Messung**, nicht zum gesamten Gebinde. Die gemeinsame Fußnote steht an erster Stelle (Fußnote **1**):

> gemessene/beprobte Größe, ggf. umgerechnet.

Die Gebindeabrechnung enthält keine Summenzeile.

## Tagesabrechnung – Maximalwerte

Pro Gebinde und Blattabschnitt erscheint **eine maßgebliche Messung**. Ausschlaggebend ist die größere massen- oder flächenspezifische Ausschöpfung:

$$
q = \max\left(\frac{OG_M}{FGW_M},\frac{OG_A}{FGW_A}\right)
$$

Verwendet werden die bereits um KF beziehungsweise SW angepassten, ungerundeten Werte. Alle Messwerte und Faktoren der Zeile stammen aus derselben Messung. Die Mess-ID und das Messdatum machen die Quelle nachvollziehbar. Die Auswahlregel steht als unnummerierter Hinweis **„Auswahl je Gebinde“** direkt unter Zeitraum und NV oberhalb der Tabelle; sie ist keine Fußnote am Untertitel. Bei Gleichstand entscheiden aufsteigend Messzeitpunkt, Mess-ID und Revisionskennung.

Der Untertitel nennt den Zeitraum vom frühesten bis zum spätesten enthaltenen Messdatum sowie die verwendeten Nuklidvektoren. Der Zeitraum umfasst **alle Messungen des Abschnitts**, nicht nur die ausgewählten Maximalwertmessungen.

Die NV-Angabe im Untertitel der Tagesabrechnung nennt nur die Namen (zum Beispiel `NV: A01`), ohne Jahreszusatz. Mehrere Jahresversionen desselben NV werden einmal aufgeführt. Der Messzeitraum enthält weiterhin vollständige Datumsangaben; die tatsächlichen NV-Jahresversionen bleiben in den gespeicherten Daten nachvollziehbar.

### Reststoffmasse und Gesamtaktivität

Die gespeicherten Stoffklassenmassen sind bereits Reststoffmassen nach Abzug der Innentara. Pro Blatt werden nur die zugehörigen Stoffklassenmassen summiert. Es erfolgt kein weiterer Taraabzug und es werden keine zusätzlichen ReVK-Felder benötigt.

Die Fußnote zur Reststoffmasse lautet:

> Reststoffmasse = Nettomasse (Nettomasse ReVK) - Innentara (= Innentara ReVK, wenn vorhanden)

Die zusätzliche Gesamtaktivität wird aus der **angezeigten OG_M einschließlich KF-Anpassung** berechnet. Die Berechnung verwendet den Wert vor Anzeigerundung:

$$
A_{\mathrm{Gebindeanteil}}[\mathrm{Bq}] = OG_M[\mathrm{Bq/g}] \cdot m_{\mathrm{Reststoffanteil}}[\mathrm{kg}] \cdot 1000
$$

Die Zeile am Abschnittsende zeigt **Summe** links, die **Gebindeanzahl** in der Gebindespalte und die **Gesamtaktivität** in ihrer eigenen Spalte. In der Vorschau bleiben diese Abschnittssummen auch bei aktiven Tabellenfiltern erhalten. Die Aktivitätssumme wird aus ungerundeten Zahlen gebildet. Die Tagesabrechnung zeigt die Reststoffmasse. Masse und Fläche der ausgewählten Messung stehen ausschließlich in den Details der Gebindeabrechnung.

### Beispiel einer Mischgebindeabrechnung

Ein Gebinde enthält 10 kg CST und 20 kg SON13. Messung A schöpft massenspezifisch 80 % und flächenspezifisch 20 % aus. Messung B erreicht 50 % beziehungsweise 90 %. **Messung B ist maßgeblich**, weil 90 % die höchste Ausschöpfung ist.

Bei einer angezeigten OG_M von 0,5 Bq/g ergeben sich auf dem CST-Blatt 5.000 Bq und auf dem SON13-Blatt 10.000 Bq. Die beiden Anteile ergeben zusammen 15.000 Bq; die volle Gebindemasse wird nicht auf jedem Blatt erneut angesetzt.

![Maximalwerte im PDF](../screenshots/gebindeabrechnung-pdf.png)

### Fehlende Grundlagen

Nicht berechenbare Werte bleiben als solche gekennzeichnet und werden nicht durch Null ersetzt. Fehlen erforderliche Vergleichswerte einer Messung, wird das ermittelte Maximum als **unvollständig** markiert. Fehlende massenspezifische OG oder eine nicht verfügbare Umrechnung können die Gesamtaktivitätsberechnung verhindern. Betroffene Aktivitätssummen sind als unvollständig gekennzeichnet; ein angezeigter Zahlenwert ist dann nur die Summe der berechenbaren Anteile. Fehlende Messdaten machen auch den Zeitraum unvollständig.

## Indizes und Fußnoten

Die nummerierten Fußnoten beginnen je Abrechnung bei 1 und werden auf Folgeseiten mit derselben Zuordnung wiederholt. Die Markierungen im Tabellenkopf sind kleiner und hochgestellt.

| Abrechnung | Fußnote 1 | Fußnote 2 | Fußnote 3 |
| --- | --- | --- | --- |
| Gebindeabrechnung | Masse und Fläche | OG | — |
| Tagesabrechnung | Reststoffmasse | Gesamtaktivität | OG |

- **M**: massenspezifisch; **A**: flächenspezifisch. OG, FGW, SW und KF tragen diese Indizes.
- **OG** (Fußnote 2 in der Gebindeabrechnung, Fußnote 3 in der Tagesabrechnung): „Obere Grenze Überdeckungsintervall der spez. Aktivität nach DIN 25457-1“.
- **\***: unter Berücksichtigung des Korrekturfaktors (KF).
- **\*\***: unter Berücksichtigung des Schwellenwertes (SW).
- Die Maximalwertauswahl, Aktivitätsformel und anteilige Behandlung von Mischgebinden werden unmittelbar auf der Abrechnung erläutert.

## Historie und Verifikation

Der zentrale Abschluss speichert PDF, Snapshot, Nutzerautorisierung, TSA-Nachweis und die Zuordnung zu den verwendeten Versionen gemeinsam. Der Snapshot enthält die eindeutige Messliste, Berechnungsgrundlagen, Blattzuordnungen, Maximalwerte und verwendeten Jahresentscheidungen. Mehrfachdarstellungen eines Mischgebindes erzeugen keine doppelten Messverknüpfungen. Tagesabrechnung und Gebindeabrechnung bleiben eine gemeinsame PDF-Datei mit identischen DATA- und TSA-Fingerprints auf allen Seiten.

Unter **Historie** öffnen Sie **Daten und Nachweise prüfen** oder **PDF prüfen und speichern**. Bereits lokal vorhandene Dokumente und Nachweise können auch offline geprüft und gespeichert werden. Fehlende Dateien benötigen einen Online-Abruf. Historische Originalnachweise werden nicht durch neue Signaturen oder umgeschriebene Hashverfahren ersetzt.

Änderungen an gebundenen Daten können eine bestehende Abrechnung invalidieren. Mit `reports.invalidate` können Sie sie außerdem mit Begründung manuell ungültig machen. Die Invalidierung wird signiert und vorgemerkt; ihre zentrale Wirkung folgt nach Übernahme. Die Originalabrechnung bleibt als Nachweis erhalten.

Die PDF-Prüfung gilt für die unveränderte Originaldatei. Neu gespeicherte oder eingescannte PDFs besitzen eine andere Inhaltsadresse beziehungsweise Prüfsumme.

Die fachlichen Entscheidungen stehen in [ADR-005: Gebindeabrechnung](../architecture/adr-005-gebindeabrechnung.md), der zentrale Ablauf in [ADR-007](../architecture/adr-007-server-ipld.md). Jahresbezogene Ausnahmen erläutert [FMK – Pfadprüfung je Messjahr](fmk.md#pfadprufung-je-messjahr).
