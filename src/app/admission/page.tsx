"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Upload } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapAdmissionResource } from "@/lib/supabase/mappers";
import type { AdmissionResource } from "@/lib/types";
import { capitalize, formatDate } from "@/lib/utils";
import { ADMISSION_SUBCATEGORIES } from "@/lib/constants";
import { PageHeader } from "@/components/layout/PageHeader";
import { HubLinkCard } from "@/components/shared/HubLinkCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  HelpCircle,
} from "lucide-react";
import {
  canPreviewDocument,
  getDocumentPreviewUrl,
} from "@/lib/document-preview";

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
    <div className="pb-12">
      <PageHeader
        eyebrow="Prospective Students"
        title="Admission Portal"
        description="Calculators, FAQs, and test materials for FAST-NUCES admission — all in one place."
      >
        <Button size="lg" className="mt-4 md:mt-0" asChild>
          <Link href="/admission/upload">
            <Upload className="h-4 w-4" />
            Share Resource
          </Link>
        </Button>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-10 grid gap-6 md:grid-cols-2">
          {HUB_LINKS.map((link) => (
            <HubLinkCard key={link.href} {...link} />
          ))}
        </div>

        <div className="mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-vault-gold" />
          <h2 className="text-2xl font-bold tracking-tight">Admission Resources</h2>
        </div>

        <FilterPanel
          showClear={subcategory !== "all"}
          onClear={() => setSubcategory("all")}
        >
          <NativeSelect
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="max-w-xs"
          >
            <option value="all">All Categories</option>
            {ADMISSION_SUBCATEGORIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </NativeSelect>
        </FilterPanel>

        {loading ? (
          <LoadingPage message="Loading admission resources..." />
        ) : resources.length === 0 ? (
          <EmptyState
            title="No admission resources yet"
            description="Be the first to share admission guides, sample papers, or preparation material."
            actionLabel="Upload Resource"
            actionHref="/admission/upload"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const canPreview = canPreviewDocument(resource.file_url);
              const previewUrl = getDocumentPreviewUrl(resource.file_url);
              return (
                <Card
                  key={resource.id}
                  className="overflow-hidden border-border/80 shadow-card transition-all hover:-translate-y-0.5 hover:border-vault-gold/50"
                >
                  <div className="h-1 bg-gradient-to-r from-vault-gold/70 to-amber-200/70" />
                  <CardContent className="p-6">
                    <span className="rounded-full bg-vault-navy px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                      {capitalize(resource.subcategory)}
                    </span>
                    <h3 className="mt-3 font-semibold tracking-tight">
                      {resource.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(resource.created_at)} · {resource.downloads}{" "}
                      downloads
                    </p>
                    <div className="mt-5 flex gap-2">
                      {canPreview && previewUrl ? (
                        <Button size="sm" asChild>
                          <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </Button>
                      ) : null}
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          Download
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
