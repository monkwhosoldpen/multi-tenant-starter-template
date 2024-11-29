'use client';

import { useEffect, useState } from 'react';
import { useRealtimeContext } from '@/lib/realtime-provider';
import { SubgroupOrChannel } from '@/lib/types/goat';
import { useOfflineContext } from '@/lib/offline-provider';

interface MessagesGridProps {
  subgroup: SubgroupOrChannel;
}

export const MessagesGrid = ({ subgroup }: MessagesGridProps) => {
  const { messages, subscribeToChannel, unsubscribeFromChannel, wsStatus } = useRealtimeContext();
  const { loadMessagesFromDb, isOfflineDisabled } = useOfflineContext();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const channelId = 'rid' in subgroup ? subgroup.rid : subgroup._id;
    setIsLoading(true);
    
    const loadMessages = async () => {
      try {
        // Only try loading from DB if offline is enabled
        if (!isOfflineDisabled) {
          const cachedMessages = await loadMessagesFromDb(channelId);
          if (cachedMessages && cachedMessages.length > 0) {
            console.log('📦 Using cached messages:', cachedMessages.length);
          }
        }

        // Subscribe to real-time updates
        await subscribeToChannel(channelId, (message) => {
          // Handle real-time updates
        });
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
    
    return () => {
      unsubscribeFromChannel(channelId);
    };
  }, [subgroup, subscribeToChannel, unsubscribeFromChannel, loadMessagesFromDb, isOfflineDisabled]);

  if (isLoading || wsStatus === 'connecting') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-200"></div>
          <p className="text-sm text-gray-400">
            {wsStatus === 'connecting' ? 'Connecting...' : 'Loading messages...'}
          </p>
        </div>
      </div>
    );
  }

  if (wsStatus === 'disconnected') {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-2">
          <span className="text-red-400">⚠️</span>
          <p>Connection lost. Trying to reconnect...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        No messages yet
      </div>
    );
  }

  // Remove duplicate messages
  const uniqueMessages = messages.reduce((acc, current) => {
    const x = acc.find(item => item._id === current._id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as typeof messages);

  // Sort messages by timestamp
  const sortedMessages = [...uniqueMessages].sort((a, b) => 
    new Date(a.ts).getTime() - new Date(b.ts).getTime()
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-4 p-4">
        {sortedMessages.map((message) => (
          <div 
            key={`${message._id}-${message.ts}`} 
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
} 