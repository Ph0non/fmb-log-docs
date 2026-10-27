# Rechte (Permission Keys)

Die Anwendung nutzt Gruppenrechte. Admins besitzen immer alle Rechte.

Die reinen Leserechte `fmk.read` und `nv.read` erlauben den Zugriff auf die jeweilige Stammdatenansicht, aber keine Änderungen. Für den allgemeinen Fachbestand und den Abgleich werden beide Leserechte benötigt. Die Nutzeroberfläche und der Dienst prüfen zusätzlich die konkreten Schreibrechte; die Administration kann die Berechtigungen im Bereich **Benutzer und Rechte** vergeben.

| Key | Bedeutung |
|---|---|
| `measurements.import` | Messungen einlesen |
| `measurements.update` | Messungen ändern |
| `measurements.delete` | Messungen löschen |
| `measurements.update_date` | Messdatum ändern |
| `reports.create` | Abrechnungen erzeugen, ersetzen und ungültig machen |
| `fmk.read` | FMK ansehen |
| `fmk.create` | FMK anlegen |
| `fmk.update` | FMK ändern |
| `fmk.delete` | FMK löschen |
| `nv.read` | NV ansehen |
| `nv.create` | NV anlegen |
| `nv.update` | NV ändern |
| `nv.delete` | NV löschen |
| `fgw.update` | Freigabewerte ändern |
| `users.reset_passwords` | Zugang anderer aktiver Nutzer mit neuem Schlüssel/Vault und vorläufigem Passwort wiederherstellen |

`reports.create` ist zusätzlich zu den jeweiligen Bearbeitungsrechten erforderlich, wenn eine konkrete Änderung mindestens eine gültige Abrechnung ungültig machen würde. Eine Revision ohne Auswirkung auf gültige Abrechnungen benötigt dieses zusätzliche Recht nicht. Bei Sammeloperationen wird die gesamte Operation geprüft und gegebenenfalls abgelehnt.

Bestehende Gruppen mit dem früheren Recht `reports.invalidate` erhalten bei der Aktualisierung automatisch `reports.create`. Reine Leser können vorhandene Abrechnungen weiterhin prüfen und herunterladen.

`devices.manage` – **Messgeräte verwalten**: gemeinsame MC2-Gerätevorgaben bearbeiten. Lesen ist allen angemeldeten Nutzern erlaubt, auch ohne FMK-/NV-Leserechte. Administratoren bleiben berechtigt; bestehende Gruppen erhalten das Recht nicht automatisch. Individuelle Messparameter benötigen dieses Recht nicht.
