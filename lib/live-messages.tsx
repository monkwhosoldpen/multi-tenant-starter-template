'use client';

import { useEffect, ReactNode, useCallback } from "react";
import React, { createContext, useContext, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { Message, Subgroup } from "./types/goat";

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
const main_NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cWx2c3prcGJleGJsc2NucGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTMwMDAsImV4cCI6MjA0MDY2OTAwMH0.VlQG9CG1s4m9ZLFcFH_W6E2VpWNHtVftKdvRGIWZz6Y";
const main_NEXT_PUBLIC_SUPABASE_JWT_SECRET = 'LaSV5x4LCxHwKz9UDedXSk+PooG5wxHtecwBIPD/bY8uUjGF9QXIhYiQBKm0qdp/FWcOLesCJZQdLld4em5gPQ==';

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

// Add this near the top of the file, after imports
const isPublicGroup = (username?: string): boolean => {
  if (!username) return false;
  return username.toLowerCase() === 'public';
};

type SuperAdminContextType = {
  supabase: any;
  CentralSupabase: any;
  fetchGoats: () => Promise<{ data: any[] | null; error: any }>;
  createGoat: (goatData: any) => Promise<{ data: any | null; error: any }>;
  deleteGoat: (uid: string) => Promise<{ data: any | null; error: any }>;
  updateGoat: (uid: string, goatData: any) => Promise<{ data: any | null; error: any }>;
  clearAllGoats: () => Promise<{ data: any | null; error: any }>;
  mockMultipleGoats: (goatsData: any[]) => Promise<{ data: any | null; error: any }>;
  fetchApprovals: () => Promise<{ 
    data: {
      id: string;
      user_id: string;
      channel_id: string;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      created_at: string;
      updated_at: string;
    }[] | null; 
    error: any 
  }>;
  generateMockApprovals: () => Promise<{ data: any | null; error: any }>;
  handleApproval: (approvalId: string, status: 'APPROVED' | 'REJECTED') => Promise<{ data: any | null; error: any }>;
  fetchSubgroups: (goatId: string) => Promise<{ data: any[] | null; error: any }>;
  createSubgroup: (subgroupData: Subgroup) => Promise<{ data: any | null; error: any }>;
  createBulkSubgroups: (subgroups: Subgroup[]) => Promise<{ data: any | null; error: any }>;
  createMessage: (messageData: any) => Promise<{ data: any | null; error: any }>;
  createBulkMessages: (messages: Message[], tableType: 'live_messages' | 'messages') => Promise<{ data: any | null; error: any }>;
  deleteSubgroup: (subgroupId: number) => Promise<{ data: any | null; error: any }>;
  clearAllSubgroups: (ownerUsername: string) => Promise<{ data: any | null; error: any }>;
  updateSubgroup: (ownerUsername: string, type: string, updates: any) => Promise<{ data: any | null; error: any }>;
  deleteMessages: (ownerUsername: string, username: string, table: 'live_messages' | 'messages', type: string) => Promise<{ data: any | null; error: any }>;
};

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export function SuperadminProvider({ children }: { children: ReactNode }) {

  const supabase = createClient(main_NEXT_PUBLIC_SUPABASE_URL, main_NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);

  const CentralSupabase = supabase;

  const fetchGoats = async () => {
    const { data, error } = await CentralSupabase.from("user_profiles").select("*");
    return { data, error };
  };

  const createGoat = async (goatData: any) => {
    const { data, error } = await CentralSupabase
      .from("user_profiles")
      .upsert([goatData], {
        onConflict: 'uid',
        // returning: 'minimal'
      });
    return { data, error };
  };

  const deleteGoat = async (uid: string) => {
    // Artificial delay of 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const { data, error } = await CentralSupabase
      .from("user_profiles")
      .delete()
      .match({ uid });
    
    return { data, error };
  };

  const updateGoat = async (uid: string, goatData: any) => {
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { data, error } = await CentralSupabase
      .from("user_profiles")
      .update(goatData)
      .match({ uid });
    
    return { data, error };
  };

  const clearAllGoats = async () => {
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { data, error } = await CentralSupabase
      .from("user_profiles")
      .delete()
      .not('uid', 'is', null); // Delete all records with non-null UIDs
    
    return { data, error };
  };

  const mockMultipleGoats = async (goatsData: any[]) => {
    const { data, error } = await CentralSupabase
      .from("user_profiles")
      .upsert(goatsData, {
        onConflict: 'uid',
      });
    return { data, error };
  };

  const fetchApprovals = async () => {
    const { data, error } = await CentralSupabase
      .from("tenant_approvals")
      .select("*")
      .order('created_at', { ascending: false });
    return { data, error };
  };

  const generateMockApprovals = async () => {
    // Get some existing user profiles for realistic data
    const { data: users } = await CentralSupabase
      .from("user_profiles")
      .select("uid")
      .limit(5);

    if (!users) return { data: null, error: new Error("No users found") };

    const channels = ['TWITTER', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK', 'TIKTOK'];
    
    const mockApprovals = [];
    
    for (const user of users) {
      // Get user's current channels from metadata
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user.uid);
      if (userError) continue;

      const existingChannels = userData.user.user_metadata?.channels || [];
      const existingChannelIds = new Set(existingChannels.map((c: any) => c.channelId));

      // Only create approvals for channels that don't exist in metadata
      const availableChannels = channels.filter(channel => !existingChannelIds.has(channel));
      const selectedChannels = availableChannels.slice(0, Math.floor(Math.random() * 3) + 1);

      for (const channel of selectedChannels) {
        mockApprovals.push({
          id: crypto.randomUUID(),
          user_id: user.uid,
          channel_id: channel,
          status: 'PENDING',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Add pending channel to user metadata
        const updatedChannels = [
          ...existingChannels,
          { channelId: channel, status: 'PENDING' }
        ];

        await supabase.auth.admin.updateUserById(
          user.uid,
          {
            user_metadata: {
              ...userData.user.user_metadata,
              channels: updatedChannels
            }
          }
        );
      }
    }

    if (mockApprovals.length === 0) {
      return { data: null, error: new Error("No mock approvals created") };
    }

    const { data, error } = await CentralSupabase
      .from("tenant_approvals")
      .insert(mockApprovals);
    
    return { data, error };
  };

  const handleApproval = async (approvalId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      // First get the approval record
      const { data: approvalData, error: fetchError } = await CentralSupabase
        .from("tenant_approvals")
        .select("*")
        .eq('id', approvalId)
        .single();

      if (fetchError) throw fetchError;
      if (!approvalData) throw new Error('Approval not found');

      // Update the approval status in tenant_approvals
      const { error: updateError } = await CentralSupabase
        .from("tenant_approvals")
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', approvalId);

      if (updateError) throw updateError;

      // Update the user's metadata in Supabase Auth
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
        approvalData.user_id
      );

      if (userError) throw userError;

      const existingChannels = userData.user.user_metadata?.channels || [];
      const updatedChannels = existingChannels.map((channel: any) => 
        channel.channelId === approvalData.channel_id 
          ? { ...channel, status }
          : channel
      );

      // If channel doesn't exist in metadata, add it
      if (!existingChannels.some((c: any) => c.channelId === approvalData.channel_id)) {
        updatedChannels.push({
          channelId: approvalData.channel_id,
          status
        });
      }

      const { error: updateUserError } = await supabase.auth.admin.updateUserById(
        approvalData.user_id,
        {
          user_metadata: {
            ...userData.user.user_metadata,
            channels: updatedChannels
          }
        }
      );

      if (updateUserError) throw updateUserError;

      return { data: approvalData, error: null };
    } catch (error) {
      console.error('Error in handleApproval:', error);
      return { data: null, error };
    }
  };

  const fetchSubgroups = async (goatId: string) => {
    const { data, error } = await CentralSupabase
      .from("sub_groups")
      .select("*")
      .eq('owner_username', goatId);
    return { data, error };
  };

  const fetchMessages = async (goatId: string, username: string, table: 'live_messages' | 'messages') => {
    console.log('fetchMessages called with:', { goatId, username, table });
    
    const { data, error } = await CentralSupabase
      .from(table)
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: true });
    
    console.log(`fetchMessages response from ${table}:`, { data, error });
    return { data, error };
  };

  const createSubgroup = async (subgroupData: any) => {
    // Delete existing subgroup with same owner and type
    await CentralSupabase
      .from("sub_groups")
      .delete()
      .eq('owner_username', subgroupData.owner_username)
      .eq('category', subgroupData.type);

    // Then insert the new subgroup
    const { data, error } = await CentralSupabase
      .from("sub_groups")
      .insert([subgroupData])
      .select();
    return { data, error };
  };

  const createBulkSubgroups = async (subgroups: any[]) => {
    // Delete existing subgroups for each owner_username and type combination
    for (const subgroup of subgroups) {
      await CentralSupabase
        .from("sub_groups")
        .delete()
        .eq('owner_username', subgroup.owner_username)
        .eq('type', subgroup.type);
    }

    // Then insert all new subgroups
    const { data, error } = await CentralSupabase
      .from("sub_groups")
      .insert(subgroups)
      .select();
    return { data, error };
  };

  const createMessage = async (messageData: any) => {
    const table = messageData.tableType; // Use the specified table
    console.log('Creating message in table:', table);
    
    const { data, error } = await CentralSupabase
      .from(table)
      .insert([{
        username: messageData.username,
        content: messageData.content,
        created_at: messageData.created_at,
      }])
      .select();
    return { data, error };
  };

  const createBulkMessages = async (messages: Message[], tableType: 'live_messages' | 'messages') => {
    console.log('Creating bulk messages in table:', tableType);
    
    const formattedMessages = messages.map(msg => {
      const isPublic = isPublicGroup(msg.username);
      return {
        username: msg.username, // Keep username as is
        content: msg.content,
        created_at: msg.created_at,
      };
    });

    const { data, error } = await CentralSupabase
      .from(tableType)
      .insert(formattedMessages)
      .select();

    console.log(`Created ${messages.length} messages in ${tableType}:`, { data, error });
    return { data, error };
  };

  const deleteSubgroup = async (subgroupId: number) => {
    const { data, error } = await CentralSupabase
      .from("sub_groups")
      .delete()
      .eq('subgroup_id', subgroupId);
    return { data, error };
  };

  const clearAllSubgroups = async (ownerUsername: string) => {
    return await supabase
      .from('sub_groups')
      .delete()
      .eq('owner_username', ownerUsername);
  };

  const updateSubgroup = async (ownerUsername: string, type: string, updates: any) => {
    const { data, error } = await CentralSupabase
      .from("sub_groups")
      .update(updates)
      .eq('owner_username', ownerUsername)
      .eq('type', type);
    return { data, error };
  };

  const deleteMessages = async (ownerUsername: string, username: string, table: 'live_messages' | 'messages', type: string) => {
    debugger;
    try {
      if (isPublicGroup(username)) {
        // For public group, delete messages for the current owner only
        const { data, error } = await CentralSupabase
          .from(table)
          .delete()
          .eq('username', ownerUsername);
        return { data, error };
      } else {
        // For other groups, delete all messages for that username
        const { data, error } = await CentralSupabase
          .from(table)
          .delete()
          .eq('username', username);
        return { data, error };
      }
    } catch (error) {
      console.error('Error in deleteMessages:', error);
      return { data: null, error };
    }
  };

  return (
    <SuperAdminContext.Provider value={{ 
      supabase, 
      CentralSupabase, 
      fetchGoats, 
      createGoat, 
      deleteGoat,
      updateGoat,
      clearAllGoats,
      mockMultipleGoats,
      fetchApprovals,
      generateMockApprovals,
      handleApproval,
      fetchSubgroups,
      createSubgroup,
      createBulkSubgroups,
      createMessage,
      createBulkMessages,
      deleteSubgroup,
      clearAllSubgroups,
      updateSubgroup,
      deleteMessages,
    }}>
      {children}
    </SuperAdminContext.Provider>
  );
}

export default function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (context === undefined) {
    throw new Error('useSuperAdmin must be used within a SuperadminProvider');
  }
  return context;
}
