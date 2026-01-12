# Konto & Passwort

## Eigenes Passwort ändern

Sie können Ihr eigenes Passwort unter **Passwort ändern** aktualisieren. Aus Sicherheitsgründen verlangt die Anwendung dabei das **aktuelle Passwort**, bevor ein neues gesetzt werden kann. So wird verhindert, dass ein bereits angemeldeter, aber unberechtigter Zugriff im offenen Client unbemerkt Passwörter ändern kann.

Geben Sie anschließend das neue Passwort und die Bestätigung ein (mind. **8 Zeichen**). Intern wird das Passwort per **Argon2** gehasht gespeichert.

::: {.info data-title="Kurzfassung"}
- Aktuelles Passwort eingeben
- Neues Passwort + Bestätigung setzen
- Änderungen wirken sofort (nächste Anmeldung nutzt das neue Passwort)
:::

## Passwort zurücksetzen (andere Nutzer)

Das Zurücksetzen fremder Passwörter ist eine Admin/Key‑User‑Funktion. Sie ist entweder als Admin verfügbar oder über die Berechtigung `users.reset_passwords`. Das neue Passwort kann gesetzt werden, ohne das alte zu kennen.

::: {.warning data-title="Empfehlung"}
- Passwort‑Resets sollten dokumentiert und nur nach einem definierten Prozess durchgeführt werden.
:::
