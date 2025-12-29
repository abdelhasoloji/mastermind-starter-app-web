export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  n8nBaseUrl: import.meta.env.VITE_N8N_BASE_URL as string,
};

for (const [k, v] of Object.entries(env)) {
  if (!v) throw new Error(`Missing env: ${k}`);
}
