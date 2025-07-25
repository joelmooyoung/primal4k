import { useState } from "react";
import Navigation from "@/components/Navigation";
import StationSelector from "@/components/StationSelector";
import AudioPlayer from "@/components/AudioPlayer";
import ChatRoom from "@/components/ChatRoom";
import TwitchEmbed from "@/components/TwitchEmbed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Calendar, Users } from "lucide-react";

interface Station {
  id: string;
  name: string;
  type: 'radio' | 'radio2' | 'livestream';
  icon: React.ElementType;
  isLive: boolean;
  currentTrack?: string;
  listeners?: number;
}

const Index = () => {
  const [selectedStation, setSelectedStation] = useState<Station>({
    id: 'radio',
    name: 'Radio',
    type: 'radio',
    icon: Music,
    isLive: true,
    currentTrack: 'Taking over the World - JA male accent',
    listeners: 847
  });

  const getStreamUrl = (stationId: string) => {
    const streamUrls = {
      'radio': 'https://fast.citrus3.com:2020/8014/stream',
      'radio2': 'https://s1.citrus3.com:2000/8000/stream',
      'livestream': 'https://fast.citrus3.com:2020/8014/stream'
    };
    return streamUrls[stationId as keyof typeof streamUrls] || streamUrls.radio;
  };

  const getExternalLinks = (stationId: string) => {
    if (stationId === 'radio') {
      return {
        winamp: 'https://fast.citrus3.com:2020/tunein/djgadaffiandfriends/stream/pls',
        vlc: 'https://fast.citrus3.com:2020/tunein/djgadaffiandfriends/stream/pls',
        itunes: 'https://fast.citrus3.com:2020/tunein/djgadaffiandfriends/stream/pls'
      };
    }
    return {
      winamp: 'https://s1.citrus3.com:2000/tunein/primal4k/stream/pls',
      vlc: 'https://s1.citrus3.com:2000/tunein/primal4k/stream/pls',
      itunes: 'https://s1.citrus3.com:2000/tunein/primal4k/stream/pls'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              PRIMAL
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            ...where it all starts
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-chat-online/20 text-chat-online border-chat-online/30">
              <div className="w-2 h-2 bg-chat-online rounded-full mr-2 animate-pulse" />
              Live Now
            </Badge>
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              1,081 Listeners
            </Badge>
            <Badge variant="outline">
              <Music className="w-3 h-3 mr-1" />
              24/7 Music
            </Badge>
          </div>
        </section>

        {/* Station Selection */}
        <section id="radio" className="mb-12 animate-fade-in-up">
          <StationSelector onStationChange={setSelectedStation} />
        </section>

        {/* Audio Player */}
        <section className="mb-12 animate-fade-in-up">
          <AudioPlayer
            title={selectedStation.name}
            description={selectedStation.currentTrack || "No track info available"}
            streamUrl={getStreamUrl(selectedStation.id)}
            isLive={selectedStation.isLive}
            externalLinks={getExternalLinks(selectedStation.id)}
          />
        </section>

        {/* Chat and Twitch Grid */}
        <section id="chat" className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="animate-fade-in-up">
            <ChatRoom />
          </div>
          <div className="animate-fade-in-up">
            <TwitchEmbed />
          </div>
        </section>

        {/* Schedule Section */}
        <section id="schedule" className="mb-12 animate-fade-in-up">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">DJ Gadaffi & Friends</h4>
                    <p className="text-sm text-muted-foreground">Reggae & Dancehall Vibes</p>
                  </div>
                  <Badge variant="outline">8:00 PM - 12:00 AM</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Late Night Mix</h4>
                    <p className="text-sm text-muted-foreground">Smooth Jazz & R&B</p>
                  </div>
                  <Badge variant="outline">12:00 AM - 4:00 AM</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Morning Energy</h4>
                    <p className="text-sm text-muted-foreground">High Energy Dancehall</p>
                  </div>
                  <Badge variant="outline">6:00 AM - 10:00 AM</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Events Section */}
        <section id="events" className="animate-fade-in-up">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No upcoming events scheduled. Stay tuned for exciting announcements!
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;