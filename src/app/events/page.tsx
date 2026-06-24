"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapEvent } from "@/lib/supabase/mappers";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireAuth } from "@/lib/auth/useProtectedRoute";
import { CAMPUSES } from "@/lib/constants";
import type { Event } from "@/lib/types";
import { EventCard } from "@/components/events/EventCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

export default function EventsPage() {
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [campus, setCampus] = useState("all");
  const [showPast, setShowPast] = useState(false);
  const [search, setSearch] = useState("");

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
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      let items = (data ?? []).map((row) => mapEvent(row));

      if (campus !== "all") items = items.filter((e) => e.campus === campus);
      if (!showPast) items = items.filter((e) => e.date >= new Date());
      if (search.trim()) {
        const term = search.toLowerCase();
        items = items.filter(
          (e) =>
            e.title.toLowerCase().includes(term) ||
            e.description.toLowerCase().includes(term) ||
            e.organizer.toLowerCase().includes(term)
        );
      }

      setEvents(items);
      setLoading(false);
    }

    load();
  }, [campus, showPast, search]);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return;

    getSupabase()
      .from("bookmarks")
      .select("resource_id")
      .eq("user_id", user.id)
      .eq("type", "event")
      .then(({ data }) => {
        setBookmarks(new Set((data ?? []).map((b) => b.resource_id)));
      });
  }, [user]);

  const handleBookmark = async (eventId: string) => {
    if (!requireAuth() || !user) return;
    const supabase = getSupabase();

    if (bookmarks.has(eventId)) {
      setBookmarks((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", eventId)
        .eq("type", "event");
    } else {
      setBookmarks((prev) => new Set(prev).add(eventId));
      await supabase.from("bookmarks").insert({
        user_id: user.id,
        resource_id: eventId,
        type: "event",
      });
    }
  };

  const handleShare = (event: Event) => {
    const url = `${window.location.origin}/events/${event.id}`;
    if (navigator.share) {
      navigator.share({ title: event.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  const hasFilters = campus !== "all" || showPast || search.trim().length > 0;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Campus Life"
        title="Events"
        description="Workshops, competitions, and activities happening across FAST-NUCES campuses."
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <FilterPanel
          showClear={hasFilters}
          onClear={() => {
            setCampus("all");
            setShowPast(false);
            setSearch("");
          }}
        >
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
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
            <label className="flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm shadow-sm">
              <input
                type="checkbox"
                checked={showPast}
                onChange={(e) => setShowPast(e.target.checked)}
                className="accent-vault-gold"
              />
              Show past events
            </label>
          </div>
        </FilterPanel>

        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{events.length}</span>{" "}
          {events.length === 1 ? "event" : "events"} found
        </p>

        {loading ? (
          <LoadingPage message="Loading events..." />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events found"
            description="Try changing your filters or check back later for new campus activities."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isBookmarked={bookmarks.has(event.id)}
                onBookmark={() => handleBookmark(event.id)}
                onShare={() => handleShare(event)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
