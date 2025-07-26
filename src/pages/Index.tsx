import { useState } from "react";
import Navigation from "@/components/Navigation";
import StationSelector from "@/components/StationSelector";
import AudioPlayer from "@/components/AudioPlayer";
import { useStreamMetadata } from "@/hooks/useStreamMetadata";
import DJCarousel from "@/components/DJCarousel";
import EventsCarousel from "@/components/EventsCarousel";
import ChatRoom from "@/components/ChatRoom";
import TwitchEmbed from "@/components/TwitchEmbed";
import PrimalText3D from "@/components/PrimalText3D";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Music, Calendar, Users, Radio, Clock, Mail, Phone, MapPin } from "lucide-react";
import { Station } from "@/types/station";

// Import DJ images
import djGadaffi from "@/assets/dj-gadaffi-original.jpeg";
import dj77 from "@/assets/dj-77-original.jpeg";
import djDede from "@/assets/dj-dede-original.jpeg";
import djJermaine from "@/assets/dj-jermaine-original.jpeg";
import djTonyG from "@/assets/dj-tony-g-original.jpeg";
import djKeu from "@/assets/dj-keu-original.jpeg";
import djTeachdem from "@/assets/dj-teachdem-original.jpeg";
import djCraig from "@/assets/dj-craig-original.jpeg";
import jeanMarie from "@/assets/jean-marie-original.jpeg";
import theMatrix from "@/assets/the-matrix-original.jpeg";
import docImanBlak from "@/assets/doc-iman-blak-original.jpeg";
import professorX from "@/assets/professor-x-original.jpg";
import djMigrane from "@/assets/dj-migrane-original.jpeg";
import djScreench from "@/assets/dj-screech-original.jpeg";
import djBadbin from "@/assets/dj-badbin-original.jpeg";
import alopex from "@/assets/alopex-original.jpeg";
import dlcLioncore from "@/assets/dlc-lioncore-original.jpeg";
const djSmoothDaddy = "/lovable-uploads/0dff8266-ab20-4e95-8173-8e6383bad650.png";

type PageSection = 'home' | 'djs' | 'dj-profile' | 'contact';

const Index = () => {
  const [selectedStation, setSelectedStation] = useState<Station>({
    id: 'primal-radio',
    name: 'Primal Radio',
    type: 'radio',
    icon: 'music',
    isLive: true,
    currentTrack: 'Live Stream'
  });
  
  const [activeSection, setActiveSection] = useState<PageSection>('home');
  const [selectedDJId, setSelectedDJId] = useState<string>('');

  // Debug active section changes
  const handleSectionChange = (section: PageSection) => {
    console.log('🎯 Index: activeSection changing from', activeSection, 'to', section);
    setActiveSection(section);
  };

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

  // DJ Data
  const djs = [
    {
      id: "imaara",
      name: "Imaara",
      show: "The Community Buzz",
      time: "Monday 4:00 PM - 6:00 PM",
      description: "Bringing the community together with buzz-worthy conversations and music",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "neiima-poets",
      name: "Neiima & Poets",
      show: "Primally Poetic",
      time: "Monday 8:30 PM - 9:30 PM",
      description: "Poetry meets music in this inspiring weekly show",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "jean-marie",
      name: "Jean Marie",
      show: "Level Up",
      time: "Tuesday 7:00 PM - 8:00 PM & Sunday 12:00 PM - 1:00 PM",
      description: "Motivational content to help you level up your life",
      image: jeanMarie,
      isLive: false
    },
    {
      id: "dj-77-gadaffi",
      name: "DJ 77 & DJ Gadaffi",
      show: "Soul2Soul",
      time: "Tuesday 8:00 PM - 10:00 PM",
      description: "Bringing you the best soul and R&B classics",
      image: djGadaffi,
      isLive: false
    },
    {
      id: "doc-iman-blak",
      name: "Doc Iman Blak",
      show: "MetaMorphosis",
      time: "Tuesday 10:00 PM - 12:00 AM",
      description: "Transformative music and conversation",
      image: docImanBlak,
      isLive: false
    },
    {
      id: "dj-jermaine-hard-drive",
      name: "DJ Jermaine Hard Drive",
      show: "Turn Up Tuesday / Hype Thursdays",
      time: "Tuesday 10:00 PM - 12:00 AM & Thursday 7:00 PM - 9:00 PM",
      description: "High energy music to turn up your week",
      image: djJermaine,
      isLive: false
    },
    {
      id: "singing-melody",
      name: "Singing Melody",
      show: "Hold a Reasoning",
      time: "Wednesday 1:00 PM - 3:00 PM",
      description: "Reggae vibes and conscious reasoning",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-77",
      name: "DJ 77",
      show: "Urban Honeys / Linen & Lace",
      time: "Wednesday 6:00 PM - 8:00 PM",
      description: "Urban beats and straight jazz odyssey",
      image: dj77,
      isLive: false
    },
    {
      id: "dj-dede",
      name: "DJ DeDe",
      show: "The Wednesday Workout / Sunday Serenade",
      time: "Wednesday 8:00 PM - 10:00 PM & Sunday 10:00 AM - 12:00 PM",
      description: "High energy workouts and Sunday chill vibes",
      image: djDede,
      isLive: false
    },
    {
      id: "dj-tony-g",
      name: "DJ Tony G",
      show: "The Tony G Show",
      time: "Wednesday 10:00 PM - 12:00 AM",
      description: "Late night vibes with Tony G",
      image: djTonyG,
      isLive: false
    },
    {
      id: "neiima-dede",
      name: "Neiima & DeDe",
      show: "The Matrix",
      time: "Thursday 6:00 PM - 7:00 PM",
      description: "Unplugging from the ordinary",
      image: theMatrix,
      isLive: false
    },
    {
      id: "dlc-daddy-lion",
      name: "DLC (Daddy Lion Chandell)",
      show: "The Heart of Soul / Afternoon Delight / The Roots Dynamic Experience / Lioncore",
      time: "Multiple Shows - Various Times Including Thursday 3:00 PM - 5:00 PM",
      description: "Heart of Soul, Roots Dynamic Experience, Afternoon Delight, Lioncore and more",
      image: dlcLioncore,
      isLive: false
    },
    {
      id: "dj-keu",
      name: "DJ Keu",
      show: "Di Drive / Grown Folks Music",
      time: "Saturday 7:30 PM - 9:30 PM & Sunday 1:00 PM - 3:00 PM",
      description: "Driving beats and grown folks music",
      image: djKeu,
      isLive: false
    },
    {
      id: "dj-tracy",
      name: "DJ Tracy",
      show: "The Tracy Show",
      time: "Various Times",
      description: "Bringing you the best music and entertainment",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-teachdem",
      name: "DJ Teachdem",
      show: "The Traffic Jam Mix / Amapiano & more",
      time: "Friday 6:00 PM - 8:00 PM & Saturday 5:00/5:30 PM - 7:30 PM",
      description: "Traffic jam mixes and Amapiano vibes",
      image: djTeachdem,
      isLive: true
    },
    {
      id: "dj-screech",
      name: "DJ Screech",
      show: "Screech At Night",
      time: "Friday 8:00 PM - 10:00 PM",
      description: "Late night entertainment with DJ Screech",
      image: djScreench,
      isLive: false
    },
    {
      id: "dj-migrane",
      name: "DJ Migrane",
      show: "Deja Vu / The Cookie Jar",
      time: "Friday 10:00 PM - 12:00 AM & Sunday 6:00 PM - 9:00 PM",
      description: "Nostalgic vibes and sweet Sunday sounds",
      image: djMigrane,
      isLive: false
    },
    {
      id: "dj-craig",
      name: "DJ Craig",
      show: "The Craig Show",
      time: "Various Times",
      description: "Bringing you the best music and entertainment",
      image: djCraig,
      isLive: false
    },
    {
      id: "primal-sports-team",
      name: "Dale, Kane, Froggy & The Controversial Boss",
      show: "Primal Sports",
      time: "Saturday 4:00 PM - 5:00/5:30 PM",
      description: "Sports talk and controversial takes",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-badbin",
      name: "DJ Badbin",
      show: "Outside We Deh",
      time: "Saturday 9:30 PM - 12:00 AM",
      description: "Saturday night party vibes",
      image: djBadbin,
      isLive: false
    },
    {
      id: "alopex-dr-dawkins",
      name: "Alopex/Dr Dawkins",
      show: "Answers from The Word",
      time: "Sunday 9:00 AM - 10:00 AM",
      description: "Spiritual guidance and inspiration",
      image: alopex,
      isLive: false
    },
    {
      id: "professor-x",
      name: "Professor X",
      show: "The Kool Runnings Show",
      time: "Sunday 3:00 PM - 6:00 PM",
      description: "Kool vibes and runnings",
      image: professorX,
      isLive: false
    },
    {
      id: "dj-smooth-daddy",
      name: "DJ Smooth Daddy",
      show: "The Quiet Storm Show",
      time: "Sunday 9:00 PM - 11:00 PM",
      description: "Smooth sounds for Sunday nights",
      image: djSmoothDaddy,
      isLive: false
    }
  ];

  // DJ Profile Data
  const djProfileData: Record<string, any> = {
    "imaara": {
      name: "Imaara",
      show: "The Community Buzz",
      time: "Monday 4:00 PM - 6:00 PM",
      description: "Bringing the community together with buzz-worthy conversations and music",
      bio: "Imaara is a passionate community advocate who uses her platform to bring people together through music and meaningful conversations. Her show focuses on local events, community issues, and uplifting music.",
      specialties: ["Community Events", "Local News", "Feel Good Music"],
      experience: "5+ years in radio",
      email: "imaara@primal4k.com"
    },
    "jean-marie": {
      name: "Jean Marie",
      show: "Level Up",
      time: "Tuesday 7:00 PM - 8:00 PM & Sunday 12:00 PM - 1:00 PM",
      description: "Motivational content to help you level up your life",
      bio: "Jean Marie is a motivational speaker and life coach who uses radio to inspire listeners to reach their full potential.",
      specialties: ["Motivation", "Personal Development", "Success Stories"],
      experience: "4+ years in radio",
      email: "jean@primal4k.com"
    },
    "dj-77-gadaffi": {
      name: "DJ 77 & DJ Gadaffi",
      show: "Soul2Soul",
      time: "Tuesday 8:00 PM - 10:00 PM",
      description: "Bringing you the best soul and R&B classics",
      bio: "The dynamic duo of DJ 77 and DJ Gadaffi bring decades of combined experience, specializing in classic soul, R&B, and neo-soul music.",
      specialties: ["Classic Soul", "R&B", "Neo-Soul"],
      experience: "15+ years combined",
      email: "soul2soul@primal4k.com"
    }
  };

  const renderHomeSection = () => (
    <>
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

      {/* Audio Player / Twitch Toggle - Only show on home */}
      {activeSection === 'home' && (
        <section className="mb-12 animate-fade-in-up">
          {(() => {
            console.log('🎯 Index: Rendering with selectedStation:', selectedStation);
            
            if (selectedStation.type === 'twitch') {
              return <TwitchEmbed />;
            } else {
              return (
                <div className="space-y-4">
                  <AudioPlayer
                    title={selectedStation.name}
                    description={selectedStation.currentTrack || "Now Playing"}
                    streamUrl={getStreamUrl(selectedStation.id)}
                    isLive={selectedStation.isLive}
                    coverImage="/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png"
                    station={selectedStation}
                    externalLinks={getExternalLinks(selectedStation.id)}
                  />
                </div>
              );
            }
          })()}
        </section>
      )}

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
    </>
  );

  const renderDJsSection = () => (
    <section className="animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our DJs</h1>
        <p className="text-xl text-muted-foreground">
          Meet the voices behind Primal4K Radio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {djs.map((dj, index) => (
          <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              {/* DJ Image */}
              <div className="flex justify-center mb-4">
                <img 
                  src={dj.image} 
                  alt={dj.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">{dj.name}</h3>
                </div>
                {dj.isLive && (
                  <Badge variant="secondary" className="bg-chat-online/20 text-chat-online border-chat-online/30">
                    <div className="w-2 h-2 bg-chat-online rounded-full mr-1 animate-pulse" />
                    LIVE
                  </Badge>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Music className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{dj.show}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{dj.time}</span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {dj.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => {
                    setSelectedDJId(dj.id);
                    setActiveSection('dj-profile');
                  }}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Card className="bg-gradient-card border-border/50 max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Want to Join Our Team?</h2>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented DJs and radio personalities to join the Primal4K family.
            </p>
            <Button>
              Apply Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );

  const renderDJProfileSection = () => {
    const dj = djProfileData[selectedDJId];
    
    if (!dj) {
      return (
        <section className="animate-fade-in-up">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">DJ Profile</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Profile page for {selectedDJId} - Coming Soon!
            </p>
            <Button onClick={() => setActiveSection('djs')}>
              Back to DJs
            </Button>
          </div>
        </section>
      );
    }

    return (
      <section className="animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setActiveSection('djs')}
              className="mb-4"
            >
              ← Back to DJs
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card border-border/50 mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Radio className="w-8 h-8 text-primary" />
                      <div>
                        <CardTitle className="text-2xl">{dj.name}</CardTitle>
                        <p className="text-muted-foreground">{dj.show}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      <Music className="w-3 h-3 mr-1" />
                      DJ
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{dj.time}</span>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {dj.bio}
                    </p>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {dj.specialties.map((specialty: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Shows */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Shows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Recent show playlist and content coming soon...
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{dj.experience}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Show Description</p>
                    <p className="text-sm">{dj.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{dj.email}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Connect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request Song
                  </Button>
                  <Button variant="outline" className="w-full">
                    Follow Updates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderContactSection = () => (
    <section className="animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with the Primal4K Radio team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-muted-foreground">+1 (876) 555-RADIO</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">info@primal4k.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-muted-foreground">
                    123 Music Street<br />
                    Kingston, Jamaica
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Broadcasting Hours</p>
                  <p className="text-muted-foreground">24/7 Live</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First Name</label>
                    <Input placeholder="Your first name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                    <Input placeholder="Your last name" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="What's this about?" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us how we can help you..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation 
        onNavigate={(section: string) => {
          if (section === 'home') handleSectionChange('home');
          else if (section === 'djs') handleSectionChange('djs');
          else if (section === 'contact') handleSectionChange('contact');
        }}
        activeSection={activeSection}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && renderHomeSection()}
        {activeSection === 'djs' && renderDJsSection()}
        {activeSection === 'dj-profile' && renderDJProfileSection()}
        {activeSection === 'contact' && renderContactSection()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;