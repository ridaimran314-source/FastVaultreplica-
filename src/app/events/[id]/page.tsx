"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { mapEvent } from "@/lib/supabase/mappers";
import type { Event } from "@/lib/types";
import { capitalize, formatDate } from "@/lib/utils";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      const { data } = await getSupabase()
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      setEvent(data ? mapEvent(data) : null);
      setLoading(false);
    }
    fetchEvent();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!event) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link href="/events" className="mt-4 inline-block text-vault-gold">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to events
      </Link>

      <Card>
        <CardContent className="p-8">
          {event.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.poster}
              alt={event.title}
              className="mb-6 w-full rounded-xl object-cover"
            />
          )}
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <div className="mt-4 space-y-2 text-muted-foreground">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(event.date)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.venue} · {capitalize(event.campus)}
            </p>
            <p>Organized by {event.organizer}</p>
          </div>
          <p className="mt-6">{event.description}</p>
          {event.registration_url && (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block"
            >
              <Button size="lg">Register for Event</Button>
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
