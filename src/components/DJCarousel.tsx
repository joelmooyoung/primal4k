import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import djPlaceholder1 from "@/assets/dj-placeholder-1.jpg";
import djPlaceholder2 from "@/assets/dj-placeholder-2.jpg";

interface DJSlide {
  id: string;
  image: string;
  title: string;
  description: string;
}

const DJCarousel = () => {
  const slides: DJSlide[] = [
    {
      id: "dj-craig",
      image: djPlaceholder1,
      title: "DJ Craig",
      description: "Urban beats and classic hits"
    },
    {
      id: "dj-77",
      image: djPlaceholder2,
      title: "DJ 77",
      description: "Urban Honeys & Linen & Lace"
    },
    {
      id: "dj-kyle",
      image: djPlaceholder1,
      title: "DJ Kyle Tunez",
      description: "Hype Thursdays & Turn Up Tuesday"
    },
    {
      id: "dj-gadaffi",
      image: djPlaceholder2,
      title: "DJ Gadaffi",
      description: "Taking over the World"
    },
    {
      id: "the-matrix",
      image: djPlaceholder1,
      title: "The Matrix",
      description: "Neiima & DeDe"
    },
    {
      id: "kings-korner",
      image: djPlaceholder2,
      title: "Kings Korner",
      description: "Andre Keitt"
    },
    {
      id: "jean-marie",
      image: djPlaceholder1,
      title: "Jean Marie",
      description: "Level Up"
    },
    {
      id: "dj-teachdem",
      image: djPlaceholder2,
      title: "DJ Teachdem",
      description: "Traffic Jam Mix & Amapiano"
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