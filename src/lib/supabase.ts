import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://xvigiigldbnbcbpvivyf.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWdpaWdsZGJuYmNicHZpdnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2Nzk1ODcsImV4cCI6MjEwMjI1NTU4N30.fg0IWDAuSatpfzjMmXjlZTiOH6StP_UfmRLNRbnb43Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
