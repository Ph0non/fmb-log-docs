# Benutzer

Die Benutzerverwaltung befindet sich in der App unter **Administration → Benutzer**. Hier verwalten Sie Accounts und steuern, wer sich anmelden darf. Rechte werden nicht direkt am Nutzer vergeben (außer „Admin“), sondern über Gruppen.

## Überblick

Ein Benutzer kann:

- **aktiv** oder **inaktiv** sein (nur aktive Benutzer können sich anmelden),
- **Administrator** sein (volle Rechte) oder
- Rechte über **Gruppen** erhalten (empfohlenes Rollenmodell).

Inaktivieren statt Löschen ist oft sinnvoll, weil dadurch die Historie (wer hat wann welche Messungen importiert) nachvollziehbar bleibt.

::: info Empfehlung
- Nutzen Sie Gruppen als Rollen (z. B. „Messung“, „Auswertung“, „Key‑User“) und vergeben Sie Rechte ausschließlich über Gruppen.
:::

## Benutzer anlegen

Zum Anlegen eines neuen Nutzers geben Sie Benutzername, Anzeigename und ein initiales Passwort ein. Optional können Sie den Nutzer direkt als Admin markieren (nur in Ausnahmefällen; üblich ist die Rechtevergabe über Gruppen).

Nach dem Anlegen kann sich der Nutzer (sofern aktiv) sofort anmelden und sein eigenes Passwort ändern.

## Benutzer bearbeiten

Wählen Sie in der Tabelle einen Benutzer aus. In der Detailansicht können Sie:

- Anzeigename ändern
- Benutzer aktivieren/deaktivieren
- Admin-Status setzen/entfernen

Hinweis: Mindestens ein **aktiver Admin** muss verbleiben.

## Gruppen zuweisen

Weisen Sie dem Benutzer die passenden Gruppen zu. Die wirksamen Rechte ergeben sich aus der Gruppen‑Rechte‑Matrix (siehe [Gruppen & Rechte](./groups-permissions.md)). Änderungen wirken sofort auf die UI (nach dem nächsten Laden der Seite bzw. nach erneutem Login).

## Passwort zurücksetzen

Admins können in der Detailansicht ein neues Passwort für den ausgewählten Benutzer setzen (**Passwort neu setzen**). Zusätzlich existiert die Seite **Administration → Passwörter zurücksetzen** für Nutzer mit dem Recht `users.reset_passwords`. Das ist hilfreich, wenn ein Key‑User Passwörter verwalten darf, aber kein Voll‑Admin sein soll.

## Benutzer löschen

In der Detailansicht können Benutzer gelöscht werden. In vielen Organisationen ist jedoch „Inaktivieren“ die bessere Wahl, weil die Historie nachvollziehbar bleibt.

Hinweis: Der eigene Account kann nicht gelöscht werden.

::: info Zusammenfassung
- Nutzer sind aktiv/inaktiv und optional Admin.
- Rechte werden über Gruppen vergeben (best practice).
- Passwort‑Resets sind eine separate, sensible Berechtigung.
:::
