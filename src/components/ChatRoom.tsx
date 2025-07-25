import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users, Clock } from "lucide-react";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isOwn?: boolean;
  country?: string;
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      username: "DJ Gadaffi",
      message: "Craig, Gadaffi probably knows the track number for the songs",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      country: "🇺🇸"
    },
    {
      id: "2", 
      username: "DJ Screech",
      message: "Craig, if you don't have it yet, you should get the remastered copy of that red light album.",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      country: "🇺🇸"
    },
    {
      id: "3",
      username: "Jersey Dude",
      message: "Harmony House Singers One Life to Live is a monster jam. They are Beres Back up singers led by Dwisdion",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      country: "🇺🇸"
    },
    {
      id: "4",
      username: "Shadeed A. Kelly",
      message: "Simply Red!",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      country: "🇺🇸"
    },
    {
      id: "5",
      username: "Jersey Dude",
      message: "mi love da chune ya man",
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
      country: "🇺🇸"
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers] = useState(47);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        username: "You",
        message: newMessage,
        timestamp: new Date(),
        isOwn: true,
        country: "🇺🇸"
      };
      setMessages(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

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
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    msg.isOwn
                      ? 'bg-chat-bubble-own text-white ml-4'
                      : 'bg-chat-bubble text-foreground mr-4'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {msg.country} {msg.username}
                    </span>
                    <span className="text-xs opacity-70 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-input/50 border-border/50 focus:border-primary"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatRoom;