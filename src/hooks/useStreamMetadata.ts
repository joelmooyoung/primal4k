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
    
    const fetchMetadata = async () => {
      console.log('🎵 Attempting to fetch metadata...');
      setIsLoading(true);
      
      try {
        // Try different metadata endpoint patterns for Citrus3
        const baseUrl = streamUrl.replace('/stream/', '/').replace(/\/[^\/]*$/, '');
        const streamName = streamUrl.split('/').pop();
        
        console.log('🎵 Base URL:', baseUrl, 'Stream name:', streamName);
        
        const metadataUrls = [
          `${baseUrl}/stats?json=1`,
          `${baseUrl}/status-json.xsl`,
          `${baseUrl}/7.html`,
          `${baseUrl}/status.xsl?mount=/stream/${streamName}`,
        ];
        
        let metadataFound = false;
        
        for (const url of metadataUrls) {
          try {
            console.log('🎵 Trying metadata URL:', url);
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json, text/html',
              },
            });
            
            if (response.ok) {
              const contentType = response.headers.get('content-type');
              console.log('🎵 Response content type:', contentType);
              
              let data;
              if (contentType?.includes('application/json')) {
                data = await response.json();
                console.log('🎵 JSON metadata:', data);
              } else {
                const text = await response.text();
                console.log('🎵 HTML/XML metadata (first 200 chars):', text.substring(0, 200));
                
                // Try to extract metadata from HTML/XML
                if (text.includes('StreamTitle')) {
                  const titleMatch = text.match(/StreamTitle['"=\s]*([^'"<>&]+)/i);
                  if (titleMatch) {
                    console.log('🎵 Found StreamTitle:', titleMatch[1]);
                    const parts = titleMatch[1].split(' - ');
                    const metadata = {
                      title: parts.length > 1 ? parts[1] : titleMatch[1],
                      artist: parts.length > 1 ? parts[0] : 'Unknown Artist',
                      albumArt: '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png' // Default for now
                    };
                    console.log('🎵 Extracted metadata:', metadata);
                    setMetadata(metadata);
                    metadataFound = true;
                    break;
                  }
                }
              }
              
              if (data && !metadataFound) {
                // Handle JSON metadata
                console.log('🎵 Processing JSON metadata...');
                metadataFound = true;
                break;
              }
            }
          } catch (urlError) {
            console.log('🎵 URL failed:', url, urlError);
          }
        }
        
        if (!metadataFound) {
          throw new Error('No metadata endpoints accessible');
        }
        
      } catch (error) {
        console.log('🎵 All metadata attempts failed, using fallback:', error);
        // Fallback metadata
        const fallbackMetadata = {
          title: 'Live Stream',
          artist: 'Primal Radio',
          albumArt: '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
        };
        console.log('🎵 Setting fallback metadata:', fallbackMetadata);
        setMetadata(fallbackMetadata);
      } finally {
        setIsLoading(false);
      }
    };

    // Immediate fallback while we try to fetch real metadata
    setMetadata({
      title: 'Live Stream',
      artist: 'Primal Radio',
      albumArt: '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
    });
    
    fetchMetadata();
    
    // Refresh metadata every 30 seconds
    const interval = setInterval(fetchMetadata, 30000);
    return () => clearInterval(interval);
  }, [streamUrl]);

  return { metadata, isLoading };
};