import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Tv, Music } from "lucide-react";
import { Station } from "@/types/station";

interface StationSelectorProps {
  onStationChange: (station: Station) => void;
}

const StationSelector = ({ onStationChange }: StationSelectorProps) => {
  const stations: Station[] = [
    {
      id: 'primal-radio',
      name: 'Primal Radio',
      type: 'radio',
      icon: 'radio',
      isLive: true,
      currentTrack: 'Live Stream'
    },
    {
      id: 'dj-live',
      name: 'DJ Live',
      type: 'radio',
      icon: 'music',
      isLive: false,
      currentTrack: 'DJ Sessions'
    },
    {
      id: 'twitch-stream',
      name: 'Live on Twitch',
      type: 'twitch',
      icon: 'tv',
      isLive: true,
      currentTrack: 'Live Stream'
    }
  ];

  const [selectedStation, setSelectedStation] = useState(stations[0]);

  const handleStationSelect = (station: Station) => {
    console.log('🎯 StationSelector: handleStationSelect called with:', station);
    setSelectedStation(station);
    onStationChange(station);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Choose a Station:</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {stations.map((station) => (
          <Card
            key={station.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              selectedStation.id === station.id
                ? 'bg-gradient-primary/20 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
                : 'bg-gradient-card border-border/50 hover:border-primary/50'
            }`}
            onClick={() => handleStationSelect(station)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary/10">
                    {station.icon === 'radio' && <Radio className="w-6 h-6 text-primary" />}
                    {station.icon === 'music' && <Music className="w-6 h-6 text-primary" />}
                    {station.icon === 'tv' && <Tv className="w-6 h-6 text-primary" />}
                  </div>
                  <h3 className="font-semibold">{station.name}</h3>
                </div>
                
                <Badge
                  variant={station.isLive ? "default" : "secondary"}
                  className={
                    station.isLive
                      ? "bg-chat-online/20 text-chat-online border-chat-online/30"
                      : "bg-chat-offline/20 text-chat-offline border-chat-offline/30"
                  }
                >
                  {station.isLive ? (
                    <>
                      <div className="w-2 h-2 bg-chat-online rounded-full mr-1 animate-pulse" />
                      LIVE
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-chat-offline rounded-full mr-1" />
                      OFFLINE
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground truncate">
                  {station.currentTrack}
                </p>
                
                {selectedStation.id === station.id && (
                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-xs">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedStation && (
        <div className="mt-6">
          <Button
            className="w-full text-white hover:opacity-90 transition-opacity"
            style={{ 
              background: 'linear-gradient(180deg, hsl(60 100% 50%) 0%, hsl(120 40% 30%) 15%)',
            }}
            size="lg"
          >
            Listen to {selectedStation.name}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StationSelector;