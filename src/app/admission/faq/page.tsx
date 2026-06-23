"use client";

import { useEffect, useState } from "react";
import { Search, MessageCircleQuestion } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapFaq } from "@/lib/supabase/mappers";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireAuth } from "@/lib/auth/useProtectedRoute";
import { FAQ_CATEGORIES } from "@/lib/constants";
import type { Faq } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function FaqPage() {
  const { user, profile } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showAskForm, setShowAskForm] = useState(false);
  const [askForm, setAskForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    question: "",
    category: "public" as Faq["category"],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    async function load() {
      const { data } = await getSupabase()
        .from("faqs")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      let items = (data ?? []).map((row) => mapFaq(row));

      if (category !== "all") {
        items = items.filter((f) => f.category === category);
      }
      if (search.trim()) {
        const term = search.toLowerCase();
        items = items.filter(
          (f) =>
            f.question.toLowerCase().includes(term) ||
            f.answer?.toLowerCase().includes(term)
        );
      }

      setFaqs(items);
      setLoading(false);
    }

    load();
  }, [category, search]);

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;

    setSubmitting(true);
    try {
      const { error } = await getSupabase().from("faqs").insert({
        question: askForm.question,
        answer: null,
        category: askForm.category,
        author: askForm.name,
        author_email: askForm.email,
        status: "pending",
      });
      if (error) throw error;
      setSubmitted(true);
      setShowAskForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Admission FAQ</h1>
        <p className="mt-2 text-muted-foreground">
          Search common questions, official answers, and ask the team
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Categories</option>
          {FAQ_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <Button onClick={() => setShowAskForm(!showAskForm)}>
          <MessageCircleQuestion className="h-4 w-4" />
          Ask a Question
        </Button>
      </div>

      {submitted && (
        <div className="mb-6 rounded-lg border border-vault-gold/50 bg-vault-gold/10 p-4 text-sm">
          Your question has been submitted and is pending review. We&apos;ll
          publish the answer once reviewed.
        </div>
      )}

      {showAskForm && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleAskSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={askForm.name}
                    onChange={(e) =>
                      setAskForm({ ...askForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={askForm.email}
                    onChange={(e) =>
                      setAskForm({ ...askForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  value={askForm.category}
                  onChange={(e) =>
                    setAskForm({
                      ...askForm,
                      category: e.target.value as Faq["category"],
                    })
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  {FAQ_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Your Question</Label>
                <Textarea
                  value={askForm.question}
                  onChange={(e) =>
                    setAskForm({ ...askForm, question: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Question"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <LoadingPage message="Loading FAQs..." />
      ) : faqs.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No FAQs found. Be the first to ask a question!
        </p>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-6">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {FAQ_CATEGORIES.find((c) => c.value === faq.category)?.label ||
                    capitalize(faq.category)}
                </span>
                <h3 className="mt-2 font-semibold">{faq.question}</h3>
                <p className="mt-3 text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
