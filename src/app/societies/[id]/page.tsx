"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { mapSociety } from "@/lib/supabase/mappers";
import type { Society } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";

export default function SocietyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [society, setSociety] = useState<Society | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSociety() {
      const { data } = await getSupabase()
        .from("societies")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      setSociety(data ? mapSociety(data) : null);
      setLoading(false);
    }
    fetchSociety();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!society) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Society not found</h1>
        <Link href="/societies" className="mt-4 inline-block text-vault-gold">
          Back to societies
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/societies"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to societies
      </Link>

      <Card>
        <CardContent className="p-8">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-vault-gold/10 text-3xl font-bold text-vault-gold">
            {society.name.charAt(0)}
          </div>
          <h1 className="text-3xl font-bold">{society.name}</h1>
          <p className="mt-2 text-muted-foreground">
            {capitalize(society.campus)} · {society.members} members
            {society.category && ` · ${society.category}`}
          </p>
          <p className="mt-6">{society.description}</p>
          {Object.keys(society.social_links).length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {Object.entries(society.social_links).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-vault-gold hover:underline"
                >
                  {capitalize(platform)}
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
