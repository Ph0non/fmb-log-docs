# Datenqualität

Die Seite **Datenqualität** hilft dabei, typische Konfigurations- oder Importprobleme schnell zu finden und gezielt zu beheben. Sie ist vor allem dann hilfreich, wenn Berechnungen „ungültig“ erscheinen oder Werte in der Gebindeabrechnung fehlen.

## Welche Prüfungen gibt es?

Aktuell werden drei Klassen von Auffälligkeiten angezeigt:

1. **Gebinde ohne FMK**
   - Ein Gebinde hat Messungen, aber keine Freimesskampagne (FMK) zugeordnet.
   - Folge: Freigabeprüfung und Gebindeabrechnung können nicht korrekt nach FMK/NV bewertet werden.
2. **Messungen mit unklarer Einheit**
   - Für eine Messung ist die Einheit nicht eindeutig ableitbar (z. B. kein klares $Bq/g$ oder $Bq/cm^2$).
   - Folge: Umrechnung und Vergleich gegen Freigabewerte sind nicht belastbar.
3. **Messungen ohne NV‑Anteile**
   - Der benötigte Nuklidvektor (NV) für das Messjahr ist nicht vorhanden oder enthält keine Gamma‑Anteile.
   - Folge: OG/BS‑Hochrechnung und Freigabeprüfung sind nicht möglich.

## Vorgehen zur Korrektur

### Messungen im Serverbetrieb speichern

Beim bewussten Speichern prüft FMB Log die Zuordnung bis zum Gebinde, zur FMK und zum Nuklidvektor einschließlich des Messjahrs. Rein technische Fassungsänderungen werden automatisch übernommen. Sie müssen dasselbe Gebinde dafür nicht erneut auswählen. Eigene Messungsfläche, Masse und Umrechnung bleiben erhalten.

Fachliche Änderungen erscheinen gemeinsam unter **Zuordnungen und Messung prüfen**. Der Dialog zeigt bisherige und vorbereitete Werte, Bearbeiter und Zeitpunkt, offene Freigaben, betroffene Abrechnungen und fehlende Rechte. Geräte- und Rasteranpassungen können dort geprüft werden. Unterschiedliche Messungswerte lassen sich vergleichen. **Zuordnungen aktualisieren und Messung speichern** übernimmt die vorbereiteten Fassungen gemeinsam; andere Messungen werden nicht automatisch bearbeitet. Fehlende Freigabebestätigungen dürfen offen bleiben, sperren aber die entsprechende Abrechnung.

**Lokal gespeichert – Serverbestätigung ausstehend** bedeutet, dass der Entwurf auf diesem Gerät erhalten ist. Unter **Gespeicherte Messungsentwürfe** können Sie ihn prüfen oder mit **Jetzt abgleichen** erneut übertragen. Nach einer Wiederverbindung werden neue fachliche Folgen erneut vorgelegt. Erst **Gespeichert und abgeglichen** bestätigt die zentrale Übernahme. Bei zwischenzeitlichen Änderungen oder fehlenden Rechten bleibt der Entwurf erhalten.

Historische Fassungen finden Sie unter **Verlauf**, Versionskennungen unter **Technische Details**. Bestehende signierte Nachweise bleiben auch erhalten, wenn eine Änderung ihre fachliche Gültigkeit aufhebt.

### Auffällige Berechnungsgrundlagen korrigieren

- **Gebinde ohne FMK**: Zeile auswählen → **In Import öffnen** → FMK zuordnen und speichern.
- **Unklare Einheit**: Zeile auswählen → **Messung öffnen** → Protokoll/Einheit prüfen und ggf. Messdaten korrigieren.
- **NV‑Anteile fehlen**: Zeile auswählen → **NV öffnen** → passendes Jahr anlegen oder Anteile ergänzen → speichern.

::: info Hinweis
Die Datenqualitäts-Seite ist ein „Abkürzungsweg“: Sie ersetzt keine fachliche Prüfung, aber sie spart Zeit beim Auffinden typischer Ursachen.
:::

