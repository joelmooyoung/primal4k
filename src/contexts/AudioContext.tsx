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
  // Track station changes for debugging
  const stationChangeCountRef = useRef(0);
  
  // Create audio element imperatively, outside React
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element once
  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.preload = "none";
  }
  
  // Initialize state from localStorage to persist across re-renders
  const [currentStation, setCurrentStation] = useState<Station | null>(() => {
    try {
      const saved = localStorage.getItem('currentStation');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isPlaying, setIsPlaying] = useState(() => {
    try {
      const saved = localStorage.getItem('isPlaying');
      console.log('🔄 Initializing isPlaying from localStorage:', saved);
      return saved === 'true';
    } catch {
      console.log('🔄 Failed to read isPlaying from localStorage, defaulting to false');
      return false;
    }
  });
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('volume');
      return saved ? parseInt(saved, 10) : 80;
    } catch {
      return 80;
    }
  });
  const [isMuted, setIsMuted] = useState(false);

  console.log('🎵 AudioProvider render - currentStation:', currentStation, 'isPlaying:', isPlaying);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const getStreamUrl = (station: Station): string => {
    console.log('🎵 getStreamUrl called with station:', station);
    console.log('🎵 Call stack:', new Error().stack);
    switch (station.id) {
      case 'primal-radio':
        console.log('🎵 Returning Primal Radio URL');
        return 'https://fast.citrus3.com:2020/stream/djgadaffiandfriends';
      case 'primal-radio-2':
        console.log('🎵 Returning Primal Radio 2 URL');
        return 'https://s1.citrus3.com:2000/stream/primal4k';
      case 'twitch-stream':
        console.log('🎵 Returning Twitch URL');
        return 'https://twitch.tv/primalradio';
      default:
        console.log('🎵 Using default Primal Radio URL for unknown station:', station.id);
        return 'https://fast.citrus3.com:2020/stream/djgadaffiandfriends';
    }
  };

  const getExternalLinks = (station: Station) => {
    if (station.type === 'twitch') return undefined;
    
    // Use the .pls playlist files for external players
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
    console.log('🎵 togglePlay called, audioRef.current:', audioRef.current, 'currentStation:', currentStation);
    
    if (!audioRef.current) {
      console.log('⚠️ No audio element found');
      return;
    }
    
    if (!currentStation) {
      console.log('⚠️ No current station selected, stopping any playing audio');
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('isPlaying', 'false');
      return;
    }

    try {
      if (isPlaying) {
        console.log('🔇 Pausing audio');
        audioRef.current.pause();
        setIsPlaying(false);
        localStorage.setItem('isPlaying', 'false');
        console.log('🔇 Set isPlaying to false in localStorage');
      } else {
        console.log('🔊 Playing audio, src:', audioRef.current.src);
        // Ensure the audio source is set correctly
        const streamUrl = getStreamUrl(currentStation);
        console.log('🔊 Stream URL for current station:', streamUrl);
        
        if (audioRef.current.src !== streamUrl) {
          console.log('🔄 Setting new audio source:', streamUrl);
          audioRef.current.src = streamUrl;
          audioRef.current.load();
        }
        
        console.log('🎵 Attempting to play audio...');
        await audioRef.current.play();
        console.log('✅ Audio play successful');
        
        // Set volume after play starts for live streams
        setTimeout(() => {
          if (audioRef.current && currentStation) {
            console.log('🔊 Setting volume to:', volume);
            audioRef.current.volume = volume / 100;
          }
        }, 500);
        setIsPlaying(true);
        localStorage.setItem('isPlaying', 'true');
        console.log('🔊 Set isPlaying to true in localStorage');
      }
    } catch (error) {
      console.error('🚨 Error playing audio:', error);
      console.error('🚨 Current station when error occurred:', currentStation);
      console.error('🚨 Audio src when error occurred:', audioRef.current?.src);
      
      // Attempt recovery by resetting the audio element
      console.log('🔧 Attempting audio recovery...');
      if (audioRef.current && currentStation) {
        try {
          audioRef.current.src = '';
          audioRef.current.load();
          const streamUrl = getStreamUrl(currentStation);
          audioRef.current.src = streamUrl;
          audioRef.current.load();
          console.log('🔧 Audio element reset for recovery');
        } catch (recoveryError) {
          console.error('🚨 Recovery failed:', recoveryError);
        }
      }
      
      setIsPlaying(false);
      localStorage.setItem('isPlaying', 'false');
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
      // Force volume update multiple times to ensure it sticks
      audioRef.current.volume = newVolume / 100;
      // Try setting volume again after a delay
      setTimeout(() => {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.volume = newVolume / 100;
        }
      }, 50);
    }
  };

  const handleStationChange = (station: Station | null) => {
    const timestamp = Date.now();
    console.log(`🔄 [${timestamp}] STATION CHANGE START - from:`, currentStation?.name, 'to:', station?.name);
    console.log(`🔄 [${timestamp}] Current playing state:`, isPlaying);
    console.log(`🔄 [${timestamp}] Audio element exists:`, !!audioRef.current);
    console.log(`🔄 [${timestamp}] Audio element state:`, {
      paused: audioRef.current?.paused,
      src: audioRef.current?.src,
      readyState: audioRef.current?.readyState
    });
    
    // Track how many times this function is called
    stationChangeCountRef.current += 1;
    console.log(`🔄 [${timestamp}] Station change count:`, stationChangeCountRef.current);
    
    // Immediately stop playing
    console.log(`🔄 [${timestamp}] Setting isPlaying to false`);
    setIsPlaying(false);
    localStorage.setItem('isPlaying', 'false');
    
    // Simple cleanup - just stop and clear
    if (audioRef.current) {
      console.log(`🔄 [${timestamp}] Pausing and clearing audio`);
      audioRef.current.pause();
      audioRef.current.src = '';
      console.log(`🔄 [${timestamp}] Audio cleaned up`);
    }
    
    // Set new station
    console.log(`🔄 [${timestamp}] Setting new station in state`);
    setCurrentStation(station);
    if (station) {
      localStorage.setItem('currentStation', JSON.stringify(station));
    } else {
      localStorage.removeItem('currentStation');
    }
    
    console.log(`🔄 [${timestamp}] STATION CHANGE COMPLETE`);
  };

  // Remove the useEffect that sets src immediately on station change
  // We'll set the src only when user tries to play

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
      {/* Audio element is now created imperatively outside of React */}
    </AudioContext.Provider>
  );
};