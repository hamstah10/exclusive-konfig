import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Calendar, Cog, Fuel, Gauge, Palette, Sparkles,
  ShieldCheck, Phone, Mail, Settings2, Car as CarIcon,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/Reveal';
import { findVehicle, vehicles } from '@/data/vehicles';

export default function VehicleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const vehicle = slug ? findVehicle(slug) : undefined;
  const [activeImg, setActiveImg] = useState(0);

  if (!vehicle) return <Navigate to="/fahrzeuge" replace />;

  const specs = [
    { icon: <Calendar className="h-4 w-4" />, label: 'Erstzulassung', value: String(vehicle.year) },
    { icon: <Gauge className="h-4 w-4" />, label: 'Leistung', value: `${vehicle.hp} PS` },
    { icon: <Cog className="h-4 w-4" />, label: 'Kilometerstand', value: `${vehicle.km.toLocaleString('de-DE')} km` },
    { icon: <Fuel className="h-4 w-4" />, label: 'Kraftstoff', value: vehicle.fuel },
    { icon: <Settings2 className="h-4 w-4" />, label: 'Getriebe', value: vehicle.transmission },
    { icon: <CarIcon className="h-4 w-4" />, label: 'Antrieb', value: vehicle.drive },
    { icon: <Palette className="h-4 w-4" />, label: 'Farbe', value: vehicle.color },
    { icon: <ShieldCheck className="h-4 w-4" />, label: 'Kategorie', value: vehicle.category },
  ];

  const related = vehicles
    .filter((other) => other.slug !== vehicle.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader variant="solid" />

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          to="/fahrzeuge"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-[hsl(var(--brand-gold))] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück zur Fahrzeugbörse
        </Link>
      </div>

      {/* HERO */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-10">
          {/* GALLERY */}
          <div className="lg:col-span-3">
            <Reveal direction="scale">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="aspect-[4/3] overflow-hidden border border-border bg-muted"
              >
                <img
                  src={vehicle.gallery[activeImg]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                  width={1280}
                  height={896}
                />
              </motion.div>
            </Reveal>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {vehicle.gallery.map((g, idx) => (
                <button
                  key={g + idx}
                  type="button"
                  onClick={() => setActiveImg(idx)}
                  className={`aspect-[4/3] overflow-hidden border-2 transition-colors ${
                    activeImg === idx ? 'border-[hsl(var(--brand-gold))]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Bild ${idx + 1} ansehen`}
                >
                  <img src={g} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="lg:col-span-2">
            <Reveal direction="left">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] mb-4">
                <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
                {vehicle.brand}
              </span>
            </Reveal>
            <Reveal direction="up" delay={0.05}>
              <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4">
                {vehicle.model}
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <div className="font-display text-3xl text-[hsl(var(--brand-gold))] mb-6">
                {vehicle.priceLabel}
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground ml-2 font-sans">inkl. MwSt.</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {vehicle.description}
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href="tel:+4938301000000"
                  className="group inline-flex items-center justify-center gap-2 bg-[hsl(var(--brand-dark))] text-white px-6 py-3.5 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))]/90 transition-all"
                >
                  <Phone className="h-4 w-4" /> Probefahrt anfragen
                </a>
                <a
                  href="mailto:info@exclusiv-automobile-ruegen.de"
                  className="group inline-flex items-center justify-center gap-2 border-2 border-[hsl(var(--brand-dark))] text-[hsl(var(--brand-dark))] px-6 py-3.5 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))] hover:text-white transition-all"
                >
                  <Mail className="h-4 w-4" /> Anfragen
                </a>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.25}>
              <Link
                to="/konfigurator"
                className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1 hover:text-[hsl(var(--brand-gold))] transition-colors"
              >
                <Sparkles className="h-4 w-4" /> Tuning für dieses Modell konfigurieren
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="py-16 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal direction="up">
            <h2 className="font-display text-3xl md:text-4xl mb-10">
              Technische <span className="italic text-[hsl(var(--brand-gold))]">Daten</span>
            </h2>
          </Reveal>
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.06}>
            {specs.map((s) => (
              <StaggerItem key={s.label}>
                <div className="bg-card border border-border p-5">
                  <div className="flex items-center gap-2 text-[hsl(var(--brand-gold))] mb-2">{s.icon}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {s.label}
                  </div>
                  <div className="font-semibold">{s.value}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <Reveal direction="up">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] mb-4">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Ausstattung
            </span>
            <h2 className="font-display text-3xl md:text-4xl leading-tight">
              Highlights, die <span className="italic text-[hsl(var(--brand-gold))]">begeistern.</span>
            </h2>
          </Reveal>
          <StaggerGroup className="grid sm:grid-cols-2 gap-3" stagger={0.06}>
            {vehicle.highlights.map((h) => (
              <StaggerItem key={h} distance={16}>
                <div className="flex items-start gap-3 bg-card border border-border p-4">
                  <Sparkles className="h-4 w-4 text-[hsl(var(--brand-gold))] shrink-0 mt-0.5" />
                  <span className="text-sm">{h}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* RELATED */}
      <section className="py-16 md:py-20 bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal direction="up">
            <h2 className="font-display text-3xl md:text-4xl mb-10">
              Weitere <span className="italic text-[hsl(var(--brand-gold))]">Fahrzeuge</span>
            </h2>
          </Reveal>
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
            {related.map((other) => (
              <StaggerItem key={other.slug} direction="scale" distance={32}>
                <Link to={`/fahrzeuge/${other.slug}`} className="block h-full">
                  <motion.article
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-card border border-border overflow-hidden hover:border-[hsl(var(--brand-gold))] transition-colors h-full"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={other.img}
                        alt={`${other.brand} ${other.model}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                        {other.brand}
                      </div>
                      <h3 className="font-display text-xl mb-3">{other.model}</h3>
                      <div className="flex items-end justify-between pt-3 border-t border-border">
                        <span className="font-display text-xl text-[hsl(var(--brand-gold))]">{other.priceLabel}</span>
                        <span className="text-xs uppercase tracking-[0.15em] font-semibold inline-flex items-center gap-1 group-hover:text-[hsl(var(--brand-gold))] transition-colors">
                          Details <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}