# Gruppen & Rechte

FMB Log nutzt ein gruppenbasiertes Berechtigungsmodell: Sie definieren **Gruppen** (Rollen) und vergeben Rechte in einer Matrix. Benutzer erhalten Rechte, indem sie einer oder mehreren Gruppen zugeordnet werden. Dieses Vorgehen ist im Alltag deutlich wartbarer als individuelle Rechte pro Nutzer, weil Rollen (z. B. „Messung“, „Auswertung“, „Key‑User“) konsistent abgebildet werden können.

Die Gruppen- und Rechteverwaltung befindet sich in der App unter **Administration → Gruppen & Rechte**.

## Rollenmodell

Ein Benutzer kann als **Admin** markiert werden. Admins besitzen immer alle Rechte und sehen zusätzlich die Administrationsseiten. Für alle anderen gilt: Rechte kommen ausschließlich aus den zugewiesenen **Gruppen**.

Das hat einen praktischen Vorteil: Wenn eine Funktion fehlt (oder zu viel sichtbar ist), lässt sich das fast immer auf die Gruppenzuordnung bzw. die Gruppen‑Matrix zurückführen.

## Gruppen verwalten

Gruppen können angelegt, umbenannt, deaktiviert/aktiviert und gelöscht werden. Nur **aktive** Gruppen werden bei der Berechnung der wirksamen Rechte berücksichtigt. In der Praxis ist „Deaktivieren“ häufig die bessere Wahl als „Löschen“, weil sich so die Historie nachvollziehen lässt und die Gruppe später bei Bedarf wieder aktiviert werden kann.

## Rechte (Matrix)

Die Rechte werden pro Gruppe in einer Matrix vergeben. Die UI blendet Funktionen entsprechend ein/aus; zusätzlich werden sensible Aktionen auch serverseitig geprüft.

Typische Beispiele für Rechte sind:

- Messungen importieren/ändern/löschen sowie **Messdatum ändern**
- Tagesabrechnungen ungültig machen (`reports.invalidate`)
- FMK und NV anlegen/ändern/löschen
- Freigabewerte ändern (`fgw.update`)
- Passwörter anderer Nutzer zurücksetzen (`users.reset_passwords`)

Die vollständige Liste der Permission Keys befindet sich in der Referenz: [Rechte](../reference/permissions.md).

::: {.info data-title="Zusammenfassung (Gruppen & Rechte)"}
- Rechte werden über Gruppen vergeben; Admins haben immer alles.
- „Deaktivieren“ ist oft sinnvoller als „Löschen“ (Historie, Wiederverwendbarkeit).
- Kritische Rechte (FGW ändern, Passwörter zurücksetzen, Messdatum ändern, Tagesabrechnungen ungültig machen) nur gezielt vergeben.
:::
