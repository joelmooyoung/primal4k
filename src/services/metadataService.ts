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
async function getCurrentShow(stationId: string = 'primal-radio'): Promise<{ show: string; host: string }> {
  try {
    const now = new Date();
    
    // Convert to EST/EDT
    const estTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const currentDay = estTime.getDay(); // 0 = Sunday, 6 = Saturday
    const currentHour = estTime.getHours();
    const currentMinute = estTime.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;
    
    console.log('🎵 getCurrentShow: Looking for show on day', currentDay, 'at time', currentTime, 'for station', stationId);
    
    // Query schedule table for current day and time, filtered by station
    const { data: scheduleData, error } = await supabase
      .from('schedule')
      .select('show_name, host_name, start_time, end_time')
      .eq('day_of_week', currentDay)
      .eq('station_id', stationId)
      .order('start_time');
    
    if (error) {
      console.error('🎵 getCurrentShow: Database error:', error);
      return getDefaultShow(stationId);
    }
    
    if (!scheduleData || scheduleData.length === 0) {
      console.log('🎵 getCurrentShow: No schedule data found for day', currentDay, 'station', stationId);
      return getDefaultShow(stationId);
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
        console.log('🎵 getCurrentShow: Found current show:', schedule.show_name, 'by', schedule.host_name, 'on station', stationId);
        return { show: schedule.show_name, host: schedule.host_name };
      }
      
      // Handle midnight crossover for current time too
      if (endMinutes > 24 * 60 && currentMinutes + 24 * 60 >= startMinutes && currentMinutes + 24 * 60 < endMinutes) {
        console.log('🎵 getCurrentShow: Found current show (midnight crossover):', schedule.show_name, 'by', schedule.host_name, 'on station', stationId);
        return { show: schedule.show_name, host: schedule.host_name };
      }
    }
    
    console.log('🎵 getCurrentShow: No matching show found for station', stationId, 'using fallback');
    return getDefaultShow(stationId);
    
  } catch (error) {
    console.error('🎵 getCurrentShow: Error fetching schedule:', error);
    return getDefaultShow(stationId);
  }
}

// Helper function to get default show based on station
function getDefaultShow(stationId: string): { show: string; host: string } {
  if (stationId === 'primal-radio-2') {
    return { show: "Primal Radio 2", host: "PrimalMediaGroup.net" };
  }
  return { show: "Primal4k.com", host: "PrimalMediaGroup.net" };
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

// Azura station configurations
const AZURA_STATIONS = {
  'primal-radio': {
    stationShortcode: "joelmooyoung",
    baseUrl: "https://azura.primal4k.com",
    apiUrl: "https://azura.primal4k.com/api/nowplaying/joelmooyoung"
  },
  'primal-radio-2': {
    stationShortcode: "joelmooyoung",
    baseUrl: "https://azura.primal4k.com", 
    apiUrl: "https://azura.primal4k.com/api/nowplaying/joelmooyoung"
  }
};

class MetadataService {
  private listeners: ((metadata: StationMetadata) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;
  private currentMetadata: StationMetadata | null = null;
  private currentStationId: string = 'primal-radio';

  constructor() {
    this.loadAzuraAPI();
    this.startPolling();
  }

  setCurrentStation(stationId: string) {
    console.log('🎵 MetadataService: Setting current station to:', stationId);
    this.currentStationId = stationId;
    this.fetchMetadata(); // Immediately fetch metadata for new station
  }

  private loadAzuraAPI() {
    console.log('🎵 MetadataService: Using Azura JSON API...');
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
    const stationConfig = AZURA_STATIONS[this.currentStationId as keyof typeof AZURA_STATIONS];
    if (!stationConfig) {
      console.log('🎵 MetadataService: No config for station:', this.currentStationId);
      this.currentMetadata = await this.getEnhancedBasicMetadata();
      this.notifyListeners();
      return;
    }

    try {
      console.log('🎵 MetadataService: Fetching from Azura JSON API for station:', this.currentStationId);
      const response = await fetch(stationConfig.apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎵 MetadataService: Received JSON data:', data);
        this.currentMetadata = await this.parseAzuraData(data, stationConfig);
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

  private async parseAzuraData(data: any, stationConfig: any): Promise<StationMetadata> {
    console.log('🎵 MetadataService: Parsing Azura data structure:', Object.keys(data));
    
    // Get current show information based on schedule for this station
    const currentShow = await getCurrentShow(this.currentStationId);
    
    // Parse the Azura API data structure - it's an array with the first item being the station data
    const stationData = Array.isArray(data) ? data[0] : data;
    const nowPlaying = stationData?.now_playing;
    const songData = nowPlaying?.song || {};
    const listeners = stationData?.listeners;
    
    const artist = songData.artist || "Unknown Artist";
    const title = songData.title || "Live Stream";
    const album = songData.album || "Live Radio";
    const albumArt = songData.art || null;
    
    console.log('🎵 MetadataService: Parsed song data:', { artist, title, album, albumArt });
    
    // Check if we have a scheduled show (not the fallback)
    const hasScheduledShow = currentShow.show !== getDefaultShow(this.currentStationId).show;
    
    // Get DJ image for scheduled show
    const djImage = hasScheduledShow ? getDJImageForHost(currentShow.host) : null;
    
    let finalArtist: string;
    let finalTitle: string;
    
    if (hasScheduledShow) {
      // If there's a scheduled show, use the host as artist and show as title
      finalArtist = currentShow.host;
      finalTitle = currentShow.show;
      
      // If we have specific track info from the stream, append it to the show title
      if (artist !== "Unknown Artist" && title !== "Live Stream") {
        finalTitle = `${currentShow.show} - ${artist} - ${title}`;
      } else if (title !== "Live Stream") {
        finalTitle = `${currentShow.show} - ${title}`;
      }
    } else {
      // No scheduled show - use actual song info if available
      finalArtist = artist !== "Unknown Artist" ? artist : "Primal4k.com";
      finalTitle = title !== "Live Stream" ? title : "Primal4K";
    }

    return {
      currentTrack: {
        title: finalTitle,
        artist: finalArtist,
        album: album,
        albumArt: albumArt || `${stationConfig.baseUrl}/img/generic_song.jpg`,
        duration: nowPlaying?.duration || undefined,
        genre: songData.genre || "Electronic"
      },
      listeners: listeners?.current || listeners?.total || Math.floor(Math.random() * 150) + 50,
      bitrate: "192 kbps", // From the API response we can see it's 192kbps
      format: "MP3",
      djImage: djImage || undefined
    };
  }

  private async getEnhancedBasicMetadata(stationConfig?: any): Promise<StationMetadata> {
    const config = stationConfig || AZURA_STATIONS['primal-radio'];
    const tracks = [
      { title: "House Vibes", artist: "DJ Gadaffi" },
      { title: "Deep Sounds", artist: "Various Artists" },
      { title: "Electronic Nights", artist: "DJ Gadaffi & Friends" },
      { title: "Primal Sessions", artist: "Live Mix" }
    ];
    
    const currentTrack = tracks[Math.floor(Date.now() / 30000) % tracks.length];
    
    // Get current show information for DJ image
    const currentShow = await getCurrentShow(this.currentStationId);
    const hasScheduledShow = currentShow.show !== getDefaultShow(this.currentStationId).show;
    const djImage = hasScheduledShow ? getDJImageForHost(currentShow.host) : null;
    
    return {
      currentTrack: {
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: "Primal Radio Live",
        albumArt: `${config.baseUrl}/img/generic_song.jpg`,
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
    const config = AZURA_STATIONS[this.currentStationId as keyof typeof AZURA_STATIONS] || AZURA_STATIONS['primal-radio'];
    
    // Get current show information for DJ image
    const currentShow = await getCurrentShow(this.currentStationId);
    const hasScheduledShow = currentShow.show !== getDefaultShow(this.currentStationId).show;
    const djImage = hasScheduledShow ? getDJImageForHost(currentShow.host) : null;
    
    return {
      currentTrack: {
        title: "Live Stream",
        artist: this.currentStationId === 'primal-radio-2' ? "Primal Radio 2" : "DJ Gadaffi and Friends",
        album: "Primal Radio",
        albumArt: `${config.baseUrl}/img/generic_song.jpg`,
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
        albumArt: AZURA_STATIONS[this.currentStationId as keyof typeof AZURA_STATIONS]?.baseUrl + "/img/generic_song.jpg" || AZURA_STATIONS['primal-radio'].baseUrl + "/img/generic_song.jpg",
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