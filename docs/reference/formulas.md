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

## 5) Messobjekt und automatische Pfadwahl

Die zulässigen Pfade des Messobjekts sind die Schnittmenge der zulässigen Hauptpfade seiner Gebinde. Für jeden Kandidaten müssen sämtliche gültigen Messungen jedes Gebindes die Primär- und Zusatzprüfung bestehen. Massenpfade werden vor Flächenpfaden geprüft; innerhalb einer Einheit gilt aufsteigend:

$$
S(p) = \min_m \left(FGW_{NV(m),p} \cdot SW_{Jahr(m),Gerät(m),p}\right)
$$

Das manuelle Messdatum hat Vorrang. KF bleibt Bestandteil des Bestehensvergleichs und gehört nicht zum Sortierwert. Der erste gemeinsam bestandene Pfad gilt für alle Mitglieder.

## 6) Maßgebliche Messungen und Gesamtaktivität

In der Tagesabrechnung werden die Messungen mit der höchsten massen- und flächenspezifischen Ausschöpfung getrennt bestimmt. Fallen beide Maxima auf dieselbe Messung, wird diese einmal angezeigt. Die Gesamtaktivität verwendet weiterhin die Messung mit der höchsten **Massenausschöpfung**:

$$
m^* = \operatorname{argmax}_m \frac{OG_{M,m}}{FGW_{M,m}}, \qquad
A[\mathrm{Bq}] = OG_{M,m^*}[\mathrm{Bq/g}] \cdot m_{\mathrm{Reststoff}}[\mathrm{kg}] \cdot 1000
$$

Die angezeigten OG enthalten bereits KF, die FGW bereits SW. Vergleiche und Summen verwenden ungerundete Werte.

Die erfassten Stoffklassenmassen sind bereits Reststoffmassen (Nettomasse ReVK abzüglich Innentara, soweit vorhanden). Die Auswertung zieht keine Innentara erneut ab. Bei Mischgebinden werden nur die Massen der zum jeweiligen Blatt gehörenden Klassen verwendet. Aktivitätssummen entstehen vor Anzeigerundung; fehlende Werte ergeben keine Nullaktivität.

Details und Beispiel: [Gebindeabrechnung](../user-guide/reports.md). Entscheidungen: [ADR-005](../architecture/adr-005-gebindeabrechnung.md).

## 7) MC2-Messhilfe

Für eine angenommene Bruttoimpulsrate wird der Nulleffekt abgezogen und mit der bestehenden MC2-Auswertung die obere Vertrauensgrenze berechnet. Die MC2-Messhilfe verwendet ausschließlich Oberflächen-Freigabewerte in Bq/cm² aus Haupt- und Zusatzpfad (OF, 3a, 4a, 5b). Massenbezogene Freigabewerte werden weder umgerechnet noch für die Impulsratengrenze verwendet. Die Nachweisgrenze muss kleiner als `NV-Freigabewert × SW` sein. Die zulässige unkorrigierte OG entspricht je Oberflächenprüfung `NV-Freigabewert × SW × KF`. Die engste Oberflächengrenze bestimmt die zulässige Rate; die Anzeige wird auf 0,01 Ips abgerundet.

Standardwerte: Nulleffekt 5 Ips, Nulleffektmesszeit 100 s, Messzeit 10 s. Die Detektorfläche beträgt 177 cm². Ohne Oberflächen-Freigabewert wird keine Impulsratengrenze angegeben. Bezugsmasse und Umrechnungsfaktor sind für die MC2-Messhilfe nicht erforderlich.

## 8) Negative Nettoeffekte

Für aktuelle Auswertungen gilt bei MC2 und Gammaspektrometrie gleichermaßen: Ein negativer Nettoeffekt geht effektiv als 0 ein. Das gilt unabhängig vom Importdatum.

Bei MC2 wird die effektive Nettoimpulsrate auf mindestens 0 begrenzt. Die statistische Unsicherheit verwendet weiterhin die gemessenen Brutto- und Hintergrundzählraten; Nachweisgrenzen und Konfidenzgrenzen werden weiterhin berechnet. Bei GS wird jeder negative ME-Wert im Originalprotokoll vor der Summenbildung auf 0 begrenzt. UG, OG und BS bleiben unverändert. Originalprotokolle und signierte Messdaten werden nicht überschrieben. Fehlt ein benötigtes Original, wird die Auswertung als nicht verfügbar angezeigt.

Neue Abrechnungen verwenden Berichtssnapshot v8. Er enthält die für die GS-Prüfung benötigten Originalprotokolle innerhalb der bestehenden Größenbegrenzung. Bereits ausgestellte Abrechnungen bis v7 bleiben mit ihren damaligen Rechenregeln prüfbar. Beim Rollout zuerst die Clients mit v8-Leseunterstützung aktualisieren, danach den Server auf v8-Erstellung umstellen; offene ältere Abrechnungsvorbereitungen müssen neu erstellt werden.
