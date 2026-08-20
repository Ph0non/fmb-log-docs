# ADR‑004: Historische TSA‑Vertrauensprofile und Erneuerungsnachweise

- **Status:** teilweise umgesetzt
- **Datum:** 2026‑08‑20

## Kontext

RFC‑3161‑Zeitstempel belegen, dass ein bestimmter Hash spätestens zum im Token
genannten Zeitpunkt vorlag. TSA‑Betreiber können später Zertifikatsketten,
Signaturalgorithmen oder Tokenformate ändern. Ein ausschließlich auf das aktuelle
TSA‑Verfahren festgelegter Prüfer kann dadurch ein früher korrekt ausgestelltes
Token nicht mehr verifizieren.

Dieser Fehler darf nicht durch das Ignorieren einer ungültigen Zertifikatskette,
eine manuelle Freigabe oder das Überschreiben des ursprünglichen Tokens verborgen
werden. Ein heutiger Nachweis kann außerdem keinen verlorenen Nachweis für den
ursprünglichen Erstellungszeitpunkt ersetzen.

## Entscheidung

FMB Log soll historische Zeitstempel mit **versionierten, unveränderlichen
TSA‑Vertrauensprofilen** prüfen:

1. Jedes Profil enthält den Anbieter, fest gepinnte Root-/Intermediate-Zertifikate,
   erlaubte Algorithmen und ein begrenztes Ausstellungszeitfenster.
2. Ein Profil wird über das im Token referenzierte Signierzertifikat und dessen
   gepinnten Fingerprint ausgewählt und darf nur verwendet werden, wenn der
   signierte `genTime` innerhalb der Zertifikatsgültigkeit liegt. Datenbankfelder
   oder eine aktuelle Administratoreinstellung dürfen das Profil nicht auswählen
   oder zurückdatieren.
3. Der Verifier wählt den RSA-/ECDSA-Prüfpfad ausschließlich anhand der signierten
   Algorithmuskennungen und des öffentlichen Schlüssels im validierten Zertifikat.
   Ein Profil darf keine algorithmische Abweichung oder automatische Fallback-Prüfung
   erlauben.
4. Unabhängig vom Profil bleiben CMS‑Signatur, Message‑Imprint, Token‑Hash,
   Zertifikatskette, EKU `timeStamping` und Zertifikatsgültigkeit zum `genTime`
   verpflichtend. Ein historisches Profil lockert keine kryptografische Prüfung.
5. Das ursprüngliche Token und die Audit-Historie bleiben unverändert. Ein neuer
   Prüflauf nennt zusätzlich Verifier-Version und Kennung des verwendeten
   Vertrauensprofils.
6. Verifier-Version und Fingerprints aller Profilbestandteile fließen in den
   Audit-Cache-Schlüssel ein. Änderungen an Prüflogik oder Trust Store erzwingen
   dadurch eine vollständige Neuprüfung statt alte Cache-Ergebnisse zu übernehmen.

Für FreeTSA sind derzeit zwei Blattzertifikate fest gepinnt:

| Profil | Verfahren | Zertifikatsgültigkeit | SHA-256-Fingerprint |
| --- | --- | --- | --- |
| `freetsa-rsa-2016-2026` | RSA 4096 / PKCS#1 v1.5 mit SHA-2 | 13.03.2016–11.03.2026 | `4694BE23C3A53004444B1705BFE5A7F50A6D2A1638194F23C0F389B68BD78A75` |
| `freetsa-p384-2026-2040` | ECDSA P-384 mit SHA-2 | 15.02.2026–02.02.2040 | `32E841A95CC1164101FFDE41298EF2FC75C1C4372EF095E88A6BBD47DFB191FC` |

Beide Profile müssen zur fest gepinnten FreeTSA Root CA mit Fingerprint
`A6379E7CECC05FAA3CBF076013D745E327BBBAA38C0B9AF22469D4701D18AABC`
verketten. Das Profil wird anhand des im Token signierten SignerIdentifier, des
eingebetteten Blattzertifikats und dessen Fingerprint gewählt. `genTime` begrenzt
das ausgewählte Profil zusätzlich auf die Zertifikatsgültigkeit, darf aber niemals
allein ein Profil auswählen. Das abgelaufene RSA-Zertifikat wird dadurch nicht zum
Trust Anchor und eine Signatur nach seinem Ablauf bleibt ungültig.

Wenn ein Token auch mit einem nachweislich damals freigegebenen Profil nicht
kryptografisch validiert werden kann, bleibt es fehlerhaft. Optional kann ein
**Erneuerungsnachweis** erzeugt werden. Dieser enthält in kanonischer Form mindestens:

- Report-ID sowie Snapshot- und PDF-Hash,
- Hash des ursprünglichen TSA‑Tokens,
- ursprünglichen `genTime` und den unveränderten Fehlerstatus,
- Grund und Version des Erneuerungsverfahrens.

Der Hash dieser Aussage wird mit dem aktuellen Signierverfahren signiert und erneut
RFC‑3161‑zeitgestempelt. Damit wird nur bewiesen, dass die alte Evidenz und die
zugehörigen Reportdaten spätestens zum Erneuerungszeitpunkt unverändert vorlagen.
Der Erneuerungsnachweis behauptet ausdrücklich **nicht**, die Gültigkeit zum alten
Zeitpunkt wiederhergestellt zu haben.

## Konsequenzen

- Alte TSA‑Roots dürfen nur aufgenommen werden, wenn ihre frühere Freigabe und ihr
  Fingerprint aus einer vertrauenswürdigen Quelle belegt sind.
- Neue Zeitstempel verwenden ausschließlich das aktuelle Profil.
- Die Historie muss Originalstatus und gegebenenfalls Erneuerungsstatus getrennt
  darstellen: beispielsweise „ursprünglicher Zeitnachweis nicht verifizierbar“ und
  „Unverändertheit seit Erneuerung am … bestätigt“.
- Es gibt keinen Schalter „TSA‑Fehler akzeptieren“ und keine automatische
  Umwandlung eines Fehlers in eine Warnung.

## Noch benötigte Umsetzung

- End-to-End-Regressionstest mit einem tatsächlich vor März 2026 ausgestellten,
  archivierten RFC-3161-Token; Zertifikat, Kette und RSA-Verifikationspfad sind
  bereits als getrennte Regressionstests abgedeckt;
- Archivierung und Prüfung zeitbezogener Sperrinformationen (CRL/OCSP), soweit der
  Anbieter belastbare historische Nachweise bereitstellt;
- append-only Tabelle und signierter Nachrichtentyp für Erneuerungsnachweise;
- getrennte Anzeige beider Nachweise in Historie und Audit.
