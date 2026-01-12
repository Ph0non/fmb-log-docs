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
