import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Tv } from "lucide-react";

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
  
  console.log('🎥 TwitchEmbed - Channel:', twitchChannel, 'Script loaded:', isScriptLoaded, 'Offline:', isOffline);

  useEffect(() => {
    // Load Twitch embed script
    const script = document.createElement('script');
    script.src = 'https://player.twitch.tv/js/embed/v1.js';
    script.onload = () => {
      setIsScriptLoaded(true);
      initializeTwitchPlayer();
    };
    document.head.appendChild(script);

    return () => {
      // Clean up Twitch player when component unmounts
      if (window.twitchPlayer) {
        try {
          window.twitchPlayer.destroy();
          window.twitchPlayer = null;
        } catch (error) {
          console.log('Error destroying Twitch player:', error);
        }
      }
      document.head.removeChild(script);
    };
  }, []);

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
          console.log('Twitch player ready');
        });

        window.twitchPlayer.addEventListener(window.Twitch.Player.OFFLINE, () => {
          setIsOffline(true);
        });

        window.twitchPlayer.addEventListener(window.Twitch.Player.ONLINE, () => {
          setIsOffline(false);
        });

        window.twitchPlayer.addEventListener(window.Twitch.Player.ERROR, (error: any) => {
          console.error('Twitch player error:', error);
          setIsOffline(true);
        });
      } catch (error) {
        console.error('Error initializing Twitch player:', error);
        setIsOffline(true);
      }
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-purple-500" />
            LiveStream
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
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {/* Use the container div directly as Twitch player target */}
          <div 
            id="twitch-livestream-container" 
            className="w-full h-full"
          />
        </div>
        
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Live video stream from Primal Radio
          </p>
          <Button
            variant="outline"
            asChild
            className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10"
          >
            <a 
              href="https://fast.citrus3.com:2020/public/dj_gadaffi_and_friends"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Window
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwitchEmbed;