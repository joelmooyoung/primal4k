import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";

interface AudioPlayerProps {
  title: string;
  description: string;
  streamUrl: string;
  isLive?: boolean;
  coverImage?: string;
  externalLinks?: {
    winamp?: string;
    vlc?: string;
    itunes?: string;
  };
}

const AudioPlayer = ({ 
  title, 
  description, 
  streamUrl, 
  isLive = false, 
  coverImage,
  externalLinks 
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Audio visualization bars
  const visualizerBars = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className={`w-1 bg-gradient-to-t from-primary to-primary-glow rounded-full ${
        isPlaying ? 'animate-audio-wave' : 'h-2'
      }`}
      style={{
        animationDelay: `${i * 0.1}s`,
        height: isPlaying ? 'auto' : '8px'
      }}
    />
  ));

  // For the main radio stream, use iframe approach since it's a web player
  if (streamUrl.includes('citrus3.com')) {
    return (
      <Card className="bg-gradient-card border-border/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {/* Header with title and description */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
              {isLive && (
                <div className="inline-flex bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold animate-pulse-glow mt-2">
                  LIVE
                </div>
              )}
            </div>

            {/* Embedded Radio Player */}
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <iframe 
                src={streamUrl}
                className="w-full h-full border-0"
                title={title}
                allow="autoplay"
              />
            </div>

            {/* External Player Links */}
            {externalLinks && (
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-muted-foreground">Open in:</span>
                {externalLinks.winamp && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8"
                  >
                    <a href={externalLinks.winamp} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Winamp
                    </a>
                  </Button>
                )}
                {externalLinks.vlc && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8"
                  >
                    <a href={externalLinks.vlc} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      VLC
                    </a>
                  </Button>
                )}
                {externalLinks.itunes && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8"
                  >
                    <a href={externalLinks.itunes} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      iTunes
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // For other streams, use the HTML5 audio approach
  return (
    <Card className="bg-gradient-card border-border/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cover Image & Visualizer */}
          <div className="flex-shrink-0">
            <div className="relative w-full lg:w-64 h-64 rounded-lg overflow-hidden bg-gradient-primary/20">
              {coverImage ? (
                <img 
                  src={coverImage} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex items-end space-x-1 h-20">
                    {visualizerBars}
                  </div>
                </div>
              )}
              
              {isLive && (
                <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold animate-pulse-glow">
                  LIVE
                </div>
              )}
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                size="lg"
                onClick={togglePlay}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>

              {/* Volume Control */}
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="p-2"
                >
                  {isMuted || volume[0] === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-8">
                  {volume[0]}
                </span>
              </div>
            </div>

            {/* External Player Links */}
            {externalLinks && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Open in:</span>
                {externalLinks.winamp && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8"
                  >
                    <a href={externalLinks.winamp} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Winamp
                    </a>
                  </Button>
                )}
                {externalLinks.vlc && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8"
                  >
                    <a href={externalLinks.vlc} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      VLC
                    </a>
                  </Button>
                )}
                {externalLinks.itunes && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8"
                  >
                    <a href={externalLinks.itunes} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      iTunes
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={streamUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;