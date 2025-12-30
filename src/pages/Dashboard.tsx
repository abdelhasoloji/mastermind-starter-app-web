import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { LogOut, User, FileText, Scale, MessageSquare, Settings, Shield } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/", { replace: true });
  };

  const dashboardCards = [
    {
      title: "Mes Documents",
      description: "Gérez vos documents juridiques",
      icon: FileText,
      count: 0,
    },
    {
      title: "Consultations",
      description: "Historique des consultations IA",
      icon: MessageSquare,
      count: 0,
    },
    {
      title: "Analyses",
      description: "Vos analyses juridiques",
      icon: Scale,
      count: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.email}</span>
              </div>
              
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue sur Juriscope
          </h1>
          <p className="text-muted-foreground">
            Votre assistant juridique intelligent alimenté par l'IA
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <Card key={card.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Getting Started */}
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle>Commencer</CardTitle>
            <CardDescription>
              Explorez les fonctionnalités de Juriscope
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Button variant="heroOutline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/consultation")}>
                <MessageSquare className="w-5 h-5" />
                <span>Nouvelle consultation IA</span>
              </Button>
              <Button variant="heroOutline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/document-analysis")}>
                <FileText className="w-5 h-5" />
                <span>Analyse de document</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Scale className="w-5 h-5" />
                <span>Importer un document</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/n8n-dev")}>
                <Shield className="w-5 h-5" />
                <span>Admin n8n DEV</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
