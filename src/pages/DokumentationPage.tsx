import { Link } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import {
  Car, Settings2, Gauge, CircleDot, Wallet, ShoppingCart,
  UserCircle, ShieldCheck, Globe, Sparkles,
} from 'lucide-react';

interface Section {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  icon: React.ComponentType<{ className?: string }>;
  screenshot: string;
  route?: string;
  features: string[];
}

const sections: Section[] = [
  {
    id: 'landing',
    eyebrow: 'Startseite',
    title: 'Landing Page',
    intro:
      'Die zentrale Einstiegsseite bündelt alle Geschäftsbereiche – Verkauf, Chiptuning, Prüfstand, Räder & Reifen sowie Finanzierung – in einem cinematischen Brand-Auftritt.',
    icon: Sparkles,
    screenshot: '/docs/landing.png',
    route: '/',
    features: [
      'Hero mit Vollbild-Video und Headline „More joy of driving“',
      'Kennzahlen-Leiste (Erfahrung, optimierte Fahrzeuge, 4WD-Prüfstand, HP-Kapazität)',
      'Sektion-Anker für Fahrzeuge, Chiptuning, Prüfstand, Räder, Finanzierung, Kontakt',
      'Sticky-Header mit Scroll-Verhalten und Sprachumschaltung DE/EN',
    ],
  },
  {
    id: 'fahrzeuge',
    eyebrow: 'Marktplatz',
    title: 'Fahrzeugbörse',
    intro:
      'Handverlesener Bestand mit Filtern nach Marke, Karosserie und Preis. Jedes Fahrzeug wird vor Übergabe auf dem 4WD-Prüfstand vermessen.',
    icon: Car,
    screenshot: '/docs/fahrzeuge.png',
    route: '/fahrzeuge',
    features: [
      'Kategorien-Filter (Sportwagen, Coupé, Limousine, SUV, Cabrio)',
      'Live-Suche nach Marke, Modell, Farbe',
      'Sortierung nach Datum, Preis und Leistung',
      'Detailansicht mit Galerie, technischen Daten und Anfrage-CTA',
    ],
  },
  {
    id: 'konfigurator',
    eyebrow: 'Chiptuning',
    title: 'Tuning-Konfigurator',
    intro:
      'Schritt-für-Schritt-Konfigurator von Fahrzeug bis Stage. Mit Schnellsuche aus der internen Fahrzeug-Datenbank werden ECU, Motorcode und Serienleistung automatisch gesetzt.',
    icon: Settings2,
    screenshot: '/docs/konfigurator.png',
    route: '/konfigurator',
    features: [
      'Schnellsuche mit Auto-Vervollständigung (z. B. „Golf GTI“, „M340i“)',
      'Manuelle Eingabe als Fallback inklusive Marken-/Modell-Vorschlägen',
      'Stage-Auswahl mit ECO-, Stage 1- und Stage 2-Konfigurationen',
      'Ergebnis-Seite mit ECU-Badge, PS-/Nm-Steigerung und Anfrage-Button',
    ],
  },
  {
    id: 'pruefstand',
    eyebrow: 'Prüfstand',
    title: 'Prüfstand-Buchung',
    intro:
      '4WD-Allrad-Rollenprüfstand bis 1.500 PS. Kunden buchen Service, Termin und Fahrzeug in vier klar geführten Schritten.',
    icon: Gauge,
    screenshot: '/docs/pruefstand.png',
    route: '/pruefstand-buchung',
    features: [
      'Service-Auswahl: Leistungsmessung, Tuning-Session, Vorher/Nachher, Datenlogging',
      'Termin-Picker mit verfügbaren Slots',
      'Fahrzeug- und Kontaktdaten in zwei separaten Schritten',
      'Bestätigung innerhalb von 24 Stunden',
    ],
  },
  {
    id: 'raeder',
    eyebrow: 'Räder & Reifen',
    title: 'Räder-Konfigurator',
    intro:
      'Komplettrad-Konfigurator über sechs Schritte – von Fahrzeugklasse bis Übersicht – mit Live-Vorschau und Preiskalkulation.',
    icon: CircleDot,
    screenshot: '/docs/raeder.png',
    route: '/raeder-konfigurator',
    features: [
      'Fahrzeugklasse (Kompakt, Limousine, SUV, Sportwagen)',
      'Design-, Größen- und Finish-Auswahl mit Live-Vorschau',
      'Reifen-Marke und -Profil',
      'Übersicht mit Komplettpreis inkl. Eintragung, Montage, Auswuchten',
    ],
  },
  {
    id: 'finanzierung',
    eyebrow: 'Finanzierung',
    title: 'Finanzierungsrechner',
    intro:
      'Drei Finanzierungswege – Leasing, Basis- und Ziel-Finanzierung – mit Echtzeit-Ratenberechnung und unverbindlichem Angebot.',
    icon: Wallet,
    screenshot: '/docs/finanzierung.png',
    route: '/finanzierung',
    features: [
      'Privat- und Gewerbeleasing mit Restwert- und Laufzeit-Slider',
      'Basis-Finanzierung mit Anzahlung und Schlussrate',
      'Ziel-Finanzierung mit definiertem Wunsch-Endbetrag',
      'Live-Übersicht: monatliche Rate, Anzahlung, Gesamtaufwand',
    ],
  },
  {
    id: 'ankauf',
    eyebrow: 'Ankauf',
    title: 'Ankauf-Funnel',
    intro:
      '5-Schritt-Funnel zur Fahrzeugbewertung in unter 2 Minuten. Optionaler Voice-Agent unterstützt bei der Eingabe.',
    icon: ShoppingCart,
    screenshot: '/docs/ankauf.png',
    route: '/ankauf',
    features: [
      'Marke & Modell mit Logo-Auswahl der gängigsten Hersteller',
      'Antrieb, Zustand und Foto-Upload',
      'Kontakt- und Termin-Erfassung',
      'Verbindliches Angebot innerhalb von 24 Stunden',
    ],
  },
  {
    id: 'portal',
    eyebrow: 'Kundenportal',
    title: 'Mein Portal',
    intro:
      'Persönlicher Bereich für angemeldete Kunden: Status aller Anfragen, Fahrzeuge und Buchungen auf einen Blick.',
    icon: UserCircle,
    screenshot: '/docs/portal.png',
    route: '/portal',
    features: [
      'Übersicht aller offenen und abgeschlossenen Anfragen',
      'Status-Badges (offen, in Bearbeitung, abgeschlossen)',
      'Direkter Sprung zum angefragten Fahrzeug',
      'Sicheres Login per E-Mail',
    ],
  },
  {
    id: 'admin',
    eyebrow: 'Admin',
    title: 'Verwaltungs-Backend',
    intro:
      'Internes Dashboard für Anfragen, Prüfstand-Buchungen und Ankauf-Leads. Nur für berechtigte Mitarbeiter zugänglich.',
    icon: ShieldCheck,
    screenshot: '/docs/admin.png',
    route: '/admin',
    features: [
      'Dashboard mit Live-Kennzahlen',
      'Anfragen-Verwaltung mit Status-Workflow',
      'Prüfstand-Buchungen mit Termin-Übersicht',
      'Ankauf-Leads mit Filter und Status-Update',
    ],
  },
];

const platformFeatures = [
  { icon: Globe, label: 'Mehrsprachig (DE/EN)', text: 'Vollständige Übersetzung über react-i18next.' },
  { icon: Sparkles, label: 'Brand-Konsistenz', text: 'Goldene Akzente, Playfair-Display Headlines, Light-Theme.' },
  { icon: ShieldCheck, label: 'Sicheres Backend', text: 'Authentifizierung, Rollen und RLS auf Datenebene.' },
  { icon: Gauge, label: 'Performance', text: 'Vite-Build, Lazy Loading, optimierte Assets.' },
];

export default function DokumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="solid" />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-20 border-b border-[hsl(var(--brand-gold))]/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))]">
              Dokumentation
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-tight">
            Alle Funktionen von <em className="text-[hsl(var(--brand-gold))] not-italic font-display italic">exclusive Automobile Rügen</em>
          </h1>
          <p className="mt-6 text-white/70 max-w-2xl text-lg leading-relaxed">
            Diese Übersicht erklärt jeden Bereich der Website mit Screenshots und Funktionsliste – als
            Referenz für Team, Partner und Onboarding.
          </p>
        </div>
      </section>

      {/* TOC */}
      <section className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-muted-foreground hover:text-[hsl(var(--brand-gold))] transition-colors uppercase tracking-[0.15em] text-xs"
            >
              {s.title}
            </a>
          ))}
        </div>
      </section>

      {/* Plattform Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl md:text-3xl mb-8">
          Plattform-<em className="text-[hsl(var(--brand-gold))] font-display italic">Grundlagen</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformFeatures.map((f) => (
            <div key={f.label} className="border border-border rounded-md p-5 bg-card">
              <f.icon className="h-5 w-5 text-[hsl(var(--brand-gold))] mb-3" />
              <p className="text-sm font-semibold text-foreground mb-1">{f.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-20">
        {sections.map((s, idx) => (
          <article key={s.id} id={s.id} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-[hsl(var(--brand-gold))]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))]">
                {String(idx + 1).padStart(2, '0')} · {s.eyebrow}
              </span>
            </div>
            <div className="flex items-start gap-4 mb-4">
              <s.icon className="h-7 w-7 text-[hsl(var(--brand-dark))] mt-1 shrink-0" />
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground">{s.title}</h2>
                {s.route && (
                  <Link
                    to={s.route}
                    className="inline-block mt-2 text-xs uppercase tracking-[0.2em] text-[hsl(var(--brand-gold))] hover:underline"
                  >
                    {s.route} →
                  </Link>
                )}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">{s.intro}</p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3 rounded-md border border-border overflow-hidden bg-card shadow-sm">
                <img
                  src={s.screenshot}
                  alt={`Screenshot ${s.title}`}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
                  Funktionen
                </h3>
                <ul className="space-y-3">
                  {s.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand-gold))] shrink-0" />
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
