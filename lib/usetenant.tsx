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
  isLoading: boolean;
  error: Error | null;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

import PocketBase from 'pocketbase';

export function TenantProvider({ children }: { children: ReactNode }) {

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const params = useParams<{ teamId: string }>();
  const user: any = useUser({ or: 'redirect' });
  const [tenantConfig, setTenantConfig] = useState<any | null>(null);
  const [userCreds, setUserCreds] = useState<any | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user?.primaryEmail) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const configRecords = await pb.collection('tenant_config').getFullList({
          sort: '-created',
        });
        
        if (!isMounted) return;

        const config = configRecords?.[0] ?? null;
        if (config) {
          setTenantConfig(config);
          
          const supabase = createClient(
            config.TENANT_PUBLIC_SUPABASE_URL,
            config.TENANT_SUPABASE_ANON_KEY
          );
          setSupabaseClient(supabase);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch tenant config'));
        console.error('Error fetching data:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.primaryEmail]);

  const tenantContext: TenantContextType = {
    tenantId: params.teamId,
    userRole: 'super_admin',
    isMaintenanceMode: false,
    tenantConfig,
    userCreds,
    tenantSupabase: supabaseClient,
    isLoading,
    error
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
