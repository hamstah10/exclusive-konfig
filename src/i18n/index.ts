import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  de: {
    translation: {
      nav: {
        start: 'Start',
        marketplace: 'Fahrzeugbörse',
        chiptuning: 'Chiptuning',
        dyno: 'Prüfstand',
        wheels: 'Räder & Reifen',
        contact: 'Kontakt',
        configurator: 'Konfigurator',
        menu: 'Menü',
      },
      hero: {
        eyebrow: 'Insel Rügen · seit 2009',
        title1: 'Mehr Freude',
        title2: 'am Fahren.',
        intro:
          'Exklusive Fahrzeuge, ehrliches Chiptuning und ein eigener Allrad-Leistungsprüfstand – alles unter einem Dach, direkt an der Ostsee.',
        ctaConfigure: 'Tuning konfigurieren',
        ctaMarketplace: 'Fahrzeugbörse',
        scrollAria: 'Nach unten scrollen',
      },
      stats: {
        years: 'Jahre Erfahrung',
        cars: 'Optimierte Fahrzeuge',
        awd: 'Allrad-Prüfstand',
        powerLimit: 'PS Prüfleistung',
      },
      intro: {
        eyebrow: 'Willkommen',
        titleA: 'Vorstellungen werden',
        titleB: 'zur Realität.',
        text1:
          'Ob exklusive Fahrzeuge, mehr Power für deinen Alltagswagen oder die professionelle Vermessung auf unserem 4WD-Leistungsprüfstand – bei exclusiv Automobile Rügen bekommst du alles aus einer Hand.',
        text2:
          'Wir arbeiten ehrlich, transparent und mit Leidenschaft. Jede Optimierung ist individuell auf dein Fahrzeug abgestimmt – nicht von der Stange.',
        cta: 'Mehr erfahren',
      },
      features: {
        certifiedTitle: 'Zertifizierte Optimierung',
        certifiedText: 'Eintragungsfähige Lösungen',
        tuvTitle: 'TÜV-konform',
        tuvText: 'Sicherheit hat Priorität',
        ecuTitle: 'Original-ECU',
        ecuText: 'Reversibel & sauber',
        consultingTitle: 'Persönliche Beratung',
        consultingText: 'Termin nach Vereinbarung',
      },
      chiptuning: {
        eyebrow: 'Chiptuning',
        titleA: 'Mehr Power.',
        titleB: 'Weniger Verbrauch.',
        intro:
          'Optimierung sämtlicher Fahrzeugmodelle bei OptimaTuning Germany auf der Insel Rügen. Wähle dein Fahrzeug, deine Stage und sieh sofort eine fahrzeugspezifische Leistungsprognose – inklusive Dyno-Kurve und transparenter Preise.',
        cta: 'Jetzt konfigurieren',
        points: [
          'Stage 1, Stage 2 & Eco-Stage für Diesel',
          'Live-Leistungsprognose & Vergleichsmodus',
          'Tuning-Optionen wie DTC, Pops & Bangs, V/Max-Off',
          'Termin direkt vereinbaren – Optimierung in 1 Tag',
        ],
        packages: {
          stage1: { name: 'Stage 1', delta: '+25 % PS', desc: 'Software-Optimierung', from: 'ab 599 €' },
          stage2: { name: 'Stage 2', delta: '+40 % PS', desc: 'Hardware + Software', from: 'ab 1.499 €' },
          eco: { name: 'Eco', delta: '−15 % Verbrauch', desc: 'Spritspar-Tuning Diesel', from: 'ab 449 €' },
          options: { name: 'Optionen', delta: 'DTC · Pops & Bangs', desc: 'Individuelle Features', from: 'ab 99 €' },
        },
      },
      marketplace: {
        eyebrow: 'Fahrzeugbörse',
        title1: 'Aktuelle',
        title2: 'Highlights',
        cta: 'Alle Fahrzeuge ansehen',
        details: 'Details',
        regYear: 'EZ',
        hp: 'PS',
      },
      dyno: {
        eyebrow: 'Leistungsprüfstand',
        titleA: '4WD-Allrad-Dyno.',
        titleB: 'Daten lügen nicht.',
        intro:
          'Auf unserem hochpräzisen Leistungsprüfstand vermessen wir Front-, Heck- und Allradfahrzeuge bis 1.200 PS. Du bekommst ein offizielles Diagramm mit PS-, Drehmoment- und Lambda-Verlauf – perfekt vor und nach jeder Optimierung.',
        cta: 'Termin buchen',
        features: ['Lambda-Messung', 'PS & Nm Diagramm', 'Bis 1.200 PS', 'Vor- & Nachher-Vergleich'],
      },
      wheels: {
        eyebrow: 'Räder & Reifen',
        titleA: 'Der perfekte',
        titleB: 'Auftritt.',
        intro:
          'Vom OEM-Plus-Rad bis zur Schmiedefelge – wir liefern, montieren und tragen ein. Reifenwechsel, Auswuchten und Einlagerung gehören selbstverständlich dazu.',
        cta: 'Räder konfigurieren',
        points: [
          'Premium-Marken & Eigenfertigung',
          'Eintragung & TÜV-Abnahme inklusive',
          'Saisonale Einlagerung möglich',
        ],
      },
      ctaBanner: {
        titleA: 'Bereit für',
        titleB: 'mehr Power?',
        text: 'Konfiguriere dein Tuning in unter 60 Sekunden und sieh sofort, was in deinem Fahrzeug steckt.',
        cta: 'Konfigurator starten',
      },
      footer: {
        tagline:
          'Mehr Freude am Fahren. Verkauf, Vermittlung und Leistungsoptimierung auf der Insel Rügen.',
        contactHeading: 'Kontakt',
        hoursHeading: 'Öffnungszeiten',
        weekdays: 'Mo – Fr: 09:00 – 18:00',
        saturday: 'Sa: 10:00 – 14:00',
        sunday: 'So & Feiertage: geschlossen',
        appointment: 'Termine nach Vereinbarung',
        servicesHeading: 'Leistungen',
        services: {
          marketplace: 'Fahrzeugbörse',
          configurator: 'Chiptuning Konfigurator',
          dyno: 'Leistungsprüfstand',
          wheels: 'Räder & Reifen',
          financing: 'Finanzierung',
        },
        rights: 'Alle Rechte vorbehalten.',
        legal: { imprint: 'Impressum', privacy: 'Datenschutz', terms: 'AGB' },
      },
      lang: { switchLabel: 'Sprache', de: 'Deutsch', en: 'Englisch' },
    },
  },
  en: {
    translation: {
      nav: {
        start: 'Home',
        marketplace: 'Vehicles',
        chiptuning: 'Chip tuning',
        dyno: 'Dyno',
        wheels: 'Wheels & tyres',
        contact: 'Contact',
        configurator: 'Configurator',
        menu: 'Menu',
      },
      hero: {
        eyebrow: 'Rügen Island · since 2009',
        title1: 'More joy',
        title2: 'of driving.',
        intro:
          'Exclusive cars, honest chip tuning and our own all-wheel dynamometer – all under one roof, right by the Baltic Sea.',
        ctaConfigure: 'Configure tuning',
        ctaMarketplace: 'Browse cars',
        scrollAria: 'Scroll down',
      },
      stats: {
        years: 'Years of experience',
        cars: 'Cars optimised',
        awd: 'All-wheel dyno',
        powerLimit: 'HP test capacity',
      },
      intro: {
        eyebrow: 'Welcome',
        titleA: 'Where vision becomes',
        titleB: 'reality.',
        text1:
          'Whether exclusive cars, more power for your daily driver or professional measurement on our 4WD dyno – at exclusiv Automobile Rügen you get everything from a single source.',
        text2:
          'We work honestly, transparently and with passion. Every optimisation is tailored individually to your car – never off the shelf.',
        cta: 'Learn more',
      },
      features: {
        certifiedTitle: 'Certified tuning',
        certifiedText: 'Street-legal solutions',
        tuvTitle: 'TÜV compliant',
        tuvText: 'Safety comes first',
        ecuTitle: 'Original ECU',
        ecuText: 'Reversible & clean',
        consultingTitle: 'Personal consulting',
        consultingText: 'By appointment',
      },
      chiptuning: {
        eyebrow: 'Chip tuning',
        titleA: 'More power.',
        titleB: 'Less consumption.',
        intro:
          'Optimisation for all car models by OptimaTuning Germany on Rügen Island. Pick your car and stage and see an instant vehicle-specific power forecast – including dyno curve and transparent pricing.',
        cta: 'Configure now',
        points: [
          'Stage 1, Stage 2 & Eco stage for diesel',
          'Live power forecast & comparison mode',
          'Tuning options like DTC, pops & bangs, V/Max-Off',
          'Book directly – tuning done in one day',
        ],
        packages: {
          stage1: { name: 'Stage 1', delta: '+25 % HP', desc: 'Software optimisation', from: 'from €599' },
          stage2: { name: 'Stage 2', delta: '+40 % HP', desc: 'Hardware + software', from: 'from €1,499' },
          eco: { name: 'Eco', delta: '−15 % consumption', desc: 'Diesel economy tuning', from: 'from €449' },
          options: { name: 'Options', delta: 'DTC · Pops & bangs', desc: 'Individual features', from: 'from €99' },
        },
      },
      marketplace: {
        eyebrow: 'Vehicles',
        title1: 'Current',
        title2: 'highlights',
        cta: 'View all cars',
        details: 'Details',
        regYear: 'Reg.',
        hp: 'HP',
      },
      dyno: {
        eyebrow: 'Dynamometer',
        titleA: '4WD all-wheel dyno.',
        titleB: 'Numbers don’t lie.',
        intro:
          'On our high-precision dyno we measure front-, rear- and all-wheel-drive cars up to 1,200 HP. You receive an official chart with HP, torque and lambda curves – perfect before and after any optimisation.',
        cta: 'Book appointment',
        features: ['Lambda measurement', 'HP & Nm chart', 'Up to 1,200 HP', 'Before & after comparison'],
      },
      wheels: {
        eyebrow: 'Wheels & tyres',
        titleA: 'The perfect',
        titleB: 'stance.',
        intro:
          'From OEM-plus to forged wheels – we supply, mount and register them. Tyre changes, balancing and seasonal storage are all part of the deal.',
        cta: 'Configure wheels',
        points: [
          'Premium brands & in-house manufacturing',
          'Registration & TÜV approval included',
          'Seasonal storage available',
        ],
      },
      ctaBanner: {
        titleA: 'Ready for',
        titleB: 'more power?',
        text: 'Configure your tuning in under 60 seconds and instantly see what your car is capable of.',
        cta: 'Launch configurator',
      },
      footer: {
        tagline:
          'More joy of driving. Sales, brokerage and performance tuning on Rügen Island.',
        contactHeading: 'Contact',
        hoursHeading: 'Opening hours',
        weekdays: 'Mon – Fri: 09:00 – 18:00',
        saturday: 'Sat: 10:00 – 14:00',
        sunday: 'Sun & holidays: closed',
        appointment: 'Other times by appointment',
        servicesHeading: 'Services',
        services: {
          marketplace: 'Vehicles',
          configurator: 'Chip tuning configurator',
          dyno: 'Dynamometer',
          wheels: 'Wheels & tyres',
          financing: 'Financing',
        },
        rights: 'All rights reserved.',
        legal: { imprint: 'Imprint', privacy: 'Privacy', terms: 'Terms' },
      },
      lang: { switchLabel: 'Language', de: 'German', en: 'English' },
    },
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de',
    supportedLngs: ['de', 'en'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lng',
    },
  });

export default i18n;