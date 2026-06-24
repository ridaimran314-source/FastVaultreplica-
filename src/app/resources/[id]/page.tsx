"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { mapResource } from "@/lib/supabase/mappers";
import {
  canPreviewDocument,
  getDocumentPreviewUrl,
} from "@/lib/document-preview";
import type { Resource } from "@/lib/types";
import { capitalize, formatDate } from "@/lib/utils";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ResourceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchResource() {
      const { data, error } = await getSupabase()
        .from("resources")
        .select("*")
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setResource(mapResource(data));
      }
      setLoading(false);
    }
    if (id) fetchResource();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (notFound || !resource) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Resource not found</h1>
        <Link href="/resources" className="mt-4 inline-block text-vault-gold">
          Back to resources
        </Link>
      </div>
    );
  }

  const previewUrl = getDocumentPreviewUrl(resource.file_url);
  const canPreview = canPreviewDocument(resource.file_url);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/resources"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to resources
      </Link>

      <Card>
        <CardContent className="p-8">
          <span className="rounded-full bg-muted px-3 py-1 text-xs">
            {capitalize(resource.type)}
          </span>
          <h1 className="mt-4 text-3xl font-bold">{resource.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {resource.course} · Semester {resource.semester} ·{" "}
            {capitalize(resource.campus)}
            {resource.department && ` · ${resource.department}`}
          </p>

          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span>{resource.downloads} downloads</span>
            <span>Uploaded {formatDate(resource.created_at)}</span>
            {resource.uploader_name && <span>by {resource.uploader_name}</span>}
          </div>

          {resource.description && (
            <p className="mt-6 text-foreground/80">{resource.description}</p>
          )}

          <div className="mt-6">
            <Button size="lg" asChild>
              <a
                href={resource.file_url}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                Download File
              </a>
            </Button>
          </div>

          {canPreview && previewUrl ? (
            <iframe
              src={previewUrl}
              title={resource.title}
              className="mt-8 h-[75vh] w-full rounded-lg border bg-muted"
            />
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              Inline preview is not available for this file type. Use Download
              to save the file.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
