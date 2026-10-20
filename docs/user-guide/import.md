# Import (RPT und MicroCont 2)

Unter **Import** übernehmen Sie RPT-Protokolle der Gammaspektrometrie und CSV-Dateien des MicroCont 2 in die Datenbank. Auch neue Importrevisionen bestehender Messungen werden ausschließlich hier eingelesen. Der Import ist so gestaltet, dass er sowohl für den täglichen Betrieb (schnell mehrere Dateien übernehmen) als auch für Nachweise funktioniert (Originalprotokoll bleibt archiviert).

## Was passiert beim Import?

Beim Import liest FMB Log die RPT-Datei ein, extrahiert die für die Auswertung relevanten Inhalte (u. a. Messzeitpunkt, ISO-11929-Werte) und speichert zusätzlich das **Originalprotokoll** im Archiv.

## Ablaufdiagramm

![Ablauf (Import)](../diagrams/import-flow.svg)

## Schritt-für-Schritt

Wählen Sie ein bestehendes Gebinde oder legen Sie über **Neues Gebinde** eines an. Bei bestehenden Gebinden sehen Sie die gespeicherten Stammdaten einschließlich Herkunft, Datenblatt, FMK, Stoffmassen, Gebindemasse und gegebenenfalls Gebindeoberfläche.

Abgeschlossene Gebinde stehen nicht als Importziel zur Verfügung. Das gilt auch für neue Importrevisionen. Speichern Sie das Gebinde zuerst wieder als **unvollständig**. Über **Weitere Messungen importieren** im Gebinde gelangen Sie zum Import mit vorausgewähltem Ziel. Ungespeicherte Änderungen werden dabei berücksichtigt.

::: warning Hinweis
Beim Import werden Stammdaten eines bestehenden Gebindes **nicht** geändert – Aktualisierungen erfolgen im Menü **Gebinde**. Zum Anlegen eines weiteren Gebindes verwenden Sie **Neues Gebinde**.
:::

Wählen Sie das **Messgerät** (Gammaspektrometrie oder MicroCont 2) und ergänzen Sie die Parameter für die Messungen. **Masse [kg] (Messungen)** und **Fläche [m²] (Messungen)** sind von der Gebindemasse und Gebindeoberfläche getrennt. Die Vorgaben werden beim Einlesen auf die neuen Messungen angewendet. Bei einer neuen Revision gelten die bisherigen Messungsdaten. Das Messgerät kann geändert werden, solange kein Import vorbereitet ist.

Bei der Auswahl eines Gebindes werden Masse und Fläche der zuletzt angelegten aktuellen Messung ohne offenen Konflikt vorbelegt. Die Auswahl **MicroCont 2** trägt **177 cm² = 0,0177 m²** ein; der Wert bleibt editierbar.

Eine im RPT enthaltene Probenmenge wird als Messungsmasse oder Messungsfläche übernommen, wenn das entsprechende Feld leer ist. Unterstützt werden g, kg, cm² und m². Bereits eingetragene Werte werden nur nach Ihrer Auswahl im gemeinsamen Mengendialog ersetzt. **Abbrechen** behält die bisherigen Werte. Nicht unterstützte Mengen erscheinen als Hinweis in der Vorschau. Gebindestammdaten bleiben davon unberührt.

![Import (RPT)](../screenshots/import.annotated.png)

Die eigene Card **Dateien und Importvorschau** zeigt nach der Auswahl die Dateien mit Messdatum, Mess-ID, Radionukliden, Aktivität (BS), Vergleichswert (OG), Einheit, Aktion und Status. Bei MicroCont 2 werden zusätzlich Messpunkte, Gebindezuordnung und effektiver Wirkungsgrad angezeigt. **Prüfen** öffnet die Messdaten der betreffenden Zeile; **Entfernen** nimmt sie aus dem vorbereiteten Import. Die **Importaktion** bietet neue Messung, Überspringen oder eine bestehende Messung als Revisionsziel an. **Vergleichen** zeigt die bisherigen und vorbereiteten Werte. Änderungen an Datum, Messdaten oder Zuordnungen aktualisieren die Vorschau.

Falls im Protokoll Messwerte in unterschiedlichen Einheiten vorkommen (z. B. massenspezifisch vs. oberflächenspezifisch), kann eine **Umrechnung** über $g/cm^2$ hinterlegt werden. Diese wird genutzt, um Werte zwischen $Bq/g$ und $Bq/cm^2$ umrechnen zu können.

Anschließend wählen Sie die zum Messgerät passenden Dateien aus. Die Dateiauswahl unterstützt **Mehrfachauswahl** – weitere Auswahlen werden **zur Liste hinzugefügt**, nicht ersetzt.

Für jede neue Messung schlägt FMB Log automatisch eine **Mess-ID** vor. Sie können diese vor dem Speichern anpassen. Für eine neue Revision wählen Sie ausdrücklich die bestehende Messung aus.

## Neue Messungen und Importrevisionen

Für neue Messungen bleibt **Neue Messungen** ausgewählt. Mehrere Dateien können gemeinsam eingelesen und gespeichert werden; weitere Auswahlen ergänzen die vorbereitete Liste. Die vorgeschlagenen Mess-IDs können Sie vor dem Speichern prüfen und anpassen.

Für einen Re-Import wählen Sie im selben Bereich die bestehende Messung des gewählten Gebindes und anschließend **Neue Importrevision einlesen**. Das neue Protokoll wird als Revision derselben Messung gespeichert. Frühere Revisionen und Originalprotokolle bleiben erhalten. Ein bereits bekanntes Original wird beim Erstimport nicht versehentlich ein zweites Mal angelegt.

Beim Wechsel von Gebinde oder Messung bleiben ungespeicherte Eingaben geschützt: Sie können weiterarbeiten oder den Entwurf ausdrücklich verwerfen.

Nach dem Speichern bleibt das **Importergebnis** sichtbar. Es unterscheidet übersprungene Dateien, lokal gespeicherte Messungen mit ausstehender Serverbestätigung und abgeglichene Messungen. Gleichzeitige lokale Änderungen lösen ein automatisches erneutes Laden aus; bereits eingegebene Werte bleiben erhalten.

Unter **Gebinde** stehen die ISO-11929-Werte beziehungsweise MC2-Messpunkte neben dem Originalprotokoll. Bei MC2 werden die effektive Messeffizienz und der höchste OG-Wert angezeigt; gespeicherte Messungen verwenden ihre gebundene FMK- und Nuklidvektorfassung.

## MicroCont-2-Messzeiten und Messprotokoll

Die CSV enthält keine Messdauern. Der Import belegt **Messzeit mit 10 s** und **Nulleffektmesszeit mit 100 s** vor. Beide Werte sind vor dem Einlesen und in der Importvorschau editierbar. Unter **Abweichende Zeiten einzelner Punkte** lassen sich Ausnahmen erfassen; Änderungen der gemeinsamen Zeiten erhalten diese Ausnahmen. Nur endliche Werte größer null sind zulässig. Die Zeiten werden mit der Messrevision signiert. Nachträgliche Änderungen erfolgen über eine neue Importrevision; ältere Messungen behalten ihre bisherigen 10/100 s.

Die Berechnung verwendet die bisherigen nuklidspezifischen Messeffizienzen: Co-60 28 %, Co-57 6 %, Cs-137 38 %, C-14 14 %, Cl-36 36,5 %, Fe-55 0,5 %, Ni-63 3 % und Sr-90 42,5 %. Andere Nuklide tragen mit 0 % bei. Geometriefaktor und Kalibrier-Geometriefaktor betragen jeweils 0,74, die relative Kalibrierunsicherheit 0 und Alpha, Beta sowie Gamma jeweils 0,05. Eine Geräte- oder Kalibrierverwaltung ist damit nicht verbunden.

Bei gespeicherten MC2-Messungen lädt **MC2-Messprotokoll** ein eigenständiges PDF für die gewählte Fassung herunter. Es enthält Nettoaktivität und Unsicherheit, Erkennungs- und Nachweisgrenze, besten Schätzwert und Unsicherheit sowie beide Vertrauensgrenzen in Bq/cm². Der Rohwertanhang enthält alle Punkte mit Mess- und Nulleffektzeitpunkt, beiden Messdauern, Impulsraten und Detektorfläche. Die Ausgabe nennt die verwendeten Parameter und lässt Felder für Erstellung und Prüfung frei. Historische Fassungen lassen sich ebenfalls ausgeben; vorhandene Abrechnungen und PDFs werden nicht verändert.

## Hinweise

- Das Gebinde benötigt eine passende **FMK**. Für die Vorschau werden deren Nuklidvektoren und Faktoren für das jeweilige Messjahr verwendet.
- Die Tabelle der ausgewählten Dateien zeigt u. a. Messdatum, erkannte Gamma-Nuklide sowie Vorschauwerte (BS/OG). Wenn erforderliche Stammdaten fehlen, wird die Vorschau als **nicht berechenbar** gekennzeichnet.
- Das **Messdatum** kann nach **Prüfen** bei den Messdaten korrigiert werden. Dafür ist die Berechtigung `measurements.update_date` nötig. Das Originaldatum aus dem Protokoll bleibt zusätzlich gespeichert.
- Nicht lesbare oder fehlerhafte Dateien werden einzeln aufgeführt. Gültige Dateien bleiben in der Vorschau; Größen- und Auswahlgrenzen gelten weiterhin für die gesamte Auswahl.
- Die Bemerkung im Import-Dialog wird pro importierter Messung gespeichert.
- Bei **Offline-Import** ist das Protokoll zunächst nur auf dem importierenden Rechner verfügbar. Andere Arbeitsplätze können die Messung sehen, das Protokoll jedoch erst öffnen, nachdem der Upload erfolgt ist.

::: info Kurzfassung (Import)
1. Gebinde auswählen/anlegen und Messgerät wählen
2. RPT- oder MC2-CSV-Dateien auswählen und Vorschau prüfen
3. Messdaten prüfen oder gezielt eine bestehende Messung für eine Importrevision auswählen
4. Import starten
:::
