import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://supabase.dev.juriscope.trustena.lu";
const SUPABASE_ANON_KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const N8N_BASE_URL = "https://n8n.dev.juriscope.trustena.lu";
