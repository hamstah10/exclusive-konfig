import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ImagePlus, Loader2, X, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MAX_PHOTOS, MAX_PHOTO_SIZE_BYTES } from "@/lib/valuation-schema";
import { cn } from "@/lib/utils";
import { trackEvent, trackFirstInteraction } from "@/lib/analytics";

interface Props {
  defaults?: { photoUrls?: string[] };
  onNext: (data: { photoUrls: string[] }) => void;
  onBack: () => void;
}

const ACCEPTED = "image/jpeg,image/png,image/webp,image/heic,image/heif";

export const PhotoStepForm = ({ defaults, onNext, onBack }: Props) => {
  const [urls, setUrls] = useState<string[]>(defaults?.photoUrls ?? []);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const remainingSlots = MAX_PHOTOS - urls.length;

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      const tooMany = list.length > remainingSlots;
      const accepted = list.slice(0, remainingSlots);

      if (tooMany) {
        toast({
          title: `Maximal ${MAX_PHOTOS} Fotos`,
          description: `Es werden nur die ersten ${remainingSlots} ausgewählten Bilder hochgeladen.`,
        });
      }

      trackEvent({
        eventName: "funnel_photo_upload_started",
        source: "valuation_funnel",
        funnelStep: 2,
        stepLabel: "Fotos",
        metadata: { fileCount: accepted.length, totalSelected: list.length, truncated: tooMany },
      });

      setUploading(true);
      const uploaded: string[] = [];
      let failedCount = 0;
      const failureReasons: string[] = [];
      for (const file of accepted) {
        if (!file.type.startsWith("image/")) {
          failedCount += 1;
          failureReasons.push("not_image");
          toast({
            title: "Datei übersprungen",
            description: `${file.name} ist kein Bild.`,
            variant: "destructive",
          });
          continue;
        }
        if (file.size > MAX_PHOTO_SIZE_BYTES) {
          failedCount += 1;
          failureReasons.push("too_large");
          toast({
            title: "Datei zu groß",
            description: `${file.name} überschreitet 10 MB.`,
            variant: "destructive",
          });
          continue;
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
        const path = `${crypto.randomUUID()}.${safeExt}`;
        const { error } = await supabase.storage
          .from("lead-photos")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });
        if (error) {
          failedCount += 1;
          failureReasons.push("upload_error");
          toast({
            title: "Upload fehlgeschlagen",
            description: `${file.name}: ${error.message}`,
            variant: "destructive",
          });
          continue;
        }
        const { data } = supabase.storage.from("lead-photos").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setUploading(false);
      if (uploaded.length > 0) {
        setUrls((prev) => [...prev, ...uploaded]);
      }
      trackEvent({
        eventName: "funnel_photo_upload_completed",
        source: "valuation_funnel",
        funnelStep: 2,
        stepLabel: "Fotos",
        metadata: {
          successCount: uploaded.length,
          failedCount,
          failureReasons,
          totalAfter: urls.length + uploaded.length,
        },
      });
    },
    [remainingSlots, urls.length],
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      void uploadFiles(e.target.files);
    }
    // Allow re-selecting the same file
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void uploadFiles(e.dataTransfer.files);
    }
  };

  const removePhoto = (url: string) => {
    setUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ photoUrls: urls });
  };

  const canAddMore = urls.length < MAX_PHOTOS;

  return (
    <form
      onSubmit={handleSubmit}
      onPointerDownCapture={(e) => {
        const t = e.target as HTMLElement;
        const field = t.getAttribute?.("aria-label") ?? t.tagName?.toLowerCase() ?? "unknown";
        trackFirstInteraction({ funnelStep: 2, stepLabel: "Fotos", field });
      }}
      className="space-y-5"
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (canAddMore) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={canAddMore ? handleDrop : undefined}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-6 md:p-8 text-center transition-base",
          dragActive ? "border-accent bg-accent/5" : "border-border bg-secondary/30",
          !canAddMore && "opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          onChange={handleSelect}
          className="hidden"
          disabled={!canAddMore || uploading}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent">
            <ImagePlus className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">Fotos vom Fahrzeug hinzufügen</p>
            <p className="text-sm text-muted-foreground mt-1">
              Außen, Innen, Armaturen, Schäden – je mehr, desto präziser unser Angebot.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={!canAddMore || uploading}
            >
              {uploading ? (
                <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Lädt …</>
              ) : (
                <><ImagePlus className="mr-1 h-4 w-4" /> Bilder auswählen</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById("photo-camera-input") as HTMLInputElement | null;
                el?.click();
              }}
              disabled={!canAddMore || uploading}
            >
              <Camera className="mr-1 h-4 w-4" /> Foto aufnehmen
            </Button>
            <input
              id="photo-camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleSelect}
              className="hidden"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {urls.length} / {MAX_PHOTOS} Fotos · max. 10 MB pro Bild
          </p>
        </div>
      </div>

      {urls.length > 0 && (
        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {urls.map((url, idx) => (
            <li
              key={url}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
            >
              <img
                src={url}
                alt={`Fahrzeugfoto ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute top-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-full bg-background/90 text-foreground border border-border opacity-0 group-hover:opacity-100 focus:opacity-100 transition-base hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                aria-label="Foto entfernen"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Zurück
        </Button>
        <div className="flex items-center gap-2">
          {urls.length === 0 && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Fotos sind optional
            </span>
          )}
          <Button type="submit" variant="cta" disabled={uploading}>
            {urls.length === 0 ? "Ohne Fotos weiter" : "Weiter"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};