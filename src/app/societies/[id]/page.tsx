"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireDb } from "@/lib/firebase/client";
import type { Society } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { DetailLoadingSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SocietyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [society, setSociety] = useState<Society | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSociety() {
      try {
        const snapshot = await getDoc(doc(requireDb(), "societies", id));
        if (snapshot.exists()) {
          const data = snapshot.data();
          setSociety({
            id: snapshot.id,
            name: data.name,
            description: data.description,
            campus: data.campus,
            category: data.category,
            logo: data.logo,
            members: data.members ?? 0,
            social_links: data.social_links ?? {},
            created_at: data.created_at?.toDate?.() ?? new Date(),
          });
        }
      } catch {
        setSociety(null);
      }
      setLoading(false);
    }
    fetchSociety();
  }, [id]);

  if (loading) return <DetailLoadingSkeleton />;
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
            {capitalize(society.campus)}
            {society.category && ` · ${society.category}`} · {society.members}{" "}
            members
          </p>
          <p className="mt-6 leading-relaxed">{society.description}</p>

          {Object.keys(society.social_links).length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {Object.entries(society.social_links).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    {capitalize(platform)}
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
