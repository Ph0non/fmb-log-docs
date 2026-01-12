# Datenqualität

Die Seite **Datenqualität** hilft dabei, typische Konfigurations- oder Importprobleme schnell zu finden und gezielt zu beheben. Sie ist vor allem dann hilfreich, wenn Berechnungen „ungültig“ erscheinen oder Werte in der Tagesabrechnung fehlen.

## Welche Prüfungen gibt es?

Aktuell werden drei Klassen von Auffälligkeiten angezeigt:

1. **Gebinde ohne FMK**
   - Ein Gebinde hat Messungen, aber keine Freimesskampagne (FMK) zugeordnet.
   - Folge: Freigabeprüfung und Tagesabrechnung können nicht korrekt nach FMK/NV bewertet werden.
2. **Messungen mit unklarer Einheit**
   - Für eine Messung ist die Einheit nicht eindeutig ableitbar (z. B. kein klares $Bq/g$ oder $Bq/cm^2$).
   - Folge: Umrechnung und Vergleich gegen Freigabewerte sind nicht belastbar.
3. **Messungen ohne NV‑Anteile**
   - Der benötigte Nuklidvektor (NV) für das Messjahr ist nicht vorhanden oder enthält keine Gamma‑Anteile.
   - Folge: OG/BS‑Hochrechnung und Freigabeprüfung sind nicht möglich.

## Vorgehen zur Korrektur

- **Gebinde ohne FMK**: Zeile auswählen → **In Import öffnen** → FMK zuordnen und speichern.
- **Unklare Einheit**: Zeile auswählen → **Messung öffnen** → Protokoll/Einheit prüfen und ggf. Messdaten korrigieren.
- **NV‑Anteile fehlen**: Zeile auswählen → **NV öffnen** → passendes Jahr anlegen oder Anteile ergänzen → speichern.

::: info Hinweis
Die Datenqualitäts-Seite ist ein „Abkürzungsweg“: Sie ersetzt keine fachliche Prüfung, aber sie spart Zeit beim Auffinden typischer Ursachen.
:::

