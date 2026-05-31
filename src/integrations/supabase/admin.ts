import "server-only";

/**
 * Service-role client — only needed for admin operations that bypass RLS.
 * For public/read-only data, use `@/integrations/supabase/server` instead.
 */
export { supabaseServer as supabaseAdmin } from "./server";
