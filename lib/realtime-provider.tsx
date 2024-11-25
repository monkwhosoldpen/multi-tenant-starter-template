'use client';

import { useEffect, ReactNode, useState, useCallback } from "react";
import React, { createContext, useContext } from "react";
import { Message, Subgroup } from "./types/goat";
import useSuperAdmin from "./mock-provider";
import { fetchMessages, sendMessage as sendMessageToDb } from "./message-handler";

type RealtimeMessagesContextType = {
  messages: Message[];
  subgroupMessageCounts: Record<string, number>;
};

const RealtimeMessagesContext = createContext<RealtimeMessagesContextType>({
  messages: [],
  subgroupMessageCounts: {}
});

export const useRealtimeMessagesContext = () => {
  const context = useContext(RealtimeMessagesContext);
  if (!context) {
    throw new Error('useRealtimeMessagesContext must be used within a RealtimeMessagesProvider');
  }
  return context;
};

function formatMessage(message: any, userProfile: any): Message {
  return {
    content: message.content,
    username: message.username,
    created_at: message.created_at,
  };
}

const DEFAULT_USER_PROFILE = {
  id: 9999,
  name: "System",
  img_url: [],
  verified: false,
  bio: "",
  username: "system",
  wallet_addresses: []
};

export const useRealtimeMessages = (
  goatId?: string,
  subgroup?: Subgroup | null,
  isRealtime: boolean = true
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { CentralSupabase } = useSuperAdmin();

  useEffect(() => {
    if (!subgroup?.username) {
      setLoading(false);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchMessages(subgroup.username, isRealtime);
        if (error) throw error;
        
        const formattedMessages = (data || []).map(msg => formatMessage(msg, DEFAULT_USER_PROFILE));
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Only set up subscription for realtime messages
    if (isRealtime) {
      const subscription = CentralSupabase
        .channel('public:live_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'live_messages',
            filter: `username=eq.${subgroup.username}`
          },
          (payload: any) => {
            console.log('Real-time message received:', payload);
            const formattedMessage = formatMessage(payload.new, DEFAULT_USER_PROFILE);
            setMessages(prev => [...prev, formattedMessage]);
            setNewMessages(prev => [...prev, formattedMessage]);
          }
        )
        .subscribe();

      return () => {
        CentralSupabase.removeChannel(subscription);
      };
    }
  }, [subgroup, isRealtime, CentralSupabase]);

  const sendMessage = useCallback(async (content: string) => {
    if (!subgroup?.username) return;

    try {
      const messageData = {
        content,
        username: subgroup.username,
        created_at: new Date().toISOString(),
      };

      await sendMessageToDb(messageData, isRealtime);
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, [subgroup, isRealtime]);

  return {
    data: messages,
    newMessages,
    isLoading: loading,
    error,
    sendMessage,
  };
};

export const RealtimeMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [subgroupMessageCounts, setSubgroupMessageCounts] = useState<Record<string, number>>({});
  const { CentralSupabase } = useSuperAdmin();

  // Function to update message counts
  const updateMessageCount = useCallback((username: string) => {
    if (!username) {
      console.warn('Attempted to update count for undefined username');
      return;
    }
    
    const normalizedUsername = username.toLowerCase();
    console.log(`Updating count for ${normalizedUsername}`);
    
    setSubgroupMessageCounts(prev => {
      // Check if count is already updated to prevent duplicates
      const currentCount = prev[normalizedUsername] || 0;
      const newCount = currentCount + 1;
      
      // Only update if the count has changed
      if (currentCount === prev[normalizedUsername]) {
        console.log(`${normalizedUsername}: ${currentCount} -> ${newCount}`);
        return {
          ...prev,
          [normalizedUsername]: newCount
        };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    let messageIds = new Set(); // Track processed message IDs

    const fetchMessages = async () => {
      console.log('Fetching initial messages...');
      try {
        const { data, error } = await CentralSupabase
          .from("live_messages")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (!isSubscribed) return;

        console.log('Initial messages fetched:', data?.length || 0, 'messages');
        
        // Calculate initial counts
        const counts: Record<string, number> = {};
        data?.forEach((msg: { username?: string; message_id?: number }) => {
          if (msg.username && msg.message_id) {
            messageIds.add(msg.message_id); // Track message IDs
            const username = msg.username.toLowerCase();
            counts[username] = (counts[username] || 0) + 1;
          }
        });

        console.log('Initial counts calculated:', counts);
        setSubgroupMessageCounts(counts);
        
        const formattedMessages: Message[] = data?.map((msg: Message) => formatMessage(msg, DEFAULT_USER_PROFILE)) || [];
        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching initial messages:", err);
      }
    };

    fetchMessages();

    // Set up realtime subscription
    const channel = CentralSupabase
      .channel("public:live_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_messages",
        },
        (payload: any) => {
          if (!isSubscribed) return;
          
          const newMessage = payload.new;
          const messageId = newMessage?.message_id;
          
          // Skip if we've already processed this message
          if (!messageId || messageIds.has(messageId)) {
            return;
          }
          
          console.log('Real-time update received:', {
            username: newMessage?.username,
            messageId: messageId,
            timestamp: payload.commit_timestamp
          });

          messageIds.add(messageId);

          if (!newMessage?.username) {
            console.warn('Received message without username:', newMessage);
            return;
          }

          setMessages(prev => [
            ...prev,
            formatMessage(newMessage, DEFAULT_USER_PROFILE)
          ]);

          updateMessageCount(newMessage.username);
        }
      )
      .subscribe((status: any) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription...');
      isSubscribed = false;
      messageIds.clear();
      CentralSupabase.removeChannel(channel);
    };
  }, [CentralSupabase, updateMessageCount]);

  // Debug logging for message count updates
  useEffect(() => {
    console.log('Message counts updated:', subgroupMessageCounts);
  }, [subgroupMessageCounts]);

  const contextValue = {
    messages,
    subgroupMessageCounts
  };

  return (
    <RealtimeMessagesContext.Provider value={contextValue}>
      {children}
    </RealtimeMessagesContext.Provider>
  );
};
