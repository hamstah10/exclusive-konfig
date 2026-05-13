# Tuning Configurator

Standalone Web-App: Fahrzeugspezifische Tuning-Empfehlungen für Stage 1, 2 und 3 mit Live-Dyno-Prognose und Vergleichsmodus. Gebaut mit React 18, Vite, TypeScript, Tailwind CSS und shadcn/ui.

## Routen

- `/` — Configurator (Fahrzeug auswählen, Stage wählen)
- `/configurator/:id` — Ergebnis-Seite mit Leistungskurve und Komponentenliste
- `*` — 404

## Themes

- **Hell** (Default) und **Dunkel** umschaltbar über den Sonne/Mond-Button oben rechts.
- Auswahl wird in `localStorage` (`theme`) gespeichert; ein Inline-Script in `index.html` verhindert FOUC.

## Schnellstart

```bash
npm install
npm run dev
```

Läuft unter http://localhost:8080.

## Fahrzeugdatenbank-API

Externer Endpoint: `https://verwaltung.tuningfux.de/api/fahrzeugdatenbank` (Token aktuell in `src/lib/fahrzeugdatenbank-api.ts`; für Produktion über Edge Function proxyen).
