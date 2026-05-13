// Fahrzeugdatenbank API service
// Calls go through the Supabase Edge Function `fahrzeugdatenbank`,
// which injects the upstream Bearer token + X-Token-Id server-side.

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID as string;
const API_BASE = `https://${PROJECT_ID}.supabase.co/functions/v1/fahrzeugdatenbank`;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  apikey: PUBLISHABLE_KEY,
  Authorization: `Bearer ${PUBLISHABLE_KEY}`,
};

export interface VehicleType {
  id: number;
  name: string;
}

export interface VehicleBrand {
  id: number;
  name: string;
}

export interface VehicleSeries {
  id: number;
  name: string;
}

export interface VehicleModel {
  id: number;
  name: string;
}

export interface VehicleEngine {
  id: number;
  name: string;
}

export interface EngineDetails {
  engine: Record<string, unknown>;
  brand: Record<string, unknown>;
  series: Record<string, unknown>;
  stages: unknown[];
  ecus: unknown[];
  gearboxes: unknown[];
  settings: Record<string, unknown>;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  const json = await res.json();
  // API wraps responses in { data: ... }
  return json.data !== undefined ? json.data : json;
}

export function isConfigured(): boolean {
  return Boolean(PROJECT_ID && PUBLISHABLE_KEY);
}

export async function fetchTypes(): Promise<VehicleType[]> {
  return apiFetch<VehicleType[]>('/types');
}

export async function fetchBrands(typeId: number): Promise<VehicleBrand[]> {
  return apiFetch<VehicleBrand[]>(`/brands/${typeId}`);
}

export async function fetchSeries(brandId: number): Promise<VehicleSeries[]> {
  return apiFetch<VehicleSeries[]>(`/series/${brandId}`);
}

export async function fetchModels(seriesId: number): Promise<VehicleModel[]> {
  return apiFetch<VehicleModel[]>(`/models/${seriesId}`);
}

export async function fetchEngines(modelId: number): Promise<VehicleEngine[]> {
  return apiFetch<VehicleEngine[]>(`/engines/${modelId}`);
}

export async function fetchEngineDetails(engineId: number, stageId?: number, templateVariant?: string): Promise<EngineDetails> {
  const params = new URLSearchParams();
  if (stageId !== undefined) params.set('stageId', String(stageId));
  if (templateVariant) params.set('templateVariant', templateVariant);
  const qs = params.toString();
  return apiFetch<EngineDetails>(`/engine-details/${engineId}${qs ? `?${qs}` : ''}`);
}

export async function trackEvent(data: Record<string, unknown>): Promise<void> {
  await fetch(`${API_BASE}/track`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}
