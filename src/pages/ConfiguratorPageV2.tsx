import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Zap, ArrowRight, Loader2, Shield, AlertTriangle, Gauge, Sparkles } from 'lucide-react';
import { Leaf, Star } from 'lucide-react';
import { Stage1Icon, Stage2Icon } from '@/components/StageIcons';
import { Button } from '@/components/ui/button';
import { generateRecommendation, getStageTotalPrice, formatPrice, getAvailableStages, ECO_STAGE_ID, stageConfigs, buildAssetUrl, type ConfiguratorApiData, type ApiTuningOption } from '@/lib/configurator-store';
import VehicleSearch from '@/components/VehicleSearch';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import type { VehicleSpec } from '@/lib/vehicle-database';
import type { Vehicle } from '@/types/models';
import {
  fetchTypes, fetchBrands, fetchSeries, fetchModels, fetchEngines, fetchEngineDetails,
  type VehicleType, type VehicleBrand, type VehicleSeries, type VehicleModel, type VehicleEngine,
} from '@/lib/fahrzeugdatenbank-api';

const transmissions: Vehicle['transmission'][] = ['manual', 'automatic', 'dsg', 'dct', 'cvt'];
const fuelTypes: Vehicle['fuel_type'][] = ['petrol', 'diesel', 'hybrid', 'electric'];

const transmissionLabels: Record<string, string> = {
  manual: 'Schaltgetriebe', automatic: 'Automatik', dsg: 'DSG', dct: 'DCT', cvt: 'CVT',
};
const fuelLabels: Record<string, string> = {
  petrol: 'Benzin', diesel: 'Diesel', hybrid: 'Hybrid', electric: 'Elektrisch',
};

function mapFuel(raw: unknown): Vehicle['fuel_type'] | null {
  if (typeof raw !== 'string') return null;
  const v = raw.toLowerCase();
  if (v.includes('diesel')) return 'diesel';
  if (v.includes('benz') || v.includes('petrol') || v.includes('otto')) return 'petrol';
  if (v.includes('hybrid')) return 'hybrid';
  if (v.includes('elektr') || v.includes('electric') || v === 'ev') return 'electric';
  return null;
}

function pickNum(obj: Record<string, unknown> | undefined, keys: string[]): number {
  if (!obj) return 0;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'number' && !Number.isNaN(v)) return Math.round(v);
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Math.round(Number(v));
  }
  return 0;
}

const riskIcons: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  low: { icon: <Shield className="h-4 w-4" />, color: 'text-[hsl(var(--success))]', label: 'Niedrig' },
  medium: { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-[hsl(var(--warning))]', label: 'Mittel' },
  high: { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-[hsl(var(--destructive))]', label: 'Hoch' },
};

export default function ConfiguratorPageV2() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState(1);
  const [autoDetected, setAutoDetected] = useState(false);
  const [form, setForm] = useState({
    brand: '', model: '',
    transmission: 'manual' as Vehicle['transmission'],
    fuel_type: 'petrol' as Vehicle['fuel_type'],
    stock_hp: 0, stock_nm: 0,
  });

  // Cascade state (API-driven)
  const [typeId, setTypeId] = useState<number | null>(null);
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [seriesList, setSeriesList] = useState<VehicleSeries[]>([]);
  const [modelsList, setModelsList] = useState<VehicleModel[]>([]);
  const [enginesList, setEnginesList] = useState<VehicleEngine[]>([]);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [seriesId, setSeriesId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);
  const [engineId, setEngineId] = useState<number | null>(null);
  const [apiData, setApiData] = useState<ConfiguratorApiData | undefined>(undefined);
  const [cascadeLoading, setCascadeLoading] = useState<'brands' | 'series' | 'models' | 'engines' | 'details' | null>(null);
  const [cascadeError, setCascadeError] = useState<string | null>(null);

  const isValid = form.brand.trim() !== '' && form.model.trim() !== '';

  // Init: fetch types and pick first (typically PKW)
  useEffect(() => {
    fetchTypes()
      .then((types: VehicleType[]) => {
        const pkw = types.find((t) => t.name?.toLowerCase().includes('pkw')) ?? types[0];
        if (pkw) setTypeId(pkw.id);
      })
      .catch((err) => setCascadeError(err instanceof Error ? err.message : 'Fehler beim Laden'));
  }, []);

  // Brands when type ready
  useEffect(() => {
    if (typeId === null) return;
    setCascadeLoading('brands');
    fetchBrands(typeId)
      .then(setBrands)
      .catch((err) => setCascadeError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setCascadeLoading((p) => (p === 'brands' ? null : p)));
  }, [typeId]);

  // Series when brand chosen
  useEffect(() => {
    setSeriesList([]); setModelsList([]); setEnginesList([]);
    setSeriesId(null); setModelId(null); setEngineId(null);
    if (brandId === null) return;
    setCascadeLoading('series');
    fetchSeries(brandId)
      .then(setSeriesList)
      .catch((err) => setCascadeError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setCascadeLoading((p) => (p === 'series' ? null : p)));
  }, [brandId]);

  // Models when series chosen
  useEffect(() => {
    setModelsList([]); setEnginesList([]);
    setModelId(null); setEngineId(null);
    if (seriesId === null) return;
    setCascadeLoading('models');
    fetchModels(seriesId)
      .then(setModelsList)
      .catch((err) => setCascadeError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setCascadeLoading((p) => (p === 'models' ? null : p)));
  }, [seriesId]);

  // Engines when model chosen
  useEffect(() => {
    setEnginesList([]);
    setEngineId(null);
    if (modelId === null) return;
    setCascadeLoading('engines');
    fetchEngines(modelId)
      .then(setEnginesList)
      .catch((err) => setCascadeError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setCascadeLoading((p) => (p === 'engines' ? null : p)));
  }, [modelId]);

  // Engine details → autofill PS/Nm/Fuel + brand/model
  useEffect(() => {
    if (engineId === null) return;
    setCascadeLoading('details');
    setCascadeError(null);
    fetchEngineDetails(engineId)
      .then((details) => {
        const engine = details.engine ?? {};
        const stockHp = pickNum(engine, ['horsepower', 'power', 'ps', 'hp', 'kw_power', 'series_power']);
        const stockNm = pickNum(engine, ['torque', 'nm', 'series_torque']);
        const fuel = mapFuel((engine as Record<string, unknown>).fuel ?? (engine as Record<string, unknown>).fuel_type);
        const brandName = (details.brand?.name as string | undefined) ?? brands.find((b) => b.id === brandId)?.name ?? '';
        const engineName = enginesList.find((e) => e.id === engineId)?.name ?? '';
        const modelName = modelsList.find((m) => m.id === modelId)?.name ?? '';
        setForm((prev) => ({
          ...prev,
          brand: brandName,
          model: [modelName, engineName].filter(Boolean).join(' ').trim() || prev.model,
          stock_hp: stockHp || prev.stock_hp,
          stock_nm: stockNm || prev.stock_nm,
          fuel_type: fuel ?? prev.fuel_type,
        }));

        // Extract ECU + tuning options from API
        const ecus = (details.ecus ?? []) as Array<Record<string, unknown>>;
        const ecu = ecus[0];
        const rawOptions = (ecu?.options ?? []) as Array<Record<string, unknown>>;
        const tuningOptions: ApiTuningOption[] = rawOptions.map((o) => ({
          id: Number(o.id),
          name: String(o.name ?? ''),
          iconUrl: buildAssetUrl(typeof o.icon === 'string' ? o.icon : undefined),
          price: typeof o.price === 'number' ? o.price : (typeof o.price === 'string' ? Number(o.price) : undefined),
          description: typeof o.description === 'string' ? o.description : undefined,
        }));
        setApiData({
          ecuName: typeof ecu?.name === 'string' ? ecu.name : undefined,
          ecuManufacturer: typeof ecu?.manufacturer === 'string' ? ecu.manufacturer : undefined,
          ecuManufacturerLogoUrl: buildAssetUrl(typeof ecu?.manufacturerLogo === 'string' ? ecu.manufacturerLogo as string : undefined),
          tuningOptions,
        });
        setAutoDetected(true);
      })
      .catch((err) => setCascadeError(err instanceof Error ? err.message : 'Fehler beim Laden'))
      .finally(() => setCascadeLoading((p) => (p === 'details' ? null : p)));
  }, [engineId, brandId, modelId, brands, modelsList, enginesList]);

  // Eco-Stage zurücksetzen, wenn nicht mehr Diesel
  useEffect(() => {
    if (selectedStage === ECO_STAGE_ID && form.fuel_type !== 'diesel') {
      setSelectedStage(1);
    }
  }, [form.fuel_type, selectedStage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const vehicle: Vehicle = {
      id: `v-${crypto.randomUUID().slice(0, 8)}`,
      created_at: new Date().toISOString(),
      ...form,
      year: new Date().getFullYear(),
      engine_code: enginesList.find((e) => e.id === engineId)?.name ?? '',
      ecu_type: '',
    };
    const result = generateRecommendation(vehicle, selectedStage, apiData);
    navigate(`/konfigurator/${result.id}`);
  };

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleVehicleSearchSelect = useCallback((spec: VehicleSpec) => {
    setForm((prev) => ({
      ...prev,
      brand: spec.brand, model: spec.model,
      stock_hp: spec.stockHp, stock_nm: spec.stockNm,
      fuel_type: spec.fuelType,
    }));
    setAutoDetected(true);
  }, []);

  const previewHp = form.stock_hp > 0 ? Math.round(form.stock_hp * stageConfigs[selectedStage - 1].hpMultiplier) : null;
  const previewNm = form.stock_nm > 0 ? Math.round(form.stock_nm * stageConfigs[selectedStage - 1].nmMultiplier) : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="solid" />

      <div className="bg-brand-dark text-white py-12 border-b border-[hsl(var(--brand-gold))]/20">
        <div className="max-w-4xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-gold mb-3">
            <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
            Chiptuning Konfigurator
          </span>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            Mehr Power für dein <span className="italic text-brand-gold">Fahrzeug.</span>
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <Car className="h-5 w-5 text-[hsl(var(--brand-gold))]" />
            <h2 className="text-2xl font-bold text-foreground">Fahrzeug konfigurieren</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-8 max-w-xl">
            Wähle dein Fahrzeug per Schnellsuche oder gib die Daten manuell ein. Sobald das Fahrzeug erkannt
            ist, erscheint die Stage-Auswahl.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Search */}
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Schnellsuche
              </span>
              <VehicleSearch onSelect={handleVehicleSearchSelect} />
            </div>

            {/* API-driven cascade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Marke" required>
                <select
                  value={brandId ?? ''}
                  onChange={(e) => setBrandId(e.target.value ? Number(e.target.value) : null)}
                  disabled={brands.length === 0}
                  className="field-input"
                >
                  <option value="">{cascadeLoading === 'brands' ? 'Lädt…' : 'Marke wählen'}</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Baureihe" required>
                <select
                  value={seriesId ?? ''}
                  onChange={(e) => setSeriesId(e.target.value ? Number(e.target.value) : null)}
                  disabled={brandId === null || seriesList.length === 0}
                  className="field-input"
                >
                  <option value="">{cascadeLoading === 'series' ? 'Lädt…' : brandId === null ? 'Erst Marke wählen' : 'Baureihe wählen'}</option>
                  {seriesList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Modell" required>
                <select
                  value={modelId ?? ''}
                  onChange={(e) => setModelId(e.target.value ? Number(e.target.value) : null)}
                  disabled={seriesId === null || modelsList.length === 0}
                  className="field-input"
                >
                  <option value="">{cascadeLoading === 'models' ? 'Lädt…' : seriesId === null ? 'Erst Baureihe wählen' : 'Modell wählen'}</option>
                  {modelsList.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </Field>
              <Field label="Motor" required>
                <select
                  value={engineId ?? ''}
                  onChange={(e) => setEngineId(e.target.value ? Number(e.target.value) : null)}
                  disabled={modelId === null || enginesList.length === 0}
                  className="field-input"
                >
                  <option value="">{cascadeLoading === 'engines' ? 'Lädt…' : modelId === null ? 'Erst Modell wählen' : 'Motor wählen'}</option>
                  {enginesList.map((eng) => <option key={eng.id} value={eng.id}>{eng.name}</option>)}
                </select>
              </Field>
            </div>

            {cascadeError && (
              <div className="text-xs text-destructive">Fehler bei der Fahrzeugdatenbank: {cascadeError}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Getriebe">
                <select value={form.transmission} onChange={(e) => updateField('transmission', e.target.value as Vehicle['transmission'])} className="field-input">
                  {transmissions.map((t) => <option key={t} value={t}>{transmissionLabels[t]}</option>)}
                </select>
              </Field>
              <Field label="Kraftstoff">
                <select value={form.fuel_type} onChange={(e) => updateField('fuel_type', e.target.value as Vehicle['fuel_type'])} className="field-input">
                  {fuelTypes.map((f) => <option key={f} value={f}>{fuelLabels[f]}</option>)}
                </select>
              </Field>
            </div>

            <AnimatePresence>
              {autoDetected && cascadeLoading !== 'details' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-md border border-destructive/30 bg-destructive/5"
                >
                  <Sparkles className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-xs text-destructive font-medium">
                    Fahrzeugdaten automatisch erkannt – Werte können manuell angepasst werden
                  </span>
                </motion.div>
              )}
              {cascadeLoading === 'details' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-md border border-border bg-card"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground">Fahrzeugdaten werden geladen…</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Serien-PS">
                <input type="number" value={form.stock_hp || ''} onChange={(e) => updateField('stock_hp', Number(e.target.value))} placeholder="z. B. 245" className="field-input" />
              </Field>
              <Field label="Serien-Nm">
                <input type="number" value={form.stock_nm || ''} onChange={(e) => updateField('stock_nm', Number(e.target.value))} placeholder="z. B. 370" className="field-input" />
              </Field>
            </div>

            {/* Stages – erscheinen erst wenn Fahrzeug gewählt */}
            <AnimatePresence>
              {isValid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="pt-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                      Tuning-Stufe wählen
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {getAvailableStages(form.fuel_type).map((cfg) => {
                        const isActive = selectedStage === cfg.stageId;
                        const isEco = cfg.stageId === ECO_STAGE_ID;
                        const riskInfo = riskIcons[cfg.risk];
                        const accentText = isEco ? 'text-[hsl(var(--success))]' : 'text-destructive';
                        const accentBorder = isEco
                          ? 'border-[hsl(var(--success))] bg-[hsl(var(--success))]/5 ring-1 ring-[hsl(var(--success))]'
                          : 'border-destructive bg-destructive/5 ring-1 ring-destructive';
                        return (
                          <button
                            key={cfg.stageId}
                            type="button"
                            onClick={() => setSelectedStage(cfg.stageId)}
                            className={`relative text-left p-4 rounded-md border transition-all ${
                              isActive ? accentBorder : 'border-border bg-card hover:border-muted-foreground/30'
                            }`}
                          >
                            {cfg.stageId === 1 && (<span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full shadow-lg shadow-destructive/30 ring-1 ring-destructive/40"><Star className="h-2.5 w-2.5 fill-current" />Beliebt</span>)}
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-bold uppercase tracking-wider ${isEco ? 'text-[hsl(var(--success))]' : isActive ? accentText : 'text-muted-foreground'}`}>
                                {isEco ? (<><Leaf className="h-3 w-3 inline -mt-0.5 mr-0.5" />Eco</>) : cfg.stageId === 1 ? (<Stage1Icon className="h-6 w-auto" />) : cfg.stageId === 2 ? (<Stage2Icon className="h-6 w-auto" />) : `Stage ${cfg.stageId}`}
                              </span>
                              <span className={`flex items-center gap-1 text-[10px] ${riskInfo.color}`}>
                                {riskInfo.icon}{riskInfo.label}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-foreground mb-1">{cfg.label.split(' – ')[1]}</p>
                            <p className={`text-base font-bold mb-1 ${accentText}`}>ab {formatPrice(getStageTotalPrice(cfg))}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              +{Math.round(cfg.hpMultiplier * 100)}% PS · +{Math.round(cfg.nmMultiplier * 100)}% Nm
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {cfg.components.slice(0, 3).map((c) => (
                                <span key={c} className="px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground text-[10px]">{c}</span>
                              ))}
                              {cfg.components.length > 3 && (
                                <span className="px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground text-[10px]">
                                  +{cfg.components.length - 3}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {previewHp !== null && previewNm !== null && (
                    <div className="flex items-center gap-4 p-3 rounded-md border border-border bg-card">
                      <Gauge className={`h-4 w-4 shrink-0 ${selectedStage === ECO_STAGE_ID ? 'text-[hsl(var(--success))]' : 'text-destructive'}`} />
                      <span className="text-xs text-muted-foreground">{selectedStage === ECO_STAGE_ID ? 'Eco' : `Stage ${selectedStage}`} Prognose:</span>
                      <span className={`text-sm font-bold ${selectedStage === ECO_STAGE_ID ? 'text-[hsl(var(--success))]' : 'text-destructive'}`}>+{previewHp} PS</span>
                      <span className={`text-sm font-bold ${selectedStage === ECO_STAGE_ID ? 'text-[hsl(var(--success))]' : 'text-[hsl(210_80%_55%)]'}`}>+{previewNm} Nm</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        → {form.stock_hp + previewHp} PS / {form.stock_nm + previewNm} Nm
                      </span>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`w-full md:w-auto gap-2 ${selectedStage === ECO_STAGE_ID ? 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/90' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}`}
                      size="lg"
                    >
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />AI-Empfehlung wird generiert…</>
                      ) : (
                        <><Zap className="h-4 w-4" />{selectedStage === ECO_STAGE_ID ? 'Eco' : `Stage ${selectedStage}`} Empfehlung generieren<ArrowRight className="h-4 w-4" /></>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
