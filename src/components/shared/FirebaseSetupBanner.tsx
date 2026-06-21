"use client";

import { isFirebaseConfigured } from "@/lib/firebase/client";

export function FirebaseSetupBanner() {
  if (isFirebaseConfigured()) return null;

  return (
    <div className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <strong>Firebase not configured.</strong> Copy{" "}
      <code className="rounded bg-amber-100 px-1">.env.example</code> to{" "}
      <code className="rounded bg-amber-100 px-1">.env.local</code>, add your
      Firebase project keys from{" "}
      <a
        href="https://console.firebase.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline"
      >
        Firebase Console
      </a>
      , then restart <code className="rounded bg-amber-100 px-1">npm run dev</code>.
      Static pages work; login and data features need Firebase.
    </div>
  );
}
