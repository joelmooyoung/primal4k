import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
import dlcLioncore from "@/assets/dlc-lioncore-original.jpeg";
import alopex from "@/assets/alopex-original.jpeg";
const djSmoothDaddy = "/lovable-uploads/0dff8266-ab20-4e95-8173-8e6383bad650.png";

interface DJSlide {
  id: string;
  image: string;
  title: string;
  description: string;
}

const DJCarousel = () => {
  const slides: DJSlide[] = [
    {
      id: "dj-gadaffi",
      image: djGadaffi,
      title: "DJ Gadaffi",
      description: "Taking over the World"
    },
    {
      id: "dj-77",
      image: dj77,
      title: "DJ 77",
      description: "Urban Honeys & Linen & Lace"
    },
    {
      id: "dj-jermaine",
      image: djJermaine,
      title: "DJ Jermaine Hard Drive",
      description: "Hype Thursdays"
    },
    {
      id: "dj-dede",
      image: djDede,
      title: "DJ DeDe",
      description: "Wednesday Workout & Sunday Serenade"
    },
    {
      id: "dj-tony-g",
      image: djTonyG,
      title: "DJ Tony G",
      description: "The Tony G Show"
    },
    {
      id: "dj-keu",
      image: djKeu,
      title: "DJ Keu",
      description: "Di Drive & Grown Folks Music"
    },
    {
      id: "dj-teachdem",
      image: djTeachdem,
      title: "DJ Teachdem",
      description: "Traffic Jam Mix & Amapiano"
    },
    {
      id: "dj-craig",
      image: djCraig,
      title: "DJ Craig",
      description: "The Craig Show"
    },
    {
      id: "jean-marie",
      image: jeanMarie,
      title: "Jean Marie",
      description: "Level Up"
    },
    {
      id: "the-matrix",
      image: theMatrix,
      title: "The Matrix",
      description: "Neiima & DeDe"
    },
    {
      id: "doc-iman-blak",
      image: docImanBlak,
      title: "Doc Iman Blak",
      description: "MetaMorphosis"
    },
    {
      id: "professor-x",
      image: professorX,
      title: "Professor X",
      description: "The Kool Runnings Show"
    },
    {
      id: "dj-screech",
      image: djScreench,
      title: "DJ Screech",
      description: "Screech At Night"
    },
    {
      id: "dlc-lioncore",
      image: dlcLioncore,
      title: "DLC (Daddy Lion Chandell)",
      description: "Lioncore & Multiple Shows"
    },
    {
      id: "dj-migrane",
      image: djMigrane,
      title: "DJ Migrane",
      description: "Deja Vu / The Cookie Jar"
    },
    {
      id: "dj-tracy",
      image: "/lovable-uploads/ed9ae104-9687-4deb-8c5b-dcbbc3ef796d.png",
      title: "DJ Tracy",
      description: "The Tracy Show"
    },
    {
      id: "dj-smooth-daddy",
      image: djSmoothDaddy,
      title: "The Smooth Daddy",
      description: "The Quiet Storm"
    },
    {
      id: "alopex",
      image: alopex,
      title: "Alopex",
      description: "Answers from The Word - What does the Bible say?"
    },
    {
      id: "dr-dawkins",
      image: "/lovable-uploads/7792b74e-b282-4973-bc9b-40ea514033e6.png",
      title: "Dr Dawkins",
      description: "Answers from The Word with Dr Dawkins"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  return (
    <div className="relative w-full">
      <h2 className="text-2xl font-bold text-center mb-6">
        <span className="bg-gradient-primary bg-clip-text text-transparent">
          Our DJs & Shows
        </span>
      </h2>
      
      <Card className="bg-gradient-card border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div 
            className="relative h-96 overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Slides */}
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="min-w-full h-full relative flex items-center justify-center"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-auto h-full max-w-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-white text-xl font-bold mb-1">
                      {slide.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {slide.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={goToNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 p-4">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary scale-110"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DJCarousel;