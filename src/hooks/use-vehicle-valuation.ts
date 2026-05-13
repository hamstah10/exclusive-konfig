import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ValuationResult } from "@/components/ankauf/ValuationPreview";
import type { ValuationData } from "@/lib/valuation-schema";

interface UseVehicleValuation {
  loading: boolean;
  error: string | null;
  result: ValuationResult | null;
  fetchValuation: (data: ValuationData) => Promise<void>;
  reset: () => void;
}

export const useVehicleValuation = (): UseVehicleValuation => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValuationResult | null>(null);

  const fetchValuation = useCallback(async (data: ValuationData) => {
    if (
      !data.brand || !data.model || !data.year || data.mileage === undefined ||
      !data.fuel || !data.gearbox || !data.condition || !data.hasTuev || !data.accidentFree
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data: response, error: invokeError } = await supabase.functions.invoke<
        ValuationResult | { error: string }
      >("valuate-vehicle", {
        body: {
          brand: data.brand,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          fuel: data.fuel,
          gearbox: data.gearbox,
          condition: data.condition,
          has_tuev: data.hasTuev,
          accident_free: data.accidentFree,
          customer_notes: data.notes ?? null,
        },
      });
      if (invokeError) throw new Error(invokeError.message);
      if (response && "error" in response) throw new Error(response.error);
      if (!response || !("typical_eur" in response)) {
        throw new Error("Unerwartete Antwort vom Bewertungsdienst.");
      }
      setResult(response);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Bewertung konnte nicht geladen werden.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return { loading, error, result, fetchValuation, reset };
};
