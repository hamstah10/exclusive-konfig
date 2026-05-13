import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useValuationDraft, type ValuationField } from "@/contexts/ValuationDraftContext";

interface Props {
  fields: ValuationField | ValuationField[];
  children: React.ReactNode;
  className?: string;
  showBadge?: boolean;
}

export const AiFieldHighlight = ({ fields, children, className, showBadge = true }: Props) => {
  const { highlightedFields } = useValuationDraft();
  const list = Array.isArray(fields) ? fields : [fields];
  const active = list.some((f) => highlightedFields.has(f));

  return (
    <div className={cn("relative", active && "ai-field-highlight", className)}>
      {children}
      {active && showBadge && (
        <span
          className="pointer-events-none absolute -top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-0.5 shadow-soft animate-fade-in"
          aria-live="polite"
        >
          <Sparkles className="h-2.5 w-2.5" />
          KI
        </span>
      )}
    </div>
  );
};