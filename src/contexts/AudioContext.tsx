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
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  // Setup Web Audio API for volume normalization
  const setupAudioProcessing = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      gainNodeRef.current = audioContextRef.current.createGain();
      
      // Connect audio processing chain
      source.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      // Set initial gain for volume normalization
      gainNodeRef.current.gain.value = 1.0;
      
      console.log('🎵 AudioContext: Audio processing setup complete');
    } catch (error) {
      console.warn('🎵 AudioContext: Web Audio API not available, using fallback volume control:', error);
    }
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
    }
  };

  const handleStationChange = (station: Station | null) => {
    console.log('🚨 AudioContext: handleStationChange called with station:', station);
    console.trace('🚨 AudioContext: Call stack for station change:');
    
    // COMPLETELY TERMINATE PREVIOUS STREAM AND CONNECTIONS
    
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
    
    // Apply volume through both HTML5 audio and Web Audio API for better control
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    
    // Apply normalization through Web Audio API if available
    if (gainNodeRef.current) {
      // Apply gentle compression for Radio One to reduce fluctuations
      const normalizedGain = currentStation?.id === 'primal-radio' 
        ? Math.min((newVolume / 100) * 1.2, 1.0) // Slight boost with limit for Radio One
        : newVolume / 100;
      gainNodeRef.current.gain.value = normalizedGain;
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
          
        }}
        onStalled={() => {
          console.warn('🎯 AudioContext: Audio stalled - network issue detected');
        }}
        onSuspend={() => {
          console.warn('🎯 AudioContext: Audio suspended - possible connection issue');
        }}
        onAbort={() => {
          console.warn('🎯 AudioContext: Audio aborted');
          setIsPlaying(false);
        }}
        onLoadStart={() => {
          console.log('🎯 AudioContext: Audio load started');
          setupAudioProcessing();
        }}
        onCanPlay={() => {
          console.log('🎯 AudioContext: Audio can play');
          // Resume audio context if it was suspended
          if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
          }
        }}
        onPlay={() => {
          console.log('🎯 AudioContext: Audio play event');
          setupAudioProcessing();
        }}
        onPause={() => console.log('🎯 AudioContext: Audio pause event')}
        onVolumeChange={() => {
          if (audioRef.current) {
            console.log('🎯 AudioContext: Volume changed to:', audioRef.current.volume);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            console.log('🎯 AudioContext: Audio metadata loaded');
            // Ensure consistent volume after metadata loads and setup audio processing
            audioRef.current.volume = volume / 100;
            setupAudioProcessing();
            // Apply initial volume normalization
            handleVolumeChange(volume);
          }
        }}
      />
    </AudioContext.Provider>
  );
};