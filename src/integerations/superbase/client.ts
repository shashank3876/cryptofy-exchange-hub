

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ewovoqsimfjcbplnghht.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3b3ZvcXNpbWZqY2JwbG5naGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDMwMzAsImV4cCI6MjA1OTA3OTAzMH0.M2is0i5bBy0DPXJ8qDOA7cT4x4-UVoRSmHvFnmu9hfw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});