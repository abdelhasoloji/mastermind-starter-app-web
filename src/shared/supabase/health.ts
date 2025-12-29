import { env } from "@/shared/config/env";

type HealthResult = {
  ok: boolean;
  authHealth?: { ok: boolean; status: number; body?: string };
  restOpenApi?: { ok: boolean; status: number; body?: string };
  error?: string;
};

async function safeText(res: Response) {
  try { return await res.text(); } catch { return ""; }
}

export async function checkSupabaseHealth(): Promise<HealthResult> {
  const url = env.supabaseUrl.replace(/\/+$/, "");
  const apikey = env.supabaseAnonKey;

  try {
    // 1) GoTrue health
    const authRes = await fetch(`${url}/auth/v1/health`, {
      method: "GET",
      headers: { apikey, Authorization: `Bearer ${apikey}` },
    });

    // 2) PostgREST OpenAPI (permet de valider que REST repond + CORS)
    const restRes = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey,
        Authorization: `Bearer ${apikey}`,
        Accept: "application/openapi+json",
      },
    });

    const authBody = await safeText(authRes);
    const restBody = await safeText(restRes);

    return {
      ok: authRes.ok && restRes.ok,
      authHealth: { ok: authRes.ok, status: authRes.status, body: authBody.slice(0, 200) },
      restOpenApi: { ok: restRes.ok, status: restRes.status, body: restBody.slice(0, 200) },
    };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}
