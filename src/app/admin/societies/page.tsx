"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import { CAMPUSES, SOCIETY_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSocietiesPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    campus: "islamabad",
    category: "Technical",
    members: "50",
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const social_links: Record<string, string> = {};
    if (form.instagram) social_links.instagram = form.instagram;
    if (form.facebook) social_links.facebook = form.facebook;
    if (form.linkedin) social_links.linkedin = form.linkedin;

    try {
      const { error } = await getSupabase().from("societies").insert({
        name: form.name,
        description: form.description,
        campus: form.campus,
        category: form.category,
        members: parseInt(form.members) || 0,
        social_links,
      });
      if (error) throw error;
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
            <CardTitle>Add Society</CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <p className="mb-4 rounded-lg bg-vault-gold/10 p-3 text-sm">
                Society added successfully!
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Campus</Label>
                  <select
                    value={form.campus}
                    onChange={(e) =>
                      setForm({ ...form, campus: e.target.value })
                    }
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
                  <Label>Category</Label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  >
                    {SOCIETY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Members (approx.)</Label>
                <Input
                  type="number"
                  value={form.members}
                  onChange={(e) =>
                    setForm({ ...form, members: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input
                  value={form.instagram}
                  onChange={(e) =>
                    setForm({ ...form, instagram: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input
                  value={form.facebook}
                  onChange={(e) =>
                    setForm({ ...form, facebook: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Society"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
