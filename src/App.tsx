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
    // PWA Install prompt handling with detailed logging
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 PWA install prompt available!', e);
      e.preventDefault();
      window.deferredPrompt = e;
    };

    const handleAppInstalled = () => {
      console.log('🎉 PWA successfully installed!');
      window.deferredPrompt = null;
    };

    // Track user engagement for PWA installability
    let startTime = Date.now();
    let hasInteracted = false;
    
    const trackInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        console.log('✅ User interaction detected for PWA');
      }
    };
    
    const checkEngagement = () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      console.log(`⏱️ Time spent: ${timeSpent}s, Has interacted: ${hasInteracted}`);
      
      if (timeSpent >= 30 && hasInteracted) {
        console.log('🎯 PWA engagement criteria met! Waiting for install prompt...');
      }
    };

    // Add interaction listeners
    document.addEventListener('click', trackInteraction);
    document.addEventListener('touchstart', trackInteraction);
    
    // Check engagement every 5 seconds
    const engagementInterval = setInterval(checkEngagement, 5000);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('touchstart', trackInteraction);
      clearInterval(engagementInterval);
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
