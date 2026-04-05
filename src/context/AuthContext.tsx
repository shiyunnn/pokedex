import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { hasSupabaseConfig, supabase, usersTable } from '../lib/supabase';

type AuthUser = {
  id: number;
  username: string;
  name: string | null;
};

type AuthResult = {
  error?: string;
};

type AuthContextValue = {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasConfig: boolean;
  signIn: (username: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, username: string, password: string) => Promise<AuthResult>;
  signOut: () => void;
};

type UserRow = {
  id: number;
  username: string;
  password: string;
  name?: string | null;
};

const STORAGE_KEY = 'pokemon-auth-user-v1';

const AuthContext = createContext<AuthContextValue | null>(null);

const normalizeUsername = (value: string) => value.trim().toLowerCase();

async function hashPassword(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function getStoredUser() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as AuthUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  const persistUser = (user: AuthUser | null) => {
    setCurrentUser(user);

    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  };

  const signIn = async (username: string, password: string): Promise<AuthResult> => {
    const normalizedUsername = normalizeUsername(username);
    const normalizedPassword = password.trim();

    if (!normalizedUsername || !normalizedPassword) {
      return { error: 'Enter both username and password.' };
    }

    if (!supabase) {
      return { error: 'Supabase is not configured yet. Add your Vite Supabase env vars first.' };
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from(usersTable)
        .select('id, username, password, name')
        .eq('username', normalizedUsername)
        .maybeSingle<UserRow>();

      if (error) {
        return { error: error.message };
      }

      if (!data) {
        return { error: 'User not found. Create an account first.' };
      }

      const passwordHash = await hashPassword(normalizedPassword);
      if (data.password !== passwordHash) {
        return { error: 'Incorrect password.' };
      }

      persistUser({ id: data.id, username: data.username, name: data.name ?? null });
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Could not sign in.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, username: string, password: string): Promise<AuthResult> => {
    const normalizedUsername = normalizeUsername(username);
    const normalizedPassword = password.trim();
    const normalizedName = name.trim();

    if (normalizedUsername.length < 3) {
      return { error: 'Username must be at least 3 characters.' };
    }

    if (normalizedPassword.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }

    if (!supabase) {
      return { error: 'Supabase is not configured yet. Add your Vite Supabase env vars first.' };
    }

    setIsLoading(true);

    try {
      const { data: existingUser, error: existingUserError } = await supabase
        .from(usersTable)
        .select('id')
        .eq('username', normalizedUsername)
        .maybeSingle<{ id: number }>();

      if (existingUserError) {
        return { error: existingUserError.message };
      }

      if (existingUser) {
        return { error: 'That username is already taken.' };
      }

      const passwordHash = await hashPassword(normalizedPassword);
      const { data, error } = await supabase
        .from(usersTable)
        .insert({
          username: normalizedUsername,
          password: passwordHash,
          name: normalizedName ?? null,
        })
        .select('id, username, name')
        .single<AuthUser>();

      if (error) {
        return { error: error.message };
      }

      persistUser(data);
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Could not create account.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    persistUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isLoading,
      hasConfig: hasSupabaseConfig,
      signIn,
      signUp,
      signOut,
    }),
    [currentUser, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
};

export { AuthProvider, useAuth, type AuthUser };
