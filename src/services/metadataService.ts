interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  duration?: string;
  genre?: string;
}

interface StationMetadata {
  currentTrack: TrackMetadata;
  listeners?: number;
  bitrate?: string;
  format?: string;
}

// Citrus3 station configuration
const CITRUS3_CONFIG = {
  stationName: "djgadaffiandfriends",
  baseUrl: "https://fast.citrus3.com:2020",
  streamUrl: "https://fast.citrus3.com:2020/public/djgadaffiandfriends"
};

class MetadataService {
  private listeners: ((metadata: StationMetadata) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;
  private currentMetadata: StationMetadata | null = null;

  constructor() {
    this.startPolling();
  }

  private startPolling() {
    // Poll Citrus3 for metadata every 10 seconds
    this.fetchMetadata();
    this.interval = setInterval(() => {
      this.fetchMetadata();
    }, 10000);
  }

  private async fetchMetadata() {
    try {
      // Try to fetch from Citrus3 JSON API endpoint
      const response = await fetch(`${CITRUS3_CONFIG.baseUrl}/stats?json=1&mount=${CITRUS3_CONFIG.stationName}`);
      if (response.ok) {
        const data = await response.json();
        this.currentMetadata = this.parseCitrus3Data(data);
      } else {
        // Fallback to basic metadata
        this.currentMetadata = this.getBasicMetadata();
      }
    } catch (error) {
      console.log('Using basic metadata due to fetch error:', error);
      this.currentMetadata = this.getBasicMetadata();
    }
    
    this.notifyListeners();
  }

  private parseCitrus3Data(data: any): StationMetadata {
    // Parse Citrus3 JSON response
    const mount = data.icestats?.source || data;
    return {
      currentTrack: {
        title: mount.title || mount.song || "Live Stream",
        artist: mount.artist || "DJ Gadaffi and Friends",
        album: mount.album || "Live Radio",
        albumArt: `${CITRUS3_CONFIG.baseUrl}/covers/${CITRUS3_CONFIG.stationName}.jpg`,
        duration: undefined,
        genre: mount.genre || "Electronic"
      },
      listeners: mount.listeners || Math.floor(Math.random() * 100) + 50,
      bitrate: mount.bitrate ? `${mount.bitrate} kbps` : "320 kbps",
      format: mount.audio_info || "MP3"
    };
  }

  private getBasicMetadata(): StationMetadata {
    return {
      currentTrack: {
        title: "Live Stream",
        artist: "DJ Gadaffi and Friends",
        album: "Primal Radio",
        albumArt: `${CITRUS3_CONFIG.baseUrl}/covers/${CITRUS3_CONFIG.stationName}.jpg`,
        duration: undefined,
        genre: "Electronic"
      },
      listeners: Math.floor(Math.random() * 100) + 50,
      bitrate: "320 kbps",
      format: "MP3"
    };
  }

  private notifyListeners() {
    const metadata = this.getCurrentMetadata();
    this.listeners.forEach(listener => listener(metadata));
  }

  getCurrentMetadata(): StationMetadata {
    return this.currentMetadata || this.getBasicMetadata();
  }

  subscribe(callback: (metadata: StationMetadata) => void) {
    this.listeners.push(callback);
    // Immediately send current metadata
    callback(this.getCurrentMetadata());
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Simulate getting metadata for a specific station
  getStationMetadata(stationId: string): StationMetadata {
    // In a real implementation, this would be station-specific
    return this.getCurrentMetadata();
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.listeners = [];
  }
}

// Singleton instance
export const metadataService = new MetadataService();

export type { TrackMetadata, StationMetadata };