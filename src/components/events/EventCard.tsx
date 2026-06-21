"use client";

import type { Event } from "@/lib/types";
import { capitalize, formatDate } from "@/lib/utils";
import { Calendar, MapPin, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EventCardProps {
  event: Event;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
}

export function EventCard({
  event,
  isBookmarked,
  onBookmark,
  onShare,
}: EventCardProps) {
  const isPast = event.date < new Date();

  return (
    <Card className={`transition-all hover:shadow-md ${isPast ? "opacity-60" : ""}`}>
      <CardContent className="p-6">
        {event.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.poster}
            alt={event.title}
            className="mb-4 h-40 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-vault-gold/10">
            <Calendar className="h-12 w-12 text-vault-gold" />
          </div>
        )}

        <h3 className="font-semibold">{event.title}</h3>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(event.date)}
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {event.venue} · {capitalize(event.campus)}
          </p>
          <p>Organized by {event.organizer}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/events/${event.id}`}>
            <Button variant="outline" size="sm">
              View Event
            </Button>
          </Link>
          {event.registration_url && !isPast && (
            <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm">Register</Button>
            </a>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            className={isBookmarked ? "text-vault-gold" : ""}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
