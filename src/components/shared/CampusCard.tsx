import Link from "next/link";
import { MapPin, Users, Calendar } from "lucide-react";
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
    <div className="group rounded-2xl border bg-card p-6 transition-all hover:border-vault-gold/50 hover:shadow-lg">
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{students} Students</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>Est. {established}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/resources?campus=${id}`}
          className="rounded-full bg-vault-navy/10 px-3 py-1 text-xs font-medium hover:bg-vault-gold/20 transition-colors"
        >
          Resources
        </Link>
        <Link
          href={`/societies?campus=${id}`}
          className="rounded-full bg-vault-navy/10 px-3 py-1 text-xs font-medium hover:bg-vault-gold/20 transition-colors"
        >
          Societies
        </Link>
        <Link
          href={`/events?campus=${id}`}
          className="rounded-full bg-vault-navy/10 px-3 py-1 text-xs font-medium hover:bg-vault-gold/20 transition-colors"
        >
          Events
        </Link>
      </div>

      <Link
        href={`/resources?campus=${id}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-vault-gold hover:underline"
      >
        <MapPin className="h-4 w-4" />
        View resources
      </Link>
    </div>
  );
}
