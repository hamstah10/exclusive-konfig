import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal } from '@/components/Reveal';

type VehicleClass = { id: string; label: string; basePrice: number };
type Design = { id: string; label: string; spokes: number; style: 'mesh' | 'split' | 'concave' | 'classic'; surcharge: number };
type Finish = { id: string; label: string; color: string; rim: string; surcharge: number };
type Tire = { id: string; brand: string; model: string; pricePerTire: number };

const VEHICLE_CLASSES: VehicleClass[] = [
  { id: 'kompakt', label: 'Kompakt / Hot Hatch', basePrice: 1200 },
  { id: 'limousine', label: 'Limousine / Coupé', basePrice: 1600 },
  { id: 'suv', label: 'SUV / Crossover', basePrice: 1900 },
  { id: 'sport', label: 'Sportwagen', basePrice: 2400 },
];

const SIZES = [18, 19, 20, 21, 22] as const;
type Size = (typeof SIZES)[number];
const SIZE_SURCHARGE: Record<Size, number> = { 18: 0, 19: 200, 20: 450, 21: 750, 22: 1100 };

const DESIGNS: Design[] = [
  { id: 'mesh', label: 'Mesh Performance', spokes: 10, style: 'mesh', surcharge: 0 },
  { id: 'split', label: 'Split-Speiche', spokes: 10, style: 'split', surcharge: 180 },
  { id: 'concave', label: 'Deep Concave', spokes: 5, style: 'concave', surcharge: 320 },
  { id: 'classic', label: 'Classic 5-Speiche', spokes: 5, style: 'classic', surcharge: 0 },
];

const FINISHES: Finish[] = [
  { id: 'silver', label: 'Silber Diamantgedreht', color: '#c8ccd1', rim: '#9aa0a6', surcharge: 0 },
  { id: 'gloss-black', label: 'Glanzschwarz', color: '#1a1a1d', rim: '#0a0a0c', surcharge: 120 },
  { id: 'matt-black', label: 'Matt Anthrazit', color: '#2a2d31', rim: '#1a1c1f', surcharge: 140 },
  { id: 'bronze', label: 'Bronze Brushed', color: '#8a6a3d', rim: '#6e5530', surcharge: 220 },
  { id: 'gold', label: 'Champagner Gold', color: '#bf9c5e', rim: '#9c7e44', surcharge: 260 },
];

const TIRES: Tire[] = [
  { id: 'mps5', brand: 'Michelin', model: 'Pilot Sport 5', pricePerTire: 320 },
  { id: 'sc7', brand: 'Continental', model: 'SportContact 7', pricePerTire: 295 },
  { id: 'pz', brand: 'Pirelli', model: 'P Zero PZ4', pricePerTire: 310 },
  { id: 'pot', brand: 'Bridgestone', model: 'Potenza Sport', pricePerTire: 275 },
];

const SEASONS = [
  { id: 'sommer', label: 'Sommer', factor: 1 },
  { id: 'allwetter', label: 'Allwetter', factor: 1.08 },
  { id: 'winter', label: 'Winter', factor: 1.05 },
] as const;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n) + ' €';

const STEPS = ['Fahrzeug', 'Design', 'Größe', 'Finish', 'Reifen', 'Übersicht'] as const;

export default function WheelConfiguratorPage() {
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState<VehicleClass | null>(null);
  const [design, setDesign] = useState<Design | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [finish, setFinish] = useState<Finish | null>(FINISHES[0]);
  const [tire, setTire] = useState<Tire | null>(null);
  const [season, setSeason] = useState<typeof SEASONS[number]>(SEASONS[0]);

  const total = useMemo(() => {
    if (!vehicle || !design || !size || !finish || !tire) return null;
    const wheels = vehicle.basePrice + design.surcharge + SIZE_SURCHARGE[size] + finish.surcharge;
    const tires = tire.pricePerTire * 4 * season.factor;
    return Math.round(wheels + tires);
  }, [vehicle, design, size, finish, tire, season]);

  const canNext = [vehicle, design, size, finish, tire][step] !== null || step === 5;

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submitInquiry = () => {
    toast.success('Konfiguration gespeichert — wir melden uns zur Beratung.');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader variant="solid" />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-16 md:py-20 border-b border-[hsl(var(--brand-gold))]/20">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal direction="left">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-gold mb-3">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Räder &amp; Reifen Konfigurator
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.05}>
            <h1 className="font-display text-4xl md:text-5xl leading-tight max-w-3xl">
              Stelle dein Komplettrad{' '}
              <span className="italic text-brand-gold">individuell</span> zusammen.
            </h1>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <p className="text-white/70 mt-3 max-w-2xl text-sm md:text-base">
              Fahrzeugklasse, Design, Größe und Reifenmarke — wir liefern das Komplettpaket inkl. Eintragung, Montage und Auswuchten.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stepper */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 overflow-x-auto">
          <ol className="flex items-center gap-4 min-w-max">
            {STEPS.map((label, idx) => {
              const reached = idx <= step;
              const active = idx === step;
              return (
                <li key={label} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => idx < step && setStep(idx)}
                    disabled={idx > step}
                    className={`flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                      active
                        ? 'text-[hsl(var(--brand-dark))] font-semibold'
                        : reached
                        ? 'text-muted-foreground hover:text-[hsl(var(--brand-gold))]'
                        : 'text-muted-foreground/50 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`h-7 w-7 inline-flex items-center justify-center border ${
                        active
                          ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))]'
                          : reached
                          ? 'border-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))]'
                          : 'border-border'
                      } text-[11px] font-mono`}
                    >
                      {idx + 1}
                    </span>
                    {label}
                  </button>
                  {idx < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Body */}
      <section className="flex-1 py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                {step === 0 && (
                  <StepShell title="Fahrzeugklasse" subtitle="Wähle die Klasse deines Fahrzeugs für die passende Auslegung.">
                    <CardGrid>
                      {VEHICLE_CLASSES.map((v) => (
                        <SelectCard
                          key={v.id}
                          active={vehicle?.id === v.id}
                          onClick={() => setVehicle(v)}
                          title={v.label}
                          meta={`ab ${fmt(v.basePrice)}`}
                        />
                      ))}
                    </CardGrid>
                  </StepShell>
                )}

                {step === 1 && (
                  <StepShell title="Felgendesign" subtitle="Vom dezenten Klassiker bis zum aggressiven Concave-Look.">
                    <CardGrid>
                      {DESIGNS.map((d) => (
                        <SelectCard
                          key={d.id}
                          active={design?.id === d.id}
                          onClick={() => setDesign(d)}
                          title={d.label}
                          meta={d.surcharge ? `+ ${fmt(d.surcharge)}` : 'inkl.'}
                        >
                          <div className="flex justify-center py-2">
                            <WheelSvg design={d} finish={finish ?? FINISHES[0]} size={72} />
                          </div>
                        </SelectCard>
                      ))}
                    </CardGrid>
                  </StepShell>
                )}

                {step === 2 && (
                  <StepShell title="Größe" subtitle="Zollgröße der Felge — größer = sportlicher und teurer.">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`border p-5 text-center transition-all ${
                            size === s
                              ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))]/10'
                              : 'border-border hover:border-[hsl(var(--brand-gold))]/50'
                          }`}
                        >
                          <div className="font-display text-3xl">{s}"</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                            {SIZE_SURCHARGE[s] ? `+ ${fmt(SIZE_SURCHARGE[s])}` : 'inkl.'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </StepShell>
                )}

                {step === 3 && (
                  <StepShell title="Finish" subtitle="Oberfläche und Farbgebung der Felge.">
                    <CardGrid>
                      {FINISHES.map((f) => (
                        <SelectCard
                          key={f.id}
                          active={finish?.id === f.id}
                          onClick={() => setFinish(f)}
                          title={f.label}
                          meta={f.surcharge ? `+ ${fmt(f.surcharge)}` : 'inkl.'}
                        >
                          <div className="flex justify-center py-2">
                            <WheelSvg
                              design={design ?? DESIGNS[0]}
                              finish={f}
                              size={64}
                            />
                          </div>
                        </SelectCard>
                      ))}
                    </CardGrid>
                  </StepShell>
                )}

                {step === 4 && (
                  <StepShell title="Reifen" subtitle="Premium-Marken — Saison frei wählbar.">
                    <div className="space-y-3 mb-6">
                      {TIRES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTire(t)}
                          className={`w-full text-left border p-4 flex items-center justify-between gap-4 transition-all ${
                            tire?.id === t.id
                              ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))]/10'
                              : 'border-border hover:border-[hsl(var(--brand-gold))]/50'
                          }`}
                        >
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.brand}</div>
                            <div className="font-display text-lg">{t.model}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm">{fmt(t.pricePerTire)}</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">pro Reifen</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Saison</div>
                      <div className="grid grid-cols-3 gap-2">
                        {SEASONS.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSeason(s)}
                            className={`py-3 text-sm border transition-all ${
                              season.id === s.id
                                ? 'border-[hsl(var(--brand-dark))] bg-[hsl(var(--brand-dark))] text-white'
                                : 'border-border hover:border-[hsl(var(--brand-dark))]'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </StepShell>
                )}

                {step === 5 && (
                  <StepShell title="Deine Konfiguration" subtitle="Alle Details auf einen Blick — wir melden uns mit einem persönlichen Angebot.">
                    <div className="border border-border">
                      <SummaryRow label="Fahrzeugklasse" value={vehicle?.label} />
                      <SummaryRow label="Design" value={design?.label} />
                      <SummaryRow label="Größe" value={size ? `${size}"` : null} />
                      <SummaryRow label="Finish" value={finish?.label} />
                      <SummaryRow label="Reifen" value={tire ? `${tire.brand} ${tire.model}` : null} />
                      <SummaryRow label="Saison" value={season.label} />
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={submitInquiry}
                        className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90"
                      >
                        <Sparkles className="h-4 w-4" /> Angebot anfragen
                      </button>
                      <Link
                        to="/#kontakt"
                        className="inline-flex items-center justify-center gap-2 border-2 border-[hsl(var(--brand-dark))] text-[hsl(var(--brand-dark))] px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))] hover:text-white"
                      >
                        <Phone className="h-4 w-4" /> Beratungstermin
                      </Link>
                    </div>
                  </StepShell>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-10">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-[hsl(var(--brand-dark))] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" /> Zurück
              </button>
              {step < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canNext}
                  className="inline-flex items-center gap-2 bg-[hsl(var(--brand-dark))] text-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))]/90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Weiter <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <aside className="lg:sticky lg:top-6 self-start">
            <div className="border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Vorschau
              </div>
              <div className="aspect-square bg-gradient-to-br from-[hsl(var(--brand-dark))] to-[hsl(var(--brand-dark))]/80 flex items-center justify-center mb-5">
                <motion.div
                  key={`${design?.id}-${finish?.id}-${size}`}
                  initial={{ rotate: -30, opacity: 0, scale: 0.85 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <WheelSvg
                    design={design ?? DESIGNS[0]}
                    finish={finish ?? FINISHES[0]}
                    size={size ? 130 + (size - 18) * 8 : 130}
                    spin
                  />
                </motion.div>
              </div>
              <dl className="space-y-2 text-sm">
                <PreviewRow label="Fahrzeug" value={vehicle?.label ?? '—'} />
                <PreviewRow label="Design" value={design?.label ?? '—'} />
                <PreviewRow label="Größe" value={size ? `${size}"` : '—'} />
                <PreviewRow label="Finish" value={finish?.label ?? '—'} />
                <PreviewRow label="Reifen" value={tire ? `${tire.brand}` : '—'} />
              </dl>
              <div className="mt-5 pt-5 border-t border-border">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Komplettpreis*</div>
                <div className="font-display text-3xl mt-1">
                  {total !== null ? fmt(total) : '—'}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  *inkl. 4 Räder &amp; Reifen, Montage, Auswuchten und Eintragung. Endpreis nach Beratung.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] mb-3">
        <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
        {title}
      </span>
      {subtitle && <p className="text-muted-foreground text-sm mb-6 max-w-xl">{subtitle}</p>}
      {children}
    </div>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}

function SelectCard({
  active, onClick, title, meta, children,
}: { active: boolean; onClick: () => void; title: string; meta?: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border p-5 transition-all relative ${
        active
          ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))]/10'
          : 'border-border hover:border-[hsl(var(--brand-gold))]/50'
      }`}
    >
      {active && (
        <span className="absolute top-3 right-3 h-5 w-5 inline-flex items-center justify-center bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))]">
          <Check className="h-3 w-3" />
        </span>
      )}
      {children}
      <div className="font-display text-base mt-1">{title}</div>
      {meta && <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{meta}</div>}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
      <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? '—'}</span>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</dt>
      <dd className="text-sm truncate text-right">{value}</dd>
    </div>
  );
}

function WheelSvg({
  design, finish, size = 120, spin = false,
}: { design: Design; finish: Finish; size?: number; spin?: boolean }) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const spokeStroke = finish.color;

  // Spokes generator
  const spokes = [];
  if (design.style === 'mesh') {
    for (let i = 0; i < 20; i++) {
      const a = (i * 360) / 20;
      spokes.push(<line key={i} x1={cx} y1={cy} x2={cx} y2={cy - r * 0.8} stroke={spokeStroke} strokeWidth={2.5} transform={`rotate(${a} ${cx} ${cy})`} />);
    }
  } else if (design.style === 'split') {
    for (let i = 0; i < 10; i++) {
      const a = (i * 360) / 10;
      spokes.push(<line key={`a${i}`} x1={cx - 3} y1={cy} x2={cx - 3} y2={cy - r * 0.78} stroke={spokeStroke} strokeWidth={3} transform={`rotate(${a} ${cx} ${cy})`} />);
      spokes.push(<line key={`b${i}`} x1={cx + 3} y1={cy} x2={cx + 3} y2={cy - r * 0.78} stroke={spokeStroke} strokeWidth={3} transform={`rotate(${a} ${cx} ${cy})`} />);
    }
  } else if (design.style === 'concave') {
    for (let i = 0; i < 5; i++) {
      const a = (i * 360) / 5;
      spokes.push(
        <path
          key={i}
          d={`M ${cx} ${cy} L ${cx - r * 0.18} ${cy - r * 0.78} L ${cx + r * 0.18} ${cy - r * 0.78} Z`}
          fill={spokeStroke}
          transform={`rotate(${a} ${cx} ${cy})`}
        />,
      );
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const a = (i * 360) / 5;
      spokes.push(<line key={i} x1={cx} y1={cy} x2={cx} y2={cy - r * 0.8} stroke={spokeStroke} strokeWidth={6} strokeLinecap="round" transform={`rotate(${a} ${cx} ${cy})`} />);
    }
  }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={spin ? { rotate: 360 } : undefined}
      transition={spin ? { repeat: Infinity, duration: 18, ease: 'linear' } : undefined}
      style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.4))' }}
    >
      {/* Tire */}
      <circle cx={cx} cy={cy} r={r - 1} fill="#0a0a0a" />
      {/* Rim outer */}
      <circle cx={cx} cy={cy} r={r * 0.88} fill={finish.rim} />
      {/* Rim face */}
      <circle cx={cx} cy={cy} r={r * 0.82} fill={finish.color} />
      {/* Spokes */}
      {spokes}
      {/* Center cap */}
      <circle cx={cx} cy={cy} r={r * 0.12} fill={finish.rim} />
      <circle cx={cx} cy={cy} r={r * 0.06} fill={finish.color} />
    </motion.svg>
  );
}