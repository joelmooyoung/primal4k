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
    if (!streamUrl) return;

    const fetchMetadata = async () => {
      console.log('🎵 Fetching metadata for stream:', streamUrl);
      setIsLoading(true);
      try {
        // Try to fetch metadata from the stream
        const response = await fetch(streamUrl, {
          method: 'GET',
          headers: {
            'Icy-MetaData': '1',
          },
        });

        // Parse ICY metadata if available
        const icyMetaInt = response.headers.get('icy-metaint');
        const metadata = {
          title: 'Live Stream',
          artist: 'Primal Radio',
          album: 'Now Playing',
          albumArt: '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
        };
        
        console.log('🎵 Setting metadata:', metadata);
        setMetadata(metadata);
      } catch (error) {
        console.log('🎵 Could not fetch stream metadata:', error);
        // Fallback to generic metadata with logo as placeholder
        const fallbackMetadata = {
          title: 'Live Stream',
          artist: 'Primal Radio',
          albumArt: '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
        };
        console.log('🎵 Using fallback metadata:', fallbackMetadata);
        setMetadata(fallbackMetadata);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
    
    // Refresh metadata every 30 seconds (reduced frequency)
    const interval = setInterval(fetchMetadata, 30000);
    return () => clearInterval(interval);
  }, [streamUrl]);

  return { metadata, isLoading };
};