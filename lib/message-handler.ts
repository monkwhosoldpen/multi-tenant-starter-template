import { createClient } from '@supabase/supabase-js';
import { Message } from './types/goat';

const main_NEXT_PUBLIC_SUPABASE_URL = "https://iuqlvszkpbexblscnpay.supabase.co";
const main_NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cWx2c3prcGJleGJsc2NucGF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTA5MzAwMCwiZXhwIjoyMDQwNjY5MDAwfQ.ckanGyem0hVF9ub9IN3UxnaqgOC2ttFZ5Ifa5WQdh4E';

const supabase = createClient(
  main_NEXT_PUBLIC_SUPABASE_URL,
  main_NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

export const fetchMessages = async (username: string, isRealtime: boolean = false) => {
  const tableType = isRealtime ? 'live_messages' : 'messages';
  
  try {
    const { data, error } = await supabase
      .from(tableType)
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching messages from ${tableType}:`, error);
    return { data: null, error };
  }
};

export const sendMessage = async (messageData: Partial<Message>, isRealtime: boolean = false) => {
  const tableType = isRealtime ? 'live_messages' : 'messages';
  
  try {
    const { error } = await supabase
      .from(tableType)
      .insert([messageData]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error sending message:', error);
    return { error };
  }
}; 