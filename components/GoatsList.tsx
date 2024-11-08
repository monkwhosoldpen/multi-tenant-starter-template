// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

// Step 1: Setup for Master Supabase Client (your existing setup)
const supabaseUrl: any = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey: any = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient<any>(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 20,
    },
  },
});

// Interface for Tenant Configuration
interface Config {
  supabase_url: string;
  supabase_anon_key: string;
  tenant_name: string;
}

// Step 2: Hook to fetch tenant config and create the tenant Supabase client
export const useTenantSupabase = () => {
  const [tenantSupabase, setTenantSupabase] = useState<any>(null);
  const [tenantConfig, setTenantConfig] = useState<Config | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      // Fetch config from the master Supabase (admin project)
      const { data, error } = await supabase
        .from("goats_config")  // Assuming your config table is "goats_config"
        .select("*");

      if (error) {
        console.error("Error fetching configuration:", error);
        return;
      }

      // Assuming the first config record is the correct one
      const config = data ? data[0] : null;
      if (config) {
        setTenantConfig(config);
      }
    };

    fetchConfig();
  }, []);

  // Dynamically create the tenant Supabase client if config is fetched
  useEffect(() => {
    if (tenantConfig) {
      const { supabase_url, supabase_anon_key } = tenantConfig;
      const tenantSupabaseClient = createClient(supabase_url, supabase_anon_key);
      setTenantSupabase(tenantSupabaseClient);
    }
  }, [tenantConfig]);

  return tenantSupabase;
};

// GoatsList Component using the Tenant Supabase Client
const GoatsList: React.FC = () => {
  const [goats, setGoats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const tenantSupabase = useTenantSupabase();  // Get the dynamic tenant client

  useEffect(() => {
    if (tenantSupabase) {
      fetchGoats();
    }
  }, [tenantSupabase]);

  const fetchGoats = async () => {
    setLoading(true);

    // Use tenant's Supabase client to fetch goats
    const { data, error } = await tenantSupabase.from("goats").select("*");

    if (error) {
      console.error("Error fetching goats:", error);
      setGoats([]);
    } else {
      const typedGoats = data.map((item: any) => ({
        id: item.id,
        image_url: item.image_url,
        username: item.username,
        fullname: item.fullname,
        description: item.description,
        profileimage: item.profileimage,
      }));
      setGoats(typedGoats);
    }

    setLoading(false);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {loading ? (
        <div>Loading...</div>
      ) : (
        goats.map((goat) => (
          <div
            key={`${goat.id}-${goat.username}`} // Use a combination of id and username for a unique key
            className="flex flex-col items-center border border-gray-600 rounded p-2 transition-transform transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
            onClick={() => console.log(goat.username)}
          >
            <img
              src={goat.profileimage || "https://via.placeholder.com/100"}
              alt={goat.username}
              className="rounded-full w-12 h-12 object-cover mb-1"
            />
            <span className="font-medium text-xs w-full text-center truncate">
              {goat.fullname}
            </span>
            <span className="text-xs w-full text-center truncate">
              {goat.description || "NA"}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default GoatsList;
