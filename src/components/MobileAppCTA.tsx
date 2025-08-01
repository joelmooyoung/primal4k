import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Download } from "lucide-react";

const MobileAppCTA = () => {
  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-glow mx-4 md:mx-0">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-2 text-foreground">
          📱 Get Our Mobile App!
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Install Primal4k to your phone for the best listening experience. 
          Enjoy our radio stations anywhere, anytime.
        </p>
        
        <Button 
          asChild
          className="bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold px-8 py-3 text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-glow"
        >
          <a 
            href="https://app.primal4k.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            🚀 Install Primal4k App
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MobileAppCTA;