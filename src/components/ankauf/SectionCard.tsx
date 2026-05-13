import type { ReactNode } from "react";

interface SectionCardProps {
  step: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const SectionCard = ({ step, title, subtitle, children }: SectionCardProps) => (
  <section className="space-y-5">
    <header className="flex items-start gap-3 border-b border-border/60 pb-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-accent text-xs font-bold text-accent-foreground shadow-soft">
        {step}
      </span>
      <div className="space-y-0.5 pt-0.5">
        <h3 className="text-base font-semibold leading-tight tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
    <div className="space-y-5 pl-0 sm:pl-11">{children}</div>
  </section>
);