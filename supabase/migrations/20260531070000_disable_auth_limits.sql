-- Disable email confirmation requirement
ALTER TABLE auth.users DISABLE TRIGGER ALL;

-- Note: Rate limits must be configured via Supabase Dashboard
-- or Supabase CLI settings, not through SQL migrations.
-- 
-- To disable rate limits via CLI:
-- 1. Run: supabase start
-- 2. Edit: supabase/config.toml
-- 3. Add under [auth]:
--    [auth.rate_limit]
--    email_confirm = 999999
--    sms_send = 999999
--    token_refresh = 999999
-- 4. Run: supabase db push
