import { useState, useEffect } from 'react';

interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
}

export const useStreamMetadata = (streamUrl: string) => {
  const [metadata, setMetadata] = useState<TrackMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!streamUrl) {
      setMetadata(null);
      return;
    }

    console.log('🎵 Setting up metadata for stream:', streamUrl);
    
    // Immediately set fallback metadata with album art
    const fallbackMetadata = {
      title: 'Live Stream',
      artist: 'Primal Radio',
      albumArt: '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
    };
    
    console.log('🎵 Setting fallback metadata:', fallbackMetadata);
    setMetadata(fallbackMetadata);
    setIsLoading(false);

    // Try to fetch real metadata in the background (optional)
    const tryFetchMetadata = async () => {
      try {
        // Try to fetch metadata from the stream
        const response = await fetch(streamUrl, {
          method: 'HEAD', // Use HEAD to avoid downloading stream data
          headers: {
            'Icy-MetaData': '1',
          },
        });

        // If successful and has metadata, could update here
        // For now, just log success
        console.log('🎵 Stream accessible, could fetch real metadata');
      } catch (error) {
        console.log('🎵 Stream not accessible for metadata (expected due to CORS):', error);
        // This is expected and OK - we already have fallback metadata set
      }
    };

    // Try fetching real metadata but don't wait for it
    tryFetchMetadata();
  }, [streamUrl]);

  return { metadata, isLoading };
};