# Plan: Configurator V2

## Routing & Einstieg

- Neue Routen in `src/App.tsx`:
  - `/v2` → `ConfiguratorPageV2`
  - `/v2/configurator/:id` → `ConfiguratorResultPageV2`
- Toggle „V1 / V2" im Header beider Startseiten (`/` und `/v2`), klein neben `ThemeToggle`. Aktueller Pfad bestimmt aktiven Zustand, Klick navigiert zur jeweils anderen Variante.
- V1 bleibt unverändert.

## Flow auf `/v2` (ConfiguratorPageV2)

Schritt-Logik via lokalem State `step: 'select' | 'configure'`:

**Schritt 1 – Fahrzeug wählen** (`step === 'select'`)
- Header + Schnellsuche + Marke/Modell/Baujahr/Motorcode/ECU/Getriebe/Kraftstoff/PS/Nm wie heute.
- **Keine** Stage-Karten, **keine** Live-Preview, **kein** Submit-Button.
- Statt Submit: Button „Weiter zur Stage-Auswahl" (enabled wenn `isValid`).
- Auto-Detect-Banner bleibt.

**Schritt 2 – Stage konfigurieren** (`step === 'configure'`)
- Oben kompakte Fahrzeug-Zusammenfassung (Marke/Modell, Motorcode, Stock PS/Nm) + Button „Fahrzeug ändern" → zurück zu Schritt 1 (State bleibt erhalten).
- Stage-Karten (wie heute) + Live-Preview.
- Submit „Stage X Empfehlung generieren" → erzeugt Result, Navigation zu `/v2/configurator/:id`.

## Result-Page V2 (`ConfiguratorResultPageV2`)

Basiert auf der bestehenden Result-Page mit folgenden Änderungen:

- **Stats-Row**: „Risiko" und „Erstellt" entfernen → zwei Karten bleiben (PS, Nm). Grid auf `md:grid-cols-2` reduzieren oder durch zwei zusätzliche Stats ersetzen (z. B. „Stage" + „Gesamtpreis"). Vorschlag: durch **Stage-Label** und **Gesamtpreis** ersetzen, damit Layout 4-spaltig bleibt.
- **Tuning-Optionen Sektion** (neu, unter Komponenten/Beschreibung):
  - Überschrift „Tuning-Optionen" + Untertitel „Verfügbare Zusatz-Features für diese Stage".
  - Grid mit Icon + Label-Kacheln (statisch, nur Anzeige):
    - **ECU Hersteller** (eigener Block oben mit Badge: abgeleitet aus `vehicle.ecu_type` → `Bosch`, `Siemens`, `Marelli`, `Continental`, `Delphi`, sonst „ECU"; Pill-Style mit kleinem Logo-Kürzel).
    - Optionen: `DTC OFF`, `E85 Flex-Fuel`, `Kaltstart OFF`, `KAT OFF`, `Pops & Bangs`, `V/MAX Off`, `Vmax 30`.
  - Lucide-Icons als Platzhalter: `Settings2`, `Snowflake`, `Flame`, `Gauge`, `Lock`, `Zap`, `Fuel`. Pro Kachel: Icon links, Label rechts, `bg-card border rounded-md p-3`.
  - Hinweistext: „Optionen sind informativ – bitte beim Termin freischalten lassen."
- **Disclaimer & API Trace** bleiben.
- Header: Statt „Neue Konfiguration" → Link zu `/v2`.

## ECU-Hersteller-Ableitung

Hilfsfunktion `getEcuManufacturer(ecuType?: string): string` in `src/lib/configurator-store.ts` (oder neuer `src/lib/ecu.ts`):
```ts
if (/bosch/i) return 'Bosch';
if (/marelli/i) return 'Marelli';
if (/siemens|simos/i) return 'Siemens';
if (/conti/i) return 'Continental';
if (/delphi/i) return 'Delphi';
return 'ECU';
```

## Geteilte Bausteine

- `VehicleSearch`, `ThemeToggle`, `stageConfigs`, `generateRecommendation`, `getResult` werden wiederverwendet.
- Keine Änderungen an V1-Pages, Store oder Datentypen.

## Neue / geänderte Dateien

- `src/App.tsx` – Routes `/v2`, `/v2/configurator/:id`.
- `src/components/VersionToggle.tsx` – kleiner V1/V2-Switch (Headerelement).
- `src/pages/ConfiguratorPageV2.tsx` – neuer Zwei-Schritt-Flow.
- `src/pages/ConfiguratorResultPageV2.tsx` – Stats angepasst, Tuning-Optionen, ECU-Badge.
- `src/lib/ecu.ts` – `getEcuManufacturer` Helper.
- `src/pages/ConfiguratorPage.tsx`, `src/pages/ConfiguratorResultPage.tsx` – nur Header bekommen `<VersionToggle />`.
- Memory `mem://features/configurator` + `mem://index.md` – V2-Flow notieren.

## Offen / Annahmen

- Tuning-Optionen-Liste ist für alle Stages identisch (nur Anzeige). Falls stage-spezifisch gewünscht, später erweiterbar.
- Stats-Karten „Risiko/Erstellt" werden durch „Stage/Gesamtpreis" ersetzt. Falls stattdessen 2-spaltig gewünscht, sag Bescheid.
