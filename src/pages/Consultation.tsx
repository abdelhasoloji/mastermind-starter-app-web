import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { ArrowLeft, Send, User, Bot, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Consultation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response - to be replaced with actual AI integration
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Je suis votre assistant juridique IA. Cette fonctionnalité sera bientôt connectée à un modèle d'IA pour vous fournir des conseils juridiques personnalisés. En attendant, n'hésitez pas à poser vos questions.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <span className="text-sm text-muted-foreground">Consultation IA</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-3xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center h-64">
              <div className="text-center text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h2 className="text-lg font-medium mb-2">Assistant Juridique IA</h2>
                <p className="text-sm">Posez votre question juridique pour commencer la consultation.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Card
                key={message.id}
                className={`p-4 ${
                  message.role === "user"
                    ? "bg-primary/10 border-primary/20 ml-8"
                    : "bg-muted/50 border-border/50 mr-8"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">
                      {message.role === "user" ? "Vous" : "Assistant IA"}
                    </p>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}

          {isLoading && (
            <Card className="p-4 bg-muted/50 border-border/50 mr-8">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-muted-foreground/20 text-muted-foreground">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Réflexion en cours...</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="sticky bottom-0 bg-background pt-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Décrivez votre question juridique..."
              className="min-h-[60px] max-h-[200px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={!input.trim() || isLoading}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Appuyez sur Entrée pour envoyer, Shift+Entrée pour un retour à la ligne
          </p>
        </form>
      </main>
    </div>
  );
}
