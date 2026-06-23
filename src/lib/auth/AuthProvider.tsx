"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getSupabaseErrorMessage } from "@/lib/supabase/errors";
import { mapUser } from "@/lib/supabase/mappers";
import { isAdminEmail } from "@/lib/site-access";
import type { UserProfile } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  supabaseReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    campus: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseReady = isSupabaseConfigured();

  const loadProfile = async (userId: string) => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ? mapUser(data) : null);
  };

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadProfile(currentUser.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseReady]);

  const login = async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(getSupabaseErrorMessage(error));
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    campus: string
  ) => {
    const supabase = getSupabase();
    const role = isAdminEmail(email) ? "admin" : "student";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, campus, role },
      },
    });
    if (error) throw new Error(getSupabaseErrorMessage(error));
    if (!data.user) throw new Error("Signup failed. Please try again.");

    // Profile is created by database trigger; only insert manually if logged in
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!existing) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          name,
          email,
          campus,
          role,
        });
        if (profileError) {
          throw new Error(getSupabaseErrorMessage(profileError, "Profile save failed."));
        }
      } else {
        throw new Error(
          "Account created! Go to Login and sign in. If login fails, disable 'Confirm email' in Supabase → Authentication → Providers → Email."
        );
      }
    }

    if (data.session) {
      await loadProfile(data.user.id);
    }
  };

  const logout = async () => {
    await getSupabase().auth.signOut();
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw new Error(getSupabaseErrorMessage(error));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        supabaseReady,
        login,
        signup,
        logout,
        resetPassword,
        isAdmin: profile?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
