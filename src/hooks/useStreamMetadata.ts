import { useState, useEffect } from 'react';

interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  useLogoFallback: boolean;
}

export const useStreamMetadata = (streamUrl: string) => {
  const [metadata, setMetadata] = useState<TrackMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!streamUrl) return;

    const fetchMetadata = async () => {
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
        if (icyMetaInt) {
          // This would require more complex parsing for real implementation
          // For now, we'll simulate metadata with logo fallback
          setMetadata({
            title: 'Live Stream',
            artist: 'Primal Radio',
            album: 'Now Playing',
            albumArt: undefined, // No album art available
            useLogoFallback: true
          });
        } else {
          // No metadata available, use logo fallback
          setMetadata({
            title: 'Live Stream',
            artist: 'Primal Radio',
            albumArt: undefined,
            useLogoFallback: true
          });
        }
      } catch (error) {
        console.log('Could not fetch stream metadata:', error);
        // Fallback to generic metadata with logo
        setMetadata({
          title: 'Live Stream',
          artist: 'Primal Radio',
          albumArt: undefined,
          useLogoFallback: true
        });
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