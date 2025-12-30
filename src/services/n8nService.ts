/**
 * n8n Service - API calls for n8n health and connectivity checks
 */

import { env } from "@/shared/config/env";

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

/**
 * Check n8n DEV health status
 */
export async function checkN8nHealth(): Promise<HealthCheckResult> {
  const startTime = performance.now();
  const timestamp = new Date();

  try {
    const response = await fetch(`${env.n8nBaseUrl}/healthz`, {
      method: "GET",
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    const responseTimeMs = Math.round(performance.now() - startTime);

    if (response.ok) {
      return {
        ok: true,
        httpCode: response.status,
        responseTimeMs,
        message: "Service opérationnel",
        timestamp,
      };
    }

    return {
      ok: false,
      httpCode: response.status,
      responseTimeMs,
      message: `Service indisponible (HTTP ${response.status})`,
      timestamp,
    };
  } catch (error) {
    const responseTimeMs = Math.round(performance.now() - startTime);
    
    return {
      ok: false,
      httpCode: null,
      responseTimeMs,
      message: error instanceof Error && error.name === "TimeoutError" 
        ? "Timeout - Service indisponible" 
        : "Erreur réseau - Service injoignable",
      timestamp,
    };
  }
}

/**
 * Test n8n DEV webhook connectivity
 * Note: In production, this should go through a backend proxy to avoid exposing admin secrets
 */
export async function testN8nWebhook(): Promise<WebhookTestResult> {
  const startTime = performance.now();
  const timestamp = new Date();

  try {
    const response = await fetch(`${env.n8nBaseUrl}/webhook/admin/ping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "lovable-admin",
        env: "dev",
        action: "ping",
        timestamp: timestamp.toISOString(),
      }),
      signal: AbortSignal.timeout(15000), // 15s timeout for webhook
    });

    const responseTimeMs = Math.round(performance.now() - startTime);

    if (response.ok) {
      return {
        ok: true,
        httpCode: response.status,
        responseTimeMs,
        message: "Webhook n8n DEV reachable",
        timestamp,
      };
    }

    return {
      ok: false,
      httpCode: response.status,
      responseTimeMs,
      message: `Webhook inaccessible (HTTP ${response.status})`,
      timestamp,
    };
  } catch (error) {
    const responseTimeMs = Math.round(performance.now() - startTime);

    return {
      ok: false,
      httpCode: null,
      responseTimeMs,
      message: error instanceof Error && error.name === "TimeoutError"
        ? "Timeout - Webhook injoignable"
        : "Erreur réseau - Webhook injoignable",
      timestamp,
    };
  }
}
