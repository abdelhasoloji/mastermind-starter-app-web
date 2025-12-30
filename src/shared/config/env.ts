const FALLBACK = {
  supabaseUrl: "https://supabase.dev.juriscope.trustena.lu",
  supabaseAnonKey: "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH",
  n8nBaseUrl: "https://n8n.dev.juriscope.trustena.lu",
  apiBaseUrl: "https://api.dev.juriscope.trustena.lu",
};

export const env = {
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL as string) || FALLBACK.supabaseUrl,
  supabaseAnonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || FALLBACK.supabaseAnonKey,
  n8nBaseUrl: (import.meta.env.VITE_N8N_BASE_URL as string) || FALLBACK.n8nBaseUrl,
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) || FALLBACK.apiBaseUrl,
};

for (const [k, v] of Object.entries(env)) {
  if (!v) throw new Error(`Missing env: ${k}`);
}

