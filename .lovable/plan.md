## Ziel

Alle Stage-Detail-Werte (HP, Nm, Preis, Beschreibung, Icon, Stage-Name) kommen aus dem `stages[]`-Array der `engine-details/{id}`-API. Mock-Multiplikatoren in `stageConfigs` entfallen für API-Daten; Mock bleibt nur als Fallback, falls die API keine Stages liefert.

## API-Antwort (bestätigt via Edge-Function-Aufruf)

```json
"stages": [
  { "id": 1, "name": "Stage 1", "hp": 350, "nm": 460, "price": "699.00",
    "description": "<p>Softwareoptimierung ohne Hardware</p>",
    "icon": "uploads/media/...svg", "ecu": 1, "images": [...] },
  { "id": 3, "name": "Stage 2", "hp": 400, "nm": 550, "price": "699.00", ... }
]
```

Wichtig: API liefert **absolute** PS/Nm-Zielwerte (nicht Delta), Stages können fehlen, eine Eco-Stage gibt es in der API nicht.

## Schritte

**1. `src/lib/configurator-store.ts`**
- Neuer Typ `ApiStage { id; name; hp; nm; price; description?; iconUrl?; imageUrls?: string[]; ecuId?: number }`.
- `ConfiguratorApiData` um `stages: ApiStage[]` erweitern.
- `generateRecommendation(vehicle, selectedStage, apiData?)`:
  - Wenn `apiData.stages` vorhanden und nicht leer → Stages **aus der API** bauen:
    - `delta_hp = stage.hp - vehicle.stock_hp`, `delta_nm = stage.nm - vehicle.stock_nm`
    - `estimated_hp/nm` aus API
    - `stage_label = stage.name`, `description = stage.description` (HTML strippen für Plain-Variante)
    - `components`-Liste aus zugeordneten `tuningOptions` (siehe unten)
  - Eco-Stage zusätzlich nur generieren, wenn Diesel und API-Stage 1 vorhanden (lokale Ableitung 95 %).
  - Fallback (keine API-Stages): bisherige Mock-Logik.
- `getStageTotalPrice` so umbauen, dass bei API-Stage der `stage.price` direkt + optional gewählte Tuning-Options aufsummiert wird.

**2. `src/pages/ConfiguratorPageV2.tsx`**
- In `fetchEngineDetails`-Handler `details.stages` parsen und in `apiData.stages` mit `iconUrl`, `imageUrls` über `buildAssetUrl` abbilden.

**3. `src/pages/ConfiguratorResultPageV2.tsx`**
- Stage-Switcher dynamisch aus `result.apiData?.stages` (sonst Fallback `stageConfigs`).
- Anzeige von PS / Nm / Delta / Preis aus den jeweiligen API-Werten.
- Stage-Icon/-Image aus API anzeigen statt der lokalen `Stage1Icon`/`Stage2Icon`-SVGs (Fallback bleibt lokal).
- Komponenten-Liste pro Stage = `apiData.tuningOptions` mit `isMainOption` (oder zugeordnet zu Stage `ecu`).
- Eco-Stage nur anzeigen wenn Diesel **und** mindestens eine API-Stage vorhanden.

## Was bleibt Mock

- Dyno-Kurvenform (Sinus-Approximation mit API-Peak-PS/Nm) — die API liefert keine Drehmoment-/Leistungspunkte über RPM.
- Risiko-Einstufung (low / medium / high) — nicht in API enthalten.
- Eco-Tuning-Stage (API kennt keine Eco-Variante; weiterhin lokal aus Stage 1 abgeleitet, nur Diesel).
- Disclaimer-Text.

## Hinweis

Bestehende gespeicherte Konfigurationen (`/konfigurator/:id`) haben kein `apiData.stages` und nutzen automatisch den Fallback. Für API-Werte muss neu konfiguriert werden.
