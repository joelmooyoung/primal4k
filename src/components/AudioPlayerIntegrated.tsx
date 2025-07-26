import { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";
import { useStreamMetadata } from "@/hooks/useStreamMetadata";

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
  // Always get stream URL for this station to fetch metadata
  const streamUrl = getStreamUrl(station);
  // Only get external links when needed (they don't cause CORS issues as they're just URLs)
  const externalLinks = station.type !== 'twitch' ? getExternalLinks(station) : undefined;
  // Always fetch metadata for the current station to show album art
  const { metadata } = useStreamMetadata(streamUrl);

  // Switch station when prop changes, but don't auto-play
  useEffect(() => {
    console.log('🎯 AudioPlayerIntegrated: station prop changed to:', station);
    if (station && station.id !== currentStation?.id) {
      console.log('🎯 AudioPlayerIntegrated: switching to new station (no auto-play)');
      setCurrentStation(station);
    }
  }, [station, currentStation?.id, setCurrentStation]);

  const handlePlay = () => {
    console.log('🎯 AudioPlayerIntegrated handlePlay called');
    console.log('🎯 Current station:', currentStation?.id, 'Target station:', station?.id);
    console.log('🎯 Is playing:', isPlaying);
    
    try {
      if (!station) {
        console.error('🎯 ERROR: station prop is null/undefined!');
        return;
      }
      
      // Station should already be set by useEffect, just toggle play
      console.log('🎯 Calling togglePlay directly');
      togglePlay();
      console.log('🎯 handlePlay completed');
    } catch (error) {
      console.error('🎯 Error in handlePlay:', error);
    }
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

  // Use HTML5 audio player for all streams now
  if (false) { // Disable iframe approach
    return (
      <Card className="bg-gradient-card border-border/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {/* Header with title and description */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1">{station.name}</h3>
              <p className="text-muted-foreground">{station.currentTrack || 'Now Playing'}</p>
              {station.isLive && (
                <div className="inline-flex bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold animate-pulse mt-2">
                  LIVE
                </div>
              )}
            </div>

            {/* Debug info */}
            <div className="text-xs text-muted-foreground text-center">
              Loading: {streamUrl}
            </div>

            {/* Embedded Radio Player */}
            <div className="w-full h-64 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center">
              <iframe 
                src={streamUrl}
                className="w-full h-full border-0"
                title={station.name}
                allow="autoplay"
                allowFullScreen={false}
                onLoad={() => console.log('Iframe loaded successfully')}
                onError={() => console.log('Iframe failed to load')}
              >
                <p>Your browser does not support iframes. Please use the external links below.</p>
              </iframe>
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
          {/* Album Art & Visualizer */}
          <div className="flex-shrink-0">
            <div className="relative w-full lg:w-64 h-64 rounded-lg overflow-hidden bg-gradient-primary/20">
              {metadata?.albumArt ? (
                <img 
                  src={metadata.albumArt} 
                  alt={`${metadata.title} by ${metadata.artist}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to logo background if album art fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 relative overflow-hidden"
                  style={{
                    backgroundImage: `url('/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                  
                  {/* Content overlay */}
                  <div className="relative z-10 flex flex-col items-center gap-4 pointer-events-none">
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-white drop-shadow-lg">Primal Radio</h4>
                      <p className="text-xs text-white/90 drop-shadow-md">...where it all starts</p>
                    </div>
                    
                    {/* Visualizer */}
                    <div className="flex items-end space-x-1 h-16">
                      {visualizerBars}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Visualizer overlay when playing */}
              {isCurrentlyPlaying && metadata?.albumArt && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
                  <div className="flex items-end space-x-1 h-12 opacity-80">
                    {visualizerBars.slice(0, 10)}
                  </div>
                </div>
              )}
              
              {station.isLive && (
                <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold animate-pulse">
                  LIVE
                </div>
              )}
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-1">
                {metadata?.title || station.name}
              </h3>
              <p className="text-muted-foreground">
                {metadata?.artist || station.currentTrack || 'Now Playing'}
              </p>
              {metadata?.album && (
                <p className="text-sm text-muted-foreground/70">
                  {metadata.album}
                </p>
              )}
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