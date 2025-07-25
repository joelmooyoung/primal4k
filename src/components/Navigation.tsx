import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Radio, MessageCircle, Calendar, Menu, X } from "lucide-react";
import PrimalText3D from "@/components/PrimalText3D";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Radio, label: "Radio", href: "#radio" },
    { icon: MessageCircle, label: "Chat", href: "#chat" },
    { icon: Calendar, label: "Schedule", href: "#schedule" },
    { icon: Music, label: "Events", href: "#events" },
    { icon: Radio, label: "DJ/Shows", href: "/djs" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/src/assets/primal-logo.jpeg" 
              alt="Primal Logo" 
              className="w-8 h-8 rounded-lg object-cover" 
            />
            <div className="flex items-center">
              <div style={{ width: '120px', height: '40px' }}>
                <PrimalText3D size="small" animate={false} />
              </div>
              <div className="ml-2">
                <p className="text-xs text-muted-foreground">...where it all starts</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => {
                  if (item.href.startsWith('/')) {
                    window.location.href = item.href;
                  } else {
                    document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in-up">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="justify-start text-foreground hover:text-primary hover:bg-primary/10"
                  onClick={() => {
                    if (item.href.startsWith('/')) {
                      window.location.href = item.href;
                    } else {
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                    setIsOpen(false);
                  }}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;