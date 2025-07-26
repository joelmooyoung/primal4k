import { useAudio } from '@/contexts/AudioContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";

import { Station } from "@/types/station";

interface AudioPlayerIntegratedProps {
  station: Station;
}

const AudioPlayerIntegrated = ({ station }: AudioPlayerIntegratedProps) => {
  const { 
    currentStation, 
    isPlaying, 
    volume, 
    isMuted, 
    setCurrentStation, 
    togglePlay, 
    setVolume, 
    toggleMute, 
    getStreamUrl, 
    getExternalLinks 
  } = useAudio();

  const isCurrentlyPlaying = currentStation?.id === station.id && isPlaying;
  const streamUrl = getStreamUrl(station);
  const externalLinks = getExternalLinks(station);

  const handlePlay = () => {
    if (currentStation?.id !== station.id) {
      setCurrentStation(station);
    }
    togglePlay();
  };

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

  // For the main radio stream, use iframe approach since it's a web player
  if (streamUrl.includes('citrus3.com')) {
    return (
      <Card className="bg-gradient-card border-border/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {/* Header with title and description */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1">{station.name}</h3>
              <p className="text-muted-foreground">{station.currentTrack || 'Now Playing'}</p>
              {station.isLive && (
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
                title={station.name}
                allow="autoplay"
                allowFullScreen={false}
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

  // For other streams, use the HTML5 audio approach with global context
  return (
    <Card className="bg-gradient-card border-border/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Visualizer */}
          <div className="flex-shrink-0">
            <div className="relative w-full lg:w-64 h-64 rounded-lg overflow-hidden bg-gradient-primary/20">
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex items-end space-x-1 h-20">
                  {visualizerBars}
                </div>
              </div>
              
              {station.isLive && (
                <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold animate-pulse-glow">
                  LIVE
                </div>
              )}
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-1">{station.name}</h3>
              <p className="text-muted-foreground">{station.currentTrack || 'Now Playing'}</p>
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                size="lg"
                onClick={handlePlay}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayerIntegrated;