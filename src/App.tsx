import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AudioProvider } from "@/contexts/AudioContext";
import PersistentPlayer from "@/components/PersistentPlayer";
import IconTest from "@/components/IconTest";
import Index from "./pages/Index";

// Create queryClient outside component to prevent recreation
const queryClient = new QueryClient();

// Generate a unique App instance ID to track if App is being recreated
const APP_INSTANCE_ID = Math.random().toString(36).substr(2, 9);

const App = () => {
  console.log('🏗️ App component render - Instance ID:', APP_INSTANCE_ID);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioProvider key="persistent-audio">
          <Toaster />
          <Sonner />
          <Index />
          <PersistentPlayer />
          <IconTest />
        </AudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
