## Ziel

Unter dem bestehenden Brand-Refresh-Block (dunkler Bereich mit Logo + 4 Brand-Bausteinen) einen erweiterten Content-Showcase ergänzen, der den modernen, filigranen Logo-Stil demonstriert: dünne Linien, viel Weißraum, Lowercase-Typo, Silber/Navy/Gold, präzise Geometrie.

Alle neuen Elemente bleiben in der bestehenden dunklen Sektion auf `/dokumentation` (eine zusammenhängende Brand-Showcase-Section, keine neue Route).

## Aufbau (in dieser Reihenfolge unterhalb der vier Brand-Bausteine)

### 1. Brand-Specimen (Style-Guide-Block)
Dreigeteilter Block mit dünnen Trennlinien:
- **Typo-Skala** — vier Stufen (Display 64px, Headline 32px, Body 16px, Eyebrow 11px) mit Beispieltext, jeweils mit Label „type / 64 · display" links daneben
- **Farbpalette** — drei Chips als schmale Hochrechtecke (Navy, Gold, Silver), jeweils mit HEX-Wert in Mono-Optik
- **Logo-Lockups** — drei Größen des Logos nebeneinander (S/M/L), mit dünner Hilfslinie als Baseline darunter

### 2. Zwei Mini-Hero-Beispiele
Side-by-side Cards (2-spaltig, einspaltig auf mobile), je mit:
- Großer Display-Headline mit goldenem Italic-Akzent
- Eine Zeile Eyebrow-Text
- Schlanker Outline-Button (1px Border, uppercase, viel Letter-Spacing)
- Sehr dünne Hairline-Trenner

Beispiel-Inhalte:
- „more joy of driving." (Hero für Tuning)
- „handverlesen. heimat." (Hero für Fahrzeugbörse)

### 3. Card-Set (3 Karten)
Drei schmale Service-Karten im neuen Stil:
- Nur dünner Border, kein Fill
- Nummerierung „01 / 02 / 03" in Mono-Optik
- Lowercase-Titel, kurzer Body, dezenter Pfeil-Link
Themen: „prüfstand", „chiptuning", „ankauf"

## Stil-Regeln für alle neuen Elemente

- Bleibt im dunklen Section-Container (`bg-[hsl(var(--brand-dark))]`)
- Borders: `border-white/10` bis `border-white/20`, niemals fülle Flächen mit Farbe (außer Gold-Akzent als 1px-Linie oder Mini-Chip)
- Typografie: Display-Texte in **lowercase**, mit Letter-Spacing leicht positiv; Eyebrows uppercase mit `tracking-[0.3em]`
- Buttons: nur Outline-Variante, kein Fill
- Goldene Akzente sparsam — nur ein Element pro Karte/Block

## Technische Umsetzung

- Eine Datei: `src/pages/DokumentationPage.tsx` erweitern (innerhalb der bestehenden Brand-Refresh-`<section>`, unter dem 4er-Grid)
- Keine neuen Komponenten, kein Routing, keine Daten
- Tailwind-only, keine neuen Dependencies
- Responsive: Specimen + Heroes 2-spaltig ab `md:`, Card-Set 3-spaltig ab `lg:`

## Out of scope

- Übertragung des Stils auf andere Seiten (Landing, Marktplatz etc.)
- Änderungen am Logo selbst
- Änderungen am Design-Token-System (`index.css`)
