import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter, Fuel, Gauge, Cog, Calendar, Search, X } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/Reveal';
import { ParallaxImage } from '@/components/Parallax';
import { vehicles, type Vehicle } from '@/data/vehicles';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'hp-desc';

const categories = ['Alle', 'Sportwagen', 'Coupé', 'Limousine', 'SUV', 'Cabrio'] as const;

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <StaggerItem direction="scale" distance={32}>
      <Link to={`/fahrzeuge/${vehicle.slug}`} className="block h-full">
        <motion.article
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
          className="group bg-card border border-border overflow-hidden hover:border-[hsl(var(--brand-gold))] hover:shadow-xl hover:shadow-[hsl(var(--brand-dark))]/10 transition-colors h-full flex flex-col"
        >
          <div className="relative">
            <ParallaxImage
              src={vehicle.img}
              alt={`${vehicle.brand} ${vehicle.model}`}
              offset={10}
              width={1280}
              height={896}
              className="aspect-[4/3] bg-muted"
              imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
            />
            <span className="absolute top-3 left-3 bg-[hsl(var(--brand-dark))]/85 text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1">
              {vehicle.category}
            </span>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {vehicle.brand}
            </div>
            <h3 className="font-display text-2xl mb-3">{vehicle.model}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />EZ {vehicle.year}</span>
              <span className="inline-flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" />{vehicle.hp} PS</span>
              <span className="inline-flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5" />{vehicle.fuel}</span>
              <span className="inline-flex items-center gap-1.5"><Cog className="h-3.5 w-3.5" />{vehicle.km.toLocaleString('de-DE')} km</span>
            </div>
            <div className="flex items-end justify-between pt-4 border-t border-border mt-auto">
              <span className="font-display text-2xl text-[hsl(var(--brand-gold))]">{vehicle.priceLabel}</span>
              <span className="text-xs uppercase tracking-[0.15em] font-semibold inline-flex items-center gap-1 group-hover:text-[hsl(var(--brand-gold))] transition-colors">
                Details <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    </StaggerItem>
  );
}

export default function MarketplacePage() {
  const [category, setCategory] = useState<(typeof categories)[number]>('Alle');
  const [sort, setSort] = useState<SortKey>('newest');
  const [search, setSearch] = useState('');
  const [brands, setBrands] = useState<string[]>([]);
  const [fuels, setFuels] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  const [drives, setDrives] = useState<string[]>([]);

  const allBrands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))).sort(), []);
  const allFuels = useMemo(() => Array.from(new Set(vehicles.map((v) => v.fuel))).sort(), []);
  const allTransmissions = useMemo(() => Array.from(new Set(vehicles.map((v) => v.transmission))).sort(), []);
  const allDrives = useMemo(() => Array.from(new Set(vehicles.map((v) => v.drive))).sort(), []);

  const yearMin = useMemo(() => Math.min(...vehicles.map((v) => v.year)), []);
  const yearMax = useMemo(() => Math.max(...vehicles.map((v) => v.year)), []);
  const priceMax = useMemo(() => Math.max(...vehicles.map((v) => v.price)), []);
  const kmMax = useMemo(() => Math.max(...vehicles.map((v) => v.km)), []);
  const hpMax = useMemo(() => Math.max(...vehicles.map((v) => v.hp)), []);

  const [yearRange, setYearRange] = useState<[number, number]>([yearMin, yearMax]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, priceMax]);
  const [kmLimit, setKmLimit] = useState<number>(kmMax);
  const [hpMin, setHpMin] = useState<number>(0);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const resetFilters = () => {
    setCategory('Alle');
    setSearch('');
    setBrands([]);
    setFuels([]);
    setTransmissions([]);
    setDrives([]);
    setYearRange([yearMin, yearMax]);
    setPriceRange([0, priceMax]);
    setKmLimit(kmMax);
    setHpMin(0);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = vehicles.filter((vehicle) => {
      if (category !== 'Alle' && vehicle.category !== category) return false;
      if (brands.length && !brands.includes(vehicle.brand)) return false;
      if (fuels.length && !fuels.includes(vehicle.fuel)) return false;
      if (transmissions.length && !transmissions.includes(vehicle.transmission)) return false;
      if (drives.length && !drives.includes(vehicle.drive)) return false;
      if (vehicle.year < yearRange[0] || vehicle.year > yearRange[1]) return false;
      if (vehicle.price < priceRange[0] || vehicle.price > priceRange[1]) return false;
      if (vehicle.km > kmLimit) return false;
      if (vehicle.hp < hpMin) return false;
      if (q && !`${vehicle.brand} ${vehicle.model} ${vehicle.color}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...list];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'hp-desc':
        sorted.sort((a, b) => b.hp - a.hp);
        break;
      default:
        sorted.sort((a, b) => b.year - a.year);
    }
    return sorted;
  }, [category, sort, search, brands, fuels, transmissions, drives, yearRange, priceRange, kmLimit, hpMin]);

  const activeCount =
    (category !== 'Alle' ? 1 : 0) +
    brands.length +
    fuels.length +
    transmissions.length +
    drives.length +
    (yearRange[0] !== yearMin || yearRange[1] !== yearMax ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== priceMax ? 1 : 0) +
    (kmLimit !== kmMax ? 1 : 0) +
    (hpMin !== 0 ? 1 : 0) +
    (search ? 1 : 0);

  const fmtEur = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n) + ' €';
  const fmtKm = (n: number) => new Intl.NumberFormat('de-DE').format(n) + ' km';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader variant="solid" />

      {/* HERO */}
      <section className="relative bg-brand-dark text-white py-24 md:py-32 overflow-hidden border-b border-[hsl(var(--brand-gold))]/20">
        <div className="absolute inset-0 opacity-20">
          <ParallaxImage
            src={vehicles[0].img}
            alt=""
            offset={20}
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--brand-dark))] via-[hsl(var(--brand-dark))]/70 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <Reveal direction="left">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-gold mb-5">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Fahrzeugbörse
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 max-w-3xl">
              Aktuelle <span className="italic text-brand-gold">Highlights</span> aus unserem Bestand.
            </h1>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="text-white/75 max-w-2xl text-lg leading-relaxed">
              Handverlesene Fahrzeuge mit Geschichte, Pflege und Charakter. Jedes Auto wird vor Übergabe
              auf unserem 4WD-Prüfstand vermessen und technisch überprüft.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FILTER */}
      {/* TOOLBAR */}
      <section className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-[hsl(var(--brand-gold))]" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`text-xs uppercase tracking-[0.15em] px-3 py-1.5 border transition-colors ${
                  category === cat
                    ? 'bg-[hsl(var(--brand-dark))] text-white border-[hsl(var(--brand-dark))]'
                    : 'border-border text-muted-foreground hover:border-[hsl(var(--brand-gold))] hover:text-[hsl(var(--brand-dark))]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Sortieren
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent border border-border px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] focus:outline-none focus:border-[hsl(var(--brand-gold))]"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="price-asc">Preis aufsteigend</option>
              <option value="price-desc">Preis absteigend</option>
              <option value="hp-desc">PS absteigend</option>
            </select>
          </label>
        </div>
      </section>

      {/* GRID + SIDEBAR */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[280px_1fr] gap-8">
          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Filter</span>
                <h2 className="font-display text-xl">Verfeinern</h2>
              </div>
              {activeCount > 0 && (
                <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
                  <X className="h-3 w-3 mr-1" />Reset ({activeCount})
                </Button>
              )}
            </div>

            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Marke, Modell, Farbe…"
                className="pl-9"
              />
            </div>

            <FilterGroup title="Marke">
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                {allBrands.map((b) => (
                  <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={brands.includes(b)} onCheckedChange={() => toggle(brands, setBrands, b)} />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title={`Erstzulassung (${yearRange[0]} – ${yearRange[1]})`}>
              <Slider
                min={yearMin}
                max={yearMax}
                step={1}
                value={yearRange}
                onValueChange={(v) => setYearRange([v[0], v[1]] as [number, number])}
              />
            </FilterGroup>

            <FilterGroup title={`Preis (${fmtEur(priceRange[0])} – ${fmtEur(priceRange[1])})`}>
              <Slider
                min={0}
                max={priceMax}
                step={1000}
                value={priceRange}
                onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
              />
            </FilterGroup>

            <FilterGroup title={`Max. Kilometerstand (${fmtKm(kmLimit)})`}>
              <Slider
                min={0}
                max={kmMax}
                step={1000}
                value={[kmLimit]}
                onValueChange={(v) => setKmLimit(v[0])}
              />
            </FilterGroup>

            <FilterGroup title={`Mindest-Leistung (${hpMin} PS)`}>
              <Slider
                min={0}
                max={hpMax}
                step={10}
                value={[hpMin]}
                onValueChange={(v) => setHpMin(v[0])}
              />
            </FilterGroup>

            <FilterGroup title="Kraftstoff">
              <div className="flex flex-wrap gap-2">
                {allFuels.map((f) => (
                  <Pill key={f} active={fuels.includes(f)} onClick={() => toggle(fuels, setFuels, f)}>{f}</Pill>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Getriebe">
              <div className="flex flex-wrap gap-2">
                {allTransmissions.map((t) => (
                  <Pill key={t} active={transmissions.includes(t)} onClick={() => toggle(transmissions, setTransmissions, t)}>{t}</Pill>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Antrieb">
              <div className="flex flex-wrap gap-2">
                {allDrives.map((d) => (
                  <Pill key={d} active={drives.includes(d)} onClick={() => toggle(drives, setDrives, d)}>{d}</Pill>
                ))}
              </div>
            </FilterGroup>
          </aside>

          {/* GRID */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
              {filtered.length} {filtered.length === 1 ? 'Fahrzeug' : 'Fahrzeuge'} gefunden
            </p>
            {filtered.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground border border-dashed border-border">
                Keine Fahrzeuge passen zu deiner Auswahl.
                <div className="mt-4">
                  <Button variant="outline" onClick={resetFilters}>Filter zurücksetzen</Button>
                </div>
              </div>
            ) : (
              <StaggerGroup className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6" stagger={0.08}>
                {filtered.map((vehicle) => (
                  <VehicleCard key={vehicle.slug} vehicle={vehicle} />
                ))}
              </StaggerGroup>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-4">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--brand-dark))] mb-3 font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs uppercase tracking-[0.15em] px-3 py-1.5 border transition-colors ${
        active
          ? 'bg-[hsl(var(--brand-dark))] text-white border-[hsl(var(--brand-dark))]'
          : 'border-border text-muted-foreground hover:border-[hsl(var(--brand-gold))]'
      }`}
    >
      {children}
    </button>
  );
}