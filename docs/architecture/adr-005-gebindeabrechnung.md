# ADR-005: Gebindeabrechnung mit Details und Maximalwerten

- **Status:** umgesetzt
- **Datum:** 2026-09-23

## Kontext

Die bisherige Tagesabrechnung enthielt Messungszeilen und konnte bereits exportierte Messungen ausblenden. Benötigt werden eine vollständige Gebindeauswertung, nachvollziehbare Maximalwerte und nach Charge beziehungsweise Stoffklasse getrennte Aktivitätssummen. Ein Gebinde kann mehrere Stoffanteile enthalten; am Gebinde ist keine einzelne Charge hinterlegt.

## Entscheidungen

Die folgenden fachlichen Entscheidungen wurden mit dem Auftraggeber bestätigt:

| Entscheidung | Begründung und Konsequenz |
| --- | --- |
| Gebindeauswahl ersetzt Messtagsauswahl. | Ein PDF enthält zuerst Details und danach Maximalwerte. Der Zeitraum ergibt sich aus den enthaltenen Messungen. |
| Alle aktuellen gültigen Messungen einschließlich früher exportierter Messungen einbeziehen. | Ein früherer Export darf das Gebindemaximum nicht verändern. Der Exportfilter entfällt; der Vollständigkeitsfilter bleibt bestehen. |
| Eine maßgebliche Messung nach `max(OG_M/FGW_M, OG_A/FGW_A)`. | Alle Werte einer Maximalwertzeile haben eine gemeinsame Quelle; unabhängige Spaltenmaxima werden nicht kombiniert. Verglichen werden ungerundete, KF-/SW-angepasste Werte. |
| Gesamtaktivität aus angezeigter OG_M einschließlich KF. | `A [Bq] = OG_M [Bq/g] × Reststoffmasse [kg] × 1000`. Weder die OG vor KF noch der beste Schätzwert ersetzen diese Basis. |
| Vorhandene Stoffklassenmassen sind bereits Reststoffmassen. | Kein neuer ReVK-Import, keine zusätzlichen Netto-/Tara-Felder und kein erneuter Abzug. Die Fußnote beschreibt die fachliche Herkunft der erfassten Werte. |
| Mischgebinde anteilig auf Materialblätter aufteilen. | Messungen erscheinen auf allen betroffenen Blättern. Nur die jeweils zugehörige Masse und Aktivität werden angesetzt. Blattweise Gebindeanzahlen sind nicht global addierbar. |
| Eine Charge je Stoffart innerhalb einer FMK. | Dadurch lässt sich jeder Stoffanteil eindeutig einer Charge zuordnen. Mehrdeutige Altbestände bleiben zur Korrektur lesbar, dürfen aber nicht abgerechnet werden. |
| SON und NEM zusätzlich nach Stoffklasse trennen. | Beispielsweise erhalten SON13 und SON23 getrennte Blätter derselben Charge. Andere Stoffarten fassen ihre Klassen zusammen. |

Bestehende Freigabepfade und deren Reihenfolge bleiben erhalten. Die neue Auswahl des Maximalwerts ersetzt nicht die Freigabeprüfung aller Messungen.

## Technische Umsetzung und festgelegte Randfälle

- Die bestehende Messauswertung liefert eindeutige Ergebnisse je Messrevision. Eine gemeinsame reine Berechnung erzeugt daraus Materialblätter, Maximalwerte, Zeitraum und NV-Angaben für Vorschau und PDF.
- Bei gleicher Ausschöpfung entscheiden aufsteigend vollständiger Messzeitpunkt, Mess-ID und Revisionskennung. Fehlende Zeitpunkte stehen hinten.
- Ein Quotient ist nur mit endlichen Werten und positivem FGW berechenbar. Fehlende erforderliche Vergleichswerte machen das Maximum unvollständig; nicht berechenbare Aktivitäten werden nicht als Null ausgegeben. Betroffene Summen und unvollständige Zeiträume erhalten einen Hinweis.
- Teil 1 enthält keine Summenzeile. Nur Teil 2 summiert Gebindeanzahl und Gesamtaktivität pro fachlichem Blattabschnitt, einmal an dessen Ende auch bei mehreren PDF-Seiten.
- Die Teilnummer steht in der Hauptüberschrift „Gebindeabrechnung - Teil 1“ beziehungsweise „Gebindeabrechnung - Teil 2“. „Details“ und „Maximalwerte“ bleiben als Untertitel erhalten.
- Masse/Fläche erhält als erster Tabellenhinweis Fußnote 1, OG Fußnote 2, Reststoffmasse Fußnote 3 und Gesamtaktivität Fußnote 4. Die bisherige Fußnote zur Maximalwertauswahl entfällt: Ihre Regel steht unnummeriert als „Auswahl je Gebinde“ oberhalb der Tabelle in Teil 2. Damit wird sie unmittelbar vor dem Lesen der Werte erklärt, ohne einen Fußnotenverweis am Untertitel. Vorschau und PDF verwenden dieselbe Formulierung.
- Die Gebindeabrechnung führte Snapshot-Version 4 ein; neue Exporte verwenden inzwischen Version 5 mit jahresbezogenen Pfadentscheidungen (siehe [ADR-006](adr-006-jahresbezogene-fmk-bestaetigungen.md)). Die Messliste bleibt eindeutig; Blattzuordnungen referenzieren die Messrevisionen. Maximalwerte und zugehörige Reststoffmassen werden zusammen mit ihren Grundlagen eingefroren und beim Einlesen gegen die gespeicherte Projektion geprüft.
- Version 3 und ältere historische Ergebnisse bleiben lesbar. Original-Snapshots, PDFs, Hashes und TSA-Nachweise werden nicht migriert oder nachträglich verändert. Das SQL-Schema und technische `daily_reports`-Bezeichner bleiben bestehen.

## Konsequenzen und Prüfung

Neue Berichte können mehr Seiten enthalten, weil dieselbe Messung für verschiedene Stoffanteile dokumentiert wird. Aktivitäten werden dadurch nicht doppelt angesetzt. Fehlende oder mehrdeutige Stammdaten müssen vor der Abrechnung korrigiert werden.

Regressionstests prüfen Auswahl nach beiden Einheiten, deterministische Gleichstände, anteilige Massen/Aktivitäten, SON-/NEM-Aufteilung, fehlende Werte, eindeutige Exportverknüpfungen und Snapshot-Kompatibilität. PDF-Prüfungen lesen tatsächlich gerenderte Textströme; mehrseitige Layouts werden zusätzlich visuell kontrolliert.

Die Bedienung und ein Zahlenbeispiel stehen in der [Benutzeranleitung](../user-guide/reports.md).
