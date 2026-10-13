# Benutzer

Die Benutzerverwaltung befindet sich in der App unter **Administration → Benutzer und Rechte**. Änderungen benötigen eine Online-Anmeldung und Administratorrechte. Rechte kommen über Gruppen; der Administratorstatus ist eine gesonderte Eigenschaft des Nutzers.

## Benutzer im Serverbetrieb

Bei eingerichteter Serververbindung verwenden Administratoren den Bereich **Benutzer und Rechte**.
Für **Nutzer anlegen** sind eine Online-Anmeldung, ein Benutzername und ein zweimal eingegebenes
Passwort mit mindestens zwölf Zeichen erforderlich. Wählen Sie die Gruppen und gegebenenfalls
den Administratorstatus. **Zentral speichern** erzeugt den Nutzerschlüssel und den verschlüsselten
Vault auf diesem Arbeitsplatz und registriert den Zugang auf dem Server.

Danach kann sich der Nutzer auf einem Arbeitsplatz mit eingerichteter Serververbindung allein
mit Benutzername und Passwort anmelden. Nach der ersten erfolgreichen Anmeldung ist dort auch
das Offline-Entsperren möglich.

Bei einem Verbindungsabbruch können Sie die bereits signierte Anlage über **Zentral speichern**
erneut senden. Die Eingaben sind währenddessen gesperrt. Für eine geänderte Anfrage laden Sie
den Sicherheitsstand neu und verwerfen den Entwurf. Nach einem Programmneustart prüfen Sie
zuerst die Nutzerliste: Eine vor dem Abbruch zentral gespeicherte Anlage bleibt erhalten.

Für einen verlorenen Zugang wählen Sie als Administrator einen anderen aktiven Nutzer
und **Zugang wiederherstellen**. Geben Sie eine Begründung und ein vorläufiges Passwort
zweimal ein. Die Bestätigung widerruft alle bisherigen aktiven Nutzerschlüssel und beendet
die betroffenen Sitzungen. Ein neuer Schlüssel und ein neuer verschlüsselter Vault ersetzen
den Zugang; Gruppen, Rechte und historische Signaturnachweise bleiben erhalten.
Nicht übertragene Offline-Arbeit mit alten Schlüsseln kann danach nicht mehr übernommen werden.

Übergeben Sie das vorläufige Passwort an den Nutzer. Er muss es nach der Online-Anmeldung
ändern und sich erneut anmelden, bevor Fachdaten und Offline-Zugriff freigegeben werden.
Bei einem Verbindungsabbruch können Sie die unveränderte, bereits bestätigte Wiederherstellung
erneut übertragen. Ein bestätigter Vorgang wird dadurch nicht doppelt ausgeführt.

Nutzer mit der Gruppenberechtigung **Passwörter zurücksetzen (andere Nutzer)**
(`users.reset_passwords`) finden denselben Ablauf unter **Zugänge wiederherstellen**.
Diese Berechtigung umfasst auch andere aktive Administratorkonten. Die Auswahl zeigt
die betroffenen Nutzer und Schlüsselkennungen; allgemeine Nutzer-, Gruppen- und
Rechteänderungen bleiben Administratoren vorbehalten. Die Wiederherstellung des eigenen
Zugangs führt ein anderer berechtigter Nutzer durch.

## Vorhandenen Nutzer bearbeiten

Wählen Sie den Nutzer und ändern Sie Benutzername, **Zugang aktiv**, Administratorstatus oder Gruppenzugehörigkeit. **Zentral speichern** übernimmt die signierte Änderung. Betroffene Sitzungen werden beendet; Änderungen am eigenen Konto können die eigene Sitzung ebenfalls schließen. Mindestens ein aktiver Administrator mit aktivem Schlüssel muss erhalten bleiben.

Die Serveroberfläche löscht keine Nutzer. Sperren Sie einen Zugang über **Zugang aktiv**, damit seine historischen Belege erhalten bleiben. Unter **Schlüssel** können einzelne aktive Schlüssel mit Begründung widerrufen werden. Ein Widerruf verhindert neue Übernahmen mit diesem Schlüssel, ohne historische Signaturen zu entfernen.

Wenn der angezeigte Sicherheitsstand veraltet ist, laden Sie ihn neu und prüfen den Entwurf erneut. Getrennte Arbeitsplätze können Änderungen erst bei der nächsten Verbindung erfahren; die zentrale Übernahme prüft die aktuellen Rechte unabhängig davon.
