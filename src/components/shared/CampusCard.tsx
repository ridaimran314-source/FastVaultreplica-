import Link from "next/link";
import { MapPin, Users, Calendar, ArrowRight } from "lucide-react";
import type { CampusId } from "@/lib/constants";

interface CampusCardProps {
  id: CampusId;
  name: string;
  students: string;
  established: number;
}

export function CampusCard({
  id,
  name,
  students,
  established,
}: CampusCardProps) {
  return (
    <div className="surface-card group p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-vault-navy text-sm font-bold text-vault-gold">
        {name.slice(0, 2).toUpperCase()}
      </div>
      <h3 className="text-xl font-bold tracking-tight">{name}</h3>
      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 text-vault-gold" />
          {students} students
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-vault-gold" />
          Established {established}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/resources?campus=${id}`}
          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium transition-colors hover:border-vault-gold/50 hover:bg-vault-gold/10"
        >
          Resources
        </Link>
        <Link
          href={`/societies?campus=${id}`}
          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium transition-colors hover:border-vault-gold/50 hover:bg-vault-gold/10"
        >
          Societies
        </Link>
        <Link
          href={`/events?campus=${id}`}
          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium transition-colors hover:border-vault-gold/50 hover:bg-vault-gold/10"
        >
          Events
        </Link>
      </div>

      <Link
        href={`/resources?campus=${id}`}
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-vault-gold hover:underline"
      >
        <MapPin className="h-4 w-4" />
        Explore campus
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
