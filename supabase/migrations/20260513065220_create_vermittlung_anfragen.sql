CREATE TABLE public.vermittlung_anfragen (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Wunschfahrzeug
  brand       TEXT,
  model       TEXT,
  year_from   INT,
  year_to     INT,
  budget_max  INT,
  fuel        TEXT,

  -- Details
  body_types  TEXT[],
  km_max      INT,
  gearbox     TEXT,
  color       TEXT,
  notes       TEXT,

  -- Kontakt
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,

  -- Workflow
  status      TEXT NOT NULL DEFAULT 'offen'
);

ALTER TABLE public.vermittlung_anfragen ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public contact form)
CREATE POLICY "Public can insert vermittlung_anfragen"
ON public.vermittlung_anfragen FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read vermittlung_anfragen"
ON public.vermittlung_anfragen FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update vermittlung_anfragen"
ON public.vermittlung_anfragen FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
