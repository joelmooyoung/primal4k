import { getDJImageForHost } from '@/utils/djImageMapping';
import { supabase } from '@/integrations/supabase/client';

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
  djImage?: string; // DJ image for scheduled shows
}

// Helper function to get current show from database
async function getCurrentShow(): Promise<{ show: string; host: string }> {
  try {
    const now = new Date();
    
    // Convert to EST/EDT
    const estTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const currentDay = estTime.getDay(); // 0 = Sunday, 6 = Saturday
    const currentHour = estTime.getHours();
    const currentMinute = estTime.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;
    
    console.log('🎵 getCurrentShow: Looking for show on day', currentDay, 'at time', currentTime);
    
    // Query schedule table for current day and time
    const { data: scheduleData, error } = await supabase
      .from('schedule')
      .select('show_name, host_name, start_time, end_time')
      .eq('day_of_week', currentDay)
      .order('start_time');
    
    if (error) {
      console.error('🎵 getCurrentShow: Database error:', error);
      return { show: "Primal4k.com", host: "PrimalMediaGroup.net" };
    }
    
    if (!scheduleData || scheduleData.length === 0) {
      console.log('🎵 getCurrentShow: No schedule data found for day', currentDay);
      return { show: "Primal4k.com", host: "PrimalMediaGroup.net" };
    }
    
    // Find the current show
    for (const schedule of scheduleData) {
      const startTime = schedule.start_time;
      const endTime = schedule.end_time;
      
      // Convert time strings to minutes for comparison
      const startMinutes = timeToMinutes(startTime);
      let endMinutes = timeToMinutes(endTime);
      const currentMinutes = currentHour * 60 + currentMinute;
      
      // Handle midnight crossover (e.g., 22:00 - 02:00)
      if (endMinutes <= startMinutes) {
        endMinutes += 24 * 60; // Add 24 hours
      }
      
      // Check if current time is within this show's time range
      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        console.log('🎵 getCurrentShow: Found current show:', schedule.show_name, 'by', schedule.host_name);
        return { show: schedule.show_name, host: schedule.host_name };
      }
      
      // Handle midnight crossover for current time too
      if (endMinutes > 24 * 60 && currentMinutes + 24 * 60 >= startMinutes && currentMinutes + 24 * 60 < endMinutes) {
        console.log('🎵 getCurrentShow: Found current show (midnight crossover):', schedule.show_name, 'by', schedule.host_name);
        return { show: schedule.show_name, host: schedule.host_name };
      }
    }
    
    console.log('🎵 getCurrentShow: No matching show found, using fallback');
    return { show: "Primal4k.com", host: "PrimalMediaGroup.net" };
    
  } catch (error) {
    console.error('🎵 getCurrentShow: Error fetching schedule:', error);
    return { show: "Primal4k.com", host: "PrimalMediaGroup.net" };
  }
}

// Helper function to convert time string to minutes
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
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
      this.currentMetadata = await this.getEnhancedBasicMetadata();
      this.notifyListeners();
      return;
    }

    try {
      console.log('🎵 MetadataService: Fetching from Citrus3 JSON API for station:', this.currentStationId);
      const response = await fetch(stationConfig.apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎵 MetadataService: Received JSON data:', data);
        this.currentMetadata = await this.parseCitrus3Data(data, stationConfig);
      } else {
        console.log('🎵 MetadataService: API request failed, using enhanced metadata');
        this.currentMetadata = await this.getEnhancedBasicMetadata(stationConfig);
      }
    } catch (error) {
      console.log('🎵 MetadataService: Using enhanced metadata due to error:', error);
      this.currentMetadata = await this.getEnhancedBasicMetadata(stationConfig);
    }
    
    this.notifyListeners();
  }

  private async parseCitrus3Data(data: any, stationConfig: any): Promise<StationMetadata> {
    console.log('🎵 MetadataService: Parsing Citrus3 data structure:', Object.keys(data));
    
    // Get current show information based on schedule
    const currentShow = await getCurrentShow();
    
    // Parse the "nowplaying" field which is in "Artist - Title" format
    const nowPlaying = data.nowplaying || "Live Stream";
    let artist: string;
    let title: string;
    
    // Check if we have a scheduled show (not the fallback)
    const hasScheduledShow = currentShow.show !== "Primal4k.com";
    
    // Get DJ image for scheduled show
    const djImage = hasScheduledShow ? getDJImageForHost(currentShow.host) : null;
    
    if (hasScheduledShow) {
      // If there's a scheduled show, use the host as artist and show as title
      artist = currentShow.host;
      title = currentShow.show;
      
      // If we have specific track info from the stream, append it to the show title
      if (nowPlaying.includes(' - ')) {
        const parts = nowPlaying.split(' - ');
        title = `${currentShow.show} - ${parts.slice(1).join(' - ')}`;
      } else if (nowPlaying !== "Live Stream" && nowPlaying !== "Unknown") {
        title = `${currentShow.show} - ${nowPlaying}`;
      } else if (nowPlaying === "Unknown") {
        title = `${currentShow.show} - Primal4K`;
      }
    } else {
      // No scheduled show - use actual song info if available
      if (nowPlaying.includes(' - ')) {
        const parts = nowPlaying.split(' - ');
        artist = parts[0];
        title = parts.slice(1).join(' - ');
      } else if (nowPlaying !== "Live Stream" && nowPlaying !== "Unknown") {
        artist = "Primal4k.com";
        title = nowPlaying;
      } else if (nowPlaying === "Unknown") {
        artist = "Primal4k.com";
        title = "Primal4K";
      } else {
        artist = "PrimalMediaGroup.net";
        title = "Primal4k.com";
      }
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
      format: data.format?.[0] || "AAC",
      djImage: djImage || undefined
    };
  }

  private async getEnhancedBasicMetadata(stationConfig?: any): Promise<StationMetadata> {
    const config = stationConfig || CITRUS3_STATIONS['primal-radio'];
    const tracks = [
      { title: "House Vibes", artist: "DJ Gadaffi" },
      { title: "Deep Sounds", artist: "Various Artists" },
      { title: "Electronic Nights", artist: "DJ Gadaffi & Friends" },
      { title: "Primal Sessions", artist: "Live Mix" }
    ];
    
    const currentTrack = tracks[Math.floor(Date.now() / 30000) % tracks.length];
    
    // Get current show information for DJ image
    const currentShow = await getCurrentShow();
    const hasScheduledShow = currentShow.show !== "Primal4k.com";
    const djImage = hasScheduledShow ? getDJImageForHost(currentShow.host) : null;
    
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
      format: "MP3",
      djImage: djImage || undefined
    };
  }

  private async getBasicMetadata(): Promise<StationMetadata> {
    const config = CITRUS3_STATIONS[this.currentStationId as keyof typeof CITRUS3_STATIONS] || CITRUS3_STATIONS['primal-radio'];
    
    // Get current show information for DJ image
    const currentShow = await getCurrentShow();
    const hasScheduledShow = currentShow.show !== "Primal4k.com";
    const djImage = hasScheduledShow ? getDJImageForHost(currentShow.host) : null;
    
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
      format: "MP3",
      djImage: djImage || undefined
    };
  }

  private notifyListeners() {
    const metadata = this.getCurrentMetadata();
    this.listeners.forEach(listener => listener(metadata));
  }

  getCurrentMetadata(): StationMetadata {
    return this.currentMetadata || {
      currentTrack: {
        title: "Live Stream",
        artist: this.currentStationId === 'primal-radio-2' ? "Primal Radio 2" : "DJ Gadaffi and Friends",
        album: "Primal Radio",
        albumArt: CITRUS3_STATIONS[this.currentStationId as keyof typeof CITRUS3_STATIONS]?.baseUrl + "/covers/" + CITRUS3_STATIONS[this.currentStationId as keyof typeof CITRUS3_STATIONS]?.stationName + ".jpg" || CITRUS3_STATIONS['primal-radio'].baseUrl + "/covers/" + CITRUS3_STATIONS['primal-radio'].stationName + ".jpg",
        duration: undefined,
        genre: "Electronic"
      },
      listeners: Math.floor(Math.random() * 100) + 50,
      bitrate: "320 kbps",
      format: "MP3",
      djImage: undefined
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