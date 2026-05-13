## Logo "exclusiv Automobile Rügen" — Monogramm + Insel

Premium Monogramm-Logo basierend auf der Brand-DNA (Gold #B89968 + Dark-Navy #1B2433). "eA"-Ligatur mit der Rügen-Insel-Silhouette als integrierter Akzent — kein Wortmarken-Logo.

### Designkonzept

- **Monogramm "eA"** in Playfair Display, kursiv. Das geschwungene "e" und das großzügige "A" verschränken sich zu einer Ligatur.
- **Rügen-Silhouette** in Gold, eingebaut als horizontaler Anker — fließt aus dem Querbalken des "A" oder unterstreicht das Monogramm wie eine geographische Grundlinie. Insel-Form anatomisch korrekt (langgestreckte Hauptform mit Halbinsel Wittow oben links, Mönchgut unten rechts).
- **"exclusiv Automobile RÜGEN"** als feines uppercase-Label (tracking-[0.25em]) unter dem Monogramm — sehr eng gesetzt, fungiert als Untertitel, nicht als Hauptelement.

### Drei Ausgabevarianten

```text
1. HORIZONTAL (Header)         2. QUADRATISCH (Favicon)      3. STEMPEL (Footer/Print)
   ┌──────────────────────┐    ┌────────────┐                 ┌──────────────────┐
   │  ╱e╲A   exclusiv     │    │   ╱e╲A     │                 │  ⌜ ╱e╲A ⌝        │
   │ ◢◣◣◢◤  AUTOMOBILE    │    │  ◢◣◣◢◤    │                 │  ◢◣◣◢◤          │
   │       RÜGEN          │    │            │                 │ EST · EXCLUSIV   │
   └──────────────────────┘    └────────────┘                 │ AUTOMOBILE RÜGEN │
                                                              └──────────────────┘
```

### Umsetzung

1. **SVG-Komponente** `src/components/BrandLogo.tsx` (existiert bereits, wird ersetzt). Drei Varianten via Prop:
   - `variant="horizontal"` — Header, Marketplace, Auth-Page
   - `variant="mark"` — kompaktes Quadrat, ohne Untertitel
   - `variant="stamp"` — kreisförmig/wappenartig für Footer
2. **Rügen-Silhouette** als sauberer SVG-Pfad (handgezeichnet, vereinfacht aber wiedererkennbar — Wittow/Jasmund/Mönchgut als drei Halbinsel-Auswüchse), in Gold mit feiner Strichstärke.
3. **Favicon** generiert aus der `mark`-Variante als 512×512 PNG → `public/favicon.png`, `index.html` aktualisiert.
4. **SiteHeader** verwendet `<BrandLogo variant="horizontal" />` statt der drei `<span>`-Elemente.
5. **SiteFooter** bekommt `<BrandLogo variant="stamp" />`.
6. **AdminLayout** Sidebar nutzt `<BrandLogo variant="mark" />`.

### Technische Details

- **Reines SVG**, keine Bilddateien für Header (skaliert verlustfrei, sehr klein, Farben via `currentColor`/CSS-Variablen steuerbar).
- Farben über `hsl(var(--brand-gold))` und `hsl(var(--brand-dark))` — schaltbar je nach Hintergrund (auf dunklem Header: Gold + Weiß; auf hellem Footer: Gold + Dark-Navy).
- Rügen-Pfad als wiederverwendbare Konstante `RUEGEN_PATH` exportiert.
- Favicon: Quadratische SVG → via Sharp/Canvas zu PNG 512×512 mit dunklem Hintergrund + goldenem Monogramm.

### Geänderte Dateien

- `src/components/BrandLogo.tsx` — komplette Neufassung mit 3 Varianten + Rügen-Silhouette
- `src/components/SiteHeader.tsx` — Wortmarke ersetzt
- `src/components/SiteFooter.tsx` — Stempel hinzugefügt
- `src/components/AdminLayout.tsx` — Mark in Sidebar
- `public/favicon.png` — neu generiert
- `public/favicon.ico` — gelöscht (damit Browser das PNG nimmt)
- `index.html` — favicon-Link aktualisiert
