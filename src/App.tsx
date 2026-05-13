import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import ConfiguratorPageV2 from "./pages/ConfiguratorPageV2";
import ConfiguratorResultPageV2 from "./pages/ConfiguratorResultPageV2";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/konfigurator" element={<ConfiguratorPageV2 />} />
          <Route path="/konfigurator/:id" element={<ConfiguratorResultPageV2 />} />
          <Route path="/v2" element={<Navigate to="/konfigurator" replace />} />
          <Route path="/v2/configurator/:id" element={<Navigate to="/konfigurator" replace />} />
          <Route path="/configurator" element={<Navigate to="/konfigurator" replace />} />
          <Route path="/configurator/:id" element={<Navigate to="/konfigurator" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
