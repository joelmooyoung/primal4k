import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AudioProvider } from "@/contexts/AudioContext";
import PersistentPlayer from "@/components/PersistentPlayer";
import Index from "./pages/Index";
import { useEffect } from "react";

// Create queryClient outside component to prevent recreation
const queryClient = new QueryClient();

// Generate a unique App instance ID to track if App is being recreated
const APP_INSTANCE_ID = Math.random().toString(36).substr(2, 9);

// Extend Window interface for PWA
declare global {
  interface Window {
    deferredPrompt?: any;
  }
}

const App = () => {
  console.log('🏗️ App component render - Instance ID:', APP_INSTANCE_ID);
  
  useEffect(() => {
    // PWA Install prompt handling
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 PWA install prompt available!');
      e.preventDefault();
      window.deferredPrompt = e;
    };

    const handleAppInstalled = () => {
      console.log('🎉 PWA successfully installed!');
      window.deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioProvider key="persistent-audio">
          <Toaster />
          <Sonner />
          <Index />
          <PersistentPlayer />
        </AudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
