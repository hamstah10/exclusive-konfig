import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import ConfiguratorResultPage from "./pages/ConfiguratorResultPage";
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
          <Route path="/" element={<ConfiguratorPage />} />
          <Route path="/configurator" element={<Navigate to="/" replace />} />
          <Route path="/configurator/:id" element={<ConfiguratorResultPage />} />
          <Route path="/v2" element={<ConfiguratorPageV2 />} />
          <Route path="/v2/configurator/:id" element={<ConfiguratorResultPageV2 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
