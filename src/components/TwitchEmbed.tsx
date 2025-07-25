import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Tv } from "lucide-react";

declare global {
  interface Window {
    Twitch: any;
  }
}

const TwitchEmbed = () => {
  const twitchChannel = "joelgadaffi";
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

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
      document.head.removeChild(script);
    };
  }, []);

  const initializeTwitchPlayer = () => {
    if (window.Twitch) {
      try {
        const options = {
          width: '100%',
          height: '100%',
          channel: twitchChannel,
          parent: [window.location.hostname, 'localhost'],
          muted: true
        };

        const player = new window.Twitch.Player('twitch-embed', options);
        
        player.addEventListener(window.Twitch.Player.READY, () => {
          player.setVolume(1);
          player.setMuted(true);
          console.log('Twitch player ready');
        });

        player.addEventListener(window.Twitch.Player.OFFLINE, () => {
          setIsOffline(true);
        });

        player.addEventListener(window.Twitch.Player.ONLINE, () => {
          setIsOffline(false);
        });

        player.addEventListener(window.Twitch.Player.ERROR, (error: any) => {
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
            Twitch Stream
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={
              isOffline 
                ? "bg-chat-offline/20 text-chat-offline border-chat-offline/30"
                : "bg-purple-500/20 text-purple-500 border-purple-500/30"
            }
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isOffline ? 'bg-chat-offline' : 'bg-purple-500 animate-pulse'
            }`} />
            {isOffline ? 'OFFLINE' : 'LIVE'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {isScriptLoaded ? (
            <div id="twitch-embed" className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Tv className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-muted-foreground">Loading Twitch player...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
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
              Visit Twitch Channel
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwitchEmbed;