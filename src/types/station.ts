export interface Station {
  id: string;
  name: string;
  type: string;
  icon: string;
  isLive: boolean;
  currentTrack?: string;
}