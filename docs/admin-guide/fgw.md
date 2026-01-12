# Freigabewerte (FGW)

Freigabewerte (FGW) sind die nuklidspezifischen Grenzwerte, gegen die FMB Log gemessene Aktivitäten prüft. Sie sind zentral für die Berechnung von Freigabewerten eines Nuklidvektors und für die Freigabeprüfung in Vorschau und PDF der Tagesabrechnung.

Die FGW werden bewusst **lokal in der SQLite‑Datenbank** gespeichert. Dadurch ist die Anwendung nicht von externen Dateien oder Datenbankservern abhängig, und Änderungen können in denselben Prozess (Berechtigungen, Backup, Freigabe) eingebettet werden wie alle anderen Stammdaten.

## Zugriff und Berechtigung

Die Seite **Freigabewerte** ist nur sichtbar, wenn Sie Administrator sind oder die Permission `fgw.update` besitzen. So kann ein Key‑User FGW pflegen, ohne Voll‑Admin zu sein.

## Einheiten und Struktur

FGW werden pro Nuklid und Freigabepfad gespeichert. Die Einheit hängt vom Pfad ab:

- Oberflächenspezifische Pfade (z. B. OF/3a/4a/5b) in $Bq/cm^2$
- Alle übrigen Pfade in $Bq/g$

## Änderungen im Betrieb

Änderungen an FGW wirken sofort auf Berechnungen und Anzeigen. Aus fachlicher Sicht empfiehlt sich daher ein klarer Freigabeprozess (z. B. Vier‑Augen‑Prinzip) und ein Backup, bevor größere Änderungen vorgenommen werden. So bleiben Tagesabrechnungen auch später nachvollziehbar.

::: info Zusammenfassung (FGW)
- Zugriff nur als Admin oder mit `fgw.update`.
- Einheiten: OF/3a/4a/5b in $Bq/cm^2$, sonst in $Bq/g$.
- Änderungen wirken sofort – daher Freigabeprozess und Backups nutzen.
:::
