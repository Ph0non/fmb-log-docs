# Benutzer & Rechte (Übersicht)

In der Administration trennt FMB Log bewusst zwischen **Benutzern** (Accounts) und **Rechten** (Berechtigungen). Benutzer bestimmen, wer sich anmelden darf. Rechte bestimmen, was ein angemeldeter Benutzer in der Anwendung tun darf.

Die Administration ist in der UI daher in zwei Bereiche aufgeteilt:

- [Benutzer](./users.md) – Accounts anlegen, aktivieren/deaktivieren, Passwort zurücksetzen
- [Gruppen & Rechte](./groups-permissions.md) – Rollen definieren und Berechtigungen vergeben

## Rollenmodell

Admins besitzen immer alle Rechte und sehen die Administrationsseiten. Für Nicht‑Admins gilt das Prinzip „Least Privilege“: Sie erhalten Rechte ausschließlich über Gruppen (Matrix). Damit ist transparent nachvollziehbar, warum jemand eine Funktion nutzen darf – oder eben nicht.

## Gruppen

In der Praxis werden Gruppen als Rollen genutzt (z. B. „Messung“, „Auswertung“, „Key‑User“). Eine Gruppe kann aktiv oder inaktiv sein; nur aktive Gruppen verleihen Rechte.

## Rechte (Auszug)

Die folgenden Rechte sind besonders häufig relevant:

- Messungen importieren/ändern/löschen sowie **Messdatum ändern**
- Tagesabrechnungen ungültig machen (`reports.invalidate`)
- FMK und NV anlegen/ändern/löschen
- Freigabewerte ändern (`fgw.update`)
- Passwörter anderer Nutzer zurücksetzen (`users.reset_passwords`)

Siehe [Referenz: Rechte](../reference/permissions.md).

::: info Kurzfassung
- Benutzer: Zugang und Account‑Status.
- Gruppen: Rollen/Matrix für Berechtigungen.
- Admins haben immer alle Rechte; sonst entscheidet die Gruppenmatrix.
:::
