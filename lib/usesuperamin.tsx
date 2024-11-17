'use client';

import { createContext, useContext, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

type SuperAdminContextType = {
  supabase: any;
  CentralSupabase: any;
  fetchGoats: () => Promise<{ data: any[] | null; error: any }>;
  createGoat: (goatData: any) => Promise<{ data: any | null; error: any }>;
  deleteGoat: (uid: string) => Promise<{ data: any | null; error: any }>;
  updateGoat: (uid: string, goatData: any) => Promise<{ data: any | null; error: any }>;
  clearAllGoats: () => Promise<{ data: any | null; error: any }>;
  mockMultipleGoats: (goatsData: any[]) => Promise<{ data: any | null; error: any }>;
};

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

const main_NEXT_PUBLIC_SUPABASE_URL = "https://iuqlvszkpbexblscnpay.supabase.co";
const main_NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cWx2c3prcGJleGJsc2NucGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTMwMDAsImV4cCI6MjA0MDY2OTAwMH0.VlQG9CG1s4m9ZLFcFH_W6E2VpWNHtVftKdvRGIWZz6Y";

export function SuperadminProvider({ children }: { children: ReactNode }) {
  const supabase = createClient(
    main_NEXT_PUBLIC_SUPABASE_URL,
    main_NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

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

  return (
    <SuperAdminContext.Provider value={{ 
      supabase, 
      CentralSupabase, 
      fetchGoats, 
      createGoat, 
      deleteGoat,
      updateGoat,
      clearAllGoats,
      mockMultipleGoats
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
