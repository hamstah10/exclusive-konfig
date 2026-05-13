-- Status enum
CREATE TYPE public.dyno_booking_status AS ENUM (
  'angefragt',
  'bestaetigt',
  'durchgefuehrt',
  'storniert'
);

CREATE TYPE public.dyno_service AS ENUM (
  'leistungsmessung',
  'tuning_session',
  'vorher_nachher',
  'datenlogging'
);

-- Bookings table
CREATE TABLE public.dyno_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  service public.dyno_service NOT NULL,
  preferred_date date NOT NULL,
  time_slot text NOT NULL,
  vehicle_brand text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_hp integer,
  fuel text,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  status public.dyno_booking_status NOT NULL DEFAULT 'angefragt',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX dyno_bookings_user_id_idx ON public.dyno_bookings(user_id);
CREATE INDEX dyno_bookings_date_idx ON public.dyno_bookings(preferred_date);

ALTER TABLE public.dyno_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request a booking"
ON public.dyno_bookings FOR INSERT
TO anon, authenticated
WITH CHECK (
  ((auth.uid() IS NULL) AND (user_id IS NULL))
  OR ((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))
);

CREATE POLICY "Users can view own bookings"
ON public.dyno_bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- updated_at trigger (reuse existing function)
CREATE TRIGGER dyno_bookings_updated_at
BEFORE UPDATE ON public.dyno_bookings
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

-- realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.dyno_bookings;