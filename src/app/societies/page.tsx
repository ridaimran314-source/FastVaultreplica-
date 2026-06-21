"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Link from "next/link";
import { Search } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { CAMPUSES, SOCIETY_CATEGORIES } from "@/lib/constants";
import type { Society } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SocietiesPage() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [campus, setCampus] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campusParam = params.get("campus");
    if (campusParam) setCampus(campusParam);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "societies"), orderBy("name"));

    return onSnapshot(q, (snapshot) => {
      let items = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name,
          description: data.description,
          campus: data.campus,
          category: data.category,
          logo: data.logo,
          members: data.members ?? 0,
          social_links: data.social_links ?? {},
          created_at: data.created_at?.toDate?.() ?? new Date(),
        } as Society;
      });

      if (campus !== "all") {
        items = items.filter((s) => s.campus === campus);
      }
      if (category !== "all") {
        items = items.filter((s) => s.category === category);
      }
      if (search.trim()) {
        const term = search.toLowerCase();
        items = items.filter(
          (s) =>
            s.name.toLowerCase().includes(term) ||
            s.description.toLowerCase().includes(term)
        );
      }

      setSocieties(items);
      setLoading(false);
    });
  }, [campus, category, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Societies</h1>
        <p className="text-muted-foreground">
          Discover clubs and organizations across all FAST-NUCES campuses
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search societies..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Campuses</option>
          {CAMPUSES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Categories</option>
          {SOCIETY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingPage message="Loading societies..." />
      ) : societies.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No societies found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {societies.map((society) => (
            <Link key={society.id} href={`/societies/${society.id}`}>
              <Card className="h-full transition-all hover:border-vault-gold/50 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-vault-gold/10 text-xl font-bold text-vault-gold">
                    {society.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold">{society.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {capitalize(society.campus)} · {society.members} members
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm">{society.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
