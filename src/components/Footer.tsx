import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Radio,
  Clock,
  Heart
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  const quickLinks = [
    { label: "Home", href: "#" },
    { label: "Schedule", href: "#schedule" },
    { label: "DJs", href: "#" },
    { label: "Events", href: "#events" },
    { label: "Chat", href: "#chat" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <footer className="bg-gradient-card border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Station Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Primal4K Radio</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your premier destination for the best music, live shows, and community connection. Broadcasting 24/7 with love from the heart of the Caribbean.
            </p>
            <Badge variant="secondary" className="bg-chat-online/20 text-chat-online border-chat-online/30">
              <div className="w-2 h-2 bg-chat-online rounded-full mr-2 animate-pulse" />
              Live Broadcasting
            </Badge>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Us
            </h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (876) 555-RADIO</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@primal4k.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>123 Music Street<br />Kingston, Jamaica</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>24/7 Live Broadcasting</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Connect With Us</h4>
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Stay updated with our latest shows and events
              </p>
              <Button 
                variant="outline" 
                className="w-full border-primary/50 hover:bg-primary hover:text-primary-foreground"
              >
                <Mail className="w-4 h-4 mr-2" />
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} Primal4K Radio. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <span className="text-border">|</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                Made with <Heart className="w-3 h-3 text-red-500" /> in Jamaica
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;