import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Radio, MessageCircle, Calendar, Menu, X, Home, Users, Phone, Smartphone } from "lucide-react";
import PrimalText3D from "@/components/PrimalText3D";

interface NavigationProps {
  onNavigate?: (section: string) => void;
  activeSection?: string;
}

const Navigation = ({ onNavigate, activeSection = 'home' }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", section: "home" },
    { icon: Users, label: "DJs", section: "djs" },
    { icon: MessageCircle, label: "Chat", section: "chat" },
    { icon: Calendar, label: "Schedule", section: "schedule" },
    { icon: Phone, label: "Contact", section: "contact" }
  ];

  const handleNavClick = (section: string) => {
    console.log('🎯 Navigation: handleNavClick called with section:', section);
    setIsOpen(false);
    
    if (section === 'chat' || section === 'schedule') {
      // Navigate to home first if not already there
      if (activeSection !== 'home') {
        onNavigate?.('home');
        // Wait a moment for the section to render, then scroll
        setTimeout(() => {
          const element = document.querySelector(`#${section}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Already on home, just scroll
        const element = document.querySelector(`#${section}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (section === 'home') {
      // Navigate to home and scroll to top
      onNavigate?.(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to section
      console.log('🎯 Navigation: Calling onNavigate with section:', section);
      onNavigate?.(section);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => handleNavClick('home')}
          >
            <img 
              src="/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png" 
              alt="Primal4K Logo" 
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
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.section;
              
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 transition-colors ${
                    isActive ? 'text-primary bg-primary/10' : 'hover:text-primary'
                  }`}
                  onClick={() => handleNavClick(item.section)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
            
            {/* PWA Install Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground border-primary hover:from-primary-glow hover:to-primary"
              onClick={(e) => {
                console.log('🔘 PWA Install button clicked - DIRECT TEST');
                
                // Use same-window navigation instead of popup
                window.location.assign('/app.html');
              }}
            >
              <Smartphone className="w-4 h-4" />
              Install App
            </Button>
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
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.section;
                
                return (
                  <Button
                    key={item.label}
                    variant="ghost"
                    size="lg"
                    className={`w-full justify-start gap-3 transition-colors ${
                      isActive ? 'text-primary bg-primary/10' : 'hover:text-primary'
                    }`}
                    onClick={() => handleNavClick(item.section)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* PWA Install Button - Mobile */}
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start gap-3 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground border-primary hover:from-primary-glow hover:to-primary"
                onClick={() => {
                  console.log('🔘 PWA Install button clicked (mobile) - DIRECT TEST');
                  window.location.assign('/app.html');
                }}
              >
                <Smartphone className="w-5 h-5" />
                Install App
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;