import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car, Zap, AlertTriangle, ArrowLeft, Gauge, Layers, Copy, Check,
  Cpu, Snowflake, Flame, Lock, Fuel, Settings2, Euro, Info,
} from 'lucide-react';
import { Leaf, ChevronRight, Star } from 'lucide-react';
import { Stage1Icon, Stage2Icon } from '@/components/StageIcons';
import { BrandLogo } from '@/components/BrandLogo';
import { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { getResult, stageConfigs, getStageTotalPrice, formatPrice, getAvailableStages, ECO_STAGE_ID } from '@/lib/configurator-store';
import { getEcuManufacturer } from '@/lib/ecu';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LeadRequestDialog } from '@/components/LeadRequestDialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

function mergedCompareData(stages: { dynoPoints: { rpm: number; power: number; torque: number }[] }[]) {
  const s1 = stages[0]?.dynoPoints ?? [];
  const s2 = stages[1]?.dynoPoints ?? [];
  const s3 = stages[2]?.dynoPoints ?? [];
  return s1.map((p, i) => ({
    rpm: p.rpm,
    ps1: p.power, nm1: p.torque,
    ps2: s2[i]?.power ?? 0, nm2: s2[i]?.torque ?? 0,
    ps3: s3[i]?.power ?? 0, nm3: s3[i]?.torque ?? 0,
  }));
}

const tuningOptions: { label: string; icon: React.ReactNode }[] = [
  { label: 'DTC OFF', icon: <Settings2 className="h-4 w-4" /> },
  { label: 'E85 Flex-Fuel', icon: <Fuel className="h-4 w-4" /> },
  { label: 'Kaltstart OFF', icon: <Snowflake className="h-4 w-4" /> },
  { label: 'KAT OFF', icon: <Flame className="h-4 w-4" /> },
  { label: 'Pops & Bangs', icon: <Zap className="h-4 w-4" /> },
  { label: 'V/MAX Off', icon: <Lock className="h-4 w-4" /> },
  { label: 'Vmax 30', icon: <Gauge className="h-4 w-4" /> },
];

export default function ConfiguratorResultPageV2() {
  const { id } = useParams<{ id: string }>();
  const result = id ? getResult(id) : undefined;
  const [copied, setCopied] = useState(false);
  const [activeStage, setActiveStage] = useState(result?.selectedStage ?? 1);
  const [compareMode, setCompareMode] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">Konfiguration nicht gefunden.</p>
        <Link to="/konfigurator">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Neue Konfiguration starten
          </Button>
        </Link>
      </div>
    );
  }

  const { vehicle, stages } = result;
  const stageData = stages[activeStage - 1];
  const rec = stageData.recommendation;
  const dynoPoints = stageData.dynoPoints;
  const ecuManufacturer = getEcuManufacturer(vehicle.ecu_type);
  const stageTotal = getStageTotalPrice(stageConfigs[activeStage - 1]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="solid" />

      <div className="bg-brand-dark text-white py-8 border-b border-[hsl(var(--brand-gold))]/20">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Deine Konfiguration</span>
            <h1 className="font-display text-2xl md:text-3xl mt-1">
              {vehicle.brand} <span className="italic text-brand-gold">{vehicle.model}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyLink} className="gap-1.5 text-xs text-white hover:bg-white/10 hover:text-brand-gold">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Kopiert' : 'Link teilen'}
            </Button>
            <Link to="/konfigurator">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-brand-gold">
                <ArrowLeft className="h-3.5 w-3.5" />
                Neue Konfiguration
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Vehicle Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <BrandLogo brand={vehicle.brand} className="object-contain h-10 w-10 text-xl mx-[5px]" />
            <div className="flex items-center gap-1.5 flex-wrap text-base font-semibold text-foreground">
              <span>{vehicle.brand}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{vehicle.model}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground font-normal">{vehicle.year}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-sm">{vehicle.engine_code || '–'}</span>
            </div>
          </div>
        </motion.div>

        {/* Stage Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="flex gap-2"
        >
          {getAvailableStages(vehicle.fuel_type).map((cfg) => {
            const isActive = activeStage === cfg.stageId;
            const stageRec = stages[cfg.stageId - 1].recommendation;
            const isEco = cfg.stageId === ECO_STAGE_ID;
            const accentText = isEco ? 'text-[hsl(var(--success))]' : 'text-destructive';
            const accentBorder = isEco
              ? 'border-[hsl(var(--success))] bg-[hsl(var(--success))]/5 ring-1 ring-[hsl(var(--success))]'
              : 'border-destructive bg-destructive/5 ring-1 ring-destructive';
            return (
              <button
                key={cfg.stageId}
                onClick={() => setActiveStage(cfg.stageId)}
                className={`relative flex-1 p-3 rounded-md border text-left transition-all ${
                  isActive ? accentBorder : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                {cfg.stageId === 1 && (<span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full shadow-lg shadow-destructive/30 ring-1 ring-destructive/40"><Star className="h-2.5 w-2.5 fill-current" />Beliebt</span>)}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {isEco && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--success))] mb-1 inline-flex items-center gap-1">
                        <Leaf className="h-3 w-3" />Eco
                      </span>
                    )}
                    <p className="text-sm font-bold text-foreground">
                      {stageRec.estimated_hp} PS / {stageRec.estimated_nm} Nm
                    </p>
                    <p className={`text-[10px] font-semibold ${accentText}`}>
                      +{stageRec.delta_hp} PS · +{stageRec.delta_nm} Nm
                    </p>
                    <p className="text-xs font-bold text-foreground mt-1">
                      {formatPrice(getStageTotalPrice(cfg))}
                    </p>
                  </div>
                  <div className={`shrink-0 ${isActive ? accentText : 'text-muted-foreground'}`}>
                    {cfg.stageId === 1 && <Stage1Icon className="h-12 w-auto" />}
                    {cfg.stageId === 2 && <Stage2Icon className="h-12 w-auto" />}
                    {isEco && <Leaf className="h-10 w-10 text-[hsl(var(--success))]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Stats Row – Risiko/Erstellt entfernt, durch Stage + Preis ersetzt */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard icon={<Gauge className="h-4 w-4" />} label="Prognose PS" value={<><CountUp value={rec.estimated_hp} /> PS</>} sub={<>+<CountUp value={rec.delta_hp} /> PS</>} />
          <StatCard icon={<Zap className="h-4 w-4" />} label="Prognose Nm" value={<><CountUp value={rec.estimated_nm} /> Nm</>} sub={<>+<CountUp value={rec.delta_nm} /> Nm</>} />
          <StatCard icon={<Layers className="h-4 w-4" />} label="Stage" value={activeStage === ECO_STAGE_ID ? 'Eco' : `Stage ${activeStage}`} sub={rec.stage_label.split(' – ')[1]} />
          <div className="bg-card border border-border rounded-md p-4 relative">
            <div className="flex items-center gap-1.5 mb-2 text-muted-foreground">
              <Euro className="h-4 w-4" /><span className="text-[10px] uppercase tracking-wider font-medium">Gesamtpreis</span>
            </div>
            <p className={`text-lg font-bold ${activeStage === ECO_STAGE_ID ? 'text-[hsl(var(--success))]' : 'text-destructive'}`}>
              <CountUp value={stageTotal} format={formatPrice} />
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Komponenten & Preise anzeigen"
                  className="absolute top-2 right-2 inline-flex items-center justify-center h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <h4 className="text-sm font-semibold text-foreground mb-3">Komponenten & Preise</h4>
                <div className="space-y-2">
                  {rec.components.map((c) => {
                    const price = stageConfigs[activeStage - 1].componentPrices[c] ?? 0;
                    return (
                      <div key={c} className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground text-xs font-medium">{c}</span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {price > 0 ? formatPrice(price) : 'inkl.'}
                        </span>
                      </div>
                    );
                  })}
                  <div className="border-t border-border pt-2 mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Gesamt</span>
                    <span className={`text-sm font-bold ${activeStage === ECO_STAGE_ID ? 'text-[hsl(var(--success))]' : 'text-destructive'}`}>{formatPrice(stageTotal)}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>

        {/* Beschreibung – volle Breite vor Diagramm */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-card border border-border rounded-md p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-2">Beschreibung</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
        </motion.div>

        {/* Dyno Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-border rounded-md p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              {compareMode ? 'Stage-Vergleich – Alle Kurven' : `Prognostizierte Leistungskurve – ${rec.stage_label}`}
            </h2>
            <button
              type="button"
              onClick={() => setCompareMode((p) => !p)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                compareMode
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-border bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              {compareMode ? 'Einzelansicht' : 'Vergleichsmodus'}
            </button>
          </div>
          <div key={`chart-${activeStage}-${compareMode}`} className="h-64 animate-fade-in">
            <ResponsiveContainer width="100%" height="100%">
              {compareMode ? (
                <LineChart data={mergedCompareData(stages)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="rpm" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} label={{ value: 'RPM', position: 'insideBottom', offset: -4, fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', fontSize: '12px' }} labelFormatter={(rpm) => `${rpm} RPM`} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="ps1" name="S1 PS" stroke="hsl(var(--brand-gold))" strokeWidth={1.5} dot={false} strokeDasharray="6 3" />
                  <Line type="monotone" dataKey="nm1" name="S1 Nm" stroke="hsl(var(--brand-dark))" strokeWidth={1.5} dot={false} strokeDasharray="6 3" />
                  <Line type="monotone" dataKey="ps2" name="S2 PS" stroke="hsl(var(--brand-gold))" strokeWidth={2} dot={false} strokeDasharray="3 2" />
                  <Line type="monotone" dataKey="nm2" name="S2 Nm" stroke="hsl(var(--brand-dark))" strokeWidth={2} dot={false} strokeDasharray="3 2" />
                  {vehicle.fuel_type === 'diesel' && (
                    <>
                      <Line type="monotone" dataKey="ps3" name="Eco PS" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="nm3" name="Eco Nm" stroke="hsl(var(--success))" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                    </>
                  )}
                </LineChart>
              ) : (
                <LineChart data={dynoPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="rpm" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} label={{ value: 'RPM', position: 'insideBottom', offset: -4, fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', fontSize: '12px' }} labelFormatter={(rpm) => `${rpm} RPM`} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="power" name="PS" stroke={activeStage === ECO_STAGE_ID ? 'hsl(var(--success))' : 'hsl(var(--brand-gold))'} strokeWidth={2} dot={false} isAnimationActive animationDuration={700} animationEasing="ease-out" />
                  <Line type="monotone" dataKey="torque" name="Nm" stroke={activeStage === ECO_STAGE_ID ? 'hsl(var(--success))' : 'hsl(var(--brand-dark))'} strokeWidth={2} dot={false} strokeDasharray={activeStage === ECO_STAGE_ID ? '4 2' : undefined} isAnimationActive animationDuration={700} animationEasing="ease-out" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Description + Components */}
        {/* Tuning-Optionen */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-card border border-border rounded-md p-6"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground">Tuning-Optionen</h3>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Info</span>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Verfügbare Zusatz-Features für diese Stage. Optionen sind informativ – bitte beim Termin freischalten lassen.
          </p>

          {/* ECU Hersteller Badge */}
          <div className="mb-5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              ECU Hersteller{result.apiData?.ecuName ? ` · ${result.apiData.ecuName}` : ''}
            </span>
            <div className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border bg-background">
              {result.apiData?.ecuManufacturerLogoUrl ? (
                <img
                  src={result.apiData.ecuManufacturerLogoUrl}
                  alt={result.apiData.ecuManufacturer ?? 'ECU Hersteller'}
                  className="h-5 w-auto object-contain"
                  loading="lazy"
                />
              ) : (
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-destructive text-destructive-foreground">
                  <Cpu className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="text-sm font-semibold text-foreground">
                {result.apiData?.ecuManufacturer ?? ecuManufacturer}
              </span>
            </div>
          </div>

          {(() => {
            const apiOpts = result.apiData?.tuningOptions ?? [];
            if (apiOpts.length > 0) {
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {apiOpts.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border bg-background"
                      title={opt.name}
                    >
                      {opt.iconUrl ? (
                        <img src={opt.iconUrl} alt="" className="h-5 w-5 object-contain shrink-0" loading="lazy" />
                      ) : (
                        <Settings2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="text-xs font-medium text-foreground truncate">{opt.name}</span>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {tuningOptions.map((opt) => (
                  <div
                    key={opt.label}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border bg-background"
                  >
                    <span className="text-muted-foreground shrink-0">{opt.icon}</span>
                    <span className="text-xs font-medium text-foreground truncate">{opt.label}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 bg-brand-dark text-white rounded-md p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Bereit?</span>
            <h3 className="font-display text-2xl md:text-3xl mt-2">
              Tuning für deinen <span className="italic text-brand-gold">{vehicle.brand} {vehicle.model}</span> anfragen
            </h3>
            <p className="text-white/70 text-sm mt-2 max-w-xl">
              Wir melden uns mit einem verbindlichen Angebot inkl. Termin auf unserem 4WD-Prüfstand.
              Stage {activeStage} · Gesamtpreis ca. {formatPrice(stageTotal)}.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setLeadOpen(true)}
            className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 font-semibold uppercase tracking-[0.15em]"
          >
            Angebot anfragen
          </Button>
        </motion.div>

      </main>
      <SiteFooter />

      <LeadRequestDialog
        open={leadOpen}
        onOpenChange={setLeadOpen}
        vehicle={{
          slug: `tuning-${vehicle.brand}-${vehicle.model}-stage${activeStage}-${id}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
          brand: vehicle.brand,
          model: vehicle.model,
          label: `Chiptuning · ${vehicle.brand} ${vehicle.model} · Stage ${activeStage}`,
          priceLabel: `ca. ${formatPrice(stageTotal)}`,
        }}
      />
    </div>
  );
}

function StatCard({
  icon, label, value, sub, valueClass,
}: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: React.ReactNode; valueClass?: string }) {
  return (
    <div className="bg-card border border-border rounded-md p-4">
      <div className="flex items-center gap-1.5 mb-2 text-muted-foreground">
        {icon}<span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className={`text-lg font-bold ${valueClass ?? 'text-foreground'}`}>{value}</p>
      {sub && <p className="text-xs text-destructive font-semibold mt-0.5">{sub}</p>}
    </div>
  );
}

function CountUp({ value, format, duration = 700 }: { value: number; format?: (n: number) => string; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value, duration]);

  const rounded = Math.round(display);
  return <>{format ? format(rounded) : rounded.toLocaleString('de-DE')}</>;
}
