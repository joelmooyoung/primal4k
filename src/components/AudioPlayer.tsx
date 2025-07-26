import { useEffect } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useStreamMetadata } from "@/hooks/useStreamMetadata";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";
import { Station } from "@/types/station";

interface AudioPlayerProps {
  title: string;
  description: string;
  streamUrl: string;
  isLive?: boolean;
  coverImage?: string;
  station?: Station; // Add station prop
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
  station: stationProp,
  externalLinks 
}: AudioPlayerProps) => {
  console.log('🎯 AudioPlayer render - received station prop:', stationProp);
  // Use global audio context
  const { 
    isPlaying, 
    volume, 
    isMuted, 
    togglePlay, 
    setVolume, 
    toggleMute,
    currentStation,
    setCurrentStation 
  } = useAudio();
  
  // Use the station prop if provided, otherwise create one
  const station = stationProp || {
    id: streamUrl.includes('djgadaffiandfriends') ? 'primal-radio' : 'primal-radio-2',
    name: title,
    type: 'radio' as const,
    icon: 'radio',
    isLive,
    currentTrack: description
  };

  // Set current station in AudioContext for PersistentPlayer
  useEffect(() => {
    // Only set station if it's different from current station to avoid resets
    if (currentStation?.id !== station.id) {
      console.log('🎯 AudioPlayer: Setting current station:', station);
      setCurrentStation(station);
    }
  }, [station.id, setCurrentStation, currentStation?.id]); // Re-run when station ID changes

  const isCurrentlyPlaying = currentStation?.id === station.id && isPlaying;

  // Get metadata for this station
  const { metadata } = useStreamMetadata(streamUrl);

  // Audio visualization bars
  const visualizerBars = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className={`w-1 bg-gradient-to-t from-primary to-primary-glow rounded-full ${
        isCurrentlyPlaying ? 'animate-audio-wave' : 'h-2'
      }`}
      style={{
        animationDelay: `${i * 0.1}s`,
        height: isCurrentlyPlaying ? 'auto' : '8px'
      }}
    />
  ));

  // Use HTML5 audio approach for all streams to work with AudioContext
  return (
    <Card className="bg-gradient-card border-border/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cover Image & Visualizer */}
          <div className="flex-shrink-0">
            <div className="relative w-full lg:w-64 h-64 rounded-lg overflow-hidden bg-gradient-primary/20">
              {/* Use metadata cover art or fallback to prop */}
              {(metadata?.currentTrack?.albumArt || coverImage) ? (
                <img 
                  src={metadata?.currentTrack?.albumArt || coverImage} 
                  alt={metadata?.currentTrack ? `${metadata.currentTrack.artist} - ${metadata.currentTrack.title}` : title}
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
              <h3 className="text-xl font-bold mb-1">
                {metadata?.currentTrack?.title || title}
              </h3>
              <p className="text-muted-foreground">
                {metadata?.currentTrack?.artist || description}
              </p>
              {metadata?.currentTrack?.album && (
                <p className="text-sm text-muted-foreground/70">
                  {metadata.currentTrack.album}
                </p>
              )}
              {isLive && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  <span className="text-sm text-destructive font-medium">LIVE</span>
                </div>
              )}
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                size="lg"
                onClick={togglePlay}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isCurrentlyPlaying ? (
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
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-8">
                  {volume}
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
            
            {/* Stream Info */}
            {metadata && (
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {metadata.listeners && (
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {metadata.listeners} listeners
                  </div>
                )}
                {metadata.bitrate && (
                  <div>{metadata.bitrate}</div>
                )}
                {metadata.format && (
                  <div>{metadata.format}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;