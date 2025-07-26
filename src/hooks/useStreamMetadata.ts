import { useState, useEffect } from 'react';
import { metadataService, type StationMetadata } from '@/services/metadataService';

export const useStreamMetadata = (streamUrl: string) => {
  const [metadata, setMetadata] = useState<StationMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!streamUrl) {
      setMetadata(null);
      return;
    }

    console.log('🎵 Setting up metadata for stream:', streamUrl);
    setIsLoading(true);
    
    // Subscribe to metadata updates
    const unsubscribe = metadataService.subscribe((newMetadata) => {
      console.log('🎵 Received metadata update:', newMetadata);
      setMetadata(newMetadata);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [streamUrl]);

  return { metadata, isLoading };
};