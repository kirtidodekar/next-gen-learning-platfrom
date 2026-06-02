-- Disable email confirmation requirement so users can sign in immediately after signup
-- This updates the Supabase auth configuration
-- Note: This must be run in the Supabase SQL editor or via Supabase CLI

-- For Supabase projects, you can also disable this in the Dashboard:
-- Authentication > Settings > Email Auth > Disable "Confirm email"

-- If using Supabase self-hosted, this would be:
-- UPDATE auth.instances SET enable_confirmations = false;

-- For managed Supabase, create a helper function that can be called
-- to check auth settings (informational only)
CREATE OR REPLACE FUNCTION public.check_auth_settings()
RETURNS TABLE (setting text, value text) AS $$
BEGIN
  -- This is informational - the actual email confirmation setting
  -- must be changed in the Supabase Dashboard:
  -- Go to Authentication > Providers > Email > Enable Email > Confirm email
  RETURN QUERY
  SELECT 'info'::text, 'Disable email confirmation in Supabase Dashboard: Authentication > Providers > Email'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
