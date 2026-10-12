import { isDemo } from "./demo-mode";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = isDemo ? "https://demo.example.test" : import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = isDemo ? "demo-public-placeholder" : import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

// Auth only — no app data goes through this client (see brief §8).
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  isDemo
    ? {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        global: {
          fetch: async () => {
            throw new Error("Authentification indisponible en mode démo.");
          },
        },
      }
    : undefined,
);
