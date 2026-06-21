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
import type { Faq } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    const firestore = requireDb();
    const q = query(
      collection(firestore, "faqs"),
      where("status", "==", "pending"),
      orderBy("created_at", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      setFaqs(
        snapshot.docs.map((d) => ({
          id: d.id,
          question: d.data().question,
          answer: d.data().answer,
          category: d.data().category,
          author: d.data().author,
          author_email: d.data().author_email,
          status: d.data().status,
          created_at: d.data().created_at?.toDate?.() ?? new Date(),
        }))
      );
      setLoading(false);
    });
  }, []);

  const handlePublish = async (faq: Faq) => {
    const answer = answers[faq.id];
    if (!answer?.trim()) return;

    setPublishing(faq.id);
    try {
      const publishFaqAnswer = httpsCallable(requireFunctions(), "publishFaqAnswer");
      await publishFaqAnswer({ faqId: faq.id, answer });
    } catch (err) {
      console.error("Publish failed:", err);
      alert("Failed to publish. Ensure Cloud Functions are deployed.");
    } finally {
      setPublishing(null);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">FAQ Moderation</h1>

        {loading ? (
          <LoadingPage />
        ) : faqs.length === 0 ? (
          <p className="text-muted-foreground">No pending questions.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    From {faq.author} · {formatDate(faq.created_at)}
                  </p>
                  <h3 className="mt-2 font-semibold">{faq.question}</h3>
                  <Textarea
                    placeholder="Write your answer..."
                    className="mt-4"
                    rows={4}
                    value={answers[faq.id] || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [faq.id]: e.target.value })
                    }
                  />
                  <Button
                    className="mt-4"
                    disabled={publishing === faq.id}
                    onClick={() => handlePublish(faq)}
                  >
                    {publishing === faq.id ? "Publishing..." : "Publish Answer"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
