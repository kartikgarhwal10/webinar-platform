import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing! Local fallback mode is active.");
}

/**
 * Public client for querying public tables (webinars, speakers, testimonials, agenda, etc.)
 * This client is safe for use on both server and client side.
 */
export const supabase = createSupabaseClient(
  supabaseUrl || "https://dummy-supabase-url.supabase.co",
  supabaseAnonKey || "dummy-anon-key"
);

/**
 * Admin client with privileged permissions for writing registrations, avoiding RLS block
 * WARNING: This client uses the service role key and MUST NOT be exposed to the client side.
 */
export function getAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("getAdminClient must only be executed in a server environment!");
  }
  
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is not defined!");
  }
  
  return createSupabaseClient(
    supabaseUrl || "https://dummy-supabase-url.supabase.co",
    supabaseServiceKey
  );
}
