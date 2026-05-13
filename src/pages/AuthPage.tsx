import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useAuth } from '@/hooks/useAuth';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal } from '@/components/Reveal';

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Bitte vollständigen Namen angeben').max(120),
  email: z.string().trim().email('Ungültige E-Mail-Adresse').max(255),
  password: z.string().min(8, 'Mindestens 8 Zeichen').max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email('Ungültige E-Mail-Adresse').max(255),
  password: z.string().min(1, 'Passwort erforderlich').max(72),
});

export default function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);

  const redirect = params.get('redirect') ?? '/portal';

  useEffect(() => {
    if (!authLoading && user) navigate(redirect, { replace: true });
  }, [user, authLoading, navigate, redirect]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const parsed = signupSchema.safeParse({
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          password: formData.get('password'),
        });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal`,
            data: { full_name: parsed.data.fullName },
          },
        });
        if (error) {
          toast.error(error.message.includes('already registered')
            ? 'Diese E-Mail ist bereits registriert.'
            : error.message);
          return;
        }
        toast.success('Konto erstellt! Bitte E-Mail bestätigen.');
      } else {
        const parsed = loginSchema.safeParse({
          email: formData.get('email'),
          password: formData.get('password'),
        });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) {
          toast.error(error.message.includes('Invalid login credentials')
            ? 'E-Mail oder Passwort falsch.'
            : error.message);
          return;
        }
        toast.success('Willkommen zurück!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: `${window.location.origin}${redirect}`,
    });
    if (result.error) {
      toast.error('Google-Anmeldung fehlgeschlagen.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader variant="solid" />
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-md">
          <Reveal direction="up">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] mb-4">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Kundenportal
            </span>
            <h1 className="font-display text-4xl mb-3 leading-tight">
              {mode === 'login' ? (
                <>Willkommen <span className="italic text-[hsl(var(--brand-gold))]">zurück.</span></>
              ) : (
                <>Konto <span className="italic text-[hsl(var(--brand-gold))]">erstellen.</span></>
              )}
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              {mode === 'login'
                ? 'Melde dich an, um den Status deiner Anfragen einzusehen.'
                : 'Erstelle ein Konto, um deine Angebotsanfragen zu verwalten.'}
            </p>
          </Reveal>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 border border-border bg-card px-4 py-3 text-sm font-medium hover:border-[hsl(var(--brand-gold))] hover:bg-secondary transition-colors mb-4 disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.97 6.97 0 0 1 5.47 12c0-.73.13-1.44.37-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.16-3.16C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Mit Google fortfahren
          </button>

          <div className="flex items-center gap-3 my-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            oder
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  maxLength={120}
                  className="mt-1 w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-gold))]"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">E-Mail</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={255}
                autoComplete="email"
                className="mt-1 w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-gold))]"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Passwort</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={mode === 'signup' ? 8 : 1}
                maxLength={72}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="mt-1 w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-gold))]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[hsl(var(--brand-dark))] text-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))]/90 transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            {mode === 'login' ? 'Noch kein Konto?' : 'Bereits registriert?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-semibold text-[hsl(var(--brand-dark))] hover:text-[hsl(var(--brand-gold))] underline-offset-4 hover:underline"
            >
              {mode === 'login' ? 'Konto erstellen' : 'Anmelden'}
            </button>
          </p>

          <p className="text-xs text-muted-foreground text-center mt-8">
            <Link to="/" className="hover:text-[hsl(var(--brand-gold))]">Zurück zur Startseite</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}