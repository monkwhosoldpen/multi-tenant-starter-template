"use client";
import { MessagesGrid } from "@/components/goats/MessagesGrid";
import { useEffect, useState } from "react";
import { SubgroupOrChannel } from "@/lib/types/goat";
import { useOfflineContext } from "@/lib/offline-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function WhatsappPage() {
  const [selectedChannel, setSelectedChannel] = useState<SubgroupOrChannel | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);
  const { loadChannelsFromDb, saveChannelToDb } = useOfflineContext();

  // Load ElonMusk's channels by default
  useEffect(() => {
    const loadChannels = async () => {
      setIsLoadingChannels(true);
      try {
        // First check local cache
        const cachedChannels = await loadChannelsFromDb('ElonMusk');
        if (cachedChannels.length > 0) {
          console.log('📦 Using cached channels:', cachedChannels.length);
          setChannels(cachedChannels);
          return;
        }

        // If no cache, fetch from API
        const response = await fetch(`/api/rocket/channels?username=ElonMusk`);
        if (!response.ok) {
          throw new Error('Failed to fetch Rocket.Chat channels');
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch channels');
        }
        
        // Save channels to local DB
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
  }, [loadChannelsFromDb, saveChannelToDb]);

  // Helper function to get channel icon color
  const getChannelColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="h-[calc(100vh-5rem)] mt-20">
      <div className="flex h-full">
        {/* Channels Sidebar */}
        <div className="w-20 bg-[#2B2D31] border-r border-[#1E1F22]">
          <div className="p-4 border-b border-[#1E1F22]">
            <h2 className="text-xs font-semibold text-gray-400 text-center">Channels</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {isLoadingChannels ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
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
                            <AvatarFallback 
                              className={`${getChannelColor(channel.name)} text-white`}
                            >
                              {channel.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {/* Selection Indicator */}
                          {selectedChannel?._id === channel._id && (
                            <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full top-1/2 -translate-y-1/2 -translate-x-2" />
                          )}
                          {/* Unread Indicator */}
                          {channel.msgs > 0 && selectedChannel?._id !== channel._id && (
                            <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                              {channel.msgs}
                            </div>
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
        <div className="flex-1 bg-[#313338]">
          {selectedChannel ? (
            <MessagesGrid subgroup={selectedChannel} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Select a channel to start viewing messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}