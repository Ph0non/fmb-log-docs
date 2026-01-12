# Gebinde & Messungen

In FMB Log ist ein **Gebinde** die zentrale Einheit. Messungen (aus Protokollen) werden immer einem Gebinde zugeordnet, damit Sie später:

- alle Messungen eines Gebindes gesammelt sehen,
- deren Historie nachvollziehen können (Revisionen),
- und daraus Tagesabrechnungen erzeugen.

## Gebindeübersicht

Unter **Gebinde** finden Sie eine tabellarische Übersicht. Über die Filterzeile können Sie schnell nach Gebindenummer, Datenblatt oder FMK suchen. Ein Klick auf eine Zeile öffnet die Detailansicht.

Die Spalte **Messungen** zählt bewusst nur die **aktuellen Revisionen**. Das macht die Übersicht übersichtlich, auch wenn einzelne Messungen im Laufe der Zeit aktualisiert wurden.

::: info In der Übersicht sehen Sie
- Gebindenummer, Datenblattnummer, Herkunft, FMK
- „Vollständig" als Arbeitsstatus (keine weiteren Messungen erwartet)
- Anzahl Messungen (nur aktuelle Revisionen)
:::

## Gebinde-Details

In der Detailansicht bearbeiten und prüfen Sie ein Gebinde. Typische Aufgaben sind:

- Stammdaten am Gebinde (Herkunft, Datenblatt, FMK) ergänzen,
- Messdaten pro Messung (Masse/Fläche, Umrechnung, Bemerkung) ergänzen oder korrigieren,
- den Status **Vollständig** setzen oder zurücknehmen,
- Messungen auswählen und Protokolle/ISO-Werte prüfen,
- Messungen bei Bedarf als **ungültig** markieren (mit Begründung).

Die Messungsliste kann zwischen **aktuelle Revisionen** und **alle Revisionen** umgeschaltet werden. So bleibt die Arbeitsansicht übersichtlich, während die Historie jederzeit verfügbar ist.

### Stammdaten am Gebinde ändern

Die Gebinde-Stammdaten (Herkunft, Datenblattnummer, FMK) werden in der Detailansicht im Bereich **Stammdaten** angezeigt. Über die Schaltfläche **Stammdaten bearbeiten** (Stift-Symbol) können die Werte geändert und gespeichert werden.

::: warning Hinweis
Beim Import werden Stammdaten eines **bestehenden** Gebindes nicht geändert. Wenn Sie Korrekturen vornehmen müssen (z. B. falsche FMK oder Datenblattnummer), erledigen Sie das im Menü **Gebinde** in der Detailansicht.
:::

Für das Ändern dieser Werte ist die Berechtigung `measurements.update` erforderlich (oder Admin).

### Protokoll und ISO-Tabelle

Wenn Sie eine Messung auswählen, lädt die Anwendung das gespeicherte Protokoll und zeigt die ISO-11929-Werte (sofern im Protokoll vorhanden). Das Originalprotokoll wird archiviert, damit es auch später (z. B. für Nachweise) wieder angezeigt werden kann.

Bei einem **Offline-Import** kann es vorkommen, dass das Protokoll noch nicht hochgeladen wurde. In diesem Fall ist das Protokoll zunächst nur auf dem importierenden Rechner abrufbar, bis nach dem nächsten erfolgreichen Sync der Upload automatisch nachgeholt wurde.

### Messgerät nachtragen/anpassen

Wenn eine Messung kein Messgerät hat oder ein falsches Messgerät hinterlegt ist, kann es (mit entsprechender Berechtigung) in der Detailansicht korrigiert werden. Das ist relevant, weil die zulässigen Freigabepfade je nach Messgerät variieren können.

### Messdatum manuell korrigieren

In der Praxis kommt es vor, dass das Protokolldatum (z. B. durch Geräteeinstellungen) nicht dem tatsächlichen Messtag entspricht. Daher kann das Messdatum **manuell** gesetzt werden. Die Anwendung speichert dabei:

- das ursprüngliche Datum aus dem Protokoll (zur Nachvollziehbarkeit),
- und das manuell gesetzte Datum als separate Information.

In Tabellen wird eine manuell gesetzte Angabe durch ein Stift-Symbol kenntlich gemacht. Für das Ändern des Messdatums ist die Berechtigung `measurements.update_date` erforderlich.

### Messung ungültig setzen

Wenn eine Messung fachlich nicht verwertbar ist (z. B. falsches Gebinde, falsche Parameter, Messfehler), kann sie als **ungültig** markiert werden. Eine Begründung ist Pflicht. Ungültige Messungen bleiben erhalten, werden aber bei „aktuellen/gültigen" Auswertungen nicht mehr berücksichtigt.

::: info Zusammenfassung (Detailansicht)
- Vollständig-Status steuert, ob Gebinde standardmäßig in Tagesabrechnungen erscheinen.
- Protokoll und ISO-Tabelle werden aus dem Archiv geladen.
- Manuelles Messdatum bleibt nachvollziehbar (Original + Override).
- Ungültige Messungen bleiben dokumentiert, werden aber nicht mehr als gültig ausgewertet.
:::

## Messungen & Revisionen (Versionierung)

Messungen werden über eine **Mess-ID** identifiziert. Beim erneuten Import derselben Mess-ID legt die Anwendung eine **neue Revision** an. Die vorherige Revision wird nicht überschrieben, sondern als nicht mehr aktuell markiert.

Dieses Vorgehen ist bewusst gewählt, weil Messungen und Auswertungen häufig nachvollziehbar dokumentiert werden müssen: Sie können später sehen, **wann** eine Messung geändert wurde und **welche Version** aktuell gilt.

::: info Warum Revisionen?
- Keine Daten gehen verloren (Audit-Trail statt „Überschreiben").
- Sie können Korrekturen vornehmen, ohne alte Werte zu zerstören.
- Auswertungen (z. B. Tagesabrechnung) beziehen sich immer auf eine definierte, gültige Revision.
:::
