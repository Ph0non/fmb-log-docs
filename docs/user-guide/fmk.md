# FMK (Freimesskampagne)

Eine **FMK** bündelt Gebinde in einer gemeinsamen Kampagne und beschreibt, **wie** Messungen bewertet werden sollen. In der Praxis ist die FMK der „Regel‑Container“: Sie verknüpft einen Nuklidvektor mit Messgeräten und legt fest, welche Freigabepfade in welcher Reihenfolge geprüft werden.

## Was wird in einer FMK festgelegt?

Eine FMK enthält typischerweise:

- einen **Nuklidvektor (NV)** als fachliche Grundlage,
- ein oder mehrere **Messgeräte** (welche Protokolle/Verfahren in dieser FMK vorkommen dürfen),
- die **Reihenfolge** der Freigabepfade (Prüfpfade),
- optionale Standardwerte (Umrechnung $g/cm^2$, Bezugsmasse/‑fläche),
- sowie **SW/KF** als Korrekturen pro Jahr und ggf. geräte-/pfadspezifisch.

Die Jahreszuordnung ergibt sich dabei aus dem Messdatum der jeweiligen Messung: Für eine Messung im Jahr 2026 wird die FMK‑Konfiguration für 2026 herangezogen.

## Ablaufdiagramm

![Ablauf (FMK)](../diagrams/fmk-flow.svg)

![FMK](../screenshots/freimesskampagne.annotated.png)

- (1) FMK‑Liste + Neu
- (2) Details (Kürzel, NV, Messgeräte)
- (3) Freigabepfade (Reihenfolge)
- (4) SW/KF je Jahr
- (5) Speichern/Löschen

## Freigabepfade (Reihenfolge)

Die Prüfung erfolgt in der FMK in einer festgelegten Reihenfolge. Die Anwendung prüft pfadweise und weist einem Gebinde den **ersten** Pfad zu, den **alle** gültigen Messungen des Gebindes bestehen. Damit entspricht die Auswertung dem üblichen Vorgehen: Man startet mit den „strengeren“/kleineren Pfaden und arbeitet sich nach oben.

In der UI ändern Sie die Reihenfolge über Pfeil‑Buttons. Zusätzlich können Pfade manuell ergänzt werden. Bei Auswahl eines Nuklidvektors werden die geprüften/zulässigen Pfade automatisch übernommen und sinnvoll sortiert; manuell hinzugefügte Pfade bleiben erhalten.

### Pfad‑Kombinationen (z. B. „1a (mit OF)“)

Einige Freigabepfade erfordern zusätzlich die Einhaltung eines zweiten Pfades (oft **OF** als oberflächenspezifischer Pfad). In der FMK können Sie pro Pfad optional einen **Sekundärpfad** hinterlegen. In der Tagesabrechnung wird dies als „Pfad (mit Sekundärpfad)“ dargestellt.

## SW und KF

SW (Schwellenwert) und KF (Korrekturfaktor) sind Faktoren, die in der Praxis für bestimmte Jahre/Verfahren/Pfade erforderlich sein können.

- **SW** reduziert den Freigabewert (effektiv: Freigabewert $\cdot SW$, mit $SW \le 1$).
- **KF** erhöht die Aktivität (effektiv: Aktivität $/ KF$, mit $KF \le 1$).

Beide können global oder pfadspezifisch und zusätzlich gerätespezifisch gepflegt werden.

### SW/KF-Konfiguration bedienen

Die Jahresauswahl zeigt vorhandene Konfigurationen als Schaltflächen. Die Zahl am Jahr gibt an, wie viele pfad- oder gerätespezifische Abweichungen in diesem Jahr hinterlegt sind. Über **Jahre vergleichen** können die Jahresstandards und die Anzahl der Abweichungen gegenübergestellt werden.

Für das ausgewählte Jahr werden die effektiven Werte in einer Matrix dargestellt:

- die Zeile **Standard für alle Pfade** enthält den Jahresstandard und etwaige Gerätestandards,
- die weiteren Zeilen enthalten die einzelnen Freigabepfade,
- die Spalte **Alle Geräte** enthält Werte, die geräteunabhängig gelten,
- die übrigen Spalten enthalten gerätespezifische Werte.

Ein hervorgehobenes Feld besitzt mindestens einen ausdrücklich gesetzten Wert. Bei geerbten Werten wird neben dem effektiven Wert auch dessen Herkunft angezeigt. Dabei gilt folgende Priorität:

Auf kleinen Bildschirmen wählen Sie das Gerät oberhalb der Tabelle aus; dadurch bleibt die Darstellung ohne horizontales Durchsuchen vieler Gerätespalten bedienbar.

1. Wert für Gerät und Pfad,
2. Wert für den Pfad bei allen Geräten,
3. Wert für das Gerät bei allen Pfaden,
4. Jahresstandard,
5. Systemstandard `1,00`.

Klicken Sie eine Matrixzelle an, um SW und KF für genau diesen Gültigkeitsbereich zu bearbeiten. Beide Faktoren können unabhängig voneinander als eigene Abweichung aktiviert oder wieder auf den geerbten Wert zurückgesetzt werden.

::: info Zusammenfassung (FMK)
- FMK verbindet NV, Messgeräte und Pfad‑Reihenfolge zu einem einheitlichen Auswerte‑Set.
- Pfade werden in Reihenfolge geprüft; der erste bestandene Pfad wird zugewiesen.
- Optionaler Sekundärpfad ermöglicht Kombinationen wie „1a (mit OF)“.
- SW/KF werden pro Jahr (aus Messdatum) und optional je Gerät/Pfad angewandt.
:::
