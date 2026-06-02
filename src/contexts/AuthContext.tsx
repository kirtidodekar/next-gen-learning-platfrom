"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// ── Profile type ──────────────────────────────────────────────
export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// ── Auth context shape ────────────────────────────────────────
interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Refs to prevent duplicate fetches and race conditions
  const profileFetchRef = useRef<string | null>(null);
  const initRef = useRef(false);
  // Stable ref to current user — avoids recreating callbacks when user changes
  const userRef = useRef<User | null>(null);
  userRef.current = state.user;

  // ── Fetch profile ────────────────────────────────────────
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    // Prevent duplicate concurrent fetches for the same user
    if (profileFetchRef.current === userId) return null;
    profileFetchRef.current = userId;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        // Profile may not exist yet (race with trigger) – retry once after short delay
        if (error.code === "PGRST116") {
          await new Promise((r) => setTimeout(r, 500));
          const retry = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (retry.error) {
            // Suppress noisy log when table doesn't exist or profile hasn't been created yet
            if (
              retry.error.message.includes("does not exist") ||
              retry.error.message.includes("schema cache")
            ) {
              // Silently return null — settings page will fall back to user metadata
            } else {
              console.error("[Auth] Profile retry fetch error:", retry.error.message);
            }
            return null;
          }
          return retry.data as Profile;
        }
        // Suppress noisy log for missing table / RLS issues
        if (
          error.message.includes("does not exist") ||
          error.message.includes("schema cache")
        ) {
          // Silently return null — settings page will fall back to user metadata
        } else {
          console.error("[Auth] Profile fetch error:", error.message);
        }
        return null;
      }
      return data as Profile;
    } finally {
      profileFetchRef.current = null;
    }
  }, []);

  // ── Refresh profile (public) ────────────────────────────
  const refreshProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const profile = await fetchProfile(user.id);
    if (profile) {
      setState((prev) => ({ ...prev, profile }));
    }
  }, [fetchProfile]);

  // ── Set session + profile ───────────────────────────────
  const setSession = useCallback(
    async (session: Session | null) => {
      if (!session?.user) {
        setState({
          user: null,
          session: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      const profile = await fetchProfile(session.user.id);

      setState({
        user: session.user,
        session,
        profile,
        isLoading: false,
        isAuthenticated: true,
      });
    },
    [fetchProfile],
  );

  // ── Initialize on mount ─────────────────────────────────
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // 1) Restore existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2) Listen for auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Skip INITIAL_SESSION – already handled by getSession above
        if (event === "INITIAL_SESSION") return;

        if (event === "SIGNED_OUT") {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setSession(session);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [setSession]);

  // ── Sign In ─────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Suppress the default browser console error and return clean message
        return { error: error.message };
      }
      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      return { error: message };
    }
  }, []);

  // ── Sign Up ─────────────────────────────────────────────
  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) return { error: error.message };
        return { error: null };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Sign up failed";
        return { error: message };
      }
    },
    [],
  );

  // ── Sign Out ────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  // ── Reset Password ──────────────────────────────────────
  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/signin`,
    });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  // ── Update Profile ──────────────────────────────────────
  const updateProfile = useCallback(
    async (data: Partial<Profile>) => {
      // Use userRef instead of state.user to keep this callback stable
      const currentUser = userRef.current;
      if (!currentUser) return { error: "Not authenticated" };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase
        .from("profiles") as any)
        .update(data)
        .eq("user_id", currentUser.id);

      if (error) return { error: error.message };

      // Also update user metadata if relevant fields changed
      const metaUpdate: Record<string, string> = {};
      if (data.full_name !== undefined) metaUpdate.full_name = data.full_name;
      if (data.avatar_url !== undefined) metaUpdate.avatar_url = data.avatar_url ?? "";

      if (Object.keys(metaUpdate).length > 0) {
        await supabase.auth.updateUser({ data: metaUpdate });
      }

      // Refresh profile from DB
      const profile = await fetchProfile(currentUser.id);
      if (profile) {
        setState((prev) => ({ ...prev, profile }));
      }

      return { error: null };
    },
    [fetchProfile],
  );

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
