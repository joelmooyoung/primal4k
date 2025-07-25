import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Tv } from "lucide-react";

const TwitchEmbed = () => {
  const twitchChannel = "joelgadaffi";
  const isOffline = true; // This would be determined by Twitch API in a real implementation

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
        {isOffline ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tv className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{twitchChannel} is offline</h3>
            <p className="text-muted-foreground mb-4">
              The stream is currently not live. Check back later!
            </p>
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
        ) : (
          <div className="aspect-video">
            <iframe
              src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${window.location.hostname}`}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwitchEmbed;