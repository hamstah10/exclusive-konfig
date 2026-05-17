import type { Vehicle, Recommendation, DynoDataPoint } from '@/types/models';

export interface StageConfig {
  stageId: number;
  label: string;
  hpMultiplier: number;
  nmMultiplier: number;
  risk: 'low' | 'medium' | 'high';
  components: string[];
  basePrice: number;
  componentPrices: Record<string, number>;
  description: (v: Vehicle) => string;
}

export function formatPrice(value: number): string {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

export function getStageTotalPrice(cfg: StageConfig): number {
  return cfg.basePrice + Object.values(cfg.componentPrices).reduce((sum, p) => sum + p, 0);
}

function stripHtml(html?: string): string | undefined {
  if (!html) return undefined;
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 0 ? text : undefined;
}

export const stageConfigs: StageConfig[] = [
  {
    stageId: 1,
    label: 'Stage 1 – ECU Optimierung',
    hpMultiplier: 0.22,
    nmMultiplier: 0.20,
    risk: 'low',
    components: ['ECU-Remap', 'Ladedruck-Optimierung', 'Kennfeld-Anpassung'],
    basePrice: 499,
    componentPrices: {
      'ECU-Remap': 499,
      'Ladedruck-Optimierung': 0,
      'Kennfeld-Anpassung': 0,
    },
    description: (v) =>
      `Kennfeldoptimierung für ${v.brand} ${v.model} (${v.engine_code}). Anpassung von Zündung, Ladedruck und Einspritzmenge bei seriennaher Abstimmung mit vollem Komforterhalt.`,
  },
  {
    stageId: 2,
    label: 'Stage 2 – Performance',
    hpMultiplier: 0.35,
    nmMultiplier: 0.30,
    risk: 'medium',
    components: ['ECU-Remap', 'Downpipe', 'Ladeluftkühler-Upgrade', 'Ansaugung', 'Ladedruck-Optimierung'],
    basePrice: 799,
    componentPrices: {
      'ECU-Remap': 799,
      'Downpipe': 890,
      'Ladeluftkühler-Upgrade': 650,
      'Ansaugung': 380,
      'Ladedruck-Optimierung': 0,
    },
    description: (v) =>
      `Performance-Paket für ${v.brand} ${v.model} (${v.engine_code}). Erweiterte Kennfeldoptimierung in Kombination mit Hardware-Upgrades für signifikant gesteigerte Leistung bei kontrolliertem Risiko.`,
  },
  {
    stageId: 3,
    label: 'Eco Tuning – Verbrauchsoptimierung',
    hpMultiplier: 0.22 * 0.95,
    nmMultiplier: 0.20 * 0.95,
    risk: 'low',
    components: ['ECU-Remap', 'Verbrauchs-Optimierung', 'Drehmoment-Anhebung unten'],
    basePrice: 449,
    componentPrices: {
      'ECU-Remap': 449,
      'Verbrauchs-Optimierung': 0,
      'Drehmoment-Anhebung unten': 0,
    },
    description: (v) =>
      `Eco-Tuning für ${v.brand} ${v.model} (${v.engine_code}). Verbrauchsoptimierte Kennfeldanpassung für mehr Drehmoment im unteren Drehzahlbereich bei reduziertem Kraftstoffverbrauch. Nur für Diesel-Motoren verfügbar.`,
  },
];

/** Eco Tuning ist nur für Diesel verfügbar. */
export function getAvailableStages(fuelType?: string): StageConfig[] {
  return stageConfigs.filter((cfg) => cfg.stageId !== 3 || fuelType === 'diesel');
}

export const ECO_STAGE_ID = 3;

export interface ConfiguratorResult {
  id: string;
  createdAt: string;
  vehicle: Vehicle;
  selectedStage: number;
  stages: {
    recommendation: Recommendation;
    dynoPoints: DynoDataPoint[];
    apiStage?: ApiStage;
    /** Total price for this stage; null means price not provided by API. */
    totalPrice: number | null;
  }[];
  apiData?: ConfiguratorApiData;
}

export interface ApiTuningOption {
  id: number;
  name: string;
  iconUrl?: string;
  price?: number;
  description?: string;
}

export interface ApiStage {
  /** API stage id */
  id: number;
  name: string;
  hp: number;
  nm: number;
  price?: number;
  description?: string;
  iconUrl?: string;
  imageUrls?: string[];
  ecuId?: number;
}

export interface ConfiguratorApiData {
  ecuName?: string;
  ecuManufacturer?: string;
  ecuManufacturerLogoUrl?: string;
  tuningOptions: ApiTuningOption[];
  stages?: ApiStage[];
}

export const FAHRZEUGDB_ASSET_BASE = 'https://verwaltung.tuningfux.de';

export function buildAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${FAHRZEUGDB_ASSET_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

// In-memory store (simulates API persistence)
const store = new Map<string, ConfiguratorResult>();

export function saveResult(result: ConfiguratorResult): void {
  store.set(result.id, result);
}

export function getResult(id: string): ConfiguratorResult | undefined {
  return store.get(id);
}

export function getAllResults(): ConfiguratorResult[] {
  return Array.from(store.values());
}

export function getConfiguredVehicles(): Vehicle[] {
  return Array.from(store.values()).map((r) => r.vehicle);
}

export function generateDynoCurve(
  peakHp: number,
  peakNm: number,
  peakHpRpm: number,
  peakNmRpm: number
): DynoDataPoint[] {
  const points: DynoDataPoint[] = [];
  for (let rpm = 1500; rpm <= 7000; rpm += 250) {
    const hpFactor =
      Math.sin(((rpm - 1000) / (peakHpRpm - 1000)) * (Math.PI / 2)) *
      (rpm <= peakHpRpm ? 1 : Math.max(0.7, 1 - (rpm - peakHpRpm) / 3000));
    const nmFactor =
      Math.sin(((rpm - 1000) / (peakNmRpm - 1000)) * (Math.PI / 2)) *
      (rpm <= peakNmRpm ? 1 : Math.max(0.6, 1 - (rpm - peakNmRpm) / 2500));
    points.push({
      rpm,
      power: Math.round(peakHp * Math.max(0.1, hpFactor)),
      torque: Math.round(peakNm * Math.max(0.15, nmFactor)),
    });
  }
  return points;
}

// Simulates AI recommendation generation for all stages
export function generateRecommendation(
  vehicle: Vehicle,
  selectedStage: number = 1,
  apiData?: ConfiguratorApiData,
): ConfiguratorResult {
  const id = crypto.randomUUID();

  const peakHpRpm = vehicle.fuel_type === 'diesel' ? 4200 : 5500;
  const peakNmRpm = vehicle.fuel_type === 'diesel' ? 2200 : 3200;
  const disclaimer =
    'Alle Werte sind fahrzeugspezifische Prognosen basierend auf Referenzmessungen vergleichbarer Fahrzeuge. Tatsächliche Ergebnisse können je nach Zustand, Laufleistung und Umgebungsbedingungen abweichen.';

  const apiStages = apiData?.stages ?? [];
  const useApi = apiStages.length > 0;

  const buildStageEntry = (
    cfg: StageConfig,
    stageId: number,
    estimatedHp: number,
    estimatedNm: number,
    stageLabel: string,
    description: string,
    components: string[],
    apiStage?: ApiStage,
    totalPrice: number | null = null,
  ): ConfiguratorResult['stages'][number] => {
    const deltaHp = estimatedHp - vehicle.stock_hp;
    const deltaNm = estimatedNm - vehicle.stock_nm;

    const recommendation: Recommendation = {
      id: `rec-${id.slice(0, 8)}-s${stageId}`,
      created_at: new Date().toISOString(),
      vehicle_id: vehicle.id,
      stage_id: stageId,
      stage_label: stageLabel,
      delta_hp: deltaHp,
      delta_nm: deltaNm,
      estimated_hp: estimatedHp,
      estimated_nm: estimatedNm,
      risk_assessment: cfg.risk,
      description,
      disclaimer,
      components,
    };

    const dynoPoints = generateDynoCurve(estimatedHp, estimatedNm, peakHpRpm, peakNmRpm);
    return { recommendation, dynoPoints, apiStage, totalPrice };
  };

  const apiComponents = (apiData?.tuningOptions ?? [])
    .map((option) => option.name.trim())
    .filter((name) => name.length > 0);

  const stages: ConfiguratorResult['stages'] = useApi
    ? (() => {
        const mappedStages = apiStages.map((apiStage, index) => {
          const stageId = index + 1;
          const fallbackCfg = stageConfigs[index] ?? stageConfigs[stageConfigs.length - 1];
          const estimatedHp = Math.max(apiStage.hp, vehicle.stock_hp);
          const estimatedNm = Math.max(apiStage.nm, vehicle.stock_nm);
          const description = stripHtml(apiStage.description) ?? fallbackCfg.description(vehicle);
          const components = apiComponents.length > 0 ? apiComponents : fallbackCfg.components;

          return buildStageEntry(
            fallbackCfg,
            stageId,
            estimatedHp,
            estimatedNm,
            apiStage.name || `Stage ${stageId}`,
            description,
            components,
            apiStage,
            typeof apiStage.price === 'number' ? apiStage.price : null,
          );
        });

        if (vehicle.fuel_type === 'diesel' && apiStages[0]) {
          const ecoCfg = stageConfigs.find((cfg) => cfg.stageId === ECO_STAGE_ID) ?? stageConfigs[0];
          const baseStage = apiStages[0];
          const ecoStage: ApiStage = {
            ...baseStage,
            id: -1,
            name: 'Eco Tuning – Verbrauchsoptimierung',
            hp: Math.round(baseStage.hp * 0.95),
            nm: Math.round(baseStage.nm * 0.95),
            price: typeof baseStage.price === 'number' ? Math.round(baseStage.price * 0.9) : undefined,
            description: undefined,
            iconUrl: undefined,
            imageUrls: undefined,
          };

          mappedStages.push(
            buildStageEntry(
              ecoCfg,
              ECO_STAGE_ID,
              ecoStage.hp,
              ecoStage.nm,
              ecoStage.name,
              ecoCfg.description(vehicle),
              apiComponents.length > 0 ? apiComponents : ecoCfg.components,
              ecoStage,
              typeof ecoStage.price === 'number' ? ecoStage.price : null,
            ),
          );
        }

        return mappedStages;
      })()
    : getAvailableStages(vehicle.fuel_type).map((cfg) => {
        const estimatedHp = vehicle.stock_hp + Math.round(vehicle.stock_hp * cfg.hpMultiplier);
        const estimatedNm = vehicle.stock_nm + Math.round(vehicle.stock_nm * cfg.nmMultiplier);

        return buildStageEntry(
          cfg,
          cfg.stageId,
          estimatedHp,
          estimatedNm,
          cfg.label,
          cfg.description(vehicle),
          cfg.components,
          undefined,
          getStageTotalPrice(cfg),
        );
      });

  const result: ConfiguratorResult = {
    id,
    createdAt: new Date().toISOString(),
    vehicle,
    selectedStage,
    stages,
    apiData,
  };

  saveResult(result);
  return result;
}
