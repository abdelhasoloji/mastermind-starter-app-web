import { env } from "@/shared/config/env";
import { supabase } from "@/shared/supabase/client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // smoke: ensure client is referenced so tree-shaking doesn't remove it
  void supabase;

  return (

  <QueryClientProvider client={queryClient}>
    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 9999, fontSize: 12, opacity: 0.9 }}>
      <span style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.15)" }}>
        Supabase: {env.supabaseUrl}
      </span>
    </div>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
