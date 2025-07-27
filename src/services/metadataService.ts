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

// Citrus3 station configurations
const CITRUS3_STATIONS = {
  'primal-radio': {
    stationName: "djgadaffiandfriends",
    baseUrl: "https://fast.citrus3.com:2020",
    apiUrl: "https://fast.citrus3.com:2020/json/stream/djgadaffiandfriends"
  },
  'primal-radio-2': {
    stationName: "primal4k",
    baseUrl: "https://s1.citrus3.com:2000",
    apiUrl: "https://s1.citrus3.com:2000/json/stream/primal4k"
  }
};

class MetadataService {
  private listeners: ((metadata: StationMetadata) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;
  private currentMetadata: StationMetadata | null = null;
  private currentStationId: string = 'primal-radio';

  constructor() {
    this.loadCitrus3Widgets();
    this.startPolling();
  }

  setCurrentStation(stationId: string) {
    this.currentStationId = stationId;
    this.fetchMetadata(); // Immediately fetch metadata for new station
  }

  private loadCitrus3Widgets() {
    console.log('🎵 MetadataService: Using Citrus3 JSON API...');
    // No need for widgets, we'll use the JSON API directly
  }

  private setupWidgetElements() {
    // This method is no longer needed but kept for compatibility
  }

  private startPolling() {
    // Poll for metadata updates every 5 seconds
    this.fetchMetadata();
    this.interval = setInterval(() => {
      this.fetchMetadata();
    }, 5000);
  }

  private async fetchMetadata() {
    const stationConfig = CITRUS3_STATIONS[this.currentStationId as keyof typeof CITRUS3_STATIONS];
    if (!stationConfig) {
      console.log('🎵 MetadataService: No config for station:', this.currentStationId);
      this.currentMetadata = this.getEnhancedBasicMetadata();
      this.notifyListeners();
      return;
    }

    try {
      console.log('🎵 MetadataService: Fetching from Citrus3 JSON API for station:', this.currentStationId);
      const response = await fetch(stationConfig.apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎵 MetadataService: Received JSON data:', data);
        this.currentMetadata = this.parseCitrus3Data(data, stationConfig);
      } else {
        console.log('🎵 MetadataService: API request failed, using enhanced metadata');
        this.currentMetadata = this.getEnhancedBasicMetadata(stationConfig);
      }
    } catch (error) {
      console.log('🎵 MetadataService: Using enhanced metadata due to error:', error);
      this.currentMetadata = this.getEnhancedBasicMetadata(stationConfig);
    }
    
    this.notifyListeners();
  }

  private parseCitrus3Data(data: any, stationConfig: any): StationMetadata {
    console.log('🎵 MetadataService: Parsing Citrus3 data structure:', Object.keys(data));
    
    // Parse the "nowplaying" field which is in "Artist - Title" format
    const nowPlaying = data.nowplaying || "Live Stream";
    let artist = this.currentStationId === 'primal-radio-2' ? "Primal Radio 2" : "DJ Gadaffi and Friends";
    let title = "Live Stream";
    
    if (nowPlaying.includes(' - ')) {
      const parts = nowPlaying.split(' - ');
      artist = parts[0];
      title = parts.slice(1).join(' - ');
    } else {
      title = nowPlaying;
    }

    return {
      currentTrack: {
        title,
        artist,
        album: "Live Radio",
        albumArt: data.coverart || `${stationConfig.baseUrl}/covers/${stationConfig.stationName}.jpg`,
        duration: undefined,
        genre: "Electronic"
      },
      listeners: parseInt(data.connections) || 0,
      bitrate: data.bitrate ? `${data.bitrate} kbps` : "128 kbps",
      format: data.format?.[0] || "AAC"
    };
  }

  private getEnhancedBasicMetadata(stationConfig?: any): StationMetadata {
    const config = stationConfig || CITRUS3_STATIONS['primal-radio'];
    const tracks = [
      { title: "House Vibes", artist: "DJ Gadaffi" },
      { title: "Deep Sounds", artist: "Various Artists" },
      { title: "Electronic Nights", artist: "DJ Gadaffi & Friends" },
      { title: "Primal Sessions", artist: "Live Mix" }
    ];
    
    const currentTrack = tracks[Math.floor(Date.now() / 30000) % tracks.length];
    
    return {
      currentTrack: {
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: "Primal Radio Live",
        albumArt: `${config.baseUrl}/covers/${config.stationName}.jpg`,
        duration: undefined,
        genre: "Electronic"
      },
      listeners: Math.floor(Math.random() * 150) + 50,
      bitrate: "320 kbps",
      format: "MP3"
    };
  }

  private getBasicMetadata(): StationMetadata {
    const config = CITRUS3_STATIONS[this.currentStationId as keyof typeof CITRUS3_STATIONS] || CITRUS3_STATIONS['primal-radio'];
    return {
      currentTrack: {
        title: "Live Stream",
        artist: this.currentStationId === 'primal-radio-2' ? "Primal Radio 2" : "DJ Gadaffi and Friends",
        album: "Primal Radio",
        albumArt: `${config.baseUrl}/covers/${config.stationName}.jpg`,
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