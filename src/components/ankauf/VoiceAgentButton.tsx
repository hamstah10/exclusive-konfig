import { useCallback, useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { useNavigate } from "react-router-dom";
import { Mic, PhoneOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useValuationDraft } from "@/contexts/ValuationDraftContext";
import type { ValuationData } from "@/lib/valuation-schema";
import {
  mapAppointmentPatch, mapConditionPatch, mapContactPatch, mapVehiclePatch,
} from "@/lib/valuation-draft-mapper";

const TYPEWRITER_FIELDS = ["firstName", "lastName", "email", "model"] as const;
type TypewriterField = (typeof TYPEWRITER_FIELDS)[number];
const TYPEWRITER_DELAY_MS = 45;

export const VoiceAgentButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  const { applyDraft } = useValuationDraft();
  const typewriterTimers = useRef<Map<TypewriterField, ReturnType<typeof setTimeout>>>(new Map());

  const cancelTypewriter = useCallback((field: TypewriterField) => {
    const t = typewriterTimers.current.get(field);
    if (t) { clearTimeout(t); typewriterTimers.current.delete(field); }
  }, []);

  const animateTypewriter = useCallback((field: TypewriterField, fullValue: string) => {
    cancelTypewriter(field);
    let i = 1;
    const tick = () => {
      const slice = fullValue.slice(0, i);
      applyDraft({ [field]: slice } as Partial<ValuationData>, { source: "voice" });
      if (i >= fullValue.length) { typewriterTimers.current.delete(field); return; }
      i += 1;
      typewriterTimers.current.set(field, setTimeout(tick, TYPEWRITER_DELAY_MS));
    };
    tick();
  }, [applyDraft, cancelTypewriter]);

  const applyPatchWithTypewriter = useCallback((patch: Partial<ValuationData>) => {
    const instant: Partial<ValuationData> = {};
    const animated: Array<[TypewriterField, string]> = [];
    (Object.entries(patch) as [keyof ValuationData, unknown][]).forEach(([key, value]) => {
      if ((TYPEWRITER_FIELDS as readonly string[]).includes(key) && typeof value === "string" && value.length > 1) {
        animated.push([key as TypewriterField, value]);
      } else {
        (instant as Record<string, unknown>)[key] = value;
      }
    });
    if (Object.keys(instant).length > 0) applyDraft(instant, { source: "voice" });
    animated.forEach(([f, v]) => animateTypewriter(f, v));
  }, [applyDraft, animateTypewriter]);

  useEffect(() => {
    const timers = typewriterTimers.current;
    return () => { timers.forEach((t) => clearTimeout(t)); timers.clear(); };
  }, []);

  const conversation = useConversation({
    clientTools: {
      setVehicleData: (params: Record<string, unknown>) => {
        const patch = mapVehiclePatch(params ?? {});
        if (Object.keys(patch).length === 0) return "Keine gültigen Fahrzeugdaten erhalten";
        applyPatchWithTypewriter(patch);
        toast({ title: "Fahrzeugdaten übernommen" });
        return "Fahrzeugdaten gespeichert";
      },
      setConditionData: (params: Record<string, unknown>) => {
        const patch = mapConditionPatch(params ?? {});
        if (Object.keys(patch).length === 0) return "Keine gültigen Zustandsdaten erhalten";
        applyPatchWithTypewriter(patch);
        toast({ title: "Zustand übernommen" });
        return "Zustandsdaten gespeichert";
      },
      setContactData: (params: Record<string, unknown>) => {
        const patch = mapContactPatch(params ?? {});
        if (Object.keys(patch).length === 0) return "Keine gültigen Kontaktdaten erhalten";
        applyPatchWithTypewriter(patch);
        toast({ title: "Kontaktdaten übernommen" });
        return "Kontaktdaten gespeichert";
      },
      setAppointmentData: (params: Record<string, unknown>) => {
        const patch = mapAppointmentPatch(params ?? {});
        if (Object.keys(patch).length === 0) return "Keine gültigen Termindaten erhalten";
        applyPatchWithTypewriter(patch);
        toast({ title: "Wunschtermin übernommen" });
        return "Termindaten gespeichert";
      },
      openValuationFunnel: () => { navigate("/ankauf"); return "Bewertungs-Formular geöffnet"; },
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast({
        title: "Verbindung fehlgeschlagen",
        description: "Der Sprach-Berater ist gerade nicht erreichbar.",
        variant: "destructive",
      });
    },
  });

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const { data, error } = await supabase.functions.invoke<{ token?: string; error?: string }>(
        "elevenlabs-conversation-token",
      );
      if (error || !data?.token) throw new Error(data?.error || error?.message || "Kein Token erhalten");
      await conversation.startSession({ conversationToken: data.token, connectionType: "webrtc" });
    } catch (error) {
      console.error("Voice-Agent start failed:", error);
      toast({
        title: "Mikrofon oder Verbindung",
        description: "Bitte Mikro-Zugriff erlauben und erneut versuchen.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  useEffect(() => {
    return () => { if (conversation.status === "connected") void conversation.endSession(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => { if (isConnected) void stopConversation(); else void startConversation(); };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 md:bottom-6 md:right-6">
      {isConnected && (
        <div className="rounded-full bg-card/95 backdrop-blur shadow-card border border-border px-4 py-2 text-xs font-medium animate-fade-in">
          {isSpeaking ? "KI-Berater spricht …" : "Ich höre zu …"}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={isConnecting}
        aria-label={isConnected ? "Gespräch beenden" : "Mit KI-Berater sprechen"}
        className={cn(
          "group relative grid place-items-center rounded-full shadow-elegant transition-all duration-300 h-14 w-14 md:h-16 md:w-16 focus:outline-none focus-visible:ring-4",
          isConnected
            ? "bg-destructive text-destructive-foreground hover:scale-105 focus-visible:ring-destructive/40"
            : "bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] hover:scale-110 hover:shadow-glow focus-visible:ring-[hsl(var(--brand-gold))]/40",
        )}
      >
        {isConnected && <span className="absolute inset-0 rounded-full bg-[hsl(var(--brand-gold))]/30 animate-ping" />}
        <span className="relative">
          {isConnecting ? <Loader2 className="h-6 w-6 animate-spin" />
            : isConnected ? <PhoneOff className="h-6 w-6" />
            : <Mic className="h-6 w-6" />}
        </span>
      </button>
    </div>
  );
};