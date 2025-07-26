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
    this.loadCitrus3Widgets();
    this.startPolling();
  }

  private loadCitrus3Widgets() {
    // Load Citrus3 widget script if not already loaded
    if (!document.querySelector('script[src*="citrus3"]')) {
      const script = document.createElement('script');
      script.src = 'https://fast.citrus3.com:2020/system/streaminfo.js';
      script.onload = () => {
        console.log('🎵 Citrus3 widget script loaded');
        this.setupWidgetElements();
      };
      document.head.appendChild(script);
    } else {
      this.setupWidgetElements();
    }
  }

  private setupWidgetElements() {
    // Create hidden elements for Citrus3 widgets to populate
    if (!document.getElementById('citrus3-metadata')) {
      const container = document.createElement('div');
      container.id = 'citrus3-metadata';
      container.style.display = 'none';
      container.innerHTML = `
        <span id="citrus3-nowplaying" data-widget="mcp-custom-text" data-name="djgadaffiandfriends" data-format="%nowplaying%"></span>
        <span id="citrus3-connections" data-widget="mcp-custom-text" data-name="djgadaffiandfriends" data-format="%connections%"></span>
        <span id="citrus3-status" data-widget="mcp-stream-status" data-name="djgadaffiandfriends" data-online-text="Online" data-offline-text="Offline"></span>
        <img id="citrus3-cover" data-widget="mcp-cover-image" data-name="djgadaffiandfriends" style="display:none;" />
      `;
      document.body.appendChild(container);
    }
  }

  private startPolling() {
    // Poll for metadata updates every 5 seconds
    this.fetchMetadata();
    this.interval = setInterval(() => {
      this.fetchMetadata();
    }, 5000);
  }

  private async fetchMetadata() {
    try {
      // Try to read from Citrus3 widget elements
      const nowPlayingEl = document.getElementById('citrus3-nowplaying');
      const connectionsEl = document.getElementById('citrus3-connections');
      const statusEl = document.getElementById('citrus3-status');
      const coverEl = document.getElementById('citrus3-cover') as HTMLImageElement;

      if (nowPlayingEl && nowPlayingEl.textContent && nowPlayingEl.textContent.trim() !== '') {
        console.log('🎵 MetadataService: Found widget data:', nowPlayingEl.textContent);
        this.currentMetadata = this.parseWidgetData(
          nowPlayingEl.textContent,
          connectionsEl?.textContent || '0',
          statusEl?.textContent || 'Online',
          coverEl?.src || ''
        );
      } else {
        console.log('🎵 MetadataService: No widget data found, using basic metadata');
        this.currentMetadata = this.getBasicMetadata();
      }
    } catch (error) {
      console.log('🎵 MetadataService: Using basic metadata due to error:', error);
      this.currentMetadata = this.getBasicMetadata();
    }
    
    this.notifyListeners();
  }

  private parseWidgetData(nowPlaying: string, connections: string, status: string, coverUrl: string): StationMetadata {
    // Parse "Artist - Title" format
    const parts = nowPlaying.split(' - ');
    const artist = parts.length > 1 ? parts[0] : 'DJ Gadaffi and Friends';
    const title = parts.length > 1 ? parts[1] : nowPlaying || 'Live Stream';

    return {
      currentTrack: {
        title,
        artist,
        album: "Live Radio",
        albumArt: coverUrl || `${CITRUS3_CONFIG.baseUrl}/covers/${CITRUS3_CONFIG.stationName}.jpg`,
        duration: undefined,
        genre: "Electronic"
      },
      listeners: parseInt(connections) || 0,
      bitrate: "320 kbps",
      format: "MP3"
    };
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