import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ValuationData } from "@/lib/valuation-schema";

const STORAGE_KEY = "autofux:draft:v1";
const TTL_MS = 60 * 60 * 1000; // 1 hour
const HIGHLIGHT_DURATION_MS = 4000;

export type ValuationField = keyof ValuationData;

interface StoredDraft {
  data: ValuationData;
  savedAt: number;
}

interface ValuationDraftContextValue {
  draft: ValuationData;
  applyDraft: (patch: Partial<ValuationData>, options?: { source?: "voice" | "user" }) => void;
  clearDraft: () => void;
  highlightedFields: ReadonlySet<ValuationField>;
}

const ValuationDraftContext = createContext<ValuationDraftContextValue | undefined>(undefined);

const readFromStorage = (): ValuationData => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredDraft;
    if (!parsed || typeof parsed !== "object") return {};
    if (typeof parsed.savedAt !== "number" || Date.now() - parsed.savedAt > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    return parsed.data ?? {};
  } catch {
    return {};
  }
};

const writeToStorage = (data: ValuationData) => {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredDraft = { data, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
};

export const ValuationDraftProvider = ({ children }: { children: ReactNode }) => {
  const [draft, setDraft] = useState<ValuationData>(() => readFromStorage());
  const initialised = useRef(false);
  const [highlightedFields, setHighlightedFields] = useState<ReadonlySet<ValuationField>>(
    () => new Set(),
  );
  const timersRef = useRef<Map<ValuationField, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      return;
    }
    if (Object.keys(draft).length === 0) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      return;
    }
    writeToStorage(draft);
  }, [draft]);

  const applyDraft = useCallback(
    (patch: Partial<ValuationData>, options?: { source?: "voice" | "user" }) => {
      setDraft((prev) => ({ ...prev, ...patch }));
      if (options?.source !== "voice") return;
      const fields = Object.keys(patch) as ValuationField[];
      if (fields.length === 0) return;
      setHighlightedFields((prev) => {
        const next = new Set(prev);
        fields.forEach((f) => next.add(f));
        return next;
      });
      fields.forEach((field) => {
        const existing = timersRef.current.get(field);
        if (existing) clearTimeout(existing);
        const timer = setTimeout(() => {
          setHighlightedFields((prev) => {
            if (!prev.has(field)) return prev;
            const next = new Set(prev);
            next.delete(field);
            return next;
          });
          timersRef.current.delete(field);
        }, HIGHLIGHT_DURATION_MS);
        timersRef.current.set(field, timer);
      });
    },
    [],
  );

  const clearDraft = useCallback(() => {
    setDraft({});
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
    setHighlightedFields(new Set());
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ draft, applyDraft, clearDraft, highlightedFields }),
    [draft, applyDraft, clearDraft, highlightedFields],
  );

  return (
    <ValuationDraftContext.Provider value={value}>{children}</ValuationDraftContext.Provider>
  );
};

export const useValuationDraft = (): ValuationDraftContextValue => {
  const ctx = useContext(ValuationDraftContext);
  if (!ctx) {
    throw new Error("useValuationDraft must be used within a ValuationDraftProvider");
  }
  return ctx;
};