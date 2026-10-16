# Gruppen & Rechte

Unter **Administration → Benutzer und Rechte** verwalten online angemeldete Administratoren Gruppen, Nutzer und Berechtigungen. Administratoren besitzen die administrativen Rechte; andere Nutzer erhalten ihre Rechte über die zugewiesenen Gruppen.

## Gruppe bearbeiten

1. Eine vorhandene Gruppe oder **Gruppe anlegen** wählen.
2. Gruppennamen eingeben und die benötigten **Berechtigungen** auswählen.
3. **Zentral speichern** wählen.
4. Den Nutzer auswählen, die **Gruppenzugehörigkeit** setzen und ebenfalls zentral speichern.

Die aktuelle Serveroberfläche bietet Gruppenanlage, Umbenennung und Rechteänderungen. Eine Gruppenlöschung oder ein separater Aktiv-Schalter für Gruppen ist dort nicht vorgesehen. Entziehen Sie Rechte über die Berechtigungsauswahl oder die Gruppenzugehörigkeit.

Der Sicherheitsstand ist versioniert. Wenn ein anderer Administrator zwischenzeitlich Änderungen gespeichert hat, laden Sie den aktuellen Stand und prüfen Ihren Entwurf erneut. Bereits signierte unveränderte Anfragen können nach einem Verbindungsabbruch erneut übertragen werden.

## Wirksamkeit und Offline-Betrieb

Rechteänderungen werden online gespeichert und bei der Übernahme fachlicher Operationen erneut geprüft. Betroffene Sitzungen können beendet werden; Änderungen an der eigenen Zuordnung können auch die eigene Sitzung schließen. Ein bereits getrennter Arbeitsplatz kennt zunächst weiterhin die zuletzt bestätigten Rechte.

Offline gespeicherte Arbeit erhält deshalb keine garantierte spätere Freigabe. Wird sie nach einem Rechte- oder Schlüsselentzug abgewiesen, bleibt sie mit dem Übernahmefehler lokal erhalten. Eine historische gültige Signatur allein begründet keine aktuelle Schreibberechtigung.

Typische Rechte sind FMK-/NV-Leserechte, Stammdatenbearbeitung, Messungsimport und -änderung, gesonderte Messdatumsänderung, `fgw.update`, `reports.create` und `users.reset_passwords`. Die [Rechtereferenz](../reference/permissions.md) beschreibt die fachlichen Schlüssel.
