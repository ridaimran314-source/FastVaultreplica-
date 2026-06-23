"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapEvent } from "@/lib/supabase/mappers";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireAuth } from "@/lib/auth/useProtectedRoute";
import { CAMPUSES } from "@/lib/constants";
import type { Event } from "@/lib/types";
import { EventCard } from "@/components/events/EventCard";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Campus Events</h1>
        <p className="text-muted-foreground">
          Workshops, competitions, and activities across all campuses
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
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
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showPast}
            onChange={(e) => setShowPast(e.target.checked)}
          />
          Show past events
        </label>
      </div>

      {loading ? (
        <LoadingPage message="Loading events..." />
      ) : events.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No events found.
        </p>
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
  );
}
