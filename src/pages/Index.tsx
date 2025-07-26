import { useState } from "react";
import Navigation from "@/components/Navigation";
import StationSelector from "@/components/StationSelector";
import AudioPlayer from "@/components/AudioPlayer";
import DJCarousel from "@/components/DJCarousel";
import EventsCarousel from "@/components/EventsCarousel";
import ChatRoom from "@/components/ChatRoom";
import TwitchEmbed from "@/components/TwitchEmbed";
import PrimalText3D from "@/components/PrimalText3D";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Calendar, Users } from "lucide-react";
import { Station } from "@/types/station";

const Index = () => {
  const [selectedStation, setSelectedStation] = useState<Station>({
    id: 'primal-radio',
    name: 'Primal Radio',
    type: 'radio',
    icon: 'music',
    isLive: true,
    currentTrack: 'Live Stream'
  });

  const getStreamUrl = (stationId: string) => {
    console.log('🎯 getStreamUrl called with stationId:', stationId);
    const streamUrls = {
      'primal-radio': 'https://fast.citrus3.com:2020/AudioPlayer/djgadaffiandfriends?mount=&',
      'primal-radio-2': 'https://s1.citrus3.com:2000/AudioPlayer/primal4k?mount=&',
      'twitch-stream': '' // Twitch uses iframe embed
    };
    const url = streamUrls[stationId as keyof typeof streamUrls] || streamUrls['primal-radio'];
    console.log('🎯 Returning streamUrl:', url);
    return url;
  };

  const getExternalLinks = (stationId: string) => {
    console.log('🎯 getExternalLinks called with stationId:', stationId);
    if (stationId === 'primal-radio') {
      return {
        winamp: 'https://fast.citrus3.com:2020/tunein/djgadaffiandfriends/stream/pls',
        vlc: 'https://fast.citrus3.com:2020/tunein/djgadaffiandfriends/stream/pls',
        itunes: 'https://fast.citrus3.com:2020/tunein/djgadaffiandfriends/stream/pls'
      };
    }
    return {
      winamp: 'https://s1.citrus3.com:2000/AudioPlayer/primal4k?mount=&',
      vlc: 'https://s1.citrus3.com:2000/AudioPlayer/primal4k?mount=&',
      itunes: 'https://s1.citrus3.com:2000/AudioPlayer/primal4k?mount=&'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in-up">
          <div className="mb-4">
            <PrimalText3D size="large" animate={true} />
          </div>
          <p className="text-xl text-foreground mb-8">
            ...where it all starts
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-chat-online/20 text-chat-online border-chat-online/30">
              <div className="w-2 h-2 bg-chat-online rounded-full mr-2 animate-pulse" />
              Live Now
            </Badge>
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              40K Listeners
            </Badge>
            <Badge variant="outline">
              <Music className="w-3 h-3 mr-1" />
              24/7 Music
            </Badge>
          </div>
        </section>

        {/* Station Selection */}
        <section id="radio" className="mb-12 animate-fade-in-up">
          <StationSelector onStationChange={(station) => {
            console.log('🎯 Index: Station changed to:', station);
            setSelectedStation(station);
          }} />
        </section>

        {/* Audio Player / Twitch Toggle */}
        <section className="mb-12 animate-fade-in-up">
          {(() => {
            console.log('🎯 Index: Rendering with selectedStation:', selectedStation);
            
            if (selectedStation.type === 'twitch') {
              return <TwitchEmbed />;
            } else {
              return (
                <AudioPlayer
                  title={selectedStation.name}
                  description={selectedStation.currentTrack || "Now Playing"}
                  streamUrl={getStreamUrl(selectedStation.id)}
                  isLive={selectedStation.isLive}
                  coverImage="/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png"
                  station={selectedStation}
                  externalLinks={getExternalLinks(selectedStation.id)}
                />
              );
            }
          })()}
        </section>

        {/* Chat Section */}
        <section id="chat" className="mb-12">
          <div className="animate-fade-in-up">
            <ChatRoom />
          </div>
        </section>

        <section id="schedule" className="mb-12 animate-fade-in-up">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Program Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">Day</th>
                      <th className="text-left p-3 font-semibold">Show</th>
                      <th className="text-left p-3 font-semibold">Host</th>
                      <th className="text-left p-3 font-semibold">Time (Eastern)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
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
                    ].map((schedule, index) => (
                      <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                        <td className="p-3 font-medium">{schedule.day}</td>
                        <td className="p-3">{schedule.show}</td>
                        <td className="p-3 text-muted-foreground">{schedule.host}</td>
                        <td className="p-3 text-accent">{schedule.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* DJ Carousel Section */}
        <section className="mb-12 animate-fade-in-up">
          <DJCarousel />
        </section>

        {/* Events Carousel Section */}
        <section id="events" className="animate-fade-in-up">
          <EventsCarousel />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;