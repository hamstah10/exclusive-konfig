-- Storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-attachments', 'lead-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Attachment table
CREATE TABLE public.lead_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id uuid,
  file_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX lead_attachments_lead_id_idx ON public.lead_attachments(lead_id);

ALTER TABLE public.lead_attachments ENABLE ROW LEVEL SECURITY;

-- Anyone can attach files to a lead they just created (matches lead RLS rules)
CREATE POLICY "Anyone can insert attachments"
ON public.lead_attachments FOR INSERT
TO anon, authenticated
WITH CHECK (
  ((auth.uid() IS NULL) AND (user_id IS NULL))
  OR ((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))
);

CREATE POLICY "Users can view own attachments"
ON public.lead_attachments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Anyone can upload lead attachments"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'lead-attachments'
  AND (
    ((storage.foldername(name))[1] = 'anonymous' AND auth.uid() IS NULL)
    OR ((storage.foldername(name))[1] = auth.uid()::text)
  )
);

CREATE POLICY "Users can read own lead attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lead-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);