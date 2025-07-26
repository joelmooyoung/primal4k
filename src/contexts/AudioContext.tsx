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
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const getStreamUrl = (station: Station): string => {
    switch (station.id) {
      case 'primal-radio':
        return 'https://fast.citrus3.com:2020/stream/djgadaffiandfriends';
      case 'dj-live':
        return 'https://s1.citrus3.com:2000/stream/primal4k';
      case 'twitch-stream':
        return 'https://twitch.tv/primalradio';
      default:
        return 'https://fast.citrus3.com:2020/stream/djgadaffiandfriends';
    }
  };

  const getExternalLinks = (station: Station) => {
    if (station.type === 'twitch') return undefined;
    
    // Use the .pls playlist files for external players
    const playlistUrls = {
      'primal-radio': 'https://fast.citrus3.com:2020/tunein/djgadaffiandfriends/stream/pls',
      'dj-live': 'https://s1.citrus3.com:2000/tunein/primal4k/stream/pls'
    };
    
    const playlistUrl = playlistUrls[station.id as keyof typeof playlistUrls] || playlistUrls['primal-radio'];
    return {
      winamp: playlistUrl,
      vlc: playlistUrl,
      itunes: playlistUrl
    };
  };

  const togglePlay = async () => {
    console.log('togglePlay called, audioRef.current:', audioRef.current, 'currentStation:', currentStation);
    if (!audioRef.current || !currentStation) return;

    try {
      if (isPlaying) {
        console.log('Pausing audio');
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log('Playing audio, src:', audioRef.current.src);
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

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleStationChange = (station: Station | null) => {
    console.log('handleStationChange called with station:', station, 'current isPlaying:', isPlaying);
    if (audioRef.current && isPlaying) {
      console.log('Pausing current audio before station change');
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentStation(station);
  };

  useEffect(() => {
    console.log('useEffect: currentStation changed to:', currentStation);
    if (currentStation && audioRef.current) {
      const streamUrl = getStreamUrl(currentStation);
      console.log('Setting audio src to:', streamUrl);
      audioRef.current.src = streamUrl;
      audioRef.current.load();
    }
  }, [currentStation]);

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
      {/* Global audio element for all streams */}
      {currentStation && (
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
      )}
    </AudioContext.Provider>
  );
};