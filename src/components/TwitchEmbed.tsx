import { useState, useEffect, useRef } from "react";
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
  const twitchChannel = "joelgadaffi";
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [iframeError, setIframeError] = useState(false);

  // Use ref to ensure container element is present for Twitch Player
  const containerRef = useRef<HTMLDivElement>(null);

  // Debug function to track hasError changes
  const setHasErrorWithLog = (value: boolean, reason: string) => {
    setDebugInfo(prev => [...prev, `hasError=${value}: ${reason}`]);
    setHasError(value);
  };

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
  }, []);

  useEffect(() => {
    if (isAndroid) return; // Android fallback logic

    // Load Twitch embed script for iOS and other platforms
    const script = document.createElement('script');
    script.src = 'https://player.twitch.tv/js/embed/v1.js';
    script.onload = () => {
      setIsScriptLoaded(true);
      // Wait until containerRef is set
      if (containerRef.current) {
        const hostname = window.location.hostname;
        const parentDomains = [
          hostname,
          'localhost',
          '93d33477-c474-4a2d-8760-2925f3e19bcc.lovableproject.com'
        ];
        if (hostname.includes('lovableproject.com')) parentDomains.push('lovableproject.com');
        const options = {
          width: '100%',
          height: '100%',
          channel: twitchChannel,
          parent: parentDomains
        };
        try {
          window.twitchPlayer = new window.Twitch.Player(containerRef.current, options);

          window.twitchPlayer.addEventListener(window.Twitch.Player.READY, () => {
            setDebugInfo(prev => [...prev, 'READY event fired']);
            window.twitchPlayer.setVolume(1);
            window.twitchPlayer.setMuted(true);
            setHasErrorWithLog(false, 'Player ready event fired');
          });

          window.twitchPlayer.addEventListener(window.Twitch.Player.OFFLINE, () => {
            setDebugInfo(prev => [...prev, 'OFFLINE event fired']);
            setIsOffline(true);
          });

          window.twitchPlayer.addEventListener(window.Twitch.Player.ONLINE, () => {
            setDebugInfo(prev => [...prev, 'ONLINE event fired']);
            setIsOffline(false);
          });

          window.twitchPlayer.addEventListener(window.Twitch.Player.ERROR, (error: any) => {
            setDebugInfo(prev => [...prev, `ERROR: ${JSON.stringify(error)}`]);
            setHasErrorWithLog(true, `Player error event: ${JSON.stringify(error)}`);
          });

          // Add a timeout to detect if player never loads
          setTimeout(() => {
            if (!window.twitchPlayer || window.twitchPlayer.getPlayerState() === undefined) {
              setDebugInfo(prev => [...prev, 'Player timeout - no events fired']);
              setIsOffline(true);
            } else {
              const playerState = window.twitchPlayer.getPlayerState();
              setDebugInfo(prev => [...prev, `Player state: ${playerState}`]);
              try {
                const currentTime = window.twitchPlayer.getCurrentTime();
                const duration = window.twitchPlayer.getDuration();
                if (currentTime !== undefined || duration !== undefined) {
                  setHasErrorWithLog(false, 'Player ready via state check');
                  setIsOffline(false);
                } else {
                  setIsOffline(true);
                }
              } catch (error) {
                setIsOffline(true);
              }
            }
          }, 5000);
        } catch (error) {
          setHasErrorWithLog(true, `Player initialization exception: ${error}`);
        }
      } else {
        setHasErrorWithLog(true, 'Container element not found (ref not attached)');
      }
    };
    script.onerror = (error) => {
      setHasErrorWithLog(true, 'Script loading failed');
    };
    document.head.appendChild(script);

    return () => {
      if (window.twitchPlayer) {
        try {
          window.twitchPlayer.destroy();
          window.twitchPlayer = null;
        } catch (error) {}
      }
      const existingScript = document.querySelector('script[src="https://player.twitch.tv/js/embed/v1.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [isAndroid]);

  const renderOfflineState = () => (
    <div className="aspect-video bg-gradient-to-br from-gray-900/20 to-gray-700/20 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 border border-gray-500/20">
      <Tv className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-300 mb-2 text-center">
        Stream Offline
      </h3>
      <p className="text-sm text-gray-200/80 text-center mb-4 max-w-sm">
        The live stream is currently offline. Check back later or watch previous content on Twitch.
      </p>
      <Button
        variant="outline"
        asChild
        className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
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
    </div>
  );

  const renderAndroidIframe = () => {
    const parentHostname = window.location.hostname;
    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center">
        {!iframeError ? (
          <iframe
            src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${parentHostname}`}
            title="Twitch Stream"
            height="100%"
            width="100%"
            allowFullScreen
            frameBorder="0"
            scrolling="no"
            style={{ borderRadius: "8px", minHeight: "300px", width: "100%" }}
            onError={() => setIframeError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
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
        )}
      </div>
    );
  };

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
        {/* Debug Panel - Visible on screen */}
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-black text-xs">
          <strong>Debug Info:</strong><br />
          isAndroid: {isAndroid.toString()}<br />
          hasError: {hasError.toString()}<br />
          isScriptLoaded: {isScriptLoaded.toString()}<br />
          isOffline: {isOffline.toString()}<br />
          Debug Log: {debugInfo.slice(-3).join(' | ')}
        </div>

        {(() => {
          if (isAndroid) {
            return renderAndroidIframe();
          } else if (hasError) {
            return renderErrorFallback();
          } else if (isOffline) {
            return renderOfflineState();
          } else {
            return (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <div 
                  ref={containerRef}
                  id="twitch-livestream-container" 
                  className="w-full h-full"
                />
              </div>
            );
          }
        })()}
        
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
                  href="https://primal4k.com"
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