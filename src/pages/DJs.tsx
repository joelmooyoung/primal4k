import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, Clock, Music } from "lucide-react";

const DJs = () => {
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
      id: "andre-keitt",
      name: "Andre Keitt",
      show: "Kings Korner",
      time: "Tuesday 6:00 PM - 7:00 PM",
      description: "Royal treatment of music and conversation",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "cheryl-shaw",
      name: "Cheryl Shaw",
      show: "Sweet Life Solutions",
      time: "Tuesday 6:00 PM - 7:00 PM",
      description: "Solutions for living your sweetest life",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "jean-marie",
      name: "Jean Marie",
      show: "Level Up",
      time: "Tuesday 7:00 PM - 8:00 PM & Sunday 12:00 PM - 1:00 PM",
      description: "Motivational content to help you level up your life",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-77-gadaffi",
      name: "DJ 77 & DJ Gadaffi",
      show: "Soul2Soul",
      time: "Tuesday 8:00 PM - 10:00 PM",
      description: "Bringing you the best soul and R&B classics",
      image: "/placeholder.svg",
      isLive: true
    },
    {
      id: "doc-iman-blak",
      name: "Doc Iman Blak",
      show: "MetaMorphosis",
      time: "Tuesday 10:00 PM - 12:00 AM",
      description: "Transformative music and conversation",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "kyle-tunez",
      name: "Kyle Tunez",
      show: "Turn Up Tuesday / Hype Thursdays",
      time: "Tuesday 10:00 PM - 12:00 AM & Thursday 7:00 PM - 9:00 PM",
      description: "High energy music to turn up your week",
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-dede",
      name: "DJ DeDe",
      show: "The Wednesday Workout / Sunday Serenade",
      time: "Wednesday 8:00 PM - 10:00 PM & Sunday 10:00 AM - 12:00 PM",
      description: "High energy workouts and Sunday chill vibes",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-tony-g",
      name: "DJ Tony G",
      show: "The Tony G Show",
      time: "Wednesday 10:00 PM - 12:00 AM",
      description: "Late night vibes with Tony G",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "daddy-lion-chandell",
      name: "Daddy Lion Chandell",
      show: "Lioncore",
      time: "Thursday 3:00 PM - 5:00 PM",
      description: "Lionheart music and motivation",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "neiima-dede",
      name: "Neiima & DeDe",
      show: "The Matrix",
      time: "Thursday 6:00 PM - 7:00 PM",
      description: "Unplugging from the ordinary",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dlc",
      name: "DLC",
      show: "The Heart of Soul / Afternoon Delight / The Roots Dynamic Experience",
      time: "Multiple Shows - Various Times",
      description: "Heart of Soul, Roots Dynamic Experience, Afternoon Delight and more",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-teachdem",
      name: "DJ Teachdem",
      show: "The Traffic Jam Mix / Amapiano & more",
      time: "Friday 6:00 PM - 8:00 PM & Saturday 5:00/5:30 PM - 7:30 PM",
      description: "Traffic jam mixes and Amapiano vibes",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-screech",
      name: "DJ Screech",
      show: "Screech At Night",
      time: "Friday 8:00 PM - 10:00 PM",
      description: "Late night entertainment with DJ Screech",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-migrane",
      name: "DJ Migrane",
      show: "Deja Vu / The Cookie Jar",
      time: "Friday 10:00 PM - 12:00 AM & Sunday 6:00 PM - 9:00 PM",
      description: "Nostalgic vibes and sweet Sunday sounds",
      image: "/placeholder.svg",
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
      id: "dj-keu",
      name: "DJ Keu",
      show: "Di Drive / Grown Folks Music",
      time: "Saturday 7:30 PM - 9:30 PM & Sunday 1:00 PM - 3:00 PM",
      description: "Driving beats and grown folks music",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-badbin",
      name: "DJ Badbin",
      show: "Outside We Deh",
      time: "Saturday 9:30 PM - 12:00 AM",
      description: "Saturday night party vibes",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "alopex-dr-dawkins",
      name: "Alopex/Dr Dawkins",
      show: "Answers from The Word",
      time: "Sunday 9:00 AM - 10:00 AM",
      description: "Spiritual guidance and inspiration",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "professor-x",
      name: "Professor X",
      show: "The Kool Runnings Show",
      time: "Sunday 3:00 PM - 6:00 PM",
      description: "Kool vibes and runnings",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      id: "dj-smooth-daddy",
      name: "DJ Smooth Daddy",
      show: "The Quiet Storm Show",
      time: "Sunday 9:00 PM - 11:00 PM",
      description: "Smooth sounds for Sunday nights",
      image: "/placeholder.svg",
      isLive: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
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
                    onClick={() => window.location.href = `/dj/${dj.id}`}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default DJs;