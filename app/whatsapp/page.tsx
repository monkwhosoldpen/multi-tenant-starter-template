"use client";

import { useEffect, useState, memo, useCallback } from "react";
import { useData } from '@/lib/data-provider';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { MessageType, ChannelType } from '@/lib/models/schema';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Loading Components
const LoadingChannels = () => {
  return (
    <div className="flex flex-col items-center gap-3 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className="w-12 h-12 rounded-3xl bg-gray-700 animate-pulse"
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

const LoadingMessages = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-400">Loading messages...</p>
      </div>
    </div>
  );
};

const EmptyMessages = () => {
  return (
    <div className="flex items-center justify-center h-full text-gray-400">
      <p>No messages yet</p>
    </div>
  );
};

// Message Components
const MessageItem: React.FC<{ message: MessageType }> = ({ message }) => {
  
  const timestamp = new Date(message.ts);
  const isValidDate = !isNaN(timestamp.getTime());

  return (
    <div className="group rounded p-2 hover:bg-[#2e3035]">
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-100">{message.u.name}</span>
        <span className="text-xs text-gray-400">
          {isValidDate ? timestamp.toLocaleString() : 'Invalid date'}
        </span>
      </div>
      <p className="mt-1 text-gray-300">{message.msg}</p>
    </div>
  );
};

// Channel Components
const ChannelItem: React.FC<{
  channel: ChannelType;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ channel, isSelected, onSelect }) => {

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            onSelect();
          }}
          className="relative group"
        >
          <Avatar 
            className={`w-12 h-12 transition-all duration-200 ${
              isSelected ? 'rounded-2xl' : 'rounded-3xl hover:rounded-2xl'
            }`}
          >
            <AvatarFallback className="bg-blue-500 text-white">
              {channel.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isSelected && (
            <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full top-1/2 -translate-y-1/2 -translate-x-2" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p className="font-medium">#{channel.name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Header Component
const PageHeader = memo(() => {
  const { 
    selectedChannel, 
    wsStatus, 
    selectedGoat,
    setSelectedGoat,
    isOnlineMode,
    handleOnlineToggle
  } = useData();

  // Log switch state changes only, not on every render
  useEffect(() => {
    console.log('🔌 [Connection Status]', {
      mode: isOnlineMode ? 'ONLINE' : 'OFFLINE',
      timestamp: new Date().toISOString(),
      selectedChannel: selectedChannel?.name || 'none'
    });
  }, [isOnlineMode, selectedChannel]);

  const handleSwitchChange = useCallback((checked: boolean) => {
    console.log('🎯 [Switch Action]', {
      from: isOnlineMode ? 'ONLINE' : 'OFFLINE',
      to: checked ? 'ONLINE' : 'OFFLINE',
      timestamp: new Date().toISOString()
    });
    handleOnlineToggle(checked);
  }, [isOnlineMode, handleOnlineToggle]);

  return (
    <div className="px-4 py-3 border-b border-[#3f4147] bg-[#2B2D31]">
      <div className="flex items-center gap-4">
        {selectedChannel && (
          <h2 className="text-base font-semibold text-gray-100">
            #{selectedChannel.name}
          </h2>
        )}
        
        <div className="ml-auto flex items-center gap-4">
          <Switch
            checked={isOnlineMode}
            onCheckedChange={handleSwitchChange}
            className={`${isOnlineMode ? 'bg-green-500' : 'bg-red-500'}`}
            aria-label="Toggle online/offline mode"
          />
          <div 
            className={`h-2 w-2 rounded-full ${
              isOnlineMode ? 'bg-green-500' : 'bg-red-500'
            }`} 
          />
        </div>
      </div>
    </div>
  );
});

PageHeader.displayName = 'PageHeader';

// Channel List Component
const ChannelList = () => {
  const { 
    channels, 
    selectedChannel, 
    handleChannelSelect,
    isLoadingChannels 
  } = useData();

  useEffect(() => {
  }, [channels, selectedChannel, isLoadingChannels]);

  if (isLoadingChannels) {
    return <LoadingChannels />;
  }

  return (
    <ScrollArea className="h-[calc(100vh-6rem)]">
      <div className="flex flex-col items-center gap-3 p-2">
        <TooltipProvider>
          {channels.map((channel) => (
            <ChannelItem 
              key={channel._id}
              channel={channel}
              isSelected={selectedChannel?._id === channel._id}
              onSelect={() => handleChannelSelect(channel)}
            />
          ))}
        </TooltipProvider>
      </div>
    </ScrollArea>
  );
};

// Message List Component
const MessageList = () => {
  const { messages, isLoadingMessages } = useData();

  useEffect(() => {
  }, [messages, isLoadingMessages]);

  if (isLoadingMessages) {
    return <LoadingMessages />;
  }

  if (!messages?.length) {
    return <EmptyMessages />;
  }

  return (
    <div className="min-h-0 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem 
            key={`${message._id}-${message.ts}`}
            message={message} 
          />
        ))}
      </div>
    </div>
  );
};

// Input Component
const MessageInput = () => {
  const [message, setMessage] = useState("");
  
  const handleSend = () => {
    setMessage("");
  };

  return (
    <div className="px-4 py-3 border-t border-[#3f4147] bg-[#2B2D31]">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
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

// Main Page Component
export default function WhatsappPage() {
  const { initializeChannels, selectedGoat } = useData();

  useEffect(() => {
   
    const initialize = async () => {
      if (selectedGoat) {
        try {
          await initializeChannels(selectedGoat);
        } catch (error) {
        }
      }
    };

    initialize();

    return () => {
    };
  }, [selectedGoat, initializeChannels]);

  return (
    <div className="h-screen flex flex-col">
      <PageHeader />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-20 bg-[#2B2D31] border-r border-[#1E1F22]">
          <ChannelList />
        </div>
        <div className="flex-1 bg-[#313338] flex flex-col">
          <MessageList />
          <MessageInput />
        </div>
      </div>
    </div>
  );
}