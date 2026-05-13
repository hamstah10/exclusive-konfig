import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Gauge, Wrench, Car, Activity, ShieldCheck, Sparkles,
  Cpu, LineChart as LineChartIcon, Award, Phone,
} from 'lucide-react';
import heroCar from '@/assets/hero-car.jpg';
import dynoImg from '@/assets/dyno.jpg';
import showroomImg from '@/assets/showroom.jpg';
import wheelsImg from '@/assets/wheels.jpg';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const featuredCars = [
  { brand: 'Porsche', model: '911 Turbo S', year: 2022, hp: 650, price: '189.900 €', img: heroCar },
  { brand: 'BMW', model: 'M4 Competition', year: 2023, hp: 510, price: '109.500 €', img: showroomImg },
  { brand: 'Mercedes-AMG', model: 'C 63 S', year: 2021, hp: 510, price: '79.900 €', img: wheelsImg },
];

const stats = [
  { value: '15+', label: 'Jahre Erfahrung' },
  { value: '2.500+', label: 'Optimierte Fahrzeuge' },
  { value: '4WD', label: 'Allrad-Prüfstand' },
  { value: '1.200', label: 'PS Prüfleistung' },
];

export default function LandingPage() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <SiteHeader variant="overlay" />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img
          src={heroCar}
          alt="Porsche 911 Turbo S vor Rügener Küste bei Sonnenuntergang"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--brand-dark))] via-[hsl(var(--brand-dark))]/40 to-[hsl(var(--brand-dark))]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--brand-dark))]/80 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 pb-20 md:pb-28 pt-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-white"
          >
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-gold mb-6">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Insel Rügen · seit 2009
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6">
              Mehr Freude<br />
              <span className="italic text-brand-gold">am Fahren.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed mb-10">
              Exklusive Fahrzeuge, ehrliches Chiptuning und ein eigener Allrad-Leistungsprüfstand –
              alles unter einem Dach, direkt an der Ostsee.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/konfigurator"
                className="group inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-7 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Tuning konfigurieren
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#fahrzeuge"
                className="inline-flex items-center gap-2 border border-white/40 text-white px-7 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-white/10 transition-all"
              >
                Fahrzeugbörse
              </a>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-[hsl(var(--brand-dark))]/95 backdrop-blur border-t border-[hsl(var(--brand-gold))]/30">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="font-display text-2xl md:text-3xl text-brand-gold">{s.value}</div>
                <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] mb-5">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Willkommen
            </span>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              Vorstellungen werden <span className="italic text-[hsl(var(--brand-gold))]">zur Realität.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              Ob exklusive Fahrzeuge, mehr Power für deinen Alltagswagen oder die professionelle
              Vermessung auf unserem 4WD-Leistungsprüfstand – bei exclusiv Automobile Rügen
              bekommst du alles aus einer Hand.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              Wir arbeiten ehrlich, transparent und mit Leidenschaft. Jede Optimierung ist
              individuell auf dein Fahrzeug abgestimmt – nicht von der Stange.
            </p>
            <a
              href="#chiptuning"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1 hover:text-[hsl(var(--brand-gold))] transition-colors"
            >
              Mehr erfahren <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Award className="h-6 w-6" />, title: 'Zertifizierte Optimierung', text: 'Eintragungsfähige Lösungen' },
              { icon: <ShieldCheck className="h-6 w-6" />, title: 'TÜV-konform', text: 'Sicherheit hat Priorität' },
              { icon: <Cpu className="h-6 w-6" />, title: 'Original-ECU', text: 'Reversibel & sauber' },
              { icon: <Phone className="h-6 w-6" />, title: 'Persönliche Beratung', text: 'Termin nach Vereinbarung' },
            ].map((f) => (
              <div key={f.title} className="border border-border p-6 hover:border-[hsl(var(--brand-gold))] transition-colors">
                <div className="text-[hsl(var(--brand-gold))] mb-3">{f.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHIPTUNING + KONFIGURATOR CTA */}
      <section id="chiptuning" className="bg-brand-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={dynoImg} alt="" className="w-full h-full object-cover" loading="lazy" width={1280} height={896} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-gold mb-5">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Chiptuning
            </span>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              Mehr Power.<br />
              <span className="italic text-brand-gold">Weniger Verbrauch.</span>
            </h2>
            <p className="text-white/75 text-base leading-relaxed mb-8 max-w-lg">
              Optimierung sämtlicher Fahrzeugmodelle bei OptimaTuning Germany auf der Insel Rügen.
              Wähle dein Fahrzeug, deine Stage und sieh sofort eine fahrzeugspezifische
              Leistungsprognose – inklusive Dyno-Kurve und transparenter Preise.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                'Stage 1, Stage 2 & Eco-Stage für Diesel',
                'Live-Leistungsprognose & Vergleichsmodus',
                'Tuning-Optionen wie DTC, Pops & Bangs, V/Max-Off',
                'Termin direkt vereinbaren – Optimierung in 1 Tag',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                  <Sparkles className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/konfigurator"
              className="group inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-7 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 transition-all"
            >
              <Gauge className="h-4 w-4" />
              Jetzt konfigurieren
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { stage: 'Stage 1', delta: '+25 % PS', desc: 'Software-Optimierung', from: 'ab 599 €' },
              { stage: 'Stage 2', delta: '+40 % PS', desc: 'Hardware + Software', from: 'ab 1.499 €' },
              { stage: 'Eco', delta: '−15 % Verbrauch', desc: 'Spritspar-Tuning Diesel', from: 'ab 449 €' },
              { stage: 'Optionen', delta: 'DTC · Pops & Bangs', desc: 'Individuelle Features', from: 'ab 99 €' },
            ].map((s) => (
              <div key={s.stage} className="border border-white/15 bg-white/5 backdrop-blur p-6 hover:border-[hsl(var(--brand-gold))] transition-colors">
                <div className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-2">{s.stage}</div>
                <div className="font-display text-2xl mb-1">{s.delta}</div>
                <div className="text-xs text-white/60 mb-4">{s.desc}</div>
                <div className="text-sm font-semibold text-white">{s.from}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAHRZEUGBÖRSE */}
      <section id="fahrzeuge" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] mb-4">
                <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
                Fahrzeugbörse
              </span>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                Aktuelle <span className="italic text-[hsl(var(--brand-gold))]">Highlights</span>
              </h2>
            </div>
            <a href="#" className="text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1">
              Alle Fahrzeuge ansehen →
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredCars.map((car, idx) => (
              <motion.article
                key={car.model}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-card border border-border overflow-hidden hover:border-[hsl(var(--brand-gold))] transition-colors"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={car.img}
                    alt={`${car.brand} ${car.model}`}
                    loading="lazy"
                    width={1280}
                    height={896}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{car.brand}</div>
                  <h3 className="font-display text-2xl mb-3">{car.model}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>EZ {car.year}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>{car.hp} PS</span>
                  </div>
                  <div className="flex items-end justify-between pt-4 border-t border-border">
                    <span className="font-display text-2xl text-[hsl(var(--brand-gold))]">{car.price}</span>
                    <a href="#" className="text-xs uppercase tracking-[0.15em] font-semibold hover:text-[hsl(var(--brand-gold))] transition-colors">
                      Details →
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PRÜFSTAND */}
      <section id="pruefstand" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] overflow-hidden border border-border">
              <img
                src={dynoImg}
                alt="Allrad-Leistungsprüfstand"
                loading="lazy"
                width={1280}
                height={896}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] mb-5">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Leistungsprüfstand
            </span>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              4WD-Allrad-Dyno.<br />
              <span className="italic text-[hsl(var(--brand-gold))]">Daten lügen nicht.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              Auf unserem hochpräzisen Leistungsprüfstand vermessen wir Front-, Heck- und
              Allradfahrzeuge bis 1.200 PS. Du bekommst ein offizielles Diagramm mit
              PS-, Drehmoment- und Lambda-Verlauf – perfekt vor und nach jeder Optimierung.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: <Activity className="h-5 w-5" />, label: 'Lambda-Messung' },
                { icon: <LineChartIcon className="h-5 w-5" />, label: 'PS & Nm Diagramm' },
                { icon: <Gauge className="h-5 w-5" />, label: 'Bis 1.200 PS' },
                { icon: <Wrench className="h-5 w-5" />, label: 'Vor- & Nachher-Vergleich' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3 bg-card border border-border p-4">
                  <span className="text-[hsl(var(--brand-gold))]">{f.icon}</span>
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>

            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 border-2 border-[hsl(var(--brand-dark))] text-[hsl(var(--brand-dark))] px-7 py-3.5 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))] hover:text-white transition-all"
            >
              Termin anfragen <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* RÄDER */}
      <section id="raeder" className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] mb-5">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Räder &amp; Reifen
            </span>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              Der perfekte <span className="italic text-[hsl(var(--brand-gold))]">Auftritt.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              Vom OEM-Plus-Rad bis zur Schmiedefelge – wir liefern, montieren und tragen ein.
              Reifenwechsel, Auswuchten und Einlagerung gehören selbstverständlich dazu.
            </p>
            <ul className="space-y-3 mb-8">
              {['Premium-Marken & Eigenfertigung', 'Eintragung & TÜV-Abnahme inklusive', 'Saisonale Einlagerung möglich'].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <Sparkles className="h-4 w-4 text-[hsl(var(--brand-gold))] shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1 hover:text-[hsl(var(--brand-gold))] transition-colors"
            >
              Beratung anfragen <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="aspect-[4/3] overflow-hidden border border-border">
            <img src={wheelsImg} alt="Premium Felgen" loading="lazy" width={1280} height={896} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-dark text-white py-20 border-t border-[hsl(var(--brand-gold))]/20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Car className="h-10 w-10 text-[hsl(var(--brand-gold))] mx-auto mb-6" />
          <h2 className="font-display text-4xl md:text-5xl mb-5 leading-tight">
            Bereit für <span className="italic text-brand-gold">mehr Power?</span>
          </h2>
          <p className="text-white/75 text-lg max-w-2xl mx-auto mb-10">
            Konfiguriere dein Tuning in unter 60 Sekunden und sieh sofort, was in deinem Fahrzeug steckt.
          </p>
          <Link
            to="/konfigurator"
            className="group inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-8 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Konfigurator starten
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
