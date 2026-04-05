import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
const usersTable = import.meta.env.VITE_SUPABASE_USERS_TABLE ?? 'Users';
const votesTable = import.meta.env.VITE_SUPABASE_VOTES_TABLE ?? 'Votes';

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

const supabase = hasSupabaseConfig ? createClient(supabaseUrl as string, supabaseKey as string) : null;

export { hasSupabaseConfig, supabase, usersTable, votesTable };
