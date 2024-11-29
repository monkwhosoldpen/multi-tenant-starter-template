"use client";

import { useEffect, useState } from "react";
import { useOfflineContext } from '@/lib/offline-provider';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRealtimeContext } from "@/lib/realtime-provider";
import { SubgroupOrChannel } from "@/lib/types/goat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// PageHeader Component
const PageHeader = ({ 
  selectedChannel, 
  wsStatus,
  selectedGoat,
  onGoatChange 
}: { 
  selectedChannel: SubgroupOrChannel | null;
  wsStatus: string;
  selectedGoat: string;
  onGoatChange: (value: string) => void;
}) => {
  return (
    <div className="px-4 py-3 border-b border-[#3f4147] bg-[#2B2D31]">
      <div className="flex items-center gap-4">

        {selectedChannel && (
          <>
            <h2 className="text-base font-semibold text-gray-100">
              #{selectedChannel.name}
            </h2>
            <Badge variant="secondary" className="bg-[#3f4147] text-gray-300">
              {wsStatus === 'connected' ? 'Live' : 'Connecting...'}
            </Badge>
          </>
        )}
        
        <div className={`h-2 w-2 rounded-full ml-auto ${
          wsStatus === 'connected' ? 'bg-green-500' : 
          wsStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
      </div>
    </div>
  );
};

// MessageList Component
const MessageList = ({ messages, isLoading }: { messages: any[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No messages yet</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div 
            key={`${message._id}-${new Date(message.ts).getTime()}-${index}`} 
            className="group rounded p-2 hover:bg-[#2e3035]"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-100">{message.u.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(message.ts).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-gray-300">{message.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// MessageInput Component
const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <div className="px-4 py-3 border-t border-[#3f4147] bg-[#2B2D31]">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#383A40] border-0"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button 
          onClick={handleSend}
          className="bg-[#5865F2] hover:bg-[#4752C4]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

// Add SkeletonHeader Component
const SkeletonHeader = () => {
  return (
    <div className="px-4 py-3 border-b border-[#3f4147] bg-[#2B2D31]">
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-32" /> {/* Channel name */}
        <Skeleton className="h-5 w-16" /> {/* Status badge */}
        <div className="h-2 w-2 rounded-full ml-auto bg-gray-600" /> {/* Status dot */}
      </div>
    </div>
  );
};

// Add SkeletonChannels Component
const SkeletonChannels = () => {
  return (
    <div className="flex flex-col items-center gap-3 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="w-12 h-12 rounded-3xl" />
      ))}
    </div>
  );
};

// Add SkeletonMessages Component
const SkeletonMessages = () => {
  return (
    <div className="min-h-0 p-4">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="group rounded p-2">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-24" /> {/* Username */}
              <Skeleton className="h-3 w-32" /> {/* Timestamp */}
            </div>
            <Skeleton className="h-4 w-full max-w-[80%]" /> {/* Message */}
          </div>
        ))}
      </div>
    </div>
  );
};

// Add SkeletonInput Component
const SkeletonInput = () => {
  return (
    <div className="px-4 py-3 border-t border-[#3f4147] bg-[#2B2D31]">
      <div className="flex gap-2">
        <Skeleton className="flex-1 h-10" /> {/* Input field */}
        <Skeleton className="h-10 w-10" /> {/* Send button */}
      </div>
    </div>
  );
};

// Main Page Component
export default function WhatsappPage() {
  const [selectedChannel, setSelectedChannel] = useState<SubgroupOrChannel | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);
  const [selectedGoat, setSelectedGoat] = useState("ElonMusk");
  const { loadChannelsFromDb, saveChannelToDb } = useOfflineContext();
  const { messages, wsStatus, subscribeToChannel, unsubscribeFromChannel } = useRealtimeContext();

  // Channel loading effect
  useEffect(() => {
    const loadChannels = async () => {
      setIsLoadingChannels(true);
      try {
        const cachedChannels = await loadChannelsFromDb(selectedGoat);
        if (cachedChannels.length > 0) {
          console.log('📦 Using cached channels:', cachedChannels.length);
          setChannels(cachedChannels);
          return;
        }

        const response = await fetch(`/api/rocket/channels?username=${selectedGoat}`);
        if (!response.ok) throw new Error('Failed to fetch channels');
        
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Failed to fetch channels');
        
        for (const channel of data.channels) {
          try {
            await saveChannelToDb(channel);
          } catch (err) {
            console.warn('Warning: Failed to cache channel:', channel.name, err);
          }
        }
        
        setChannels(data.channels);
      } catch (error) {
        console.error('❌ Error loading channels:', error);
        setChannels([]);
      } finally {
        setIsLoadingChannels(false);
      }
    };

    loadChannels();
  }, [loadChannelsFromDb, saveChannelToDb, selectedGoat]);

  // Add this effect right after the channel loading effect
  useEffect(() => {
    if (!isLoadingChannels && channels.length > 0 && !selectedChannel) {
      // Find channel with most recent activity
      const mostRecentChannel = channels.reduce((latest, current) => {
        const latestDate = new Date(latest._updatedAt).getTime();
        const currentDate = new Date(current._updatedAt).getTime();
        return currentDate > latestDate ? current : latest;
      }, channels[0]);

      console.log('🎯 Auto-selecting most recent channel:', mostRecentChannel.name);
      setSelectedChannel(mostRecentChannel);
    }
  }, [channels, isLoadingChannels, selectedChannel]);

  // Channel subscription effect
  useEffect(() => {
    if (selectedChannel) {
      const channelId = 'rid' in selectedChannel ? selectedChannel.rid : selectedChannel._id;
      subscribeToChannel(channelId, () => {});
      return () => unsubscribeFromChannel(channelId);
    }
  }, [selectedChannel, subscribeToChannel, unsubscribeFromChannel]);

  const handleGoatChange = (value: string) => {
    console.log("Selected GOAT changed to:", value);
    setSelectedGoat(value);
    setSelectedChannel(null);
    setChannels([]); // Reset channels when changing GOAT
  };

  const getChannelColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    return colors[name.length % colors.length];
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      {isLoadingChannels ? (
        <SkeletonHeader />
      ) : (
        <PageHeader 
          selectedChannel={selectedChannel}
          wsStatus={wsStatus}
          selectedGoat={selectedGoat}
          onGoatChange={handleGoatChange}
        />
      )}
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Channels Sidebar */}
        <div className="w-20 bg-[#2B2D31] border-r border-[#1E1F22]">
          <div className="p-2 border-b border-[#1E1F22]">
            <h2 className="text-xs font-semibold text-gray-400 text-center">Channels</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-6rem)]">
            {isLoadingChannels ? (
              <SkeletonChannels />
            ) : (
              <div className="flex flex-col items-center gap-3 p-2">
                <TooltipProvider>
                  {channels.map((channel) => (
                    <Tooltip key={channel._id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedChannel(channel)}
                          className="relative group"
                        >
                          <Avatar 
                            className={`w-12 h-12 transition-all duration-200 ${
                              selectedChannel?._id === channel._id 
                                ? 'rounded-2xl' 
                                : 'rounded-3xl hover:rounded-2xl'
                            }`}
                          >
                            <AvatarImage src={`/channel-icons/${channel.name}.png`} />
                            <AvatarFallback className={`${getChannelColor(channel.name)} text-white`}>
                              {channel.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {selectedChannel?._id === channel._id && (
                            <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full top-1/2 -translate-y-1/2 -translate-x-2" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="font-medium">#{channel.name}</p>
                        <p className="text-xs text-gray-400">{channel.msgs} messages</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-[#313338] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {isLoadingChannels ? (
              <SkeletonMessages />
            ) : selectedChannel ? (
              <MessageList messages={messages} isLoading={isLoadingChannels} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Select a channel to start viewing messages</p>
              </div>
            )}
          </div>

          {isLoadingChannels ? (
            <SkeletonInput />
          ) : (
            selectedChannel && <MessageInput />
          )}
        </div>
      </div>
    </div>
  );
}