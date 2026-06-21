"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  auth,
  db,
  isFirebaseConfigured,
  requireAuth,
  requireDb,
} from "@/lib/firebase/client";
import { isAdminEmail } from "@/lib/site-access";
import type { UserProfile } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  firebaseReady: boolean;
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
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseReady || !auth || !db) {
      setLoading(false);
      return;
    }

    const firestore = db;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profileDoc = await getDoc(
            doc(firestore, "users", firebaseUser.uid)
          );
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setProfile({
              id: firebaseUser.uid,
              name: data.name,
              email: data.email,
              photo: data.photo,
              campus: data.campus,
              role: data.role,
              created_at: data.created_at?.toDate?.() ?? new Date(),
            });
          } else {
            setProfile(null);
          }
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [firebaseReady]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(requireAuth(), email, password);
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    campus: string
  ) => {
    const firebaseAuth = requireAuth();
    const firestore = requireDb();

    let cred;
    try {
      cred = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "";
      if (code === "auth/email-already-in-use") {
        throw new Error(
          "This email is already registered. Go to Login instead."
        );
      }
      if (code === "auth/weak-password") {
        throw new Error("Password must be at least 6 characters.");
      }
      if (code === "auth/invalid-email") {
        throw new Error("Invalid email address.");
      }
      throw err;
    }

    const role = isAdminEmail(email) ? "admin" : "student";
    try {
      await setDoc(doc(firestore, "users", cred.user.uid), {
        name,
        email,
        campus,
        role,
        created_at: serverTimestamp(),
      });
    } catch {
      throw new Error(
        "Account created but profile save failed. Enable Firestore in Firebase Console, then try Login."
      );
    }
  };

  const logout = async () => {
    await signOut(requireAuth());
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(requireAuth(), email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        firebaseReady,
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
