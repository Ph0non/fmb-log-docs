# ADR-006: Jahresbezogene FMK-Ausnahmebestätigungen

- **Status:** umgesetzt
- **Datum:** 2026-09-24

## Kontext und Entscheidung

NV-Pfadprüfungen unterscheiden sich je Jahresversion. Die bisherige pauschale Gerätebestätigung an einem FMK-Pfad kann keine Entscheidung für ein bestimmtes Messjahr ausdrücken. Die Anzeige sämtlicher ungeprüfter NV-Jahre allein löst dieses Gültigkeitsproblem nicht.

Eine Ausnahme gilt deshalb nur für FMK, Messjahr, tatsächliche NV-ID, Messgerät, Haupt-/Zusatzpfad und den bestätigten fachlichen NV-Stand. Messjahr und NV-Jahr bleiben getrennt: Die vorhandene Auflösung verwendet die exakte Jahresversion, sonst die nächstältere und andernfalls die früheste vorhandene. Die Oberfläche zeigt diese Zuordnung ausdrücklich.

Der Auftraggeber hat festgelegt:

- Bestätigungen gelten für **Messjahr und verwendeten NV**, nicht pauschal für alle Jahre.
- Fachliche NV-Änderungen erfordern eine erneute Bestätigung.
- Pauschale Altbestätigungen werden nicht automatisch umgewandelt und gelten nicht für neue Auswertungen.
- Die FMK darf mit offenen Bestätigungen gespeichert werden. Nicht geprüfte und nicht passend bestätigte Kombinationen werden weiterhin mit Warnung übersprungen.

## Speicherung und Prüfung

Das bestehende signierte Feld `fmk_paths.unverified_device_codes_json` enthält künftig ein versioniertes JSON-Objekt mit `v: 1`, `legacyDeviceCodes` und `confirmations`. Ein Eintrag enthält `year`, `nvId`, `device`, `secondaryPath`, `nvFingerprint`, `confirmedBy` und `confirmedAt`. FMK und Hauptpfad gehören zum übergeordneten Datensatz. Alte Gerätearrays werden nur als Altbestand gelesen. Unbekannte oder beschädigte Formate erteilen keine Ausnahme; doppelte Bestätigungsschlüssel werden abgewiesen.

Der SHA-256-Fingerabdruck enthält die nach Nuklid sortierte Zusammensetzung und die Prüfzustände der relevanten Haupt-/Zusatzpfade im NV und für das Gerät. Beschreibungen, Reihenfolgen, Signiermetadaten und Prüfungen anderer Pfade sind nicht Bestandteil. NV-ID, Jahr, Gerät und Pfadkombination werden zusätzlich ausdrücklich abgeglichen. Eine vollständig geprüfte Kombination bleibt ohne Ausnahme verwendbar.

Bestätigen ersetzt die bisherige Entscheidung für dieses Messjahr und Gerät am FMK-Pfad. Zurücknehmen entfernt diese Entscheidung; andere Jahre bleiben erhalten. Änderungen werden gemeinsam mit den FMK-Daten signiert und auditiert. Neusignierung muss das vollständige JSON unverändert einbeziehen. Die vorhandene Signaturnachricht v2 und die CR-SQLite-Synchronisation können das Feld unverändert transportieren; eine Schemaänderung ist nicht erforderlich.

## Berichte und Kompatibilität

Neue Gebindeabrechnungen verwenden Snapshot-Version 5. Pro Messgrundlage werden die Jahresentscheidungen einschließlich NV-Zuordnung, fachlichem Fingerabdruck, Status und gegebenenfalls Bestätigung eingefroren. Beim Lesen werden Struktur und Bezüge zu den gespeicherten Grundlagen geprüft. Snapshot-Versionen 3 und 4 sowie bestehende PDF-, Hash- und TSA-Nachweise bleiben unverändert.

Die Bestätigungen dürfen erst nach Aktualisierung aller gemeinsam bearbeitenden Installationen verwendet werden: ältere Programmstände verstehen das neue JSON-Format nicht und können die neuen Ausnahmen beim Bearbeiten verwerfen. Es erfolgt keine automatische Datenbankumschreibung. Die Referenzdatenbank unter `RPT` wird nicht verändert.

## Prüfung

Tests decken Jahres- und NV-Bindung, Ersatzversionen, Haupt-/Zusatzpfade, Fingerabdruckänderungen, Altbestände, Speichern offener Jahre, Widerruf, Neusignierung und Snapshot-Kompatibilität ab. Browserprüfungen vergleichen außerdem Dashboard und Abrechnung vor und nach einer Bestätigung sowie nach fachlicher NV-Änderung.
