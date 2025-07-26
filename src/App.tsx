import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "@/contexts/AudioContext";
import PersistentPlayer from "@/components/PersistentPlayer";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import DJs from "./pages/DJs";
import DJProfile from "./pages/DJProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

// Create queryClient outside component to prevent recreation
const queryClient = new QueryClient();

// Generate a unique App instance ID to track if App is being recreated
const APP_INSTANCE_ID = Math.random().toString(36).substr(2, 9);

const App = () => {
  console.log('🏗️ App component render - Instance ID:', APP_INSTANCE_ID);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/djs" element={<DJs />} />
              <Route path="/dj/:djId" element={<DJProfile />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PersistentPlayer />
          </BrowserRouter>
        </AudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
