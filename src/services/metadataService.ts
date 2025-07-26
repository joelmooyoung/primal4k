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

// Mock data for demonstration - in a real app, this would come from an API
const mockTrackData: TrackMetadata[] = [
  {
    title: "Summer Vibes",
    artist: "DJ Gadaffi",
    album: "Primal Sessions Vol. 1",
    albumArt: "/src/assets/dj-gadaffi.jpg",
    duration: "4:32",
    genre: "House"
  },
  {
    title: "Underground Dreams",
    artist: "DJ Craig",
    album: "Deep House Collection",
    albumArt: "/src/assets/dj-craig.jpg",
    duration: "5:45",
    genre: "Deep House"
  },
  {
    title: "Midnight Groove",
    artist: "DJ TeachDem",
    album: "The Learning Curve",
    albumArt: "/src/assets/dj-teachdem.jpg",
    duration: "6:12",
    genre: "Tech House"
  },
  {
    title: "Electric Nights",
    artist: "DJ Tony G",
    album: "Electro Waves",
    albumArt: "/src/assets/dj-tony-g.jpg",
    duration: "4:18",
    genre: "Electronic"
  },
  {
    title: "Bassline Revolution",
    artist: "DJ Dede",
    album: "Urban Sounds",
    albumArt: "/src/assets/dj-dede.jpg",
    duration: "5:30",
    genre: "UK Garage"
  }
];

class MetadataService {
  private currentTrackIndex = 0;
  private listeners: ((metadata: StationMetadata) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.startRotation();
  }

  private startRotation() {
    // Simulate track changes every 2 minutes for demo
    this.interval = setInterval(() => {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % mockTrackData.length;
      this.notifyListeners();
    }, 120000); // 2 minutes
  }

  private notifyListeners() {
    const metadata = this.getCurrentMetadata();
    this.listeners.forEach(listener => listener(metadata));
  }

  getCurrentMetadata(): StationMetadata {
    const currentTrack = mockTrackData[this.currentTrackIndex];
    return {
      currentTrack,
      listeners: Math.floor(Math.random() * 500) + 100, // Mock listener count
      bitrate: "320 kbps",
      format: "MP3"
    };
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