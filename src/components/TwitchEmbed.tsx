import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Tv, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    Twitch: any;
    twitchPlayer: any;
  }
}

const TwitchEmbed = () => {
  console.log('🎥 TwitchEmbed component rendered');
  const twitchChannel = "joelgadaffi";
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  console.log('🎥 TwitchEmbed - Channel:', twitchChannel, 'Script loaded:', isScriptLoaded, 'Offline:', isOffline);

  // Detect platform
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    // More specific Android detection - must contain 'android' and NOT be Windows or macOS
    const isAndroidDevice = userAgent.includes('android') && 
                           !userAgent.includes('windows') && 
                           !userAgent.includes('mac') && 
                           !userAgent.includes('iphone') && 
                           !userAgent.includes('ipad');
    const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    setIsAndroid(isAndroidDevice);
    setIsMobile(isMobileDevice);
    
    console.log('🎥 Platform detection - UserAgent:', userAgent);
    console.log('🎥 Platform detection - Android:', isAndroidDevice, 'Mobile:', isMobileDevice);
  }, []);

  useEffect(() => {
    // On Android, skip the Twitch embed script as it's problematic in WebView
    if (isAndroid) {
      console.log('🎥 Android detected - using fallback method');
      setHasError(true); // Show fallback immediately
      return;
    }

    console.log('🎥 Loading Twitch script for non-Android platform');
    // Load Twitch embed script for iOS and other platforms
    const script = document.createElement('script');
    script.src = 'https://player.twitch.tv/js/embed/v1.js';
    script.onload = () => {
      console.log('🎥 Twitch script loaded successfully');
      setIsScriptLoaded(true);
      initializeTwitchPlayer();
    };
    script.onerror = (error) => {
      console.error('🎥 Failed to load Twitch script:', error);
      setHasError(true);
    };
    document.head.appendChild(script);

    return () => {
      console.log('🎥 Cleaning up Twitch player');
      // Clean up Twitch player when component unmounts
      if (window.twitchPlayer) {
        try {
          window.twitchPlayer.destroy();
          window.twitchPlayer = null;
        } catch (error) {
          console.log('Error destroying Twitch player:', error);
        }
      }
      // Only remove script if it exists
      const existingScript = document.querySelector('script[src="https://player.twitch.tv/js/embed/v1.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [isAndroid]);

  const initializeTwitchPlayer = () => {
    if (window.Twitch && !window.twitchPlayer) {
      try {
        const hostname = window.location.hostname;
        const parentDomains = [
          hostname,
          'localhost',
          '93d33477-c474-4a2d-8760-2925f3e19bcc.lovableproject.com'
        ];
        
        // Add lovableproject.com for any Lovable preview
        if (hostname.includes('lovableproject.com')) {
          parentDomains.push('lovableproject.com');
        }
        
        const options = {
          width: '100%',
          height: '100%',
          channel: twitchChannel,
          parent: parentDomains
        };

        // Use the container div directly as the player target
        window.twitchPlayer = new window.Twitch.Player('twitch-livestream-container', options);
        
        window.twitchPlayer.addEventListener(window.Twitch.Player.READY, () => {
          window.twitchPlayer.setVolume(1);
          window.twitchPlayer.setMuted(true);
          console.log('🎥 Twitch player ready');
          setHasError(false);
        });

        window.twitchPlayer.addEventListener(window.Twitch.Player.OFFLINE, () => {
          setIsOffline(true);
        });

        window.twitchPlayer.addEventListener(window.Twitch.Player.ONLINE, () => {
          setIsOffline(false);
        });

        window.twitchPlayer.addEventListener(window.Twitch.Player.ERROR, (error: any) => {
          console.error('🎥 Twitch player error:', error);
          setHasError(true);
        });
      } catch (error) {
        console.error('🎥 Error initializing Twitch player:', error);
        setHasError(true);
      }
    }
  };

  const renderAndroidFallback = () => (
    <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 border border-purple-500/20">
      <AlertCircle className="w-12 h-12 text-purple-400 mb-4" />
      <h3 className="text-lg font-semibold text-purple-300 mb-2 text-center">
        Android Compatibility Mode
      </h3>
      <p className="text-sm text-purple-200/80 text-center mb-4 max-w-sm">
        Twitch embed has limited support on Android. Use the button below to watch the live stream.
      </p>
      <Button
        variant="outline"
        asChild
        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
      >
        <a 
          href={`https://www.twitch.tv/${twitchChannel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Tv className="w-4 h-4" />
          Watch on Twitch
        </a>
      </Button>
    </div>
  );

  const renderErrorFallback = () => (
    <div className="aspect-video bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 border border-red-500/20">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-red-300 mb-2 text-center">
        Stream Unavailable
      </h3>
      <p className="text-sm text-red-200/80 text-center mb-4 max-w-sm">
        Unable to load the live stream embed. Click below to watch directly on Twitch.
      </p>
      <Button
        variant="outline"
        asChild
        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
      >
        <a 
          href={`https://www.twitch.tv/${twitchChannel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Open Twitch
        </a>
      </Button>
    </div>
  );

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-purple-500" />
            LiveStream
            {isAndroid && (
              <Badge variant="outline" className="text-xs border-orange-500/50 text-orange-400">
                Android Mode
              </Badge>
            )}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-chat-online/20 text-chat-online border-chat-online/30"
          >
            <div className="w-2 h-2 rounded-full mr-2 bg-chat-online animate-pulse" />
            LIVE
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {isAndroid ? (
          renderAndroidFallback()
        ) : hasError ? (
          renderErrorFallback()
        ) : (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {/* Use the container div directly as Twitch player target */}
            <div 
              id="twitch-livestream-container" 
              className="w-full h-full"
            />
          </div>
        )}
        
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {isAndroid 
              ? "Live video stream - optimized for Android" 
              : "Live video stream from Primal Radio"
            }
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              variant="outline"
              asChild
              className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10"
            >
              <a 
                href={`https://www.twitch.tv/${twitchChannel}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Watch on Twitch
              </a>
            </Button>
            
            {!isAndroid && (
              <Button
                variant="outline"
                asChild
                className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
              >
                <a 
                  href="https://fast.citrus3.com:2020/public/dj_gadaffi_and_friends"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Alternative Stream
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwitchEmbed;