'use client';

import { useParams } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Add TenantContext and Provider
type TenantContextType = {
  tenantId: string;
  userRole: UserRole;
  isMaintenanceMode: boolean;
  tenantConfig: any | null;
  userCreds: any | null;
  tenantSupabase: any;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

import PocketBase from 'pocketbase';

export function TenantProvider({ children }: { children: ReactNode }) {

  const pb = new PocketBase('https://fixdpocketbase.pockethost.io');

  const params = useParams<{ teamId: string }>();
  const user: any = useUser({ or: 'redirect' });
  const [tenantConfig, setTenantConfig] = useState<any | null>(null);
  const [userCreds, setUserCreds] = useState<any | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tenant config with Supabase credentials
        const configRecords = await pb.collection('tenant_config').getFullList({
          sort: '-created',
        });
        const config = configRecords ? configRecords[0] : null;
        if (config) {
          setTenantConfig(config);
          // Create Supabase client with credentials from config
          const supabase = createClient(
            config.TENANT_PUBLIC_SUPABASE_URL,
            config.TENANT_SUPABASE_ANON_KEY
          );
          setSupabaseClient(supabase);
        }

        // Fetch user credentials
        if (user?.primaryEmail) {
          const userCredsRecord = await pb.collection('users').getFirstListItem(`email="${user.primaryEmail}"`);
          setUserCreds(userCredsRecord);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user?.primaryEmail]);

  const tenantContext: TenantContextType = {
    tenantId: params.teamId,
    userRole: user?.primaryEmail === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL
      ? 'super_admin'
      : 'member',
    isMaintenanceMode: false,
    tenantConfig,
    userCreds,
    tenantSupabase: supabaseClient
  };

  return (
    <TenantContext.Provider value={tenantContext}>
      {children}
    </TenantContext.Provider>
  );
}

// Add custom hook
export default function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

type UserRole = 'super_admin' | 'admin' | 'member' | 'guest';
