import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const ChatRoom = () => {
  const onlineUsers = 47; // This would be dynamic in a real implementation

  return (
    <Card className="bg-gradient-card border-border/50 h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Live Chat
          </CardTitle>
          <Badge variant="secondary" className="bg-chat-online/20 text-chat-online border-chat-online/30">
            <div className="w-2 h-2 bg-chat-online rounded-full mr-2 animate-pulse" />
            {onlineUsers} online
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <div className="h-full">
          <iframe
            src="https://www6.cbox.ws/box/?boxid=860129&boxtag=GAchbo"
            width="100%"
            height="100%"
            allowTransparency={true}
            frameBorder="0"
            scrolling="auto"
            className="rounded-lg"
            title="Live Chat"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatRoom;