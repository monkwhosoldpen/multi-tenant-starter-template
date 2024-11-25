'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useLiveMessages } from "@/lib/live-messages";
import { Message, Subgroup } from "@/lib/types/goat";

interface MessagesGridProps {
  goatId: string;
  ownerUsername: string | undefined;
  selectedCategory: string;
  subgroup: Subgroup;
}

export function MessagesGrid({
  goatId,
  ownerUsername,
  selectedCategory,
  subgroup
}: MessagesGridProps) {
  const [newMessage, setNewMessage] = useState('');
  const actualUsername = ownerUsername?.toLowerCase() || '';

  const {
    data: messages,
    isLoading: loading,
    newMessages,
    messageCounts,
    error,
    sendMessage
  } = useLiveMessages(goatId, subgroup, subgroup.is_realtime);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Error in handleSendMessage:', err);
    }
  };

  // Generate a random color for each sender
  const getSenderColor = (sender: string) => {
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      hash = sender.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error loading messages
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#313338]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            <div>Loading messages from {subgroup.is_realtime ? 'live_messages' : 'messages'}...</div>
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-gray-400 p-4">
            <div className="w-72 h-72 relative">
              <img 
                src="https://placehold.co/300x300?text=💬" 
                alt="No messages"
                className="w-full h-full object-contain opacity-50"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/300x300?text=💬';
                }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-300">
                Welcome to #{actualUsername}!
              </h3>
              <p className="text-sm text-gray-400 max-w-md">
                This is the beginning of the {actualUsername} subgroup.
                <br />
                {subgroup.is_realtime ? 'Start a real-time conversation' : 'Add some static messages'} below.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {messages.map((message: Message, index: number) => {
              const senderName = `User ${index + 1}`;
              const senderColor = getSenderColor(senderName);
              
              return (
                <div key={index} className="flex items-start gap-3 group hover:bg-[#2e3035] p-2 rounded">
                  <Avatar className="h-10 w-10 rounded-full">
                    <AvatarImage src={`https://placehold.co/100/${senderColor.replace('#', '')}?text=${senderName[0]}`} />
                    <AvatarFallback style={{ backgroundColor: senderColor }}>
                      {senderName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100" style={{ color: senderColor }}>
                        {senderName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300 break-words">{message.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-[#313338] border-t border-[#3f4147]">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={messages.length === 0 ? 
              `Welcome to #${actualUsername}! Send your first message...` : 
              `Message #${actualUsername}`
            }
            className="bg-[#383a40] border-none text-gray-100 placeholder-gray-400 focus-visible:ring-1 focus-visible:ring-[#5865f2]"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 