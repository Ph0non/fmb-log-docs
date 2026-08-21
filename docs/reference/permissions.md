# Rechte (Permission Keys)

Die Anwendung nutzt Gruppenrechte. Admins besitzen immer alle Rechte.

Die reinen Leserechte `fmk.read` und `nv.read` erlauben den Zugriff auf die jeweilige Stammdatenansicht, aber keine Änderungen. Sie erzeugen keine Signaturdelegationen. Bestehende Anlege-, Änderungs- und Löschrechte schließen den Zugriff auf die jeweilige Ansicht weiterhin ein.

| Key | Bedeutung |
|---|---|
| `measurements.import` | Messungen einlesen |
| `measurements.update` | Messungen ändern |
| `measurements.delete` | Messungen löschen |
| `measurements.update_date` | Messdatum ändern |
| `reports.invalidate` | Tagesabrechnungen ungültig machen |
| `fmk.read` | FMK ansehen |
| `fmk.create` | FMK anlegen |
| `fmk.update` | FMK ändern |
| `fmk.delete` | FMK löschen |
| `nv.read` | NV ansehen |
| `nv.create` | NV anlegen |
| `nv.update` | NV ändern |
| `nv.delete` | NV löschen |
| `fgw.update` | Freigabewerte ändern |
| `users.reset_passwords` | Passwörter anderer Nutzer zurücksetzen |
