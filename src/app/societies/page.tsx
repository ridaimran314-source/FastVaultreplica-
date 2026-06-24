"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapSociety } from "@/lib/supabase/mappers";
import { CAMPUSES, SOCIETY_CATEGORIES } from "@/lib/constants";
import type { Society } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
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
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    async function load() {
      const { data } = await getSupabase()
        .from("societies")
        .select("*")
        .order("name");

      let items = (data ?? []).map((row) => mapSociety(row));

      if (campus !== "all") items = items.filter((s) => s.campus === campus);
      if (category !== "all")
        items = items.filter((s) => s.category === category);
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
    }

    load();
  }, [campus, category, search]);

  const hasFilters =
    campus !== "all" || category !== "all" || search.trim().length > 0;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Student Life"
        title="Societies"
        description="Discover clubs, teams, and organizations across every FAST-NUCES campus."
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <FilterPanel
          showClear={hasFilters}
          onClear={() => {
            setCampus("all");
            setCategory("all");
            setSearch("");
          }}
        >
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search societies..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <NativeSelect
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
            >
              <option value="all">All Campuses</option>
              {CAMPUSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {SOCIETY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </div>
        </FilterPanel>

        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{societies.length}</span>{" "}
          {societies.length === 1 ? "society" : "societies"} found
        </p>

        {loading ? (
          <LoadingPage message="Loading societies..." />
        ) : societies.length === 0 ? (
          <EmptyState
            title="No societies found"
            description="Try adjusting your search or campus filter to discover student organizations."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {societies.map((society) => (
              <Link key={society.id} href={`/societies/${society.id}`}>
                <Card className="group h-full overflow-hidden border-border/80 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-vault-gold/50 hover:shadow-soft">
                  <div className="h-1 bg-gradient-to-r from-vault-gold/70 to-amber-200/70" />
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-vault-gold/20 to-vault-gold/5 text-xl font-bold text-vault-gold">
                      {society.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold tracking-tight group-hover:text-vault-navy">
                      {society.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {capitalize(society.campus)} · {society.members} members
                    </p>
                    {society.category && (
                      <span className="mt-3 inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium">
                        {society.category}
                      </span>
                    )}
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {society.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
