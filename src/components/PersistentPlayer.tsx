import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, ExternalLink, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import { useStreamMetadata } from '@/hooks/useStreamMetadata';

const PersistentPlayer = () => {
  const { currentStation, isPlaying, volume, isMuted, togglePlay, setVolume, toggleMute, getExternalLinks, getStreamUrl } = useAudio();
  const [isMinimized, setIsMinimized] = useState(true);
  // Only fetch metadata when actually playing to avoid CORS errors
  const streamUrl = currentStation && isPlaying ? getStreamUrl(currentStation) : '';
  const { metadata } = useStreamMetadata(streamUrl);

  console.log('PersistentPlayer render - currentStation:', currentStation, 'isPlaying:', isPlaying);

  if (!currentStation) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-full w-14 h-14 shadow-lg relative overflow-hidden"
        >
          {/* Logo background */}
          <img 
            src="/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png" 
            alt="Primal Radio Logo"
            className="absolute inset-1 w-12 h-12 rounded-full object-cover opacity-30"
          />
          {/* Play/Pause icon overlay */}
          {isPlaying ? (
            <Pause className="w-6 h-6 relative z-10" />
          ) : (
            <Play className="w-6 h-6 ml-1 relative z-10" />
          )}
        </Button>
      </div>
    );
  }

  const externalLinks = getExternalLinks(currentStation);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-gradient-card border-border/50 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {metadata?.currentTrack?.albumArt ? (
                <img 
                  src={metadata.currentTrack.albumArt} 
                  alt="Album art"
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                  onError={(e) => {
                    // Fallback to logo if album art fails
                    e.currentTarget.src = '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png';
                  }}
                />
              ) : (
                <img 
                  src="/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png" 
                  alt="Primal Radio Logo"
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">
                  {metadata?.currentTrack?.title || currentStation.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {metadata?.currentTrack?.artist || (currentStation.isLive ? 'LIVE' : 'Now Playing')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="p-1 h-auto flex-shrink-0"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mb-3">
            <Button
              size="sm"
              onClick={togglePlay}
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white w-10 h-10 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="p-1"
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
            </div>
          </div>

          {/* External Links */}
          {externalLinks && (
            <div className="flex gap-1">
              {externalLinks.winamp && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-7 text-xs"
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
                  className="h-7 text-xs"
                >
                  <a href={externalLinks.vlc} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    VLC
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersistentPlayer;