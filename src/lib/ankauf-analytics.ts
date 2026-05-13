import { supabase } from "@/integrations/supabase/client";

export type AnalyticsSource = "hero_quick_start" | "valuation_funnel";

interface TrackEventInput {
  eventName: string;
  source: AnalyticsSource;
  funnelStep?: number;
  stepLabel?: string;
  metadata?: Record<string, unknown>;
}

const sessionKey = "autofux:analytics-session:v1";

const getSessionId = () => {
  if (typeof window === "undefined") return crypto.randomUUID();

  const stored = window.localStorage.getItem(sessionKey);
  if (stored) return stored;

  const next = crypto.randomUUID();
  window.localStorage.setItem(sessionKey, next);
  return next;
};

export const trackEvent = ({
  eventName,
  source,
  funnelStep,
  stepLabel,
  metadata = {},
}: TrackEventInput) => {
  const pagePath = typeof window === "undefined" ? null : window.location.pathname;

  // Route through an Edge Function with a neutral name to bypass ad-blockers
  // that filter requests with "analytics" in the URL or table name.
  void supabase.functions
    .invoke("track", {
      body: {
        eventName,
        sessionId: getSessionId(),
        source,
        funnelStep: funnelStep ?? null,
        stepLabel: stepLabel ?? null,
        pagePath,
        metadata,
      },
    })
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.warn("[analytics] track failed", error.message, { eventName, source });
      }
    });
};

// ---------------------------------------------------------------------------
// First-interaction tracker: ensures we fire `funnel_step_first_interaction`
// only once per (session, step). Uses sessionStorage so it survives reloads
// within the same browser session but resets in new tabs.
// ---------------------------------------------------------------------------
const firstInteractionKey = "autofux:funnel:first-interaction:v1";

const getFiredSet = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(firstInteractionKey);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
};

const persistFiredSet = (set: Set<string>) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(firstInteractionKey, JSON.stringify([...set]));
  } catch {
    // ignore quota errors
  }
};

export const trackFirstInteraction = ({
  funnelStep,
  stepLabel,
  field,
}: {
  funnelStep: number;
  stepLabel: string;
  field: string;
}) => {
  const key = `${funnelStep}:${stepLabel}`;
  const fired = getFiredSet();
  if (fired.has(key)) return;
  fired.add(key);
  persistFiredSet(fired);
  trackEvent({
    eventName: "funnel_step_first_interaction",
    source: "valuation_funnel",
    funnelStep,
    stepLabel,
    metadata: { field },
  });
};

export const resetFirstInteractionTracker = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(firstInteractionKey);
};

export const trackValidationErrors = ({
  funnelStep,
  stepLabel,
  errors,
}: {
  funnelStep: number;
  stepLabel: string;
  errors: Record<string, { message?: string } | undefined>;
}) => {
  const fields = Object.keys(errors).filter((k) => errors[k]);
  if (fields.length === 0) return;
  trackEvent({
    eventName: "funnel_step_validation_failed",
    source: "valuation_funnel",
    funnelStep,
    stepLabel,
    metadata: {
      errorCount: fields.length,
      fields,
      messages: fields.reduce<Record<string, string>>((acc, f) => {
        const msg = errors[f]?.message;
        if (msg) acc[f] = msg;
        return acc;
      }, {}),
    },
  });
};