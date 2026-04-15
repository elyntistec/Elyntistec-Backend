import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import NotFound from "./pages/NotFound.tsx";
import DataConsolidation from "./pages/DataConsolidation.tsx";
import Insights from "./pages/Insights.tsx";
import Dashboards from "./pages/Dashboards.tsx";
import Integrations from "./pages/Integrations.tsx";
import Monitoring from "./pages/Monitoring.tsx";
import Architecture from "./pages/Architecture.tsx";
import Settings from "./pages/Settings.tsx";
import Profile from "./pages/Profile.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/data-consolidation" element={<DataConsolidation />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
