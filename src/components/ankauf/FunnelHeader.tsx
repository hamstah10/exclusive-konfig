import { Sparkles, ShieldCheck, Clock } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  eyebrow?: string;
}

export const FunnelHeader = ({ title, subtitle, eyebrow = "Kostenlose Bewertung" }: Props) => (
  <div className="text-center mb-8">
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
      <Sparkles className="h-3.5 w-3.5" />
      {eyebrow}
    </span>
    <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
      <span className="bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent animate-gradient-text">
        {title}
      </span>
    </h1>
    <p className="mt-3 text-muted-foreground">{subtitle}</p>
    <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
        Unverbindlich & kostenlos
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-accent" />
        Antwort in 24 Stunden
      </span>
    </div>
  </div>
);