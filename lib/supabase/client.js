import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_SUPABSE_PROJECT_URL,
  process.env.NEXT_SUPABASE_ANON_KEY
);