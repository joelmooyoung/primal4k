import { Play, Pause, Volume2, Home, Menu, Radio, Music, Tv, Users } from "lucide-react";

const IconTest = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-card p-4 rounded-lg border border-border z-50">
      <h3 className="text-sm font-semibold mb-2">Icon Test</h3>
      <div className="flex flex-wrap gap-2">
        <Play className="w-6 h-6 text-primary" />
        <Pause className="w-6 h-6 text-primary" />
        <Volume2 className="w-6 h-6 text-primary" />
        <Home className="w-6 h-6 text-primary" />
        <Menu className="w-6 h-6 text-primary" />
        <Radio className="w-6 h-6 text-primary" />
        <Music className="w-6 h-6 text-primary" />
        <Tv className="w-6 h-6 text-primary" />
        <Users className="w-6 h-6 text-primary" />
      </div>
    </div>
  );
};

export default IconTest;