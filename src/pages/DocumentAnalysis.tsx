import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useJobPolling } from "@/hooks/useJobPolling";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Clock,
  Zap
} from "lucide-react";

export default function DocumentAnalysis() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documentId, setDocumentId] = useState("");

  const { 
    job, 
    status, 
    isPolling, 
    progress, 
    error, 
    startJob, 
    reset 
  } = useJobPolling({
    pollingInterval: 2000,
    onSuccess: (job) => {
      toast.success("Analyse terminée avec succès");
      console.log("Résultat:", job.result);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId.trim()) {
      toast.error("Veuillez entrer un ID de document");
      return;
    }
    
    await startJob({
      documentId: documentId.trim(),
      type: "analysis",
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "idle":
        return "En attente";
      case "pending":
        return "Création du job...";
      case "running":
        return "Analyse en cours...";
      case "completed":
        return "Terminé";
      case "failed":
        return "Échec";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-destructive";
      case "running":
      case "pending":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Logo />
            </div>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            Analyse de Document
          </h1>
          <p className="text-muted-foreground">
            Lancez une analyse IA sur vos documents juridiques
          </p>
        </div>

        {/* Formulaire */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Nouveau Job
            </CardTitle>
            <CardDescription>
              Entrez l'ID du document à analyser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentId">ID du document</Label>
                <Input
                  id="documentId"
                  placeholder="ex: doc_abc123..."
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  disabled={status === "pending" || status === "running"}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={status === "pending" || status === "running" || !documentId.trim()}
                  className="flex-1"
                >
                  {(status === "pending" || status === "running") ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Lancer l'analyse
                    </>
                  )}
                </Button>
                
                {status !== "idle" && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={reset}
                    disabled={isPolling}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Statut du Job */}
        {status !== "idle" && (
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon()}
                Statut du Job
              </CardTitle>
              {job?.id && (
                <CardDescription className="font-mono text-xs">
                  ID: {job.id}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">État</span>
                <span className={`font-medium ${getStatusColor()}`}>
                  {getStatusLabel()}
                </span>
              </div>

              {/* Progress bar */}
              {(status === "running" || status === "pending") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Erreur */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error.message}</p>
                </div>
              )}

              {/* Résultat */}
              {status === "completed" && job?.result && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm font-medium text-green-600 mb-2">Résultat de l'analyse :</p>
                  <pre className="text-xs bg-muted/50 p-2 rounded overflow-auto max-h-48">
                    {JSON.stringify(job.result, null, 2)}
                  </pre>
                </div>
              )}

              {/* Timestamps */}
              {job && (
                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/50">
                  <div className="flex justify-between">
                    <span>Créé</span>
                    <span>{new Date(job.createdAt).toLocaleString("fr-FR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mis à jour</span>
                    <span>{new Date(job.updatedAt).toLocaleString("fr-FR")}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Comment ça marche ?</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Entrez l'ID du document à analyser</li>
                  <li>Le système crée un job d'analyse asynchrone</li>
                  <li>L'avancement est affiché en temps réel</li>
                  <li>Le résultat s'affiche une fois terminé</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
