import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Globe, Settings2, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SiteLogo } from '@/components/SiteLogo';

export function SiteHeader({ variant = 'overlay' }: { variant?: 'overlay' | 'solid' }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  type NavItem = {
    label: string;
    to: string;
    children?: { label: string; to: string }[];
  };

  const navItems: NavItem[] = [
    {
      label: t('nav.marketplace'),
      to: '/#fahrzeuge',
      children: [
        { label: 'Verkauf', to: '/#fahrzeuge' },
        { label: 'Ankauf', to: '/#ankauf' },
      ],
    },
    { label: t('nav.chiptuning'), to: '/#chiptuning' },
    { label: t('nav.dyno'), to: '/#pruefstand' },
    { label: t('nav.wheels'), to: '/#raeder' },
    { label: 'Finanzierung', to: '/#finanzierung' },
    { label: t('nav.contact'), to: '/#kontakt' },
  ];

  const otherLng = i18n.language?.startsWith('en') ? 'de' : 'en';
  const switchLang = () => i18n.changeLanguage(otherLng);

  const base =
    variant === 'overlay'
      ? scrolled
        ? 'fixed top-0 inset-x-0 z-40 bg-[hsl(var(--brand-dark))]/95 backdrop-blur-md border-b border-[hsl(var(--brand-gold))]/20 shadow-lg text-white animate-in slide-in-from-top duration-300'
        : 'absolute top-0 inset-x-0 z-30 bg-gradient-to-b from-[hsl(var(--brand-dark))]/95 to-[hsl(var(--brand-dark))]/70 text-[hsl(var(--brand-dark-foreground))]'
      : 'sticky top-0 z-30 bg-brand-dark border-b border-[hsl(var(--brand-gold))]/20';

  return (
    <header className={base}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SiteLogo size={scrolled ? 'sm' : 'md'} />

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <a
                  href={isHome ? item.to.replace('/', '') : item.to}
                  className="text-xs uppercase tracking-[0.2em] text-white/80 hover:text-brand-gold transition-colors inline-flex items-center gap-1"
                >
                  {item.label}
                  <ChevronDown className="h-3 w-3 opacity-70 group-hover:rotate-180 transition-transform" />
                </a>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="min-w-[180px] bg-brand-dark border border-[hsl(var(--brand-gold))]/20 shadow-2xl py-2">
                    {item.children.map((child) => (
                      <a
                        key={child.to}
                        href={isHome ? child.to.replace('/', '') : child.to}
                        className="block px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 hover:text-brand-gold hover:bg-white/5 transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.to}
                href={isHome ? item.to.replace('/', '') : item.to}
                className="text-xs uppercase tracking-[0.2em] text-white/80 hover:text-brand-gold transition-colors"
              >
                {item.label}
              </a>
            )
          )}
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
            aria-label={t('nav.configurator') as string}
            title={t('nav.configurator') as string}
            className="inline-flex items-center justify-center h-9 w-9 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] hover:bg-[hsl(var(--brand-gold))]/90 transition-colors"
          >
            <Settings2 className="h-4 w-4" />
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
              <div key={item.label}>
                <a
                  href={isHome ? item.to.replace('/', '') : item.to}
                  onClick={() => setOpen(false)}
                  className="block text-sm uppercase tracking-[0.2em] text-white/80 hover:text-brand-gold py-1"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <a
                        key={child.to}
                        href={isHome ? child.to.replace('/', '') : child.to}
                        onClick={() => setOpen(false)}
                        className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-brand-gold py-1"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
              className="inline-flex items-center justify-center gap-2 text-sm uppercase tracking-[0.2em] px-4 py-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] font-semibold text-center mt-2"
            >
              <Settings2 className="h-4 w-4" />
              {t('nav.configurator')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
