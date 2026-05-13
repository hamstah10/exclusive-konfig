import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, Gauge, Wrench, Car, Activity, ShieldCheck, Sparkles,
  Cpu, LineChart as LineChartIcon, Award, Phone, ChevronDown,
  Banknote, Calculator, CheckCircle2, Mic,
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

function HeroSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const stats = [
    { value: '15+', label: t('stats.years') },
    { value: '2.500+', label: t('stats.cars') },
    { value: '4WD', label: t('stats.awd') },
    { value: '1.200', label: t('stats.powerLimit') },
  ];

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

      {/* Animated SVG waves over the sea area in the hero image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[38%] h-[18%] overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 70%, transparent 100%)',
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Wave is 2880 wide (2x viewBox) so translateX -1440 loops seamlessly */}
            <path
              id="heroWave"
              d="M0,160 C180,120 360,200 540,160 C720,120 900,200 1080,160 C1260,120 1440,200 1440,160 C1620,120 1800,200 1980,160 C2160,120 2340,200 2520,160 C2700,120 2880,200 2880,160 L2880,320 L0,320 Z"
            />
          </defs>

          <g className="hero-wave hero-wave--a">
            <use href="#heroWave" y="20" fill="rgba(255,255,255,0.06)" />
          </g>
          <g className="hero-wave hero-wave--b">
            <use href="#heroWave" y="60" fill="rgba(212,175,90,0.12)" />
          </g>
          <g className="hero-wave hero-wave--c">
            <use href="#heroWave" y="110" fill="rgba(255,255,255,0.10)" />
          </g>
          <g className="hero-wave hero-wave--d">
            <use href="#heroWave" y="170" fill="rgba(255,255,255,0.16)" />
          </g>
        </svg>
        <style>{`
          @keyframes heroWaveLeft {
            from { transform: translateX(0); }
            to   { transform: translateX(-1440px); }
          }
          @keyframes heroWaveRight {
            from { transform: translateX(-1440px); }
            to   { transform: translateX(0); }
          }
          .hero-wave { will-change: transform; }
          .hero-wave--a { animation: heroWaveLeft  22s linear infinite; }
          .hero-wave--b { animation: heroWaveRight 28s linear infinite; }
          .hero-wave--c { animation: heroWaveLeft  16s linear infinite; }
          .hero-wave--d { animation: heroWaveRight 12s linear infinite; }
        `}</style>
      </div>

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
            {t('hero.eyebrow')}
          </motion.span>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6 overflow-hidden">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {t('hero.title1')}
            </motion.span>
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-brand-gold"
            >
              {t('hero.title2')}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed mb-10"
          >
            {t('hero.intro')}
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
              {t('hero.ctaConfigure')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#fahrzeuge"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-7 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-white/10 hover:border-brand-gold transition-all"
            >
              {t('nav.marketplace')}
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
        aria-label={t('hero.scrollAria') as string}
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
  const { t } = useTranslation();

  const features = [
    { icon: <Award className="h-6 w-6" />, title: t('features.certifiedTitle'), text: t('features.certifiedText') },
    { icon: <ShieldCheck className="h-6 w-6" />, title: t('features.tuvTitle'), text: t('features.tuvText') },
    { icon: <Cpu className="h-6 w-6" />, title: t('features.ecuTitle'), text: t('features.ecuText') },
    { icon: <Phone className="h-6 w-6" />, title: t('features.consultingTitle'), text: t('features.consultingText') },
  ];

  const tuningPoints = t('chiptuning.points', { returnObjects: true }) as string[];

  const stagePackages = (['stage1', 'stage2', 'eco', 'options'] as const).map((k) => ({
    stage: t(`chiptuning.packages.${k}.name`),
    delta: t(`chiptuning.packages.${k}.delta`),
    desc: t(`chiptuning.packages.${k}.desc`),
    from: t(`chiptuning.packages.${k}.from`),
  }));

  const dynoIcons = [
    <Activity className="h-5 w-5" />,
    <LineChartIcon className="h-5 w-5" />,
    <Gauge className="h-5 w-5" />,
    <Wrench className="h-5 w-5" />,
  ];
  const dynoFeatures = (t('dyno.features', { returnObjects: true }) as string[]).map((label, i) => ({
    icon: dynoIcons[i],
    label,
  }));

  const wheelPoints = t('wheels.points', { returnObjects: true }) as string[];

  return (
    <div id="top" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <SiteHeader variant="overlay" />

      <HeroSection />

      {/* INTRO */}
      <section id="willkommen" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionEyebrow>{t('intro.eyebrow')}</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                {t('intro.titleA')}{' '}
                <span className="italic text-[hsl(var(--brand-gold))]">{t('intro.titleB')}</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                {t('intro.text1')}
              </p>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                {t('intro.text2')}
              </p>
            </Reveal>
            <Reveal direction="up" delay={0.3}>
              <a
                href="#chiptuning"
                className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1 hover:text-[hsl(var(--brand-gold))] transition-colors"
              >
                {t('intro.cta')} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
            <SectionEyebrow dark>{t('chiptuning.eyebrow')}</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                {t('chiptuning.titleA')}<br />
                <span className="italic text-brand-gold">{t('chiptuning.titleB')}</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-white/75 text-base leading-relaxed mb-8 max-w-lg">
                {t('chiptuning.intro')}
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
                {t('chiptuning.cta')}
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
              <SectionEyebrow>{t('marketplace.eyebrow')}</SectionEyebrow>
              <Reveal direction="up" delay={0.1}>
                <h2 className="font-display text-4xl md:text-5xl leading-tight">
                  {t('marketplace.title1')} <span className="italic text-[hsl(var(--brand-gold))]">{t('marketplace.title2')}</span>
                </h2>
              </Reveal>
            </div>
            <Reveal direction="right" delay={0.2}>
              <Link
                to="/fahrzeuge"
                className="group text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1 inline-flex items-center gap-2"
              >
                {t('marketplace.cta')}
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
                      <span>{t('marketplace.regYear')} {car.year}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                      <span>{car.hp} {t('marketplace.hp')}</span>
                    </div>
                    <div className="flex items-end justify-between pt-4 border-t border-border">
                      <span className="font-display text-2xl text-[hsl(var(--brand-gold))]">{car.priceLabel}</span>
                      <span className="text-xs uppercase tracking-[0.15em] font-semibold inline-flex items-center gap-1 group-hover:text-[hsl(var(--brand-gold))] transition-colors">
                        {t('marketplace.details')}
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
            <SectionEyebrow>{t('dyno.eyebrow')}</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                {t('dyno.titleA')}<br />
                <span className="italic text-[hsl(var(--brand-gold))]">{t('dyno.titleB')}</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                {t('dyno.intro')}
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
                {t('dyno.cta')}
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
            <SectionEyebrow>{t('wheels.eyebrow')}</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                {t('wheels.titleA')} <span className="italic text-[hsl(var(--brand-gold))]">{t('wheels.titleB')}</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                {t('wheels.intro')}
              </p>
            </Reveal>

            <StaggerGroup className="space-y-3 mb-8" stagger={0.08}>
              {wheelPoints.map((point) => (
                <StaggerItem key={point} distance={12}>
                  <li className="flex items-start gap-3 text-sm list-none">
                    <Sparkles className="h-4 w-4 text-[hsl(var(--brand-gold))] shrink-0 mt-0.5" />
                    {point}
                  </li>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal direction="up" delay={0.3}>
              <Link
                to="/raeder-konfigurator"
                className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-dark))] border-b-2 border-[hsl(var(--brand-gold))] pb-1 hover:text-[hsl(var(--brand-gold))] transition-colors"
              >
                {t('wheels.cta')}
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

      {/* ANKAUF */}
      <section id="ankauf" className="py-24 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionEyebrow>Fahrzeug-Ankauf</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                Verkaufen Sie Ihr Fahrzeug — <span className="italic text-[hsl(var(--brand-gold))]">fair & in Minuten</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Sprechen Sie einfach mit unserer KI-Assistentin oder füllen Sie den Funnel selbst aus.
                Sie erhalten eine sofortige, marktgerechte Bewertung und ein verbindliches Angebot
                innerhalb von 24 Stunden.
              </p>
            </Reveal>

            <StaggerGroup className="space-y-3 mb-8" stagger={0.08}>
              {[
                'Sofortbewertung in unter 5 Minuten',
                'Sprach-Assistent füllt den Funnel für Sie aus',
                'Faire Preise dank KI-gestützter Marktanalyse',
                'Persönliche Übergabe vor Ort auf Rügen',
              ].map((point) => (
                <StaggerItem key={point} distance={12}>
                  <li className="flex items-start gap-3 text-sm list-none">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--brand-gold))] shrink-0 mt-0.5" />
                    {point}
                  </li>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal direction="up" delay={0.3}>
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  to="/ankauf"
                  className="group inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-6 py-3 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 transition-all hover:-translate-y-0.5"
                >
                  Jetzt bewerten lassen
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <Mic className="h-4 w-4 text-[hsl(var(--brand-gold))]" />
                  oder per Sprach-Assistent
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal direction="right" duration={0.9}>
            <div className="relative">
              <div className="absolute -inset-4 bg-[hsl(var(--brand-gold))]/10 blur-2xl rounded-full" aria-hidden />
              <div className="relative grid grid-cols-2 gap-4">
                {[
                  { kpi: '5 Min', label: 'Bewertung' },
                  { kpi: '24 h', label: 'Angebot' },
                  { kpi: 'KI', label: 'Marktdaten' },
                  { kpi: '0 €', label: 'Kosten für Sie' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-background border border-border p-6 hover:border-[hsl(var(--brand-gold))]/40 transition-colors"
                  >
                    <div className="font-display text-3xl text-[hsl(var(--brand-gold))] mb-1">
                      {item.kpi}
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINANZIERUNG */}
      <section id="finanzierung" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <SectionEyebrow>Finanzierung</SectionEyebrow>
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                Drei Wege zu Ihrem <span className="italic text-[hsl(var(--brand-gold))]">Traumwagen</span>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="text-muted-foreground text-base leading-relaxed">
                Berechnen Sie Ihre Wunschrate online — Leasing, klassische Ratenfinanzierung oder
                3-Wege-Finanzierung mit Schlussrate. Wir vermitteln über unsere Bankpartner zu
                attraktiven Konditionen.
              </p>
            </Reveal>
          </div>

          <StaggerGroup className="grid md:grid-cols-3 gap-6 mb-12" stagger={0.1}>
            {[
              {
                icon: Car,
                title: 'Leasing',
                text: 'Niedrige Rate, planbare Kosten. Privat oder gewerblich mit voller MwSt.-Abzugsfähigkeit.',
                rate: 'ab 299 €/Monat',
              },
              {
                icon: Banknote,
                title: 'Basis-Finanzierung',
                text: 'Klassische Ratenfinanzierung. Nach der letzten Rate gehört das Fahrzeug Ihnen.',
                rate: 'ab 0,99 % eff. p.a.',
              },
              {
                icon: Calculator,
                title: 'Ziel-Finanzierung',
                text: 'Niedrige Monatsrate dank Schlussrate. Behalten, tauschen oder zurückgeben.',
                rate: '3 Wege am Laufzeitende',
              },
            ].map((card) => (
              <StaggerItem key={card.title}>
                <div className="group h-full bg-background border border-border p-8 hover:border-[hsl(var(--brand-gold))]/50 hover:-translate-y-1 transition-all">
                  <div className="h-12 w-12 rounded-md bg-[hsl(var(--brand-gold))]/10 flex items-center justify-center mb-5">
                    <card.icon className="h-6 w-6 text-[hsl(var(--brand-gold))]" />
                  </div>
                  <h3 className="font-display text-2xl mb-2">{card.title}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--brand-gold))] mb-4">
                    {card.rate}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal direction="up" delay={0.3}>
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/finanzierung"
                className="group inline-flex items-center gap-2 bg-[hsl(var(--brand-dark))] text-white px-8 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))]/90 transition-all hover:-translate-y-0.5"
              >
                <Calculator className="h-4 w-4" />
                Rate berechnen
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Unverbindlich · in unter 60 Sekunden
              </span>
            </div>
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
              {t('ctaBanner.titleA')} <span className="italic text-brand-gold">{t('ctaBanner.titleB')}</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="text-white/75 text-lg max-w-2xl mx-auto mb-10">
              {t('ctaBanner.text')}
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <Link
              to="/konfigurator"
              className="group inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-8 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 transition-all hover:shadow-2xl hover:shadow-[hsl(var(--brand-gold))]/40 hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              {t('ctaBanner.cta')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
