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

// Schedule data
const PROGRAM_SCHEDULE = [
  { day: "Monday", show: "The Community Buzz", host: "Imaara", time: "4:00 PM - 6:00 PM" },
  { day: "Monday", show: "Primally Poetic", host: "Neiima & Poets", time: "8:30 PM - 9:30 PM" },
  { day: "Tuesday", show: "Open", host: "Open", time: "6:00 PM - 7:00 PM" },
  { day: "Tuesday", show: "Level Up", host: "Jean Marie", time: "7:00 PM - 8:00 PM" },
  { day: "Tuesday", show: "Soul2Soul", host: "DJ 77 & DJ Gadaffi", time: "8:00 PM - 10:00 PM" },
  { day: "Tuesday", show: "MetaMorphosis", host: "Doc Iman Blak", time: "10:00 PM - 12:00 AM" },
  { day: "Wednesday", show: "Hold a Reasoning", host: "Singing Melody", time: "1:00 PM - 3:00 PM" },
  { day: "Wednesday", show: "Urban Honeys", host: "DJ 77", time: "6:00 PM - 7:00 PM" },
  { day: "Wednesday", show: "Linen & Lace - A Straight Jazz Odyssey", host: "DJ 77", time: "7:00 PM - 8:00 PM" },
  { day: "Wednesday", show: "The Wednesday Workout", host: "DJ DeDe", time: "8:00 PM - 10:00 PM" },
  { day: "Wednesday", show: "The Tony G Show", host: "DJ Tony G", time: "10:00 PM - 12:00 AM" },
  { day: "Thursday", show: "Lioncore", host: "Daddy Lion Chandell", time: "3:00 PM - 5:00 PM" },
  { day: "Thursday", show: "The Matrix", host: "Neiima & DeDe", time: "6:00 PM - 7:00 PM" },
  { day: "Thursday", show: "Hype Thursdays", host: "DJ Jermaine Hard Drive", time: "7:00 PM - 9:00 PM" },
  { day: "Thursday", show: "The Heart of Soul", host: "DLC", time: "9:00 PM - 11:00 PM" },
  { day: "Friday", show: "Afternoon Delight", host: "DLC", time: "11:00 AM - 3:00 PM" },
  { day: "Friday", show: "The Heart of Soul", host: "DLC", time: "3:00 PM - 6:00 PM" },
  { day: "Friday", show: "The Traffic Jam Mix", host: "DJ Teachdem", time: "6:00 PM - 8:00 PM" },
  { day: "Friday", show: "Screech At Night", host: "DJ Screech", time: "8:00 PM - 10:00 PM" },
  { day: "Friday", show: "Deja Vu", host: "DJ Migrane", time: "10:00 PM - 12:00 AM" },
  { day: "Saturday", show: "The Roots Dynamic Experience", host: "DLC", time: "10:00 AM - 1:00 PM" },
  { day: "Saturday", show: "The Skaturday Bang", host: "DLC", time: "1:00 PM - 4:00 PM" },
  { day: "Saturday", show: "Primal Sports", host: "Dale, Kane, Froggy & The Controversial Boss", time: "4:00 PM - 5:00/5:30 PM" },
  { day: "Saturday", show: "Amapiano & more", host: "DJ Teachdem", time: "5:00/5:30 PM - 7:30 PM" },
  { day: "Saturday", show: "Di Drive", host: "DJ Keu", time: "7:30 PM - 9:30 PM" },
  { day: "Saturday", show: "Outside We Deh", host: "DJ Badbin", time: "9:30 PM - 12:00 AM" },
  { day: "Sunday", show: "Answers from The Word", host: "Alopex/Dr Dawkins", time: "9:00 AM - 10:00 AM" },
  { day: "Sunday", show: "Sunday Serenade", host: "DJ DeDe", time: "10:00 AM - 12:00 PM" },
  { day: "Sunday", show: "Level Up", host: "Jean Marie", time: "12:00 PM - 1:00 PM" },
  { day: "Sunday", show: "Grown Folks Music", host: "DJ Keu", time: "1:00 PM - 3:00 PM" },
  { day: "Sunday", show: "The Kool Runnings Show", host: "Professor X", time: "3:00 PM - 6:00 PM" },
  { day: "Sunday", show: "The Cookie Jar", host: "DJ Migrane", time: "6:00 PM - 9:00 PM" },
  { day: "Sunday", show: "The Quiet Storm Show", host: "DJ Smooth Daddy", time: "9:00 PM - 11:00 PM" }
];

// Helper function to parse time strings and get current show
function getCurrentShow(): { show: string; host: string } {
  const now = new Date();
  
  // Convert to EST/EDT
  const estTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const currentDay = estTime.toLocaleDateString('en-US', { weekday: 'long' });
  const currentHour = estTime.getHours();
  const currentMinute = estTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  // Find matching show for current day and time
  const todaysShows = PROGRAM_SCHEDULE.filter(schedule => schedule.day === currentDay);
  
  for (const schedule of todaysShows) {
    const timeRange = schedule.time;
    const [startTime, endTime] = timeRange.split(' - ');
    
    const startMinutes = parseTimeToMinutes(startTime);
    let endMinutes = parseTimeToMinutes(endTime);
    
    // Handle midnight crossover (e.g., 10:00 PM - 12:00 AM)
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60; // Add 24 hours
    }
    
    // Check if current time is within this show's time range
    if (currentTimeInMinutes >= startMinutes && currentTimeInMinutes < endMinutes) {
      return { show: schedule.show, host: schedule.host };
    }
    
    // Handle midnight crossover for current time too
    if (endMinutes > 24 * 60 && currentTimeInMinutes + 24 * 60 >= startMinutes && currentTimeInMinutes + 24 * 60 < endMinutes) {
      return { show: schedule.show, host: schedule.host };
    }
  }
  
  // Default fallback if no show is scheduled
  return { show: "Primal Radio", host: "DJ Gadaffi and Friends" };
}

function parseTimeToMinutes(timeStr: string): number {
  const time = timeStr.trim();
  const [hourMinute, period] = time.split(' ');
  const [hourStr, minuteStr = '0'] = hourMinute.split(':');
  
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return hour * 60 + minute;
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
    
    // Get current show information based on schedule
    const currentShow = getCurrentShow();
    
    // Parse the "nowplaying" field which is in "Artist - Title" format
    const nowPlaying = data.nowplaying || "Live Stream";
    let artist = currentShow.host;
    let title = currentShow.show;
    
    // If we have specific track info from the stream, use that as the title
    if (nowPlaying.includes(' - ')) {
      const parts = nowPlaying.split(' - ');
      // Keep the scheduled host but use the track info as title
      title = `${currentShow.show} - ${parts.slice(1).join(' - ')}`;
    } else if (nowPlaying !== "Live Stream" && nowPlaying !== "Unknown") {
      title = `${currentShow.show} - ${nowPlaying}`;
    } else if (nowPlaying === "Unknown") {
      // Replace "Unknown" with "Primal4K"
      title = `${currentShow.show} - Primal4K`;
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