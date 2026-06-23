"use client";

import { isSupabaseConfigured } from "@/lib/supabase/client";

export function SupabaseSetupBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <strong>Supabase not configured.</strong> Copy{" "}
      <code className="rounded bg-amber-100 px-1">.env.example</code> to{" "}
      <code className="rounded bg-amber-100 px-1">.env.local</code>, add your
      Supabase URL and anon key from{" "}
      <a
        href="https://supabase.com/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline"
      >
        Supabase Dashboard
      </a>
      , run <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code>{" "}
      in SQL Editor, then restart{" "}
      <code className="rounded bg-amber-100 px-1">npm run dev</code>.
    </div>
  );
}
