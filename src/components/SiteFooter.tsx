import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SiteLogo } from '@/components/SiteLogo';

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer id="kontakt" className="bg-brand-dark text-[hsl(var(--brand-dark-foreground))] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <SiteLogo variant="stamp" size={120} className="mb-5" />
          <p className="text-sm text-white/70 leading-relaxed">
            {t('footer.tagline')}
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-4">{t('footer.contactHeading')}</h4>
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
          <h4 className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-4">{t('footer.hoursHeading')}</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-gold shrink-0" />
              <span>{t('footer.weekdays')}</span>
            </li>
            <li className="pl-6">{t('footer.saturday')}</li>
            <li className="pl-6">{t('footer.sunday')}</li>
            <li className="pl-6 text-white/60 text-xs mt-2">{t('footer.appointment')}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-4">{t('footer.servicesHeading')}</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="#fahrzeuge" className="hover:text-brand-gold transition-colors">{t('footer.services.marketplace')}</a></li>
            <li><Link to="/konfigurator" className="hover:text-brand-gold transition-colors">{t('footer.services.configurator')}</Link></li>
            <li><a href="#pruefstand" className="hover:text-brand-gold transition-colors">{t('footer.services.dyno')}</a></li>
            <li><a href="#raeder" className="hover:text-brand-gold transition-colors">{t('footer.services.wheels')}</a></li>
            <li><a href="#finanzierung" className="hover:text-brand-gold transition-colors">{t('footer.services.financing')}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} exclusiv Automobile Rügen. {t('footer.rights')}</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-brand-gold transition-colors">{t('footer.legal.imprint')}</a>
            <a href="#" className="hover:text-brand-gold transition-colors">{t('footer.legal.privacy')}</a>
            <a href="#" className="hover:text-brand-gold transition-colors">{t('footer.legal.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
