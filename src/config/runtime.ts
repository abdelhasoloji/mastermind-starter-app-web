declare global {
  interface Window {
    __ENV?: Record<string, string>;
  }
}

export const runtimeConfig = {
  apiBaseUrl: window.__ENV?.API_BASE_URL ?? "",
  supabaseUrl: window.__ENV?.SUPABASE_URL ?? "",
  supabaseAnonKey: window.__ENV?.SUPABASE_ANON_KEY ?? ""
};

if (!runtimeConfig.apiBaseUrl) {
  console.warn("API_BASE_URL is not defined in env.js");
}
