# Import (RPT und MicroCont 2)

Unter **Import** übernehmen Sie RPT-Protokolle der Gammaspektrometrie und CSV-Dateien des MicroCont 2 in die Datenbank. Auch neue Importrevisionen bestehender Messungen werden ausschließlich hier eingelesen. Der Import ist so gestaltet, dass er sowohl für den täglichen Betrieb (schnell mehrere Dateien übernehmen) als auch für Nachweise funktioniert (Originalprotokoll bleibt archiviert).

## Was passiert beim Import?

Beim Import liest FMB Log die RPT-Datei ein, extrahiert die für die Auswertung relevanten Inhalte (u. a. Messzeitpunkt, ISO-11929-Werte) und speichert zusätzlich das **Originalprotokoll** im Archiv.

## Ablaufdiagramm

![Ablauf (Import)](../diagrams/import-flow.svg)

## Schritt-für-Schritt

Wählen Sie ein bestehendes Gebinde oder legen Sie über **Neues Gebinde** eines an. Bei bestehenden Gebinden sehen Sie die gespeicherten Stammdaten einschließlich Herkunft, Datenblatt, FMK, Stoffmassen, Gebindemasse und gegebenenfalls Gebindeoberfläche.

::: warning Hinweis
Beim Import werden Stammdaten eines bestehenden Gebindes **nicht** geändert – Aktualisierungen erfolgen im Menü **Gebinde**. Zum Anlegen eines weiteren Gebindes verwenden Sie **Neues Gebinde**.
:::

Wählen Sie das **Messgerät** (Gammaspektrometrie oder MicroCont 2) und ergänzen Sie die Parameter für die Messungen. **Masse [kg] (Messungen)** und **Fläche [m²] (Messungen)** sind von der Gebindemasse und Gebindeoberfläche getrennt. Die Vorgaben werden beim Einlesen auf die neuen Messungen angewendet. Bei einer neuen Revision gelten die bisherigen Messungsdaten. Das Messgerät kann geändert werden, solange kein Import vorbereitet ist.

![Import (RPT)](../screenshots/import.annotated.png)

Die eigene Card **Dateien und Importvorschau** zeigt nach der Auswahl die Dateien mit Messdatum, Mess-ID, Radionukliden, Aktivität (BS), Vergleichswert (OG), Einheit, Aktion und Status. Bei MicroCont 2 werden zusätzlich Messpunkte, Gebindezuordnung und effektiver Wirkungsgrad angezeigt. **Prüfen** öffnet die Messdaten der betreffenden Zeile; **Entfernen** nimmt sie aus dem vorbereiteten Import. Änderungen an Datum, Messdaten oder Zuordnungen aktualisieren die Vorschau.

Falls im Protokoll Messwerte in unterschiedlichen Einheiten vorkommen (z. B. massenspezifisch vs. oberflächenspezifisch), kann eine **Umrechnung** über $g/cm^2$ hinterlegt werden. Diese wird genutzt, um Werte zwischen $Bq/g$ und $Bq/cm^2$ umrechnen zu können.

Anschließend wählen Sie die zum Messgerät passenden Dateien aus. Die Dateiauswahl unterstützt **Mehrfachauswahl** – weitere Auswahlen werden **zur Liste hinzugefügt**, nicht ersetzt.

Für jede neue Messung schlägt FMB Log automatisch eine **Mess-ID** vor. Sie können diese vor dem Speichern anpassen. Für eine neue Revision wählen Sie ausdrücklich die bestehende Messung aus.

## Neue Messungen und Importrevisionen

Für neue Messungen bleibt **Neue Messungen** ausgewählt. Mehrere Dateien können gemeinsam eingelesen und gespeichert werden; weitere Auswahlen ergänzen die vorbereitete Liste. Die vorgeschlagenen Mess-IDs können Sie vor dem Speichern prüfen und anpassen.

Für einen Re-Import wählen Sie im selben Bereich die bestehende Messung des gewählten Gebindes und anschließend **Neue Importrevision einlesen**. Das neue Protokoll wird als Revision derselben Messung gespeichert. Frühere Revisionen und Originalprotokolle bleiben erhalten. Ein bereits bekanntes Original wird beim Erstimport nicht versehentlich ein zweites Mal angelegt.

Beim Wechsel von Gebinde oder Messung bleiben ungespeicherte Eingaben geschützt: Sie können weiterarbeiten oder den Entwurf ausdrücklich verwerfen.

## Hinweise

- Das Gebinde benötigt eine passende **FMK**. Für die Vorschau werden deren Nuklidvektoren und Faktoren für das jeweilige Messjahr verwendet.
- Die Tabelle der ausgewählten Dateien zeigt u. a. Messdatum, erkannte Gamma-Nuklide sowie Vorschauwerte (BS/OG). Wenn erforderliche Stammdaten fehlen, wird die Vorschau als **nicht berechenbar** gekennzeichnet.
- Das **Messdatum** kann nach **Prüfen** bei den Messdaten korrigiert werden. Dafür ist die Berechtigung `measurements.update_date` nötig. Das Originaldatum aus dem Protokoll bleibt zusätzlich gespeichert.
- Wenn eine Datei nicht geparst werden kann, wird sie als Fehler markiert und blockiert den Import.
- Die Bemerkung im Import-Dialog wird pro importierter Messung gespeichert.
- Bei **Offline-Import** ist das Protokoll zunächst nur auf dem importierenden Rechner verfügbar. Andere Arbeitsplätze können die Messung sehen, das Protokoll jedoch erst öffnen, nachdem der Upload erfolgt ist.

::: info Kurzfassung (Import)
1. Gebinde auswählen/anlegen und Messgerät wählen
2. RPT- oder MC2-CSV-Dateien auswählen und Vorschau prüfen
3. Messdaten prüfen oder gezielt eine bestehende Messung für eine Importrevision auswählen
4. Import starten
:::
