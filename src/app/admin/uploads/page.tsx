"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { requireDb, requireFunctions } from "@/lib/firebase/client";
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

  useEffect(() => {
    const firestore = requireDb();
    const q1 = query(
      collection(firestore, "resources"),
      where("status", "==", "pending"),
      orderBy("created_at", "asc")
    );
    const q2 = query(
      collection(firestore, "admission_resources"),
      where("status", "==", "pending"),
      orderBy("created_at", "asc")
    );

    const unsub1 = onSnapshot(q1, (snapshot) => {
      const resources = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        collection: "resources" as const,
        created_at: d.data().created_at?.toDate?.() ?? new Date(),
      })) as PendingItem[];

      setItems((prev) => [
        ...resources,
        ...prev.filter((i) => i.collection !== "resources"),
      ]);
      setLoading(false);
    });

    const unsub2 = onSnapshot(q2, (snapshot) => {
      const admission = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        collection: "admission_resources" as const,
        created_at: d.data().created_at?.toDate?.() ?? new Date(),
      })) as PendingItem[];

      setItems((prev) => [
        ...prev.filter((i) => i.collection !== "admission_resources"),
        ...admission,
      ]);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const handleApprove = async (item: PendingItem) => {
    const approveUpload = httpsCallable(requireFunctions(), "approveUpload");
    await approveUpload({
      resourceId: item.id,
      collection: item.collection,
    });
  };

  const handleReject = async (item: PendingItem) => {
    const rejectUpload = httpsCallable(requireFunctions(), "rejectUpload");
    await rejectUpload({
      resourceId: item.id,
      collection: item.collection,
      reason: rejectReason[item.id] || "Does not meet content policy",
    });
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
                    <Button onClick={() => handleApprove(item)}>
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
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
