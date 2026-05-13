import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConversationProvider } from "@elevenlabs/react";
import { ValuationDraftProvider } from "@/contexts/ValuationDraftContext";
import { FunnelProgressProvider } from "@/contexts/FunnelProgressContext";
import { VoiceAgentButton } from "@/components/ankauf/VoiceAgentButton";
import LandingPage from "./pages/LandingPage";
import ConfiguratorPageV2 from "./pages/ConfiguratorPageV2";
import ConfiguratorResultPageV2 from "./pages/ConfiguratorResultPageV2";
import MarketplacePage from "./pages/MarketplacePage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import AuthPage from "./pages/AuthPage";
import PortalPage from "./pages/PortalPage";
import WheelConfiguratorPage from "./pages/WheelConfiguratorPage";
import DynoBookingPage from "./pages/DynoBookingPage";
import AnkaufFunnelPage from "./pages/AnkaufFunnelPage";
import AnkaufDankePage from "./pages/AnkaufDankePage";
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLeadsPage from "./pages/AdminLeadsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <ConversationProvider>
        <ValuationDraftProvider>
        <FunnelProgressProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/konfigurator" element={<ConfiguratorPageV2 />} />
          <Route path="/konfigurator/:id" element={<ConfiguratorResultPageV2 />} />
          <Route path="/fahrzeuge" element={<MarketplacePage />} />
          <Route path="/fahrzeuge/:slug" element={<VehicleDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/portal/:leadId" element={<PortalPage />} />
          <Route path="/raeder-konfigurator" element={<WheelConfiguratorPage />} />
          <Route path="/pruefstand-buchung" element={<DynoBookingPage />} />
          <Route path="/ankauf" element={<AnkaufFunnelPage />} />
          <Route path="/ankauf/danke" element={<AnkaufDankePage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="anfragen" element={<AdminLeadsPage />} />
            <Route path="pruefstand" element={<AdminBookingsPage />} />
          </Route>
          <Route path="/v2" element={<Navigate to="/konfigurator" replace />} />
          <Route path="/v2/configurator/:id" element={<Navigate to="/konfigurator" replace />} />
          <Route path="/configurator" element={<Navigate to="/konfigurator" replace />} />
          <Route path="/configurator/:id" element={<Navigate to="/konfigurator" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <VoiceAgentButton />
        </FunnelProgressProvider>
        </ValuationDraftProvider>
        </ConversationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
