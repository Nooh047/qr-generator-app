import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback logic to prevent Vite compilation crashes if .env is unconfigured initially
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase Client] Missing Environment Keys. Auth and DB will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
