import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";

import eventPlaceholder1 from "@/assets/event-placeholder-1.jpg";

interface EventSlide {
  id: string;
  image: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

const EventsCarousel = () => {
  const slides: EventSlide[] = [
    {
      id: "titchfield-homecoming",
      image: "/lovable-uploads/a10764f8-ce89-4bfe-a981-aa16d2029894.png",
      title: "Save The Date",
      date: "March 29 - April 5, 2026",
      location: "Port Antonio, Jamaica",
      description: "Titchfield High School Homecoming - Celebrating 240 Years (1786-2026)"
    },
    {
      id: "upcoming-event-1",
      image: eventPlaceholder1,
      title: "Primal Live Sessions",
      date: "Coming Soon",
      location: "TBA",
      description: "Special live recording sessions with our top DJs"
    },
    {
      id: "upcoming-event-2", 
      image: eventPlaceholder1,
      title: "Community Mixer",
      date: "Stay Tuned",
      location: "Virtual",
      description: "Meet and greet with the Primal Radio family"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

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
          Upcoming Events
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <h3 className="text-white text-xl font-bold mb-2">
                      {slide.title}
                    </h3>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1 text-white/90">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{slide.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/90">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{slide.location}</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm">
                      {slide.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons - Only show if more than 1 slide */}
            {slides.length > 1 && (
              <>
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
              </>
            )}
          </div>

          {/* Dots Indicator - Only show if more than 1 slide */}
          {slides.length > 1 && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsCarousel;