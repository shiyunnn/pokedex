/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY?: string;
  readonly VITE_SUPABASE_USERS_TABLE?: string;
  readonly VITE_SUPABASE_VOTES_TABLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
