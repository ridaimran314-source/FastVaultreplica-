"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { mapAdmissionResource, mapResource } from "@/lib/supabase/mappers";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import type { Resource, AdmissionResource } from "@/lib/types";
import { capitalize, formatDate } from "@/lib/utils";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type PendingItem = (Resource | AdmissionResource) & {
  collection: "resources" | "admission_resources";
};

export default function AdminUploadsPage() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const [resourcesRes, admissionRes] = await Promise.all([
        supabase
          .from("resources")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: true }),
        supabase
          .from("admission_resources")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: true }),
      ]);

      const resources = (resourcesRes.data ?? []).map((row) => ({
        ...mapResource(row),
        collection: "resources" as const,
      }));
      const admission = (admissionRes.data ?? []).map((row) => ({
        ...mapAdmissionResource(row),
        collection: "admission_resources" as const,
      }));

      setItems([...resources, ...admission]);
      setLoading(false);
    }

    load();
  }, []);

  const handleApprove = async (item: PendingItem) => {
    setActing(item.id);
    const table =
      item.collection === "resources" ? "resources" : "admission_resources";
    await getSupabase()
      .from(table)
      .update({ status: "published" })
      .eq("id", item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setActing(null);
  };

  const handleReject = async (item: PendingItem) => {
    setActing(item.id);
    const table =
      item.collection === "resources" ? "resources" : "admission_resources";
    await getSupabase()
      .from(table)
      .update({ status: "rejected" })
      .eq("id", item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setActing(null);
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Upload Moderation</h1>

        {loading ? (
          <LoadingPage />
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No pending uploads.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={`${item.collection}-${item.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {item.collection === "resources"
                          ? capitalize((item as Resource).type)
                          : capitalize((item as AdmissionResource).subcategory)}
                      </span>
                      <h3 className="mt-2 font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted {formatDate(item.created_at)}
                      </p>
                    </div>
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        View File
                      </Button>
                    </a>
                  </div>
                  <Textarea
                    placeholder="Rejection reason (optional)"
                    className="mt-4"
                    value={rejectReason[item.id] || ""}
                    onChange={(e) =>
                      setRejectReason({
                        ...rejectReason,
                        [item.id]: e.target.value,
                      })
                    }
                  />
                  <div className="mt-4 flex gap-2">
                    <Button
                      disabled={acting === item.id}
                      onClick={() => handleApprove(item)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={acting === item.id}
                      onClick={() => handleReject(item)}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
