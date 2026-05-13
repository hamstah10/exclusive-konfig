-- Seed test accounts: confirm emails and assign roles
-- Run this once in the Supabase SQL editor or via migration.
--
-- test-user@exclusive-ruegen.de  (ID: 8d3732a0-b828-4777-8990-e8d14bb0ddfb)
-- test-admin@exclusive-ruegen.de (ID: e045793e-dd97-4947-a19b-029a649ebc8d)

UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmed_at       = COALESCE(confirmed_at, now())
WHERE email IN (
  'test-user@exclusive-ruegen.de',
  'test-admin@exclusive-ruegen.de'
);

INSERT INTO public.user_roles (user_id, role)
VALUES ('e045793e-dd97-4947-a19b-029a649ebc8d', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
