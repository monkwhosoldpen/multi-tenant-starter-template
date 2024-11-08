// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

// Step 1: Setup for Master Supabase Client (your existing setup)
const supabaseUrl: any = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey: any = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<any>(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 20,
    },
  },
});
