import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

import { Station } from "@/types/station";

interface AudioContextType {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  setCurrentStation: (station: Station | null) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  getStreamUrl: (station: Station) => string;
  getExternalLinks: (station: Station) => { winamp?: string; vlc?: string; itunes?: string } | undefined;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentStation, setCurrentStation] = useState<Station | null>(() => {
    try {
      const saved = localStorage.getItem('currentStation');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('volume');
      return saved ? parseInt(saved, 10) : 80;
    } catch {
      return 80;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const getStreamUrl = (station: Station): string => {
    switch (station.id) {
      case 'primal-radio':
        // Try multiple stream URL formats
        return 'https://fast.citrus3.com:2020/stream/djgadaffiandfriends';
      case 'primal-radio-2':
        return 'https://s1.citrus3.com:2000/stream/primal4k';
      case 'twitch-stream':
        return 'https://twitch.tv/primalradio';
      default:
        // Fallback: try to detect from station name or use default
        if (station.name?.toLowerCase().includes('radio 2') || station.name?.toLowerCase().includes('primal 2')) {
          return 'https://s1.citrus3.com:2000/stream/primal4k';
        }
        return 'https://fast.citrus3.com:2020/stream/djgadaffiandfriends';
    }
  };

  const getExternalLinks = (station: Station) => {
    if (station.type === 'twitch') return undefined;
    
    const playlistUrls = {
      'primal-radio': 'https://fast.citrus3.com:2020/tunein/djgadaffiandfriends/stream/pls',
      'primal-radio-2': 'https://s1.citrus3.com:2000/tunein/primal4k/stream/pls'
    };
    
    const playlistUrl = playlistUrls[station.id as keyof typeof playlistUrls] || playlistUrls['primal-radio'];
    return {
      winamp: playlistUrl,
      vlc: playlistUrl,
      itunes: playlistUrl
    };
  };

  const togglePlay = async () => {
    console.log('🎯 AudioContext: togglePlay called - currentStation:', currentStation, 'isPlaying:', isPlaying);
    if (!audioRef.current || !currentStation) return;
    
    try {
      if (isPlaying) {
        console.log('🎯 AudioContext: Pausing audio');
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log('🎯 AudioContext: Starting audio playback');
        const streamUrl = getStreamUrl(currentStation);
        console.log('🎯 AudioContext: Stream URL:', streamUrl);
        
        // Test if stream URL is accessible
        console.log('🎯 AudioContext: Testing stream accessibility...');
        
        if (audioRef.current.src !== streamUrl) {
          audioRef.current.src = streamUrl;
          audioRef.current.load();
        }
        
        console.log('🎯 AudioContext: Attempting to play...');
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('🎯 AudioContext: Audio started successfully');
      }
    } catch (error) {
      console.error('🎯 AudioContext: Audio error:', error);
      console.error('🎯 AudioContext: Audio element state:', {
        src: audioRef.current?.src,
        readyState: audioRef.current?.readyState,
        networkState: audioRef.current?.networkState,
        error: audioRef.current?.error
      });
      setIsPlaying(false);
    }
  };

  const handleStationChange = (station: Station | null) => {
    console.log('🚨 AudioContext: handleStationChange called with station:', station);
    console.trace('🚨 AudioContext: Call stack for station change:');
    // Clear any pending switch
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
    }
    
    // Immediate UI feedback
    setIsPlaying(false);
    
    // Throttle the actual switching to prevent browser overload
    switchTimeoutRef.current = setTimeout(async () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        // Small delay for cleanup
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      setCurrentStation(station);
      if (station) {
        localStorage.setItem('currentStation', JSON.stringify(station));
      } else {
        localStorage.removeItem('currentStation');
      }
    }, 100); // Wait 100ms before actually switching
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem('volume', newVolume.toString());
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <AudioContext.Provider
      value={{
        currentStation,
        isPlaying,
        volume,
        isMuted,
        setCurrentStation: handleStationChange,
        togglePlay,
        setVolume: handleVolumeChange,
        toggleMute,
        getStreamUrl,
        getExternalLinks,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('🎯 AudioContext: Audio element error:', e);
          setIsPlaying(false);
        }}
        onLoadStart={() => console.log('🎯 AudioContext: Audio load started')}
        onCanPlay={() => console.log('🎯 AudioContext: Audio can play')}
        onPlay={() => console.log('🎯 AudioContext: Audio play event')}
        onPause={() => console.log('🎯 AudioContext: Audio pause event')}
      />
    </AudioContext.Provider>
  );
};