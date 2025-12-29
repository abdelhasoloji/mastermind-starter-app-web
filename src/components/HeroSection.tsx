import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background))_70%)]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Propulsé par l'Intelligence Artificielle
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 animate-fade-up text-balance" style={{ animationDelay: "0.1s" }}>
            L'expertise juridique{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              augmentée
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up text-balance" style={{ animationDelay: "0.2s" }}>
            Juriscope Mastermind révolutionne la pratique juridique avec une plateforme 
            intelligente qui analyse, synthétise et optimise votre travail juridique.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Essayer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
              Voir la démo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">RGPD Conforme</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm">Hébergement souverain</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm">IA de dernière génération</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
