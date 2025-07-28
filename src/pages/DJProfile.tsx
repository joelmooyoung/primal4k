import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, Clock, Music, Calendar, Users, Mail } from "lucide-react";

const DJProfile = () => {
  const { djId } = useParams();

  const djData = {
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
    "neiima-poets": {
      name: "Neiima & Poets",
      show: "Primally Poetic",
      time: "Monday 8:30 PM - 9:30 PM",
      description: "Poetry meets music in this inspiring weekly show",
      bio: "Neiima collaborates with local poets to create a unique blend of spoken word and music. The show celebrates creativity and artistic expression.",
      specialties: ["Spoken Word", "Poetry", "Artistic Music"],
      experience: "3+ years in radio",
      email: "neiima@primal4k.com"
    },
    "andre-keitt": {
      name: "Andre Keitt",
      show: "Kings Korner",
      time: "Tuesday 6:00 PM - 7:00 PM",
      description: "Royal treatment of music and conversation",
      bio: "Andre brings a regal approach to radio with sophisticated music selections and thoughtful discussions on culture and lifestyle.",
      specialties: ["Classic Soul", "Jazz", "Cultural Commentary"],
      experience: "8+ years in radio",
      email: "andre@primal4k.com"
    },
    "cheryl-shaw": {
      name: "Cheryl Shaw",
      show: "Sweet Life Solutions",
      time: "Tuesday 6:00 PM - 7:00 PM",
      description: "Solutions for living your sweetest life",
      bio: "Cheryl focuses on lifestyle, wellness, and personal development, offering practical advice alongside uplifting music.",
      specialties: ["Lifestyle", "Wellness", "Motivational Content"],
      experience: "6+ years in radio",
      email: "cheryl@primal4k.com"
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
    // Add more DJ data as needed
  };

  const dj = djData[djId as keyof typeof djData];

  if (!dj) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">DJ Profile</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Profile page for {djId} - Coming Soon!
            </p>
            <Button onClick={() => window.location.href = '/djs'}>
              Back to DJs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/djs'}
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
                     <div className="flex items-center gap-4">
                       <img 
                         src="/placeholder.svg" 
                         alt={dj.name}
                         className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                       />
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
                        {dj.specialties.map((specialty, index) => (
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
      </main>
      
      <Footer />
    </div>
  );
};

export default DJProfile;