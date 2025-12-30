/**
 * n8n Service - API calls via Edge Function proxy
 * All calls go through /functions/v1/n8n-admin to avoid CORS and secrets exposure
 */

import { supabase } from "@/shared/supabase/client";

export interface HealthCheckResult {
  ok: boolean;
  httpCode: number | null;
  responseTimeMs: number;
  message: string;
  timestamp: Date;
}

export interface WebhookTestResult {
  ok: boolean;
  httpCode: number | null;
  responseTimeMs: number;
  message: string;
  timestamp: Date;
}

interface EdgeHealthResponse {
  env: string;
  status: "online" | "offline";
  httpCode: number | null;
  latencyMs: number;
  checkedAt: string;
  message?: string;
}

interface EdgePingResponse {
  env: string;
  ok: boolean;
  httpCode: number | null;
  latencyMs: number;
  testedAt: string;
  message?: string;
}

/**
 * Check n8n health via Edge Function proxy
 */
export async function checkN8nHealth(env: string = "dev"): Promise<HealthCheckResult> {
  const timestamp = new Date();

  try {
    console.log(`[n8nService] Calling health check for env=${env}`);
    
    const { data, error } = await supabase.functions.invoke<EdgeHealthResponse>("n8n-admin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: undefined,
    });

    // Workaround: supabase.functions.invoke doesn't support query params well for GET
    // We use POST with action in body instead, or call with fetch directly
    
    if (error) {
      console.error("[n8nService] Health check error:", error);
      return {
        ok: false,
        httpCode: null,
        responseTimeMs: 0,
        message: error.message || "Erreur de connexion au proxy",
        timestamp,
      };
    }

    if (!data) {
      return {
        ok: false,
        httpCode: null,
        responseTimeMs: 0,
        message: "Réponse vide du proxy",
        timestamp,
      };
    }

    return {
      ok: data.status === "online",
      httpCode: data.httpCode,
      responseTimeMs: data.latencyMs,
      message: data.message || (data.status === "online" ? "Service opérationnel" : "Service indisponible"),
      timestamp: new Date(data.checkedAt),
    };
  } catch (error) {
    console.error("[n8nService] Health check failed:", error);
    return {
      ok: false,
      httpCode: null,
      responseTimeMs: 0,
      message: error instanceof Error ? error.message : "Erreur inattendue",
      timestamp,
    };
  }
}

/**
 * Test n8n webhook via Edge Function proxy
 */
export async function testN8nWebhook(env: string = "dev"): Promise<WebhookTestResult> {
  const timestamp = new Date();

  try {
    console.log(`[n8nService] Calling ping test for env=${env}`);

    const { data, error } = await supabase.functions.invoke<EdgePingResponse>("n8n-admin", {
      method: "POST",
      body: {
        source: "lovable-admin",
        action: "ping",
      },
    });

    if (error) {
      console.error("[n8nService] Ping test error:", error);
      return {
        ok: false,
        httpCode: null,
        responseTimeMs: 0,
        message: error.message || "Erreur de connexion au proxy",
        timestamp,
      };
    }

    if (!data) {
      return {
        ok: false,
        httpCode: null,
        responseTimeMs: 0,
        message: "Réponse vide du proxy",
        timestamp,
      };
    }

    return {
      ok: data.ok,
      httpCode: data.httpCode,
      responseTimeMs: data.latencyMs,
      message: data.message || (data.ok ? "Webhook reachable" : "Webhook inaccessible"),
      timestamp: new Date(data.testedAt),
    };
  } catch (error) {
    console.error("[n8nService] Ping test failed:", error);
    return {
      ok: false,
      httpCode: null,
      responseTimeMs: 0,
      message: error instanceof Error ? error.message : "Erreur inattendue",
      timestamp,
    };
  }
}
