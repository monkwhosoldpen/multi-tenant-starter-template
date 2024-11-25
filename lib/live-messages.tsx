import { useEffect, ReactNode, useCallback } from "react";
import React, { createContext, useContext, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { Message, Subgroup } from "./types/goat";
import useSuperAdmin from "./usesuperamin";

type LiveMessagesContextType = {
  messages: Message[];
  inAppNotification?: {
    message: string;
    sender: string;
  } | null;
};

const LiveMessagesContext = createContext<LiveMessagesContextType>({
  messages: [],
  inAppNotification: null,
});

export const useLiveMessagesContext = () => {
  const context = useContext(LiveMessagesContext);
  if (!context) {
    throw new Error('useLiveMessagesContext must be used within a LiveMessagesProvider');
  }
  return context;
};

export type ChannelMessageItem = {
  channel_message: {
    id: number;
    created_at: string;
    updated_at: string;
    is_payment_gated: boolean;
    body: string;
    body_text_length: number;
    sent_by: {
      id: number;
      admin: boolean;
      created_at: string;
      updated_at: string;
      profile: {
        verified: boolean;
        bio: string;
        profile_id: number;
        name: string;
        username: string;
        wallet_addresses: string[];
        img_url: string[];
      };
    };
  };
  reaction_group: Array<{
    reaction_id: number;
    count: number;
    self_reacted: boolean;
  }>;
  read: boolean;
};

// Helper function to show notifications across platforms
const showNotification = (title: string, body: string) => {
  console.log(`${title}: ${body}`); // Simple console log instead of toast
};

function formatMessage(message: any, userProfile: any): Message {
  return {
    content: message.content,
    username: message.username,
    created_at: message.created_at,
    channel_message: {
      id: message.id || Math.random(),
      created_at: message.created_at,
      updated_at: message.created_at,
      is_payment_gated: false,
      body: message.content,
      body_text_length: message.content?.length || 0,
      sent_by: {
        id: userProfile.id,
        admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile: {
          verified: userProfile.verified || false,
          bio: userProfile.bio,
          profile_id: userProfile.id,
          name: userProfile.name,
          username: userProfile.username,
          wallet_addresses: userProfile.wallet_addresses || [],
          img_url: Array.isArray(userProfile.img_url) ? userProfile.img_url : [userProfile.img_url]
        }
      }
    },
    reactions: [
      {
        reaction_id: 1,
        count: 0,
        self_reacted: false
      }
    ],
  };
}

export const LiveMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inAppNotification, setInAppNotification] = useState<{
    message: string;
    sender: string;
  } | null>(null);
  const { CentralSupabase } = useSuperAdmin();

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('Fetching initial messages...');
      const { data, error } = await CentralSupabase
        .from("live_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        console.log('Initial messages fetched:', data);
        const formattedMessages = data.map((msg: any) => formatMessage(msg, DEFAULT_USER_PROFILE));
        setMessages(formattedMessages);
      }
    };

    fetchMessages();

    const subscription = CentralSupabase
      .channel("public:live_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_messages",
        },
        (payload: any) => {
          console.log('Real-time update received:', payload);
          setMessages((prev: Message[]) => {
            showNotification(
              'New Message',
              payload.new.content
            );

            const formattedMessage = formatMessage(payload.new, DEFAULT_USER_PROFILE);
            return [...prev, formattedMessage];
          });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscription...');
      CentralSupabase.removeChannel(subscription);
    };
  }, [CentralSupabase]);

  return (
    <LiveMessagesContext.Provider value={{ messages, inAppNotification }}>
      {children}
    </LiveMessagesContext.Provider>
  );
};

// Add a type for message counts
type MessageCounts = {
  [key: string]: number;
};

const DEFAULT_USER_PROFILE = {
  id: 9999,
  name: "System",
  img_url: [],
  verified: false,
  bio: "",
  username: "system",
  wallet_addresses: []
};

const main_NEXT_PUBLIC_SUPABASE_URL = "https://iuqlvszkpbexblscnpay.supabase.co";
const main_NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cWx2c3prcGJleGJsc2NucGF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTA5MzAwMCwiZXhwIjoyMDQwNjY5MDAwfQ.ckanGyem0hVF9ub9IN3UxnaqgOC2ttFZ5Ifa5WQdh4E';

const supabase = createClient(
  main_NEXT_PUBLIC_SUPABASE_URL,
  main_NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

export const useLiveMessages = (
  username?: string | number, 
  subgroup?: Subgroup | null, 
  isRealtime: boolean = true
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const [messageCounts, setMessageCounts] = useState<MessageCounts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Force tableType based on isRealtime prop
  const tableType = isRealtime ? 'live_messages' : 'messages' as const;

  // Add the updateMessageCounts function
  const updateMessageCounts = useCallback((msgs: any[]) => {
    const counts: MessageCounts = {};
    msgs.forEach((msg) => {
      const username = msg.username?.toLowerCase();
      if (username) {
        counts[username] = (counts[username] || 0) + 1;
      }
    });
    setMessageCounts(counts);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!subgroup?.username) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching messages with params:', {
          username,
          subgroup,
          isRealtime: subgroup.is_realtime,
          tableType: subgroup.is_realtime ? 'live_messages' : 'messages'
        });
        
        // Direct database call
        const { data, error } = await supabase
          .from(subgroup.is_realtime ? 'live_messages' : 'messages')
          .select('*')
          .eq('username', subgroup.username === 'public' ? username : subgroup.username)
          .order('created_at', { ascending: true });

        if (error) throw error;

        console.log(`Fetched ${data?.length || 0} messages from ${tableType}`);
        
        const formattedMessages = (data || []).map((msg: any) => formatMessage(msg, DEFAULT_USER_PROFILE));
        setMessages(formattedMessages);
        updateMessageCounts(data || []);
      } catch (err) {
        setError(err as Error);
        console.error(`Error fetching messages from ${tableType}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [username, subgroup, tableType, updateMessageCounts]);

  // Only set up real-time subscription for live messages
  useEffect(() => {
    if (!subgroup?.is_realtime || !subgroup?.username) {
      console.log('Skipping real-time subscription:', {
        isRealtime: subgroup?.is_realtime,
        username: subgroup?.username,
        reason: !subgroup?.is_realtime ? 'non-realtime subgroup' : 'no username'
      });
      return;
    }

    console.log(`Setting up real-time subscription for ${subgroup.username} in ${tableType}`);
    
    const channel = supabase
      .channel('live_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableType,
          filter: `username=eq.${subgroup.username}`
        },
        (payload: any) => {
          console.log('Received real-time message:', payload);
          const formattedMessage = formatMessage(payload.new, DEFAULT_USER_PROFILE);

          setMessages(prev => {
            const newMessages = [...prev, formattedMessage];
            updateMessageCounts(newMessages);
            return newMessages;
          });
          setNewMessages(prev => [...prev, formattedMessage]);
        }
      )
      .subscribe();

    return () => {
      console.log(`Cleaning up subscription for ${subgroup.username}`);
      supabase.channel('live_messages').unsubscribe();
    };
  }, [subgroup, tableType]);

  // Add function to send messages
  const sendMessage = async (content: string) => {
    if (!subgroup?.username) return;

    try {
      const messageData = {
        content,
        username: subgroup.username,
        created_at: new Date().toISOString(),
        type: 'DEFAULT',
        view: 'DEFAULT',
        is_blocked: false
      };

      const { error } = await supabase
        .from(subgroup.is_realtime ? 'live_messages' : 'messages')
        .insert([messageData]);

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  return {
    data: messages,
    newMessages,
    messageCounts,
    isLoading: loading,
    isLoadingMore: false,
    error,
    sendMessage,
    markAllAsRead: useCallback(() => {
      setNewMessages([]);
    }, []),
  };
}; 