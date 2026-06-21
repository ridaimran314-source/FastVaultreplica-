"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { requireDb } from "@/lib/firebase/client";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import { CAMPUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMeritPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    campus: "Lahore",
    program: "BS Computer Science",
    year: "2025",
    closing_merit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(requireDb(), "merit_history"), {
        campus: form.campus,
        program: form.program,
        year: parseInt(form.year),
        closing_merit: parseFloat(form.closing_merit),
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="mx-auto max-w-lg px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Merit Record</CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <p className="mb-4 rounded-lg bg-vault-gold/10 p-3 text-sm">
                Merit record added!
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Campus</Label>
                <select
                  value={form.campus}
                  onChange={(e) => setForm({ ...form, campus: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  {CAMPUSES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Program</Label>
                <Input
                  value={form.program}
                  onChange={(e) =>
                    setForm({ ...form, program: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Closing Merit (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.closing_merit}
                  onChange={(e) =>
                    setForm({ ...form, closing_merit: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Record"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
