import { FileSearch, Brain, Scale, Clock, Lock, Workflow } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Analyse Documentaire",
    description: "Extraction intelligente d'informations clés à partir de vos documents juridiques avec une précision exceptionnelle.",
  },
  {
    icon: Brain,
    title: "Intelligence Juridique",
    description: "Modèles IA spécialisés en droit luxembourgeois et européen pour des réponses contextuellement pertinentes.",
  },
  {
    icon: Scale,
    title: "Jurisprudence Connectée",
    description: "Accès instantané à une base de données exhaustive de décisions de justice et textes de loi.",
  },
  {
    icon: Clock,
    title: "Gain de Temps",
    description: "Automatisez les tâches répétitives et concentrez-vous sur le conseil stratégique à haute valeur ajoutée.",
  },
  {
    icon: Lock,
    title: "Sécurité Maximale",
    description: "Infrastructure auto-hébergée avec chiffrement de bout en bout et conformité RGPD garantie.",
  },
  {
    icon: Workflow,
    title: "Workflows Automatisés",
    description: "Créez des processus personnalisés avec n8n pour optimiser vos opérations juridiques quotidiennes.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Une plateforme complète pour les{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              professionnels du droit
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des outils puissants conçus spécifiquement pour transformer votre pratique juridique.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-elevated hover:border-primary/20 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
