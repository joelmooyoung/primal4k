import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { metadataService } from '@/services/metadataService';
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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;
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

  const attemptReconnect = async () => {
    if (!audioRef.current || !currentStation || reconnectAttemptsRef.current >= maxReconnectAttempts) {
      return;
    }

    reconnectAttemptsRef.current++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 10000); // Exponential backoff, max 10s
    
    console.log(`🔄 AudioContext: Reconnect attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`);
    
    reconnectTimeoutRef.current = setTimeout(async () => {
      if (!audioRef.current || !currentStation) return;
      
      try {
        // Force reload the stream
        const streamUrl = getStreamUrl(currentStation);
        audioRef.current.src = '';
        await new Promise(resolve => setTimeout(resolve, 100)); // Brief pause
        audioRef.current.src = streamUrl;
        audioRef.current.load();
        
        console.log('🔄 AudioContext: Attempting reconnect play...');
        await audioRef.current.play();
        setIsPlaying(true);
        reconnectAttemptsRef.current = 0; // Reset on success
        console.log('✅ AudioContext: Reconnection successful');
      } catch (error) {
        console.error('🔄 AudioContext: Reconnect failed:', error);
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          attemptReconnect(); // Try again
        } else {
          console.error('🔴 AudioContext: Max reconnect attempts reached');
          setIsPlaying(false);
        }
      }
    }, delay);
  };

  const togglePlay = async () => {
    console.log('🎯 AudioContext: togglePlay called - currentStation:', currentStation, 'isPlaying:', isPlaying);
    if (!audioRef.current || !currentStation) return;
    
    // Clear any ongoing reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
    
    try {
      if (isPlaying) {
        console.log('🎯 AudioContext: Pausing audio');
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log('🎯 AudioContext: Starting audio playback');
        const streamUrl = getStreamUrl(currentStation);
        console.log('🎯 AudioContext: Stream URL:', streamUrl);
        
        // Force fresh connection for better reliability
        if (audioRef.current.src !== streamUrl) {
          audioRef.current.src = streamUrl;
          audioRef.current.load();
        } else {
          // Even if same URL, reload to ensure fresh connection
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
      
      // Attempt automatic reconnection for network errors
      if (error instanceof Error && (
        error.name === 'NotSupportedError' ||
        error.message.includes('network') ||
        error.message.includes('NETWORK_') ||
        audioRef.current?.error?.code === MediaError.MEDIA_ERR_NETWORK
      )) {
        console.log('🔄 AudioContext: Network error detected, attempting reconnection...');
        attemptReconnect();
      }
    }
  };

  const handleStationChange = (station: Station | null) => {
    console.log('🚨 AudioContext: handleStationChange called with station:', station);
    console.trace('🚨 AudioContext: Call stack for station change:');
    
    // COMPLETELY TERMINATE PREVIOUS STREAM AND CONNECTIONS
    // Clear any pending switch
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }
    
    // Clear any ongoing reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
    
    // Immediate UI feedback and complete audio termination
    setIsPlaying(false);
    
    if (audioRef.current) {
      // Force complete termination of current stream
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load(); // Force reload to clear any cached data
    }
    
    // Immediate station switch - no throttling needed for complete termination
    setCurrentStation(station);
    if (station) {
      localStorage.setItem('currentStation', JSON.stringify(station));
      // Update metadata service with new station
      console.log('🚨 AudioContext: Updating metadata service with station:', station.id);
      metadataService.setCurrentStation(station.id);
    } else {
      localStorage.removeItem('currentStation');
    }
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
      // Add audio normalization to help with volume consistency
      audioRef.current.preload = 'metadata';
    }
  }, [volume]);

  // Initialize metadata service with current station on mount
  useEffect(() => {
    if (currentStation) {
      console.log('🚨 AudioContext: Initializing metadata service with station:', currentStation.id);
      metadataService.setCurrentStation(currentStation.id);
    }
  }, []);

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
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('🎯 AudioContext: Audio element error:', e);
          const audio = e.target as HTMLAudioElement;
          setIsPlaying(false);
          
          // Handle network errors with automatic reconnection
          if (audio.error) {
            console.error('🎯 AudioContext: Media error code:', audio.error.code);
            if (audio.error.code === MediaError.MEDIA_ERR_NETWORK || 
                audio.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
              console.log('🔄 AudioContext: Network/source error in audio element, attempting reconnection...');
              attemptReconnect();
            }
          }
        }}
        onStalled={() => {
          console.warn('🎯 AudioContext: Audio stalled - network issue detected');
          if (isPlaying) {
            attemptReconnect();
          }
        }}
        onSuspend={() => {
          console.warn('🎯 AudioContext: Audio suspended - possible connection issue');
        }}
        onAbort={() => {
          console.warn('🎯 AudioContext: Audio aborted');
          setIsPlaying(false);
        }}
        onLoadStart={() => console.log('🎯 AudioContext: Audio load started')}
        onCanPlay={() => console.log('🎯 AudioContext: Audio can play')}
        onPlay={() => console.log('🎯 AudioContext: Audio play event')}
        onPause={() => console.log('🎯 AudioContext: Audio pause event')}
        onVolumeChange={() => {
          if (audioRef.current) {
            console.log('🎯 AudioContext: Volume changed to:', audioRef.current.volume);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            console.log('🎯 AudioContext: Audio metadata loaded');
            // Ensure consistent volume after metadata loads
            audioRef.current.volume = volume / 100;
          }
        }}
      />
    </AudioContext.Provider>
  );
};