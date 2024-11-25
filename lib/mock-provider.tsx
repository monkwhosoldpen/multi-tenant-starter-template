'use client';

import { ReactNode, createContext, useContext } from "react";
import { createClient } from '@supabase/supabase-js';
import { Message, Subgroup } from "./types/goat";

const main_NEXT_PUBLIC_SUPABASE_URL = "https://iuqlvszkpbexblscnpay.supabase.co";
const main_NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cWx2c3prcGJleGJsc2NucGF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTA5MzAwMCwiZXhwIjoyMDQwNjY5MDAwfQ.ckanGyem0hVF9ub9IN3UxnaqgOC2ttFZ5Ifa5WQdh4E';

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

// Helper function to check if a group is public
const isPublicGroup = (username?: string): boolean => {
  if (!username) return false;
  return username.toLowerCase() === 'public';
};

export function SuperadminProvider({ children }: { children: ReactNode }) {
  const supabase = createClient(main_NEXT_PUBLIC_SUPABASE_URL, main_NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);
  const CentralSupabase = supabase;

  // Implement all the required functions
  const fetchGoats = async () => {
    return await supabase.from("user_profiles").select("*");
  };

  const createGoat = async (goatData: any) => {
    return await supabase.from("user_profiles").insert([goatData]).select().single();
  };

  const deleteGoat = async (uid: string) => {
    return await supabase.from("user_profiles").delete().eq('uid', uid);
  };

  const updateGoat = async (uid: string, goatData: any) => {
    return await supabase.from("user_profiles").update(goatData).eq('uid', uid);
  };

  const clearAllGoats = async () => {
    try {
      // Delete all records without using UUID comparison
      const { data, error } = await supabase
        .from("user_profiles")
        .delete()
        .not('uid', 'is', null); // Delete all records where uid is not null

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error in clearAllGoats:', error);
      return { data: null, error };
    }
  };

  const mockMultipleGoats = async (goatsData: any[]) => {
    return await supabase.from("user_profiles").insert(goatsData);
  };

  const fetchApprovals = async () => {
    return await supabase.from("approvals").select("*");
  };

  const generateMockApprovals = async () => {
    // Implementation for mock approvals
    return { data: null, error: null };
  };

  const handleApproval = async (approvalId: string, status: 'APPROVED' | 'REJECTED') => {
    return await supabase
      .from("approvals")
      .update({ status })
      .eq('id', approvalId);
  };

  const fetchSubgroups = async (goatId: string) => {
    return await supabase
      .from("sub_groups")
      .select("*")
      .eq('owner_username', goatId);
  };

  const createSubgroup = async (subgroupData: Subgroup) => {
    return await supabase
      .from("sub_groups")
      .insert([subgroupData])
      .select()
      .single();
  };

  const createBulkSubgroups = async (subgroups: Subgroup[]) => {
    return await supabase.from("sub_groups").insert(subgroups);
  };

  const createMessage = async (messageData: any) => {
    return await supabase
      .from(messageData.is_realtime ? 'live_messages' : 'messages')
      .insert([messageData]);
  };

  const createBulkMessages = async (messages: Message[], tableType: 'live_messages' | 'messages') => {
    return await supabase.from(tableType).insert(messages);
  };

  const deleteSubgroup = async (subgroupId: number) => {
    return await supabase.from("sub_groups").delete().eq('id', subgroupId);
  };

  const clearAllSubgroups = async (ownerUsername: string) => {
    return await supabase
      .from("sub_groups")
      .delete()
      .eq('owner_username', ownerUsername);
  };

  const updateSubgroup = async (ownerUsername: string, type: string, updates: any) => {
    return await supabase
      .from("sub_groups")
      .update(updates)
      .eq('owner_username', ownerUsername)
      .eq('type', type);
  };

  const deleteMessages = async (ownerUsername: string, username: string, table: 'live_messages' | 'messages', type: string) => {
    return await supabase
      .from(table)
      .delete()
      .eq('username', username);
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