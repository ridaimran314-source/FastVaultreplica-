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
    <Card
      className={`group overflow-hidden border-border/80 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-vault-gold/50 hover:shadow-soft ${
        isPast ? "opacity-70" : ""
      }`}
    >
      <div className="h-1 bg-gradient-to-r from-vault-gold/70 via-amber-200/70 to-vault-gold/70" />
      <CardContent className="p-0">
        {event.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.poster}
            alt={event.title}
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-vault-navy/5 to-vault-gold/10">
            <Calendar className="h-12 w-12 text-vault-gold" />
          </div>
        )}

        <div className="p-6">
          {isPast && (
            <span className="mb-2 inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
              Past event
            </span>
          )}
          <h3 className="font-semibold tracking-tight group-hover:text-vault-navy">
            {event.title}
          </h3>
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-vault-gold" />
              {formatDate(event.date)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-vault-gold" />
              {event.venue} · {capitalize(event.campus)}
            </p>
            <p>Organized by {event.organizer}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-dashed pt-4">
            <Button variant="default" size="sm" asChild>
              <Link href={`/events/${event.id}`}>View Event</Link>
            </Button>
            {event.registration_url && !isPast && (
              <Button size="sm" variant="outline" asChild>
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={onBookmark}
              className={isBookmarked ? "border-vault-gold text-vault-gold" : ""}
              aria-label="Bookmark"
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
            <Button variant="ghost" size="icon" onClick={onShare} aria-label="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
