import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function SiteHeader({ variant = 'overlay' }: { variant?: 'overlay' | 'solid' }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { t, i18n } = useTranslation();

  const navItems = [
    { label: t('nav.start'), to: '/#top' },
    { label: t('nav.marketplace'), to: '/#fahrzeuge' },
    { label: t('nav.chiptuning'), to: '/#chiptuning' },
    { label: t('nav.dyno'), to: '/#pruefstand' },
    { label: t('nav.wheels'), to: '/#raeder' },
    { label: t('nav.contact'), to: '/#kontakt' },
  ];

  const otherLng = i18n.language?.startsWith('en') ? 'de' : 'en';
  const switchLang = () => i18n.changeLanguage(otherLng);

  const base =
    variant === 'overlay'
      ? 'absolute top-0 inset-x-0 z-30 bg-gradient-to-b from-[hsl(var(--brand-dark))]/95 to-[hsl(var(--brand-dark))]/70 text-[hsl(var(--brand-dark-foreground))]'
      : 'sticky top-0 z-30 bg-brand-dark border-b border-[hsl(var(--brand-gold))]/20';

  return (
    <header className={base}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2 leading-none">
          <span className="font-display italic text-brand-gold text-xl">exclusiv</span>
          <span className="font-display tracking-wider text-white text-lg uppercase">Automobile</span>
          <span className="font-display italic text-brand-gold text-base">Rügen</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.to}
              href={isHome ? item.to.replace('/', '') : item.to}
              className="text-xs uppercase tracking-[0.2em] text-white/80 hover:text-brand-gold transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={switchLang}
            aria-label={t('lang.switchLabel') as string}
            className="text-xs uppercase tracking-[0.2em] text-white/80 hover:text-brand-gold transition-colors inline-flex items-center gap-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            {otherLng.toUpperCase()}
          </button>
          <Link
            to="/konfigurator"
            className="text-xs uppercase tracking-[0.2em] px-4 py-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] hover:bg-[hsl(var(--brand-gold))]/90 transition-colors font-semibold"
          >
            {t('nav.configurator')}
          </Link>
        </nav>

        <button
          type="button"
          aria-label={t('nav.menu') as string}
          onClick={() => setOpen((p) => !p)}
          className="lg:hidden text-white p-1"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-brand-dark border-t border-[hsl(var(--brand-gold))]/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.to}
                href={isHome ? item.to.replace('/', '') : item.to}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-white/80 hover:text-brand-gold py-1"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => { switchLang(); setOpen(false); }}
              className="text-sm uppercase tracking-[0.2em] text-white/80 hover:text-brand-gold py-1 text-left inline-flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {otherLng.toUpperCase()}
            </button>
            <Link
              to="/konfigurator"
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.2em] px-4 py-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] font-semibold text-center mt-2"
            >
              {t('nav.configurator')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
