"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { mapFaq } from "@/lib/supabase/mappers";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { Faq } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function AdminFaqPage() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .from("faqs")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setFaqs((data ?? []).map((row) => mapFaq(row)));
        setLoading(false);
      });
  }, []);

  const handlePublish = async (faq: Faq) => {
    const answer = answers[faq.id];
    if (!answer?.trim()) return;

    setPublishing(faq.id);
    await getSupabase()
      .from("faqs")
      .update({
        answer,
        status: "published",
        answered_by: user?.id,
        answered_at: new Date().toISOString(),
      })
      .eq("id", faq.id);

    setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
    setPublishing(null);
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
