# Nuklidvektoren (NV)

Ein **Nuklidvektor (NV)** beschreibt die Zusammensetzung einer Aktivität als Prozentanteile einzelner Nuklide. In FMB Log ist ein NV immer an ein **Jahr** gebunden, weil sich sowohl fachliche Annahmen als auch Freigabewerte/Prüfungen über die Zeit ändern können.

Ein NV besteht aus:

- einem Kürzel (z. B. „A01“) und einer Beschreibung,
- einem Jahr,
- einer Liste von Nukliden mit Anteilen in Prozent (Summe = 100%),
- sowie gepflegten Informationen, welche Freigabepfade je Messgerät als geprüft/zulässig gelten.

## NV-Liste & Jahre

Die NV‑Liste ist nach Kürzel gruppiert, damit Sie nicht pro Jahr eine „neue“ Zeile suchen müssen. In der Detailansicht wählen Sie die gewünschte Jahresversion aus und bearbeiten diese.

Wenn Sie ein neues Jahr anlegen möchten, ist das in der Regel eine Kopie der bestehenden Version (als Startpunkt), die anschließend angepasst wird.

Standardmäßig wird (falls vorhanden) das **aktuelle Jahr** ausgewählt.

## Ablaufdiagramm

![Ablauf (NV)](../diagrams/nv-flow.svg)

## Anteile (in %)

In der Tabelle der Anteile fügen Sie Nuklide hinzu oder entfernen sie. Die Werte werden mit **2 Nachkommastellen** angezeigt. Gespeichert werden kann nur, wenn die Summe der Anteile **100%** ergibt – so vermeiden Sie inkonsistente Berechnungen.

## Zulässige Pfade je Messgerät

Nicht jede Kombination aus Messgerät und Freigabepfad ist für jeden NV geprüft. Deshalb können Sie pro Messgerät pflegen, welche Pfade als **geprüft/zulässig** gelten. Diese Information wird später in der FMK‑Prüfung verwendet (z. B. um nur zulässige Pfade automatisch vorzuschlagen).

## Freigabewerte anzeigen

Über die Schaltfläche **Freigabewerte** wird ein Modal geöffnet, das die berechneten Freigabewerte pro Pfad zeigt (gerundet, 2 Nachkommastellen).

Wenn Werte nicht berechenbar sind, wird angezeigt, welche FGW-Einträge fehlen.

::: info Zusammenfassung (NV)
- NV sind **jahresspezifisch** und bestehen aus Nuklidanteilen (Summe = 100%).
- Die Detailansicht verwaltet die Jahresversionen; neue Jahre werden typischerweise aus einer Kopie erstellt.
- Zulässige Pfade je Messgerät verhindern unzulässige Kombinationen in der späteren Prüfung.
- Das Modal „Freigabewerte“ zeigt die aus FGW berechneten Werte und fehlende Einträge transparent an.
:::
