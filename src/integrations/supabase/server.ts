import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function getSupabaseUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL
  );
}

function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  );
}

function createServerSupabaseClient() {
  const url = getSupabaseUrl();
  // Prefer service role when set; anon key is enough for public RLS reads (e.g. courses).
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? getSupabaseAnonKey();

  if (!url || !key) {
    const missing = [
      ...(!url ? ["SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL"] : []),
      ...(!key
        ? ["SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY"]
        : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(url, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _client: ReturnType<typeof createServerSupabaseClient> | undefined;

export const supabaseServer = new Proxy({} as ReturnType<typeof createServerSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_client) _client = createServerSupabaseClient();
    return Reflect.get(_client, prop, receiver);
  },
});
