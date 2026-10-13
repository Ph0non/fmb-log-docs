# Konto & Passwort

Die erste Anmeldung auf einem Arbeitsplatz erfolgt mit Benutzername und Passwort am eingerichteten Server. Danach kann der eigene lokale Vault auch offline entsperrt werden. Ein gesperrter Zugang oder entzogene Rechte werden spätestens beim nächsten erfolgreichen Sicherheitsabgleich wirksam; ein getrennter Arbeitsplatz kennt zunächst nur den zuletzt bestätigten Stand.

## Eigenes Passwort ändern

1. Online anmelden und das Benutzermenü oben rechts öffnen.
2. **Passwort ändern** wählen.
3. Aktuelles Passwort sowie das neue Passwort zweimal eingeben. Das neue Passwort muss mindestens zwölf Zeichen haben.
4. **Passwort speichern** wählen und den Abschluss abwarten.

Der Client verschlüsselt den Vault mit dem neuen Passwort. Der Server übernimmt Passwort-Prüfwert und verschlüsselten Vault gemeinsam. Der private Signierschlüssel wird dabei nicht im Klartext an den Dienst übertragen.

Wird die Verbindung während des Wechsels unterbrochen, kann die Anwendung einen noch nicht zentral bestätigten Passwortwechsel anzeigen. Melden Sie sich online an, um den tatsächlichen Stand zu klären. Löschen Sie dafür weder lokale Zugangsdaten noch den Vault. Andere Arbeitsplätze müssen den neuen Stand ebenfalls online abrufen; ein bereits getrennter Arbeitsplatz kann zunächst noch seinen alten lokalen Vault besitzen.

## Verlorenen Zugang wiederherstellen

Ein Administrator oder ein Nutzer mit `users.reset_passwords` kann den Zugang eines anderen aktiven Nutzers über **Zugang wiederherstellen** erneuern. Dabei werden die bisherigen aktiven Signierschlüssel widerrufen und durch einen neuen Schlüssel samt verschlüsseltem Vault ersetzt. Historische Signaturnachweise bleiben erhalten. Noch nicht übertragene Arbeit mit den alten Schlüsseln kann anschließend nicht mehr zentral übernommen werden.

Nach der Wiederherstellung erhalten Sie ein vorläufiges Passwort. Melden Sie sich damit online an, ändern Sie es und melden Sie sich erneut online an. Erst danach sind Fachdaten und Offline-Zugriff freigegeben. Der vollständige administrative Ablauf steht unter [Benutzer](../admin-guide/users.md).
