import { Lock, ShieldCheck, Clock, type LucideIcon } from "lucide-react";

const items: { icon: LucideIcon; label: string }[] = [
  { icon: Lock, label: "SSL-verschlüsselt" },
  { icon: ShieldCheck, label: "DSGVO-konform" },
  { icon: Clock, label: "Antwort in 24 h" },
];

export const FunnelTrustRow = () => (
  <div className="mt-6 grid grid-cols-3 gap-3 text-center">
    {items.map(({ icon: Icon, label }) => (
      <div
        key={label}
        className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Icon className="h-4 w-4 text-accent" />
        <span className="font-medium">{label}</span>
      </div>
    ))}
  </div>
);