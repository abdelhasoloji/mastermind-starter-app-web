import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Environment variables
const N8N_DEV_URL = Deno.env.get("N8N_DEV_URL") || "https://n8n.dev.juriscope.trustena.lu";
const N8N_DEV_SECRET = Deno.env.get("N8N_DEV_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

interface HealthResponse {
  env: string;
  status: "online" | "offline";
  httpCode: number | null;
  latencyMs: number;
  checkedAt: string;
  message?: string;
}

interface PingResponse {
  env: string;
  ok: boolean;
  httpCode: number | null;
  latencyMs: number;
  testedAt: string;
  message?: string;
}

async function verifyAuth(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    console.log("[n8n-admin] No authorization header");
    return false;
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.log("[n8n-admin] Auth error:", error?.message);
      return false;
    }

    console.log(`[n8n-admin] User authenticated: ${user.email}`);
    
    // TODO: Add admin role check here when user_roles table is set up
    // const { data: roles } = await supabase
    //   .from("user_roles")
    //   .select("role")
    //   .eq("user_id", user.id)
    //   .eq("role", "admin")
    //   .single();
    // return !!roles;
    
    return true;
  } catch (err) {
    console.error("[n8n-admin] Auth verification failed:", err);
    return false;
  }
}

async function handleHealthCheck(env: string): Promise<HealthResponse> {
  const baseUrl = env === "dev" ? N8N_DEV_URL : N8N_DEV_URL; // Extend for TEST/PROD
  const startTime = performance.now();
  const checkedAt = new Date().toISOString();

  console.log(`[n8n-admin] Health check for ${env}: ${baseUrl}/healthz`);

  try {
    const response = await fetch(`${baseUrl}/healthz`, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });

    const latencyMs = Math.round(performance.now() - startTime);
    console.log(`[n8n-admin] Health response: ${response.status} in ${latencyMs}ms`);

    if (response.ok) {
      return {
        env,
        status: "online",
        httpCode: response.status,
        latencyMs,
        checkedAt,
        message: "Service opérationnel",
      };
    }

    return {
      env,
      status: "offline",
      httpCode: response.status,
      latencyMs,
      checkedAt,
      message: `Service indisponible (HTTP ${response.status})`,
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startTime);
    const message = error instanceof Error && error.name === "TimeoutError"
      ? "Timeout - Service indisponible"
      : "Erreur réseau - Service injoignable";

    console.error(`[n8n-admin] Health check failed:`, error);

    return {
      env,
      status: "offline",
      httpCode: null,
      latencyMs,
      checkedAt,
      message,
    };
  }
}

async function handlePingTest(env: string, body: { source?: string; action?: string }): Promise<PingResponse> {
  const baseUrl = env === "dev" ? N8N_DEV_URL : N8N_DEV_URL; // Extend for TEST/PROD
  const startTime = performance.now();
  const testedAt = new Date().toISOString();

  const payload = {
    source: body.source || "lovable-admin",
    env,
    action: body.action || "ping",
    timestamp: testedAt,
  };

  console.log(`[n8n-admin] Ping test for ${env}: ${baseUrl}/webhook/admin/ping`);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add secret header if configured
    if (N8N_DEV_SECRET) {
      headers["X-ADMIN-SECRET"] = N8N_DEV_SECRET;
    }

    const response = await fetch(`${baseUrl}/webhook/admin/ping`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    const latencyMs = Math.round(performance.now() - startTime);
    console.log(`[n8n-admin] Ping response: ${response.status} in ${latencyMs}ms`);

    if (response.ok) {
      return {
        env,
        ok: true,
        httpCode: response.status,
        latencyMs,
        testedAt,
        message: "Webhook n8n DEV reachable",
      };
    }

    return {
      env,
      ok: false,
      httpCode: response.status,
      latencyMs,
      testedAt,
      message: `Webhook inaccessible (HTTP ${response.status})`,
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startTime);
    const message = error instanceof Error && error.name === "TimeoutError"
      ? "Timeout - Webhook injoignable"
      : "Erreur réseau - Webhook injoignable";

    console.error(`[n8n-admin] Ping test failed:`, error);

    return {
      env,
      ok: false,
      httpCode: null,
      latencyMs,
      testedAt,
      message,
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const isAuthed = await verifyAuth(req);
    if (!isAuthed) {
      console.log("[n8n-admin] Unauthorized request");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    // Expected paths: /n8n-admin/dev/health or /n8n-admin/dev/ping
    
    // Extract env and action from path or query
    const env = url.searchParams.get("env") || "dev";
    const action = url.searchParams.get("action") || (req.method === "GET" ? "health" : "ping");

    console.log(`[n8n-admin] Request: ${req.method} env=${env} action=${action}`);

    if (req.method === "GET" && action === "health") {
      const result = await handleHealthCheck(env);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST" && action === "ping") {
      let body = {};
      try {
        body = await req.json();
      } catch {
        // Empty body is fine
      }
      
      const result = await handlePingTest(env, body);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use ?action=health (GET) or ?action=ping (POST)" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[n8n-admin] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
