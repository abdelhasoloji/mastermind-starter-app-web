import { useEffect, useState } from "react";
import { checkSupabaseHealth } from "@/shared/supabase/health";
import { env } from "@/shared/config/env";

export function SupabaseHealthWidget() {
  if (!import.meta.env.DEV) return null;

  const [sb, setSb] = useState<any>(null);

  useEffect(() => {
    checkSupabaseHealth().then(setSb);
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 12, right: 12, zIndex: 999999, fontSize: 12, opacity: 0.95 }}>
      <div style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)", background: "rgba(255,255,255,0.92)" }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Supabase DEV</div>
        <div style={{ maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          URL: {env.supabaseUrl}
        </div>
        <div>Status: {sb ? (sb.ok ? "OK" : "KO") : "..."}</div>
        {sb?.authHealth && <div>auth/health: {sb.authHealth.status}</div>}
        {sb?.restOpenApi && <div>rest/openapi: {sb.restOpenApi.status}</div>}
        {sb?.error && <div style={{ maxWidth: 360 }}>err: {sb.error}</div>}
      </div>
    </div>
  );
}
