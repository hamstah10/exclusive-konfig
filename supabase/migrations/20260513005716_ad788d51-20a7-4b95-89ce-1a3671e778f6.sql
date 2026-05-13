ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS vehicle_id text;
UPDATE public.leads SET vehicle_id = vehicle_slug WHERE vehicle_id IS NULL;
ALTER TABLE public.leads ALTER COLUMN vehicle_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS leads_vehicle_id_idx ON public.leads(vehicle_id);