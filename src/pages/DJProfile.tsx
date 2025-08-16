import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, Clock, Music, Calendar, Users, Mail } from "lucide-react";

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

const DJProfile = () => {
  const { djId } = useParams();

  // DJ image mapping
  const djImages: Record<string, string> = {
    "imaara": "/placeholder.svg",
    "neiima-poets": "/placeholder.svg",
    "jean-marie": jeanMarie,
    "dj-77-gadaffi": djGadaffi,
    "doc-iman-blak": docImanBlak,
    "dj-jermaine-hard-drive": djJermaine,
    "singing-melody": "/placeholder.svg",
    "dj-77": dj77,
    "dj-dede": djDede,
    "dj-tony-g": djTonyG,
    "neiima-dede": theMatrix,
    "dlc-daddy-lion": dlcLioncore,
    "dj-keu": djKeu,
    "dj-tracy": "/placeholder.svg",
    "dj-teachdem": djTeachdem,
    "dj-screech": djScreench,
    "dj-migrane": djMigrane,
    "dj-craig": djCraig,
    "primal-sports-team": "/placeholder.svg",
    "dj-badbin": djBadbin,
    "alopex-dr-dawkins": alopex,
    "professor-x": professorX,
    "dj-smooth-daddy": djSmoothDaddy
  };

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
    },
    "doc-iman-blak": {
      name: "Doc Iman Blak",
      show: "MetaMorphosis",
      time: "Tuesday 10:00 PM - 12:00 AM",
      description: "Transformative music and conversation",
      bio: "Doc Iman Blak brings deep philosophical insights and transformative content to late-night radio, combining thought-provoking discussions with eclectic music selections.",
      specialties: ["Philosophy", "Transformation", "Eclectic Music"],
      experience: "7+ years in radio",
      email: "dociman@primal4k.com"
    },
    "dj-jermaine-hard-drive": {
      name: "DJ Jermaine Hard Drive",
      show: "Turn Up Tuesday / Hype Thursdays",
      time: "Tuesday 10:00 PM - 12:00 AM & Thursday 7:00 PM - 9:00 PM",
      description: "High energy music to turn up your week",
      bio: "DJ Jermaine Hard Drive is known for his high-energy shows that get listeners pumped up. His infectious enthusiasm and perfectly curated playlists make every show a party.",
      specialties: ["High Energy Music", "Hip Hop", "Party Vibes"],
      experience: "6+ years in radio",
      email: "jermaine@primal4k.com"
    },
    "singing-melody": {
      name: "Singing Melody",
      show: "Hold a Reasoning",
      time: "Wednesday 1:00 PM - 3:00 PM",
      description: "Reggae vibes and conscious reasoning",
      bio: "Singing Melody brings conscious reggae music and meaningful conversations to the airwaves, focusing on social awareness and positive vibrations.",
      specialties: ["Reggae", "Conscious Music", "Social Commentary"],
      experience: "10+ years in music and radio",
      email: "melody@primal4k.com"
    },
    "dj-77": {
      name: "DJ 77",
      show: "Urban Honeys / Linen & Lace",
      time: "Wednesday 6:00 PM - 8:00 PM",
      description: "Urban beats and straight jazz odyssey",
      bio: "DJ 77 masterfully blends urban contemporary sounds with classic jazz, creating a unique listening experience that appeals to diverse musical tastes.",
      specialties: ["Urban Contemporary", "Jazz", "R&B"],
      experience: "12+ years in radio",
      email: "dj77@primal4k.com"
    },
    "dj-dede": {
      name: "DJ DeDe",
      show: "The Wednesday Workout / Sunday Serenade",
      time: "Wednesday 8:00 PM - 10:00 PM & Sunday 10:00 AM - 12:00 PM",
      description: "High energy workouts and Sunday chill vibes",
      bio: "DJ DeDe brings versatility to radio with high-energy workout sessions and relaxing Sunday morning vibes, adapting her style to match the mood of the day.",
      specialties: ["Workout Music", "Chill Vibes", "Motivational Content"],
      experience: "5+ years in radio",
      email: "dede@primal4k.com"
    },
    "dj-tony-g": {
      name: "DJ Tony G",
      show: "The Tony G Show",
      time: "Wednesday 10:00 PM - 12:00 AM",
      description: "Late night vibes with Tony G",
      bio: "DJ Tony G is the master of late-night radio, creating the perfect atmosphere for winding down with smooth sounds and engaging conversation.",
      specialties: ["Late Night Vibes", "Smooth Jazz", "R&B"],
      experience: "8+ years in radio",
      email: "tonyg@primal4k.com"
    },
    "neiima-dede": {
      name: "Neiima & DeDe",
      show: "The Matrix",
      time: "Thursday 6:00 PM - 7:00 PM",
      description: "Unplugging from the ordinary",
      bio: "Neiima and DeDe collaborate to bring thought-provoking content that challenges conventional thinking and explores deeper truths through music and conversation.",
      specialties: ["Alternative Perspectives", "Deep Conversations", "Eclectic Music"],
      experience: "4+ years combined",
      email: "matrix@primal4k.com"
    },
    "dlc-daddy-lion": {
      name: "DLC (Daddy Lion Chandell)",
      show: "The Heart of Soul / Afternoon Delight / The Roots Dynamic Experience / Lioncore",
      time: "Multiple Shows - Various Times Including Thursday 3:00 PM - 5:00 PM",
      description: "Heart of Soul, Roots Dynamic Experience, Afternoon Delight, Lioncore and more",
      bio: "DLC is a multi-talented radio personality hosting multiple shows, each with its own unique flavor. From soul music to roots experiences, he brings passion and expertise to every broadcast.",
      specialties: ["Soul Music", "Roots Music", "Multi-Genre Programming"],
      experience: "15+ years in radio",
      email: "dlc@primal4k.com"
    },
    "dj-keu": {
      name: "DJ Keu",
      show: "Di Drive / Grown Folks Music",
      time: "Saturday 7:30 PM - 9:30 PM & Sunday 1:00 PM - 3:00 PM",
      description: "Driving beats and grown folks music",
      bio: "DJ Keu specializes in music for mature audiences, offering sophisticated selections that resonate with experienced listeners while keeping the energy high.",
      specialties: ["Mature Contemporary", "Driving Beats", "Sophisticated Sound"],
      experience: "9+ years in radio",
      email: "keu@primal4k.com"
    },
    "dj-tracy": {
      name: "DJ Tracy",
      show: "The Tracy Show",
      time: "Various Times",
      description: "Bringing you the best music and entertainment",
      bio: "DJ Tracy is a versatile radio personality known for her engaging shows and diverse music selections. She brings energy and entertainment to every broadcast.",
      specialties: ["Contemporary Music", "Entertainment", "Audience Engagement"],
      experience: "4+ years in radio",
      email: "tracy@primal4k.com"
    },
    "dj-teachdem": {
      name: "DJ Teachdem",
      show: "The Traffic Jam Mix / Amapiano & more",
      time: "Friday 6:00 PM - 8:00 PM & Saturday 5:00/5:30 PM - 7:30 PM",
      description: "Traffic jam mixes and Amapiano vibes",
      bio: "DJ Teachdem brings the hottest Amapiano sounds and expertly crafted mixes to help listeners navigate through their day with the perfect soundtrack.",
      specialties: ["Amapiano", "Mix Shows", "Contemporary African Music"],
      experience: "6+ years in radio",
      email: "teachdem@primal4k.com"
    },
    "dj-screech": {
      name: "DJ Screech",
      show: "Screech At Night",
      time: "Friday 8:00 PM - 10:00 PM",
      description: "Late night entertainment with DJ Screech",
      bio: "DJ Screech dominates the late-night airwaves with entertaining content and music that keeps listeners engaged through the weekend kickoff.",
      specialties: ["Late Night Entertainment", "Weekend Vibes", "Party Music"],
      experience: "5+ years in radio",
      email: "screech@primal4k.com"
    },
    "dj-migrane": {
      name: "DJ Migrane",
      show: "Deja Vu / The Cookie Jar",
      time: "Friday 10:00 PM - 12:00 AM & Sunday 6:00 PM - 9:00 PM",
      description: "Nostalgic vibes and sweet Sunday sounds",
      bio: "DJ Migrane specializes in nostalgic music that takes listeners on a journey through time, combined with contemporary selections that create the perfect blend of old and new.",
      specialties: ["Nostalgic Music", "Throwback Hits", "Contemporary Classics"],
      experience: "7+ years in radio",
      email: "migrane@primal4k.com"
    },
    "dj-craig": {
      name: "DJ Craig",
      show: "The Craig Show",
      time: "Various Times",
      description: "Bringing you the best music and entertainment",
      bio: "DJ Craig is known for his diverse programming and ability to connect with listeners through music and engaging conversation.",
      specialties: ["Diverse Programming", "Audience Connection", "Music Curation"],
      experience: "6+ years in radio",
      email: "craig@primal4k.com"
    },
    "primal-sports-team": {
      name: "Dale, Kane, Froggy & The Controversial Boss",
      show: "Primal Sports",
      time: "Saturday 4:00 PM - 5:00/5:30 PM",
      description: "Sports talk and controversial takes",
      bio: "The Primal Sports team brings passionate sports discussion, controversial opinions, and expert analysis to weekend programming. Their dynamic chemistry creates engaging sports talk radio.",
      specialties: ["Sports Analysis", "Controversial Takes", "Team Chemistry"],
      experience: "Combined 20+ years in sports and radio",
      email: "sports@primal4k.com"
    },
    "dj-badbin": {
      name: "DJ Badbin",
      show: "Outside We Deh",
      time: "Saturday 9:30 PM - 12:00 AM",
      description: "Saturday night party vibes",
      bio: "DJ Badbin brings the party to Saturday nights with high-energy music and infectious enthusiasm that gets listeners ready for a great night out.",
      specialties: ["Party Music", "High Energy", "Weekend Vibes"],
      experience: "6+ years in radio",
      email: "badbin@primal4k.com"
    },
    "alopex-dr-dawkins": {
      name: "Alopex/Dr Dawkins",
      show: "Answers from The Word",
      time: "Sunday 9:00 AM - 10:00 AM",
      description: "Spiritual guidance and inspiration",
      bio: "Alopex/Dr Dawkins provides spiritual guidance and inspiration through biblical teachings and uplifting music, helping listeners start their Sunday with faith and positivity.",
      specialties: ["Spiritual Content", "Biblical Teaching", "Inspirational Music"],
      experience: "10+ years in ministry and radio",
      email: "alopex@primal4k.com"
    },
    "professor-x": {
      name: "Professor X",
      show: "The Kool Runnings Show",
      time: "Sunday 3:00 PM - 6:00 PM",
      description: "Kool vibes and runnings",
      bio: "Professor X brings educational content mixed with cool vibes, offering listeners a unique blend of knowledge and entertainment during Sunday afternoons.",
      specialties: ["Educational Content", "Cool Vibes", "Cultural Music"],
      experience: "12+ years in radio and education",
      email: "professorx@primal4k.com"
    },
    "dj-smooth-daddy": {
      name: "DJ Smooth Daddy",
      show: "The Quiet Storm Show",
      time: "Sunday 9:00 PM - 11:00 PM",
      description: "Smooth sounds for Sunday nights",
      bio: "DJ Smooth Daddy masters the art of the quiet storm, providing smooth, romantic sounds that create the perfect atmosphere for Sunday evening relaxation.",
      specialties: ["Quiet Storm", "Smooth R&B", "Romantic Music"],
      experience: "10+ years in radio",
      email: "smoothdaddy@primal4k.com"
    }
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
                          src={djImages[djId as string] || "/placeholder.svg"} 
                          alt={dj.name}
                          className="w-48 h-48 rounded-full object-cover border-2 border-primary/20"
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