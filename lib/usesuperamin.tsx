'use client';

import { createContext, useContext, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Message, Subgroup } from './types/goat';

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
  fetchMessages: (goatId: string, username: string, table: 'live_messages' | 'messages') => Promise<{ data: any[] | null; error: any }>;
  createSubgroup: (subgroupData: Subgroup) => Promise<{ data: any | null; error: any }>;
  createBulkSubgroups: (subgroups: Subgroup[]) => Promise<{ data: any | null; error: any }>;
  createMessage: (messageData: any) => Promise<{ data: any | null; error: any }>;
  createBulkMessages: (messages: Message[], tableType: 'live_messages' | 'messages') => Promise<{ data: any | null; error: any }>;
  deleteSubgroup: (subgroupId: number) => Promise<{ data: any | null; error: any }>;
  clearAllSubgroups: (ownerUsername: string) => Promise<{ data: any | null; error: any }>;
  updateSubgroup: (ownerUsername: string, type: string, updates: any) => Promise<{ data: any | null; error: any }>;
  deleteMessages: (username: string, table: 'live_messages' | 'messages', type: string) => Promise<{ data: any | null; error: any }>;
};

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

const main_NEXT_PUBLIC_SUPABASE_URL = "https://iuqlvszkpbexblscnpay.supabase.co";
const main_NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cWx2c3prcGJleGJsc2NucGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTMwMDAsImV4cCI6MjA0MDY2OTAwMH0.VlQG9CG1s4m9ZLFcFH_W6E2VpWNHtVftKdvRGIWZz6Y";
const main_NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cWx2c3prcGJleGJsc2NucGF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTA5MzAwMCwiZXhwIjoyMDQwNjY5MDAwfQ.ckanGyem0hVF9ub9IN3UxnaqgOC2ttFZ5Ifa5WQdh4E';
const main_NEXT_PUBLIC_SUPABASE_JWT_SECRET = 'LaSV5x4LCxHwKz9UDedXSk+PooG5wxHtecwBIPD/bY8uUjGF9QXIhYiQBKm0qdp/FWcOLesCJZQdLld4em5gPQ==';

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
    console.log('useSuperAdmin fetchMessages called with:', { goatId, username, table });
    const { data, error } = await CentralSupabase
      .from(table)
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: true });
    console.log('fetchMessages response:', { data, error });
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
    const { data, error } = await CentralSupabase
      .from('live_messages')
      .insert([{
        room: messageData.username,
        username: messageData.username,
        content: messageData.content,
        created_at: messageData.created_at,
        type: 'DEFAULT',
        view: 'DEFAULT',
        is_blocked: false
      }])
      .select();
    return { data, error };
  };

  const createBulkMessages = async (messages: Message[], tableType: 'live_messages' | 'messages') => {
    const table = tableType;
    
    const { data, error } = await CentralSupabase
      .from(table)
      .insert(messages.map(msg => ({
        username: msg.username,
        content: msg.content,
        created_at: msg.created_at,
      })))
      .select();
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

  const deleteMessages = async (username: string, table: 'live_messages' | 'messages', type: string) => {
    const { data, error } = await CentralSupabase
      .from(table)
      .delete()
      .eq('username', username)
    return { data, error };
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
      fetchMessages,
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
