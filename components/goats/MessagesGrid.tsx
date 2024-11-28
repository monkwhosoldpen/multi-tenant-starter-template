'use client';

import { useEffect } from 'react';
import { useRealtimeContext } from '@/lib/realtime-provider';
import { SubgroupOrChannel } from '@/lib/types/goat';

interface MessagesGridProps {
  subgroup: SubgroupOrChannel;
}

export function MessagesGrid({ subgroup }: MessagesGridProps) {
  const { messages, wsStatus, subscribeToChannel, unsubscribeFromChannel } = useRealtimeContext();

  useEffect(() => {
    if ('_id' in subgroup && wsStatus === 'connected') {
      subscribeToChannel(subgroup._id, (message) => {
        console.log('📥 Received message:', message);
      });

      return () => {
        if ('_id' in subgroup) {
          unsubscribeFromChannel(subgroup._id);
        }
      };
    }
  }, [subgroup, wsStatus, subscribeToChannel, unsubscribeFromChannel]);

  if (wsStatus === 'connecting') {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Connecting...
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        No messages yet
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div key={message._id} className="group rounded p-2 hover:bg-[#2e3035]">
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