import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter, Fuel, Gauge, Cog, Calendar } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/Reveal';
import { ParallaxImage } from '@/components/Parallax';
import { vehicles, type Vehicle } from '@/data/vehicles';

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

  const filtered = useMemo(() => {
    const list = vehicles.filter((vehicle) =>
      category === 'Alle' ? true : vehicle.category === category
    );
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
  }, [category, sort]);

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

      {/* GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              Keine Fahrzeuge in dieser Kategorie verfügbar.
            </div>
          ) : (
            <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
              {filtered.map((vehicle) => (
                <VehicleCard key={vehicle.slug} vehicle={vehicle} />
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}