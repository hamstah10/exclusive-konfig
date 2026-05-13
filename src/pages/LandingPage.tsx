import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight, Gauge, Wrench, Car, Activity, ShieldCheck, Sparkles,
  Cpu, LineChart as LineChartIcon, Award, Phone, ChevronDown,
} from 'lucide-react';
import heroCar from '@/assets/hero-car.jpg';
import dynoImg from '@/assets/dyno.jpg';
import wheelsImg from '@/assets/wheels.jpg';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/Reveal';
import { CountUp } from '@/components/CountUp';
import { ParallaxImage } from '@/components/Parallax';
import { featuredVehicles } from '@/data/vehicles';

const featuredCars = featuredVehicles();

const stats = [
  { value: '15+', label: 'Jahre Erfahrung' },
  { value: '2.500+', label: 'Optimierte Fahrzeuge' },
  { value: '4WD', label: 'Allrad-Prüfstand' },
  { value: '1.200', label: 'PS Prüfleistung' },
];

const stagePackages = [
  { stage: 'Stage 1', delta: '+25 % PS', desc: 'Software-Optimierung', from: 'ab 599 €' },
  { stage: 'Stage 2', delta: '+40 % PS', desc: 'Hardware + Software', from: 'ab 1.499 €' },
  { stage: 'Eco', delta: '−15 % Verbrauch', desc: 'Spritspar-Tuning Diesel', from: 'ab 449 €' },
  { stage: 'Optionen', delta: 'DTC · Pops & Bangs', desc: 'Individuelle Features', from: 'ab 99 €' },
];

const features = [
  { icon: <Award className="h-6 w-6" />, title: 'Zertifizierte Optimierung', text: 'Eintragungsfähige Lösungen' },
  { icon: <ShieldCheck className="h-6 w-6" />, title: 'TÜV-konform', text: 'Sicherheit hat Priorität' },
  { icon: <Cpu className="h-6 w-6" />, title: 'Original-ECU', text: 'Reversibel & sauber' },
  { icon: <Phone className="h-6 w-6" />, title: 'Persönliche Beratung', text: 'Termin nach Vereinbarung' },
];

const dynoFeatures = [
  { icon: <Activity className="h-5 w-5" />, label: 'Lambda-Messung' },
  { icon: <LineChartIcon className="h-5 w-5" />, label: 'PS & Nm Diagramm' },
  { icon: <Gauge className="h-5 w-5" />, label: 'Bis 1.200 PS' },
  { icon: <Wrench className="h-5 w-5" />, label: 'Vor- & Nachher-Vergleich' },
];

const tuningPoints = [
  'Stage 1, Stage 2 & Eco-Stage für Diesel',
  'Live-Leistungsprognose & Vergleichsmodus',
  'Tuning-Optionen wie DTC, Pops & Bangs, V/Max-Off',
  'Termin direkt vereinbaren – Optimierung in 1 Tag',
];

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-end overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src={heroCar}
          alt="Porsche 911 Turbo S vor Rügener Küste bei Sonnenuntergang"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--brand-dark))] via-[hsl(var(--brand-dark))]/40 to-[hsl(var(--brand-dark))]/60"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--brand-dark))]/80 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 pb-32 md:pb-40 pt-32 w-full">
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="max-w-3xl text-white"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-gold mb-6"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-px w-10 bg-[hsl(var(--brand-gold))] origin-left"
            />
            Insel Rügen · seit 2009
          </motion.span>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6 overflow-hidden">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Mehr Freude
            </motion.span>
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-brand-gold"
            >
              am Fahren.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed mb-10"
          >
            Exklusive Fahrzeuge, ehrliches Chiptuning und ein eigener Allrad-Leistungsprüfstand –
            alles unter einem Dach, direkt an der Ostsee.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/konfigurator"
              className="group inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-7 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 transition-all hover:shadow-2xl hover:shadow-[hsl(var(--brand-gold))]/30 hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Tuning konfigurieren
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#fahrzeuge"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-7 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-white/10 hover:border-brand-gold transition-all"
            >
              Fahrzeugbörse
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#willkommen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white/60 hover:text-brand-gold transition-colors"
        aria-label="Nach unten scrollen"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.a>

      {/* Stats Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 inset-x-0 bg-[hsl(var(--brand-dark))]/95 backdrop-blur border-t border-[hsl(var(--brand-gold))]/30"
      >
        <StaggerGroup
          className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4"
          stagger={0.12}
          delay={0.2}
        >
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center md:text-left">
              <div className="font-display text-2xl md:text-3xl text-brand-gold">
                <CountUp value={s.value} />
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60 mt-1">
                {s.label}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </motion.div>
    </section>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 h-0.5 bg-[hsl(var(--brand-gold))] origin-left z-50"
    />
  );
}

function SectionEyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <Reveal direction="left" duration={0.6}>
      <span className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] ${dark ? 'text-brand-gold' : 'text-[hsl(var(--brand-gold))]'} mb-5`}>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-px w-10 bg-[hsl(var(--brand-gold))] origin-left"
        />
        {children}
      </span>
    </Reveal>
  );
}

export default function LandingPage() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <SiteHeader variant="overlay" />

      <HeroSection />

      {/* INTRO */}
      <section id="willkommen" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionEyebrow>Willkommen</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                Vorstellungen werden{' '}
                <span className="italic text-[hsl(var(--brand-gold))]">zur Realität.</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                Ob exklusive Fahrzeuge, mehr Power für deinen Alltagswagen oder die professionelle
                Vermessung auf unserem 4WD-Leistungsprüfstand – bei exclusiv Automobile Rügen
                bekommst du alles aus einer Hand.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Wir arbeiten ehrlich, transparent und mit Leidenschaft. Jede Optimierung ist
                individuell auf dein Fahrzeug abgestimmt – nicht von der Stange.
              </p>
            </Reveal>
            <Reveal direction="up" delay={0.3}>
              <a
                href="#chiptuning"
                className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1 hover:text-[hsl(var(--brand-gold))] transition-colors"
              >
                Mehr erfahren <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Reveal>
          </div>

          <StaggerGroup className="grid grid-cols-2 gap-4" stagger={0.1}>
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <motion.div
                  whileHover={{ y: -6, borderColor: 'hsl(var(--brand-gold))' }}
                  transition={{ duration: 0.3 }}
                  className="border border-border p-6 h-full bg-card"
                >
                  <motion.div
                    whileHover={{ rotate: -8, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-[hsl(var(--brand-gold))] mb-3"
                  >
                    {f.icon}
                  </motion.div>
                  <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">{f.text}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CHIPTUNING */}
      <section id="chiptuning" className="bg-brand-dark text-white py-24 md:py-32 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.12 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <ParallaxImage
            src={dynoImg}
            alt=""
            offset={20}
            width={1280}
            height={896}
            className="absolute inset-0"
          />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionEyebrow dark>Chiptuning</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                Mehr Power.<br />
                <span className="italic text-brand-gold">Weniger Verbrauch.</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-white/75 text-base leading-relaxed mb-8 max-w-lg">
                Optimierung sämtlicher Fahrzeugmodelle bei OptimaTuning Germany auf der Insel Rügen.
                Wähle dein Fahrzeug, deine Stage und sieh sofort eine fahrzeugspezifische
                Leistungsprognose – inklusive Dyno-Kurve und transparenter Preise.
              </p>
            </Reveal>

            <StaggerGroup className="space-y-3 mb-10" stagger={0.08}>
              {tuningPoints.map((item) => (
                <StaggerItem key={item} distance={16}>
                  <li className="flex items-start gap-3 text-sm text-white/85 list-none">
                    <Sparkles className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                    {item}
                  </li>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal direction="up" delay={0.3}>
              <Link
                to="/konfigurator"
                className="group inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-7 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 transition-all hover:shadow-2xl hover:shadow-[hsl(var(--brand-gold))]/30 hover:-translate-y-0.5"
              >
                <Gauge className="h-4 w-4" />
                Jetzt konfigurieren
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>

          <StaggerGroup className="grid grid-cols-2 gap-4" stagger={0.1}>
            {stagePackages.map((s) => (
              <StaggerItem key={s.stage} direction="scale" distance={32}>
                <motion.div
                  whileHover={{ y: -8, borderColor: 'hsl(var(--brand-gold))' }}
                  transition={{ duration: 0.3 }}
                  className="border border-white/15 bg-white/5 backdrop-blur p-6 h-full"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-2">{s.stage}</div>
                  <div className="font-display text-2xl mb-1">{s.delta}</div>
                  <div className="text-xs text-white/60 mb-4">{s.desc}</div>
                  <div className="text-sm font-semibold text-white">{s.from}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* FAHRZEUGBÖRSE */}
      <section id="fahrzeuge" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <SectionEyebrow>Fahrzeugbörse</SectionEyebrow>
              <Reveal direction="up" delay={0.1}>
                <h2 className="font-display text-4xl md:text-5xl leading-tight">
                  Aktuelle <span className="italic text-[hsl(var(--brand-gold))]">Highlights</span>
                </h2>
              </Reveal>
            </div>
            <Reveal direction="right" delay={0.2}>
              <Link
                to="/fahrzeuge"
                className="group text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1 inline-flex items-center gap-2"
              >
                Alle Fahrzeuge ansehen
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>

          <StaggerGroup className="grid md:grid-cols-3 gap-6" stagger={0.15}>
            {featuredCars.map((car) => (
              <StaggerItem key={car.slug} direction="scale" distance={40}>
                <Link to={`/fahrzeuge/${car.slug}`} className="block h-full">
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-card border border-border overflow-hidden hover:border-[hsl(var(--brand-gold))] hover:shadow-xl hover:shadow-[hsl(var(--brand-dark))]/10 transition-colors h-full"
                >
                  <ParallaxImage
                    src={car.img}
                    alt={`${car.brand} ${car.model}`}
                    offset={12}
                    width={1280}
                    height={896}
                    className="aspect-[4/3] bg-muted"
                    imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
                  />
                  <div className="p-6">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{car.brand}</div>
                    <h3 className="font-display text-2xl mb-3">{car.model}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>EZ {car.year}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                      <span>{car.hp} PS</span>
                    </div>
                    <div className="flex items-end justify-between pt-4 border-t border-border">
                      <span className="font-display text-2xl text-[hsl(var(--brand-gold))]">{car.priceLabel}</span>
                      <span className="text-xs uppercase tracking-[0.15em] font-semibold inline-flex items-center gap-1 group-hover:text-[hsl(var(--brand-gold))] transition-colors">
                        Details
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
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

      {/* PRÜFSTAND */}
      <section id="pruefstand" className="py-24 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="right" className="order-2 lg:order-1" duration={0.9}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="aspect-[4/3] overflow-hidden border border-border"
            >
              <ParallaxImage
                src={dynoImg}
                alt="Allrad-Leistungsprüfstand"
                offset={18}
                width={1280}
                height={896}
                className="w-full h-full"
              />
            </motion.div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionEyebrow>Leistungsprüfstand</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                4WD-Allrad-Dyno.<br />
                <span className="italic text-[hsl(var(--brand-gold))]">Daten lügen nicht.</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Auf unserem hochpräzisen Leistungsprüfstand vermessen wir Front-, Heck- und
                Allradfahrzeuge bis 1.200 PS. Du bekommst ein offizielles Diagramm mit
                PS-, Drehmoment- und Lambda-Verlauf – perfekt vor und nach jeder Optimierung.
              </p>
            </Reveal>

            <StaggerGroup className="grid grid-cols-2 gap-4 mb-8" stagger={0.08}>
              {dynoFeatures.map((f) => (
                <StaggerItem key={f.label}>
                  <motion.div
                    whileHover={{ x: 4, borderColor: 'hsl(var(--brand-gold))' }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 bg-card border border-border p-4"
                  >
                    <span className="text-[hsl(var(--brand-gold))]">{f.icon}</span>
                    <span className="text-sm font-medium">{f.label}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal direction="up" delay={0.3}>
              <Link
                to="/pruefstand-buchung"
                className="group inline-flex items-center gap-2 border-2 border-[hsl(var(--brand-dark))] text-[hsl(var(--brand-dark))] px-7 py-3.5 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))] hover:text-white transition-all"
              >
                Termin buchen
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RÄDER */}
      <section id="raeder" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionEyebrow>Räder &amp; Reifen</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                Der perfekte <span className="italic text-[hsl(var(--brand-gold))]">Auftritt.</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                Vom OEM-Plus-Rad bis zur Schmiedefelge – wir liefern, montieren und tragen ein.
                Reifenwechsel, Auswuchten und Einlagerung gehören selbstverständlich dazu.
              </p>
            </Reveal>

            <StaggerGroup className="space-y-3 mb-8" stagger={0.08}>
              {['Premium-Marken & Eigenfertigung', 'Eintragung & TÜV-Abnahme inklusive', 'Saisonale Einlagerung möglich'].map((t) => (
                <StaggerItem key={t} distance={12}>
                  <li className="flex items-start gap-3 text-sm list-none">
                    <Sparkles className="h-4 w-4 text-[hsl(var(--brand-gold))] shrink-0 mt-0.5" />
                    {t}
                  </li>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal direction="up" delay={0.3}>
              <Link
                to="/raeder-konfigurator"
                className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1 hover:text-[hsl(var(--brand-gold))] transition-colors"
              >
                Räder konfigurieren
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>
          <Reveal direction="left" duration={0.9}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="aspect-[4/3] overflow-hidden border border-border"
            >
              <ParallaxImage
                src={wheelsImg}
                alt="Premium Felgen"
                offset={18}
                width={1280}
                height={896}
                className="w-full h-full"
              />
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-dark text-white py-20 md:py-24 border-t border-[hsl(var(--brand-gold))]/20 relative overflow-hidden">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 0.08, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[hsl(var(--brand-gold))] blur-3xl"
        />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <Reveal direction="scale">
            <Car className="h-10 w-10 text-[hsl(var(--brand-gold))] mx-auto mb-6" />
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl mb-5 leading-tight">
              Bereit für <span className="italic text-brand-gold">mehr Power?</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="text-white/75 text-lg max-w-2xl mx-auto mb-10">
              Konfiguriere dein Tuning in unter 60 Sekunden und sieh sofort, was in deinem Fahrzeug steckt.
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <Link
              to="/konfigurator"
              className="group inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-8 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 transition-all hover:shadow-2xl hover:shadow-[hsl(var(--brand-gold))]/40 hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Konfigurator starten
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
