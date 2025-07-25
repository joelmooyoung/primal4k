import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, Clock, Music } from "lucide-react";

const DJs = () => {
  const djs = [
    {
      name: "DJ Gadaffi",
      show: "Soul2Soul",
      time: "Tuesday 8:00 PM - 10:00 PM",
      description: "Bringing you the best soul and R&B classics",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      name: "DJ 77",
      show: "Urban Honeys / Linen & Lace",
      time: "Wednesday 6:00 PM - 8:00 PM", 
      description: "Urban beats and straight jazz odyssey",
      image: "/placeholder.svg",
      isLive: true
    },
    {
      name: "DJ DeDe",
      show: "The Wednesday Workout / Sunday Serenade",
      time: "Wednesday & Sunday",
      description: "High energy workouts and Sunday chill vibes",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      name: "DJ Kyle Tunez",
      show: "Hype Thursdays",
      time: "Thursday 7:00 PM - 9:00 PM",
      description: "Thursday night energy and hype music",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      name: "DJ Teachdem",
      show: "The Traffic Jam Mix / Amapiano & more",
      time: "Friday & Saturday",
      description: "Traffic jam mixes and Amapiano vibes",
      image: "/placeholder.svg",
      isLive: false
    },
    {
      name: "DLC",
      show: "Multiple Shows",
      time: "Various times",
      description: "Heart of Soul, Roots Dynamic Experience, and more",
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
                  
                  <Button variant="outline" size="sm" className="w-full mt-4">
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