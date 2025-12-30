import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  RefreshCw, 
  Zap, 
  Activity, 
  Clock, 
  Server,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { 
  checkN8nHealth, 
  testN8nWebhook, 
  type HealthCheckResult, 
  type WebhookTestResult 
} from "@/services/n8nService";

const N8N_ENV = "dev";
const N8N_DISPLAY_URL = "https://n8n.dev.juriscope.trustena.lu";

type CheckHistoryItem = (HealthCheckResult | WebhookTestResult) & { type: "health" | "webhook" };

export default function N8nDevAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<WebhookTestResult | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [history, setHistory] = useState<CheckHistoryItem[]>([]);

  const addToHistory = useCallback((item: CheckHistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 5));
  }, []);

  const performHealthCheck = useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      const result = await checkN8nHealth(N8N_ENV);
      setHealthStatus(result);
      addToHistory({ ...result, type: "health" });
    } catch (err) {
      console.error("[N8nDev] Health check error:", err);
    } finally {
      setIsCheckingHealth(false);
    }
  }, [addToHistory]);

  const performWebhookTest = useCallback(async () => {
    setIsTestingWebhook(true);
    try {
      const result = await testN8nWebhook(N8N_ENV);
      setWebhookStatus(result);
      addToHistory({ ...result, type: "webhook" });
    } catch (err) {
      console.error("[N8nDev] Webhook test error:", err);
    } finally {
      setIsTestingWebhook(false);
    }
  }, [addToHistory]);

  // Auto-check on mount + auto-refresh every 30s
  useEffect(() => {
    performHealthCheck();

    const interval = setInterval(() => {
      performHealthCheck();
    }, 30000);

    return () => clearInterval(interval);
  }, [performHealthCheck]);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Logo />
              <Badge variant="secondary" className="font-mono text-xs">
                Admin
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">n8n DEV – Status & Connectivity</h1>
          <p className="text-muted-foreground font-mono text-sm">{N8N_DISPLAY_URL}</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Health Status Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Statut n8n DEV
                </CardTitle>
                <CardDescription>Healthcheck automatique</CardDescription>
              </div>
              {healthStatus && (
                <Badge 
                  variant={healthStatus.ok ? "default" : "destructive"}
                  className={healthStatus.ok ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                >
                  {healthStatus.ok ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" /> Online</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Offline</>
                  )}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {healthStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Message</span>
                    <span className={healthStatus.ok ? "text-green-600" : "text-destructive"}>
                      {healthStatus.message}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Code HTTP</span>
                    <span className="font-mono">{healthStatus.httpCode ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Temps de réponse
                    </span>
                    <span className="font-mono">{healthStatus.responseTimeMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dernière vérification</span>
                    <span className="font-mono text-xs">{formatTimestamp(healthStatus.timestamp)}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Vérification en cours...
                </div>
              )}

              <Button 
                onClick={performHealthCheck} 
                disabled={isCheckingHealth}
                className="w-full"
                variant="outline"
              >
                {isCheckingHealth ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Vérification...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Rafraîchir</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Webhook Test Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Test Connectivité
                </CardTitle>
                <CardDescription>Lovable → n8n DEV webhook</CardDescription>
              </div>
              {webhookStatus && (
                <Badge 
                  variant={webhookStatus.ok ? "default" : "destructive"}
                  className={webhookStatus.ok ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                >
                  {webhookStatus.ok ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" /> OK</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Échec</>
                  )}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {webhookStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Message</span>
                    <span className={webhookStatus.ok ? "text-green-600" : "text-destructive"}>
                      {webhookStatus.message}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Code HTTP</span>
                    <span className="font-mono">{webhookStatus.httpCode ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Temps de réponse
                    </span>
                    <span className="font-mono">{webhookStatus.responseTimeMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dernier test</span>
                    <span className="font-mono text-xs">{formatTimestamp(webhookStatus.timestamp)}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  Cliquez pour tester la connectivité
                </div>
              )}

              <Button 
                onClick={performWebhookTest} 
                disabled={isTestingWebhook}
                className="w-full"
              >
                {isTestingWebhook ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Test en cours...</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" /> Tester webhook n8n DEV</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Historique des vérifications
            </CardTitle>
            <CardDescription>5 dernières vérifications</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {item.ok ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.type === "health" ? "HEALTH" : "WEBHOOK"}
                      </Badge>
                      <span className="text-muted-foreground">{item.message}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="font-mono text-xs">{item.responseTimeMs}ms</span>
                      <span className="font-mono text-xs">{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Aucune vérification effectuée
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
