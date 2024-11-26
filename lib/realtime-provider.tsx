'use client';

import { useEffect, ReactNode, useState, useContext, createContext } from "react";
import { Message, Subgroup } from "./types/goat";
import useSuperAdmin from "./mock-provider";

interface DatabaseMessage {
  id: string;
  content: string;
  username: string;
  created_at: string;
}

type RealtimeMessagesContextType = {
  allMessages: Message[];
  getMessagesForSubgroup: (username: string) => Message[];
};

const RealtimeMessagesContext = createContext<RealtimeMessagesContextType>({
  allMessages: [],
  getMessagesForSubgroup: () => []
});

export const useRealtimeMessagesContext = () => {
  const context = useContext(RealtimeMessagesContext);
  if (!context) {
    throw new Error('useRealtimeMessagesContext must be used within a RealtimeMessagesProvider');
  }
  return context;
};

function formatMessage(msg: DatabaseMessage): Message {
  return {
    content: msg.content,
    username: msg.username,
    created_at: msg.created_at,
  };
}

export const useRealtimeMessages = (
  goatId?: string,
  subgroup?: Subgroup | null,
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { allMessages, getMessagesForSubgroup } = useRealtimeMessagesContext();

  useEffect(() => {
    if (!subgroup?.username) {
      setLoading(false);
      return;
    }

    // Simulate loading time for UI consistency
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [subgroup?.username]);

  const messages = subgroup ? getMessagesForSubgroup(subgroup.username) : [];

  return {
    data: messages,
    isLoading: loading,
    error,
  };
};

export const RealtimeMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<DatabaseMessage[]>([]);
  const { CentralSupabase } = useSuperAdmin();

  useEffect(() => {
    console.log('Setting up global realtime subscription');
    
    const loadAllMessages = async () => {
      try {
        const { data, error } = await CentralSupabase
          .from("live_messages")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        console.log(`Initially loaded ${data?.length || 0} messages`);
        setMessages(data || []);
      } catch (err) {
        console.error('Error loading initial messages:', err);
      }
    };

    loadAllMessages();
    
    const subscription = CentralSupabase
      .channel('public:live_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_messages'
        },
        (payload: { eventType: string; new: DatabaseMessage; old: DatabaseMessage }) => {
          console.log('Message event:', payload.eventType, payload.new || payload.old);
          
          switch (payload.eventType) {
            case 'INSERT':
              setMessages(prev => [...prev, payload.new]);
              break;
            case 'DELETE':
              setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
              break;
            case 'UPDATE':
              setMessages(prev => prev.map(msg => 
                msg.id === payload.new.id ? payload.new : msg
              ));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up global subscription');
      CentralSupabase.removeChannel(subscription);
    };
  }, [CentralSupabase]);

  const getMessagesForSubgroup = (username: string) => {
    return messages
      .filter(msg => msg.username === username)
      .map(formatMessage);
  };

  const contextValue = {
    allMessages: messages.map(formatMessage),
    getMessagesForSubgroup
  };

  return (
    <RealtimeMessagesContext.Provider value={contextValue}>
      {children}
    </RealtimeMessagesContext.Provider>
  );
};
