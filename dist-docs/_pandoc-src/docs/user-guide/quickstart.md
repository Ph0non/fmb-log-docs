# Schnellstart

Der Schnellstart führt Sie einmal durch den typischen Ablauf – von der ersten Anmeldung bis zum Export einer Tagesabrechnung. Die Detailseiten beschreiben anschließend einzelne Arbeitsschritte genauer.

## 1) Anwendung starten

Starten Sie FMB Log über die Desktop-Verknüpfung oder das Startmenü. Die Anwendung öffnet sich im Anmeldefenster.

## 2) Ersteinrichtung (einmalig)

Beim allerersten Start wird die **Ersteinrichtung** geöffnet. Hier legen Sie den ersten Administrator an. Dieser Admin kann später weitere Nutzer, Gruppen und Rechte pflegen.

Nach erfolgreicher Ersteinrichtung wechselt die Anwendung in den normalen Anmeldemodus. Die Ersteinrichtung erscheint nur dann, wenn noch keine Benutzer vorhanden sind.

Wenn in Ihrer Umgebung bereits eine produktive Datenquelle existiert (z. B. im Netzlaufwerk), können Sie die Ersteinrichtung auf einem neuen Arbeitsplatz überspringen:

- Im Setup-Modus **Datenquelle ändern** auswählen und den Pfad zur bestehenden Datenbank angeben.
- Danach direkt anmelden.

Passwörter müssen mindestens **8 Zeichen** lang sein und werden sicher verschlüsselt gespeichert.

::: {.info data-title="Kurzfassung (Ersteinrichtung)"}
- Admin-Benutzername, Anzeigename und Passwort setzen
- Danach mit dem Admin anmelden
:::

## 3) Anmeldung

Melden Sie sich mit Benutzername und Passwort an. Die sichtbaren Menüpunkte und Aktionen hängen von Ihren Rechten ab (Admins sehen alle Bereiche; Nicht-Admins erhalten Rechte über Gruppen).

## 4) Übersicht (Dashboard)

Nach der Anmeldung öffnet sich die **Übersicht**. Diese Seite zeigt aktuelle Kennzahlen, damit Sie schnell erkennen, was „offen" ist (z. B. nicht exportierte Messungen) und wie viele Gebinde heute bearbeitet wurden.

Die Kennzahlen beziehen sich auf **aktuelle und gültige Revisionen** (d. h. die derzeit gültige Version einer Messung).

::: {.info data-title="Was bedeutet „offen\"?"}
- **Nicht exportiert**: Messungen, die noch in keiner Tagesabrechnung enthalten sind
- **Nicht vollständig**: Gebinde, die noch nicht als „vollständig" markiert sind
:::

## 5) Typischer Ablauf

In der Praxis beginnt die Arbeit meist mit einem Gebinde und den zugehörigen Protokollen. Optional werden vorher Stammdaten geprüft (FMK/NV/FGW), typischerweise durch Admins oder Key-User. Anschließend importieren Sie RPT-Dateien, prüfen die Messungen, markieren das Gebinde als vollständig und erzeugen schließlich eine Tagesabrechnung als PDF.

::: {.info data-title="Kurzfassung (Ablauf)"}
1. Optional: Stammdaten prüfen (FMK/NV/FGW)
2. Gebinde anlegen oder auswählen
3. RPT-Dateien importieren (Gammaspektrometrie)
4. Messungen prüfen, ggf. Messdatum korrigieren
5. Gebinde als vollständig markieren
6. Tagesabrechnung als Vorschau erzeugen und PDF exportieren
7. Exportierte Tagesabrechnungen in der Historie nachschlagen
:::

## Ablaufdiagramm

![Ablaufdiagramm (User)](../diagrams/user-flow.svg)
