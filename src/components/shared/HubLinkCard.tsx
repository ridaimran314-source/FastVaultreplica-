import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HubLinkCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function HubLinkCard({
  href,
  title,
  description,
  icon: Icon,
}: HubLinkCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full overflow-hidden border-border/80 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-vault-gold/50 hover:shadow-soft">
        <div className="h-1 bg-gradient-to-r from-vault-gold/80 via-amber-300/80 to-vault-gold/80" />
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vault-gold/15">
            <Icon className="h-6 w-6 text-vault-gold" />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight group-hover:text-vault-navy">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-vault-gold">
              Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
