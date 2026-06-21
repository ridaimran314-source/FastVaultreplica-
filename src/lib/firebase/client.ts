import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
} from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, enableNetwork, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFunctions, type Functions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  return Boolean(
    apiKey &&
      projectId &&
      apiKey !== "your_api_key" &&
      !apiKey.startsWith("YOUR_")
  );
}

function getOrInitApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (getApps().length > 0) return getApp();
  return initializeApp(firebaseConfig);
}

const app = getOrInitApp();

export { app };
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;

if (typeof window !== "undefined" && db) {
  enableNetwork(db).catch(() => {
    // Firestore may be offline until database is created in Firebase Console
  });
}
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;
export const functions: Functions | null = app ? getFunctions(app) : null;

export function requireAuth(): Auth {
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Add your credentials to .env.local and restart the dev server."
    );
  }
  return auth;
}

export function requireDb(): Firestore {
  if (!db) {
    throw new Error(
      "Firebase is not configured. Add your credentials to .env.local and restart the dev server."
    );
  }
  return db;
}

export function requireStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error(
      "Firebase is not configured. Add your credentials to .env.local and restart the dev server."
    );
  }
  return storage;
}

export function requireFunctions(): Functions {
  if (!functions) {
    throw new Error(
      "Firebase Cloud Functions are not configured. Add credentials to .env.local and restart."
    );
  }
  return functions;
}
