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
          📱 Get Our App!
        </h3>
        
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          Install the Primal4k App for the ultimate mobile experience. 
          Stream live shows with offline capabilities and home screen access.
        </p>
        
        <div className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          <p className="mb-2 font-medium">📱 Installation:</p>
          <p className="mb-1">• <strong>iPhone/iPad:</strong> Open in Safari → Tap Share → "Add to Home Screen"</p>
          <p className="mb-1">• <strong>Android:</strong> Open in Chrome → Tap Menu → "Add to Home Screen" or "Install App"</p>
          <p className="mb-1">• <strong>Desktop:</strong> Look for the install icon in your browser's address bar</p>
          <p>• Enjoy full-screen experience, push notifications, and instant loading!</p>
        </div>
        
        <Button 
          asChild
          className="bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold px-8 py-3 text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-glow"
        >
          <a 
            href="/" 
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