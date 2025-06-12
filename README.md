# Referats-Zuweisung per Zufall – WebApp

Diese kleine Webanwendung hilft bei der **zufälligen Zuweisung von Schüler:innen zu Themen oder Terminen** – z. B. für Referate.

---

## 🧭 Funktionen für Nutzer:innen

### 🔁 Listen verwalten
- Du kannst mehrere **Listen** anlegen, um Schüler:innen-Gruppen für verschiedene Themen oder Klassen zu verwalten.
- Listen lassen sich **benennen**, **duplizieren**, **löschen** und in der Kopfzeile **umbenennen**.

### ➕ Namen verwalten
- Namen können manuell hinzugefügt, bearbeitet oder gelöscht werden.
- Per Eingabetaste (`Enter`) im Eingabefeld wird ein neuer Name direkt gespeichert.
- Die Reihenfolge der Namen lässt sich per **Drag & Drop** ändern.

### 🎲 Zufallsauswahl
- Die gewünschte Anzahl von Schüler:innen kann über das Dropdown ausgewählt werden.
- **Einträge mit `*` im Namen** (z. B. `Sofia*`) werden mit höherer Wahrscheinlichkeit gezogen.
- Jeder gezogene Name wird mit Nummerierung und Abstand angezeigt.

### 💾 Datenhaltung
- Die Anwendung speichert automatisch alle Änderungen im Browser (localStorage).
- Mit einem Klick kannst du:
  - deine Daten als JSON exportieren,
  - ein Backup lokal speichern oder
  - ein vorhandenes Backup (JSON-Datei) importieren.

### 📤 Exporte
- Listen lassen sich als **CSV-Datei** exportieren – z. B. zur Weiterverarbeitung in Excel.

---

## 📄 Technische Hinweise

### Voraussetzungen
Die App läuft **offline** im Browser. Es ist kein Server oder Internetzugang notwendig.

### Nutzung
Einfach `index.html` im Browser öffnen. Die Datei kann lokal auf dem Rechner gespeichert oder z. B. über Schulplattformen verteilt werden.

---

## 🧠 Tipps
- Nutze das **Sternchen `*`** für Namen, die beim Zufall häufiger gezogen werden sollen.
- Ziehe und sortiere Einträge manuell, wenn du gezielt Reihenfolgen brauchst.
- Mache regelmäßig ein Backup, wenn du mit mehreren Browsern oder Geräten arbeitest.

