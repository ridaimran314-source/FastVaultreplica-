"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { requireDb } from "@/lib/firebase/client";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import { CAMPUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminEventsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    campus: "islamabad",
    organizer: "",
    registration_url: "",
    poster: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(requireDb(), "events"), {
        ...form,
        date: new Date(form.date),
        created_at: serverTimestamp(),
      });
      setSuccess(true);
      setForm({
        title: "",
        description: "",
        date: "",
        venue: "",
        campus: "islamabad",
        organizer: "",
        registration_url: "",
        poster: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="mx-auto max-w-lg px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <p className="mb-4 rounded-lg bg-vault-gold/10 p-3 text-sm">
                Event created successfully!
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Campus</Label>
                <select
                  value={form.campus}
                  onChange={(e) => setForm({ ...form, campus: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  {CAMPUSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Organizer</Label>
                <Input
                  value={form.organizer}
                  onChange={(e) =>
                    setForm({ ...form, organizer: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Registration URL (optional)</Label>
                <Input
                  value={form.registration_url}
                  onChange={(e) =>
                    setForm({ ...form, registration_url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Poster URL (optional)</Label>
                <Input
                  value={form.poster}
                  onChange={(e) => setForm({ ...form, poster: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
