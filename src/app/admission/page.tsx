"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  HelpCircle,
  FileText,
  Upload,
  ArrowRight,
} from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapAdmissionResource } from "@/lib/supabase/mappers";
import type { AdmissionResource } from "@/lib/types";
import { capitalize, formatDate } from "@/lib/utils";
import { ADMISSION_SUBCATEGORIES } from "@/lib/constants";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HUB_LINKS = [
  {
    title: "Aggregate Calculator",
    description: "Calculate your FAST NUCES admission scores",
    href: "/admission/calculator",
    icon: Calculator,
  },
  {
    title: "Admission FAQ",
    description: "Search common questions and ask the team",
    href: "/admission/faq",
    icon: HelpCircle,
  },
];

export default function AdmissionPage() {
  const [resources, setResources] = useState<AdmissionResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategory, setSubcategory] = useState("all");

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    async function load() {
      let query = getSupabase()
        .from("admission_resources")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (subcategory !== "all") {
        query = query.eq("subcategory", subcategory);
      }

      const { data } = await query;
      setResources((data ?? []).map((row) => mapAdmissionResource(row)));
      setLoading(false);
    }

    load();
  }, [subcategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Admission Portal</h1>
        <p className="mt-2 text-muted-foreground">
          Everything you need for FAST-NUCES admission — calculators, FAQs, and
          test materials
        </p>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        {HUB_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full transition-all hover:border-vault-gold/50 hover:shadow-lg">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vault-gold/10">
                  <link.icon className="h-6 w-6 text-vault-gold" />
                </div>
                <div>
                  <h3 className="font-semibold">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm text-vault-gold">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-vault-gold" />
          <h2 className="text-2xl font-bold">Admission Resources</h2>
        </div>
        <Link href="/admission/upload">
          <Button>
            <Upload className="h-4 w-4" />
            Share Admission Resource
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Categories</option>
          {ADMISSION_SUBCATEGORIES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingPage message="Loading admission resources..." />
      ) : resources.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No admission resources yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="p-6">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {capitalize(resource.subcategory)}
                </span>
                <h3 className="mt-2 font-semibold">{resource.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(resource.created_at)} · {resource.downloads}{" "}
                  downloads
                </p>
                <a
                  href={resource.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block"
                >
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
