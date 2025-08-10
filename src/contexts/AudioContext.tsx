import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { metadataService } from '@/services/metadataService';
import { Station } from "@/types/station";

interface AudioContextType {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'retrying';
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'retrying'>('disconnected');
  const audioRef = useRef<HTMLAudioElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const lastSuccessfulUrlRef = useRef<string>('');

  const getStreamUrl = (station: Station): string => {
    switch (station.id) {
      case 'primal-radio':
        return 'https://fast.citrus3.com:2020/stream/djgadaffiandfriends';
      case 'primal-radio-2':
        return 'https://azura.primal4k.com/listen/joelmooyoung/radio.mp3';
      case 'twitch-stream':
        return 'https://twitch.tv/primalradio';
      default:
        // Fallback: try to detect from station name or use default
        if (station.name?.toLowerCase().includes('radio 2') || station.name?.toLowerCase().includes('primal 2')) {
          return 'https://azura.primal4k.com/listen/joelmooyoung/radio.mp3';
        }
        return 'https://fast.citrus3.com:2020/stream/djgadaffiandfriends';
    }
  };

  const getFallbackUrls = (station: Station): string[] => {
    // Return array of fallback URLs for each station
    switch (station.id) {
      case 'primal-radio':
        return [
          'https://fast.citrus3.com:2020/stream/djgadaffiandfriends',
          'https://s1.citrus3.com:2020/stream/djgadaffiandfriends'
        ];
      case 'primal-radio-2':
        return [
          'https://azura.primal4k.com/listen/joelmooyoung/radio.mp3',
          'https://s1.citrus3.com:2000/stream/primal4k'
        ];
      default:
        return [getStreamUrl(station)];
    }
  };

  const clearRetryTimeout = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  const calculateRetryDelay = (retryCount: number): number => {
    // Exponential backoff: 1s, 3s, 9s
    return Math.min(1000 * Math.pow(3, retryCount), 9000);
  };

  const resetRetryState = () => {
    retryCountRef.current = 0;
    clearRetryTimeout();
    setConnectionStatus('disconnected');
  };

  const attemptConnection = async (urls: string[], currentUrlIndex: number = 0): Promise<boolean> => {
    if (currentUrlIndex >= urls.length) {
      return false; // All URLs failed
    }

    const url = urls[currentUrlIndex];
    console.log(`🔄 Attempting connection to: ${url} (attempt ${currentUrlIndex + 1}/${urls.length})`);
    
    try {
      if (!audioRef.current) return false;
      
      // Clear any existing source and reload
      audioRef.current.src = '';
      audioRef.current.load();
      
      // Set new source with cache busting
      const cacheBustUrl = `${url}?t=${Date.now()}`;
      audioRef.current.src = cacheBustUrl;
      audioRef.current.load();
      
      // Wait for can play event or timeout
      const canPlayPromise = new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 10000); // 10s timeout
        
        const onCanPlay = () => {
          clearTimeout(timeout);
          audioRef.current?.removeEventListener('canplay', onCanPlay);
          audioRef.current?.removeEventListener('error', onError);
          resolve(true);
        };
        
        const onError = () => {
          clearTimeout(timeout);
          audioRef.current?.removeEventListener('canplay', onCanPlay);
          audioRef.current?.removeEventListener('error', onError);
          resolve(false);
        };
        
        audioRef.current?.addEventListener('canplay', onCanPlay, { once: true });
        audioRef.current?.addEventListener('error', onError, { once: true });
      });
      
      const canPlay = await canPlayPromise;
      
      if (canPlay) {
        lastSuccessfulUrlRef.current = url;
        console.log(`✅ Connection successful to: ${url}`);
        return true;
      } else {
        console.log(`❌ Connection failed to: ${url}, trying next URL`);
        return await attemptConnection(urls, currentUrlIndex + 1);
      }
    } catch (error) {
      console.log(`❌ Connection error for ${url}:`, error);
      return await attemptConnection(urls, currentUrlIndex + 1);
    }
  };

  const startPlaybackWithRetry = async (station: Station): Promise<void> => {
    setConnectionStatus('connecting');
    const urls = getFallbackUrls(station);
    
    const connectionSuccessful = await attemptConnection(urls);
    
    if (connectionSuccessful && audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setConnectionStatus('connected');
        resetRetryState();
        console.log('🎵 Playback started successfully');
      } catch (playError) {
        console.error('❌ Play failed despite successful connection:', playError);
        handleRetry(station);
      }
    } else {
      console.error('❌ All connection attempts failed');
      handleRetry(station);
    }
  };

  const handleRetry = (station: Station) => {
    if (retryCountRef.current >= 3) {
      console.error('❌ Max retry attempts reached, giving up');
      setIsPlaying(false);
      setConnectionStatus('disconnected');
      resetRetryState();
      return;
    }

    const delay = calculateRetryDelay(retryCountRef.current);
    retryCountRef.current++;
    setConnectionStatus('retrying');
    
    console.log(`🔄 Scheduling retry ${retryCountRef.current}/3 in ${delay}ms`);
    
    retryTimeoutRef.current = setTimeout(() => {
      if (currentStation?.id === station.id) { // Only retry if station hasn't changed
        console.log(`🔄 Executing retry ${retryCountRef.current}/3`);
        startPlaybackWithRetry(station);
      }
    }, delay);
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
        clearRetryTimeout();
        audioRef.current.pause();
        setIsPlaying(false);
        setConnectionStatus('disconnected');
        resetRetryState();
      } else {
        console.log('🎯 AudioContext: Starting audio playback with retry system');
        clearRetryTimeout();
        resetRetryState();
        await startPlaybackWithRetry(currentStation);
      }
    } catch (error) {
      console.error('🎯 AudioContext: Unexpected error in togglePlay:', error);
      setIsPlaying(false);
      setConnectionStatus('disconnected');
    }
  };

  const handleStationChange = (station: Station | null) => {
    console.log('🚨 AudioContext: handleStationChange called with station:', station);
    
    // COMPLETELY TERMINATE PREVIOUS STREAM AND CONNECTIONS
    clearRetryTimeout();
    resetRetryState();
    
    // Immediate UI feedback and complete audio termination
    setIsPlaying(false);
    setConnectionStatus('disconnected');
    
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRetryTimeout();
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentStation,
        isPlaying,
        volume,
        isMuted,
        connectionStatus,
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
          console.error('🎯 AudioContext: Error details:', {
            error: audio.error,
            code: audio.error?.code,
            message: audio.error?.message,
            networkState: audio.networkState,
            readyState: audio.readyState
          });
          
          setIsPlaying(false);
          
          // Only retry if we were actually trying to play
          if (connectionStatus === 'connecting' || connectionStatus === 'connected') {
            if (currentStation) {
              console.log('🔄 Audio error detected, initiating retry...');
              handleRetry(currentStation);
            }
          }
        }}
        onStalled={() => {
          console.warn('🎯 AudioContext: Audio stalled - network issue detected');
          if (connectionStatus === 'connected' && currentStation) {
            console.log('🔄 Stream stalled, attempting recovery...');
            setConnectionStatus('retrying');
            handleRetry(currentStation);
          }
        }}
        onSuspend={() => {
          console.warn('🎯 AudioContext: Audio suspended - possible connection issue');
          if (connectionStatus === 'connected') {
            setConnectionStatus('retrying');
          }
        }}
        onAbort={() => {
          console.warn('🎯 AudioContext: Audio aborted');
          setIsPlaying(false);
          if (connectionStatus !== 'disconnected') {
            setConnectionStatus('disconnected');
          }
        }}
        onWaiting={() => {
          console.log('🎯 AudioContext: Audio waiting for data...');
          if (connectionStatus === 'connected') {
            setConnectionStatus('retrying');
          }
        }}
        onCanPlayThrough={() => {
          console.log('🎯 AudioContext: Can play through - connection stable');
          if (connectionStatus !== 'connected' && isPlaying) {
            setConnectionStatus('connected');
          }
        }}
        onLoadStart={() => {
          console.log('🎯 AudioContext: Audio load started');
        }}
        onCanPlay={() => {
          console.log('🎯 AudioContext: Audio can play');
        }}
        onPlay={() => {
          console.log('🎯 AudioContext: Audio play event');
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
            audioRef.current.volume = volume / 100;
          }
        }}
      />
    </AudioContext.Provider>
  );
};