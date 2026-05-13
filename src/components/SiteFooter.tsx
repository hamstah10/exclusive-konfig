import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer id="kontakt" className="bg-brand-dark text-[hsl(var(--brand-dark-foreground))] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display italic text-brand-gold text-2xl">exclusiv</span>
            <span className="font-display tracking-wider text-white text-lg uppercase">Automobile</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Mehr Freude am Fahren. Verkauf, Vermittlung und Leistungsoptimierung auf der Insel Rügen.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-4">Kontakt</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              <span>Hafenstraße 12<br />18546 Sassnitz, Rügen</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-gold shrink-0" />
              <span>+49 38392 12 34 56</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-gold shrink-0" />
              <span>info@exclusiv-ruegen.de</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-4">Öffnungszeiten</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-gold shrink-0" />
              <span>Mo – Fr: 09:00 – 18:00</span>
            </li>
            <li className="pl-6">Sa: 10:00 – 14:00</li>
            <li className="pl-6">So &amp; Feiertage: geschlossen</li>
            <li className="pl-6 text-white/60 text-xs mt-2">Termine nach Vereinbarung</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-4">Leistungen</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="#fahrzeuge" className="hover:text-brand-gold transition-colors">Fahrzeugbörse</a></li>
            <li><Link to="/konfigurator" className="hover:text-brand-gold transition-colors">Chiptuning Konfigurator</Link></li>
            <li><a href="#pruefstand" className="hover:text-brand-gold transition-colors">Leistungsprüfstand</a></li>
            <li><a href="#raeder" className="hover:text-brand-gold transition-colors">Räder &amp; Reifen</a></li>
            <li><a href="#finanzierung" className="hover:text-brand-gold transition-colors">Finanzierung</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} exclusiv Automobile Rügen. Alle Rechte vorbehalten.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-brand-gold transition-colors">Impressum</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-brand-gold transition-colors">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
