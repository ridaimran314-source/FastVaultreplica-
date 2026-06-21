"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { db, isFirebaseConfigured, requireDb } from "@/lib/firebase/client";
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
      const firestore = requireDb();
      const snapshot = await getDoc(doc(firestore, "resources", id));
      if (!snapshot.exists() || snapshot.data().status !== "published") {
        setNotFound(true);
      } else {
        const data = snapshot.data();
        setResource({
          id: snapshot.id,
          title: data.title,
          description: data.description,
          type: data.type,
          course: data.course,
          semester: data.semester,
          campus: data.campus,
          department: data.department,
          file_url: data.file_url,
          downloads: data.downloads ?? 0,
          uploaded_by: data.uploaded_by,
          uploader_name: data.uploader_name,
          status: data.status,
          created_at: data.created_at?.toDate?.() ?? new Date(),
        });
      }
      setLoading(false);
    }
    fetchResource();
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
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

          <div className="mt-8">
            <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                <Download className="h-4 w-4" />
                Download File
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
