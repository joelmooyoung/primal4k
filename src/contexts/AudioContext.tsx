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
        return 'https://fast.citrus3.com:2020/AudioPlayer/djgadaffiandfriends?mount=&';
      case 'dj-live':
        return 'https://s1.citrus3.com:2000/AudioPlayer/primal4k?mount=&';
      case 'twitch-stream':
        return 'https://twitch.tv/primalradio';
      default:
        return 'https://fast.citrus3.com:2020/AudioPlayer/djgadaffiandfriends?mount=&';
    }
  };

  const getExternalLinks = (station: Station) => {
    if (station.type === 'twitch') return undefined;
    
    const streamUrl = getStreamUrl(station);
    return {
      winamp: streamUrl,
      vlc: streamUrl,
      itunes: streamUrl
    };
  };

  const togglePlay = async () => {
    if (!audioRef.current || !currentStation) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
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
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentStation(station);
  };

  useEffect(() => {
    if (currentStation && audioRef.current) {
      const streamUrl = getStreamUrl(currentStation);
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