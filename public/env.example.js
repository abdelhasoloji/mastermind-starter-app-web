/**
 * Copie en public/env.js (runtime) et adapte.
 * IMPORTANT: ce fichier est charge au runtime par le navigateur.
 * Aucun secret ici.
 */
window.__ENV = {
  ENV: "dev",
  API_BASE_URL: "https://api.dev.example.tld",
  SUPABASE_URL: "https://supabase.dev.example.tld",
  SUPABASE_ANON_KEY: "REPLACE_ME_ANON_KEY"
};
