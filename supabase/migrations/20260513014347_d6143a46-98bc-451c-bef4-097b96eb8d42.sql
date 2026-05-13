
-- ENUM types
CREATE TYPE public.valuation_lead_status AS ENUM ('neu', 'qualifiziert', 'kontaktiert', 'termin', 'gekauft', 'abgesagt');
CREATE TYPE public.valuation_fuel AS ENUM ('benzin','diesel','hybrid','elektro','lpg','cng');
CREATE TYPE public.valuation_gearbox AS ENUM ('manuell','automatik');
CREATE TYPE public.valuation_condition AS ENUM ('sehr_gut','gut','gebraucht','maengel','defekt');
CREATE TYPE public.valuation_tuev AS ENUM ('ja','nein','abgelaufen');
CREATE TYPE public.valuation_yesno AS ENUM ('ja','nein');
CREATE TYPE public.valuation_time AS ENUM ('vormittag','nachmittag','abend','egal');
CREATE TYPE public.valuation_channel AS ENUM ('telefon','email','whatsapp');

-- Leads
CREATE TABLE public.valuation_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  fuel public.valuation_fuel NOT NULL,
  gearbox public.valuation_gearbox NOT NULL,
  condition public.valuation_condition NOT NULL,
  has_tuev public.valuation_tuev NOT NULL,
  accident_free public.valuation_yesno NOT NULL,
  customer_notes TEXT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time public.valuation_time NOT NULL,
  contact_channel public.valuation_channel NOT NULL,
  estimated_value_min INTEGER NULL,
  estimated_value_typical INTEGER NULL,
  estimated_value_max INTEGER NULL,
  estimated_value_rationale TEXT NULL,
  photo_urls TEXT[] NOT NULL DEFAULT '{}',
  status public.valuation_lead_status NOT NULL DEFAULT 'neu',
  lead_score INTEGER NULL,
  admin_note TEXT NULL,
  purchased_at TIMESTAMPTZ NULL,
  purchase_price NUMERIC(10,2) NULL,
  sold_at TIMESTAMPTZ NULL,
  sale_price NUMERIC(10,2) NULL,
  expenses_eur NUMERIC(10,2) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_valuation_leads_status ON public.valuation_leads(status);
CREATE INDEX idx_valuation_leads_created ON public.valuation_leads(created_at DESC);

ALTER TABLE public.valuation_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit valuation lead"
  ON public.valuation_leads FOR INSERT TO anon, authenticated
  WITH CHECK (((auth.uid() IS NULL) AND (user_id IS NULL)) OR ((auth.uid() IS NOT NULL) AND (user_id = auth.uid())));

CREATE POLICY "Users can view own valuation leads"
  ON public.valuation_leads FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all valuation leads"
  ON public.valuation_leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update valuation leads"
  ON public.valuation_leads FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER valuation_leads_touch BEFORE UPDATE ON public.valuation_leads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Market data
CREATE TABLE public.valuation_market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.valuation_leads(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  median_price INTEGER NULL,
  min_price INTEGER NULL,
  max_price INTEGER NULL,
  sample_count INTEGER NULL,
  recommended_price INTEGER NULL,
  raw JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.valuation_market_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read market data" ON public.valuation_market_data FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins write market data" ON public.valuation_market_data FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));

-- Photo analysis
CREATE TABLE public.valuation_photo_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.valuation_leads(id) ON DELETE CASCADE,
  analysis JSONB NOT NULL,
  revaluation JSONB NULL,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.valuation_photo_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read photo analysis" ON public.valuation_photo_analysis FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins write photo analysis" ON public.valuation_photo_analysis FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));

-- Lead timeline events
CREATE TABLE public.valuation_lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.valuation_leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NULL,
  created_by UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_valuation_lead_events_lead ON public.valuation_lead_events(lead_id, created_at DESC);
ALTER TABLE public.valuation_lead_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read lead events" ON public.valuation_lead_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins insert lead events" ON public.valuation_lead_events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Anyone can insert system events" ON public.valuation_lead_events FOR INSERT TO anon, authenticated WITH CHECK (created_by IS NULL);

-- Funnel analytics events
CREATE TABLE public.valuation_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'valuation_funnel',
  session_id TEXT NULL,
  funnel_step INTEGER NULL,
  step_label TEXT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_valuation_analytics_created ON public.valuation_analytics_events(created_at DESC);
CREATE INDEX idx_valuation_analytics_session ON public.valuation_analytics_events(session_id);
ALTER TABLE public.valuation_analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert analytics" ON public.valuation_analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read analytics" ON public.valuation_analytics_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));

-- Purchase contracts
CREATE TABLE public.valuation_purchase_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.valuation_leads(id) ON DELETE CASCADE,
  contract_data JSONB NOT NULL,
  pdf_url TEXT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  generated_by UUID NULL
);
ALTER TABLE public.valuation_purchase_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read contracts" ON public.valuation_purchase_contracts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins write contracts" ON public.valuation_purchase_contracts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));

-- Follow-up jobs
CREATE TABLE public.valuation_follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.valuation_leads(id) ON DELETE CASCADE,
  due_at TIMESTAMPTZ NOT NULL,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_valuation_follow_ups_due ON public.valuation_follow_ups(due_at) WHERE status = 'pending';
ALTER TABLE public.valuation_follow_ups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read follow ups" ON public.valuation_follow_ups FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins write follow ups" ON public.valuation_follow_ups FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('valuation-photos', 'valuation-photos', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read valuation photos"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'valuation-photos');

CREATE POLICY "Anyone can upload valuation photos"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'valuation-photos');

CREATE POLICY "Admins delete valuation photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'valuation-photos' AND public.has_role(auth.uid(), 'admin'::app_role));
