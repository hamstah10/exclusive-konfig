import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Calculator, Banknote, Target, Car } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);

/** Annuity payment formula */
const annuity = (principal: number, annualRatePct: number, months: number) => {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
};

function ResultRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border/60 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={
          accent
            ? "font-display text-2xl text-[hsl(var(--brand-gold))]"
            : "font-medium text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step ?? 1}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 pr-12"
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- LEASING --------------------------------- */
function LeasingCalculator() {
  const [type, setType] = useState<"privat" | "geschaeftlich">("privat");
  const [price, setPrice] = useState(45000);
  const [downPayment, setDownPayment] = useState(5000);
  const [residualPct, setResidualPct] = useState(45);
  const [term, setTerm] = useState(36);
  const [rate, setRate] = useState(4.49);
  const [mileage, setMileage] = useState(15000);

  const residualValue = (price * residualPct) / 100;
  const financed = Math.max(price - downPayment - residualValue, 0);
  const monthly = useMemo(() => {
    const interest = ((price + residualValue) / 2) * (rate / 100 / 12);
    return financed / term + interest;
  }, [financed, term, rate, price, residualValue]);

  const totalCost = monthly * term + downPayment;
  const monthlyNet = monthly / 1.19;

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 p-6 lg:p-8 space-y-6">
        <div>
          <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Leasing-Art
          </Label>
          <RadioGroup
            value={type}
            onValueChange={(v) => setType(v as typeof type)}
            className="mt-3 grid grid-cols-2 gap-3"
          >
            {[
              { id: "privat", label: "Privatleasing" },
              { id: "geschaeftlich", label: "Gewerbeleasing" },
            ].map((opt) => (
              <Label
                key={opt.id}
                htmlFor={`lt-${opt.id}`}
                className={`cursor-pointer border rounded-md px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                  type === opt.id
                    ? "border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))]/5"
                    : "border-border hover:border-[hsl(var(--brand-gold))]/40"
                }`}
              >
                <RadioGroupItem id={`lt-${opt.id}`} value={opt.id} />
                {opt.label}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <NumberField id="l-price" label="Fahrzeugpreis" value={price} onChange={setPrice} suffix="€" step={500} />
          <NumberField id="l-down" label="Anzahlung" value={downPayment} onChange={setDownPayment} suffix="€" step={500} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Restwert
            </Label>
            <span className="text-sm font-medium">
              {residualPct}% · {fmt(residualValue)}
            </span>
          </div>
          <Slider
            value={[residualPct]}
            min={20}
            max={70}
            step={1}
            onValueChange={(v) => setResidualPct(v[0])}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Laufzeit
            </Label>
            <span className="text-sm font-medium">{term} Monate</span>
          </div>
          <Slider value={[term]} min={12} max={60} step={6} onValueChange={(v) => setTerm(v[0])} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <NumberField id="l-rate" label="Leasingfaktor (% p.a.)" value={rate} onChange={setRate} suffix="%" step={0.1} />
          <NumberField id="l-km" label="Kilometer / Jahr" value={mileage} onChange={setMileage} suffix="km" step={1000} />
        </div>
      </Card>

      <Card className="lg:col-span-2 p-6 lg:p-8 bg-[hsl(var(--brand-dark))] text-white space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))]">
          Ihre monatliche Rate
        </p>
        <p className="font-display text-5xl text-[hsl(var(--brand-gold))]">{fmt(monthly)}</p>
        <p className="text-xs text-white/60 mb-4">
          {type === "geschaeftlich" ? `netto ${fmt(monthlyNet)} zzgl. MwSt.` : "inkl. MwSt."}
        </p>
        <div className="text-white/90 [&_*]:!text-white/90 [&_.text-muted-foreground]:!text-white/60 [&_.border-border\\/60]:!border-white/10">
          <ResultRow label="Anzahlung" value={fmt(downPayment)} />
          <ResultRow label="Restwert" value={fmt(residualValue)} />
          <ResultRow label="Laufzeit" value={`${term} Monate`} />
          <ResultRow label="Gesamtaufwand" value={fmt(totalCost)} />
        </div>
        <Button variant="cta" className="w-full mt-4">
          Unverbindliches Angebot anfordern
        </Button>
      </Card>
    </div>
  );
}

/* --------------------------- BASIS-FINANZIERUNG --------------------------- */
function BasisFinanzierungCalculator() {
  const [price, setPrice] = useState(45000);
  const [downPayment, setDownPayment] = useState(5000);
  const [term, setTerm] = useState(60);
  const [rate, setRate] = useState(5.99);

  const principal = Math.max(price - downPayment, 0);
  const monthly = annuity(principal, rate, term);
  const totalCost = monthly * term + downPayment;
  const interestCost = totalCost - price;

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <NumberField id="b-price" label="Fahrzeugpreis" value={price} onChange={setPrice} suffix="€" step={500} />
          <NumberField id="b-down" label="Anzahlung" value={downPayment} onChange={setDownPayment} suffix="€" step={500} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Laufzeit
            </Label>
            <span className="text-sm font-medium">{term} Monate</span>
          </div>
          <Slider value={[term]} min={12} max={96} step={6} onValueChange={(v) => setTerm(v[0])} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Effektivzins p.a.
            </Label>
            <span className="text-sm font-medium">{rate.toFixed(2)} %</span>
          </div>
          <Slider value={[rate]} min={0} max={12} step={0.1} onValueChange={(v) => setRate(v[0])} />
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Klassische Ratenfinanzierung mit gleichbleibender monatlicher Rate. Nach Ablauf gehört
          das Fahrzeug Ihnen — ohne Schlussrate.
        </p>
      </Card>

      <Card className="lg:col-span-2 p-6 lg:p-8 bg-[hsl(var(--brand-dark))] text-white space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))]">
          Monatliche Rate
        </p>
        <p className="font-display text-5xl text-[hsl(var(--brand-gold))]">{fmt(monthly)}</p>
        <p className="text-xs text-white/60 mb-4">{term} gleich hohe Raten</p>
        <div className="text-white/90 [&_*]:!text-white/90 [&_.text-muted-foreground]:!text-white/60 [&_.border-border\\/60]:!border-white/10">
          <ResultRow label="Nettodarlehen" value={fmt(principal)} />
          <ResultRow label="Zinskosten" value={fmt(interestCost)} />
          <ResultRow label="Gesamtaufwand" value={fmt(totalCost)} />
          <ResultRow label="Schlussrate" value="—" />
        </div>
        <Button variant="cta" className="w-full mt-4">
          Finanzierung anfragen
        </Button>
      </Card>
    </div>
  );
}

/* ---------------------------- ZIEL-FINANZIERUNG --------------------------- */
function ZielFinanzierungCalculator() {
  const [price, setPrice] = useState(55000);
  const [downPayment, setDownPayment] = useState(8000);
  const [balloonPct, setBalloonPct] = useState(40);
  const [term, setTerm] = useState(48);
  const [rate, setRate] = useState(4.99);

  const balloon = (price * balloonPct) / 100;
  const principal = Math.max(price - downPayment, 0);

  const monthly = useMemo(() => {
    if (term <= 0) return 0;
    const r = rate / 100 / 12;
    if (r === 0) return (principal - balloon) / term;
    const pvBalloon = balloon / Math.pow(1 + r, term);
    const financedNow = principal - pvBalloon;
    return (financedNow * r) / (1 - Math.pow(1 + r, -term));
  }, [principal, balloon, term, rate]);

  const totalCost = monthly * term + downPayment + balloon;
  const interestCost = totalCost - price;

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <NumberField id="z-price" label="Fahrzeugpreis" value={price} onChange={setPrice} suffix="€" step={500} />
          <NumberField id="z-down" label="Anzahlung" value={downPayment} onChange={setDownPayment} suffix="€" step={500} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Schlussrate (Zielrate)
            </Label>
            <span className="text-sm font-medium">
              {balloonPct}% · {fmt(balloon)}
            </span>
          </div>
          <Slider
            value={[balloonPct]}
            min={10}
            max={60}
            step={1}
            onValueChange={(v) => setBalloonPct(v[0])}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Laufzeit
            </Label>
            <span className="text-sm font-medium">{term} Monate</span>
          </div>
          <Slider value={[term]} min={12} max={72} step={6} onValueChange={(v) => setTerm(v[0])} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Effektivzins p.a.
            </Label>
            <span className="text-sm font-medium">{rate.toFixed(2)} %</span>
          </div>
          <Slider value={[rate]} min={0} max={12} step={0.1} onValueChange={(v) => setRate(v[0])} />
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Niedrige Monatsrate dank Schlussrate. Am Ende der Laufzeit haben Sie 3 Optionen:
          Schlussrate zahlen, Fahrzeug zurückgeben oder Anschlussfinanzierung wählen.
        </p>
      </Card>

      <Card className="lg:col-span-2 p-6 lg:p-8 bg-[hsl(var(--brand-dark))] text-white space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))]">
          Monatliche Rate
        </p>
        <p className="font-display text-5xl text-[hsl(var(--brand-gold))]">{fmt(monthly)}</p>
        <p className="text-xs text-white/60 mb-4">+ Schlussrate {fmt(balloon)}</p>
        <div className="text-white/90 [&_*]:!text-white/90 [&_.text-muted-foreground]:!text-white/60 [&_.border-border\\/60]:!border-white/10">
          <ResultRow label="Anzahlung" value={fmt(downPayment)} />
          <ResultRow label="Schlussrate" value={fmt(balloon)} />
          <ResultRow label="Laufzeit" value={`${term} Monate`} />
          <ResultRow label="Zinskosten" value={fmt(interestCost)} />
          <ResultRow label="Gesamtaufwand" value={fmt(totalCost)} />
        </div>
        <Button variant="cta" className="w-full mt-4">
          3-Wege-Finanzierung anfragen
        </Button>
      </Card>
    </div>
  );
}

/* ----------------------------------- PAGE ---------------------------------- */
export default function FinanzierungPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="solid" />
      <main>
        <section className="border-b border-border/60 bg-[hsl(var(--brand-dark))] text-white">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))]">
                Finanzierung
              </span>
            </div>
            <h1 className="font-display text-4xl lg:text-6xl leading-tight max-w-3xl">
              Ihr Traumwagen — <em className="text-[hsl(var(--brand-gold))] not-italic font-display italic">flexibel finanziert</em>
            </h1>
            <p className="text-white/70 mt-4 max-w-2xl">
              Drei Wege zu Ihrem Fahrzeug. Berechnen Sie Ihre Wunschrate und fordern Sie ein
              unverbindliches Angebot an — wir finden gemeinsam die passende Lösung.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <Tabs defaultValue="leasing" className="w-full">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 h-auto p-1 mb-10">
              <TabsTrigger value="leasing" className="flex items-center gap-2 py-3">
                <Car className="h-4 w-4" />
                <span className="hidden sm:inline">Leasing</span>
              </TabsTrigger>
              <TabsTrigger value="basis" className="flex items-center gap-2 py-3">
                <Banknote className="h-4 w-4" />
                <span className="hidden sm:inline">Basis-Finanzierung</span>
                <span className="sm:hidden">Basis</span>
              </TabsTrigger>
              <TabsTrigger value="ziel" className="flex items-center gap-2 py-3">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Ziel-Finanzierung</span>
                <span className="sm:hidden">Ziel</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leasing">
              <LeasingCalculator />
            </TabsContent>
            <TabsContent value="basis">
              <BasisFinanzierungCalculator />
            </TabsContent>
            <TabsContent value="ziel">
              <ZielFinanzierungCalculator />
            </TabsContent>
          </Tabs>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Car,
                title: "Leasing",
                text: "Niedrige Rate, planbare Kosten. Privat oder gewerblich mit voller MwSt.-Abzugsfähigkeit.",
              },
              {
                icon: Banknote,
                title: "Basis-Finanzierung",
                text: "Klassische Ratenfinanzierung. Nach der letzten Rate gehört das Fahrzeug Ihnen.",
              },
              {
                icon: Target,
                title: "Ziel-Finanzierung",
                text: "Niedrige Rate dank Schlussrate. Am Ende: behalten, tauschen oder zurückgeben.",
              },
            ].map((c) => (
              <Card key={c.title} className="p-6">
                <div className="h-10 w-10 rounded-md bg-[hsl(var(--brand-gold))]/10 flex items-center justify-center mb-4">
                  <c.icon className="h-5 w-5 text-[hsl(var(--brand-gold))]" />
                </div>
                <h3 className="font-display text-xl mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </Card>
            ))}
          </div>

          <p className="mt-10 text-xs text-muted-foreground text-center max-w-3xl mx-auto">
            <Calculator className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
            Alle Berechnungen sind unverbindliche Beispielrechnungen ohne Berücksichtigung Ihrer
            individuellen Bonität. Das tatsächliche Angebot erstellen wir gemeinsam mit unseren
            Bankpartnern.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}