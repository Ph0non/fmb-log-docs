# Rechner & Formeln

## 1) Freigabewert für einen Nuklidvektor

Für einen NV und einen Pfad gilt (vereinfachte Darstellung):

$$
FGW_{NV} = \frac{1}{\sum_i \frac{p_i}{f_{i,p}}}
$$

- $p_i$: Anteil des Nuklids $i$ im NV (0…1)
- $f_{i,p}$: Freigabewert aus FGW für Nuklid $i$ und Pfad $p$

## 2) SW/KF

- **SW** reduziert den Freigabewert: $FGW_{\mathrm{eff}} = FGW_{NV} \cdot SW$
- **KF** erhöht die Aktivität: $OG_{\mathrm{eff}} = OG / KF$

## 3) Bestehenslogik (OG)

Eine Messung besteht für einen Pfad, wenn:

$$
OG_{\mathrm{eff}} \le FGW_{\mathrm{eff}}
$$

## 4) Einheit/Umrechnung

Umrechnungen zwischen Bq/g und Bq/cm² benötigen eine Umrechnung g/cm² (z. B. aus Flächenmasse).

## 5) Gebindeabrechnung: maßgebliche Messung und Aktivität

Je Messung wird die größere der verfügbaren massen- und flächenspezifischen Ausschöpfungen verglichen:

$$
q = \max(OG_M / FGW_M, OG_A / FGW_A)
$$

Die angezeigten OG enthalten bereits KF, die FGW bereits SW. Pro Gebinde wird eine Messung mit der höchsten ungerundeten Ausschöpfung übernommen. Die Aktivität je Stoffanteil beträgt:

$$
A[\mathrm{Bq}] = OG_M[\mathrm{Bq/g}] \cdot m_{\mathrm{Reststoffanteil}}[\mathrm{kg}] \cdot 1000
$$

Die erfassten Stoffklassenmassen sind bereits Reststoffmassen (Nettomasse ReVK abzüglich Innentara, soweit vorhanden). Die Auswertung zieht keine Innentara erneut ab. Bei Mischgebinden werden nur die Massen der zum jeweiligen Blatt gehörenden Klassen verwendet. Aktivitätssummen entstehen vor Anzeigerundung; fehlende Werte ergeben keine Nullaktivität.

Details und Beispiel: [Gebindeabrechnung](../user-guide/reports.md). Entscheidungen: [ADR-005](../architecture/adr-005-gebindeabrechnung.md).
