"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { getSupabaseErrorMessage } from "@/lib/supabase/errors";
import { uploadUserFile } from "@/lib/supabase/upload";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  CAMPUSES,
  COURSES,
  DEPARTMENTS,
  MAX_UPLOAD_MB,
  RESOURCE_TYPES,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function UploadForm() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "notes",
    course: COURSES[0] as string,
    semester: "1",
    campus: profile?.campus || "",
    department: "CS",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && selected.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`File must be ${MAX_UPLOAD_MB} MB or smaller.`);
      setFile(null);
      e.target.value = "";
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fileUrl = await uploadUserFile(user.id, file, {
        maxBytes: MAX_UPLOAD_MB * 1024 * 1024,
      });
      const keywords = [
        form.title.toLowerCase(),
        form.course.toLowerCase(),
        ...form.course.toLowerCase().split(" "),
      ];

      const { error: insertError } = await getSupabase().from("resources").insert({
        title: form.title,
        description: form.description,
        type: form.type,
        course: form.course,
        semester: Number(form.semester),
        campus: form.campus,
        department: form.department,
        file_url: fileUrl,
        downloads: 0,
        uploaded_by: user.id,
        uploader_name: profile?.name || user.email,
        status: "published",
        search_keywords: keywords,
      });

      if (insertError) throw insertError;
      setSuccess(true);
    } catch (err) {
      setError(getSupabaseErrorMessage(err, "Upload failed."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-vault-gold">
            Upload Submitted!
          </h2>
          <p className="mb-6 text-muted-foreground">
            Your resource is now live in the directory. If you don&apos;t see it
            right away, set all filters to &quot;All&quot; on the Resources page.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push("/resources")}>
              Browse Resources
            </Button>
            <Button variant="outline" onClick={() => setSuccess(false)}>
              Upload Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full border-border/80 shadow-card">
      <CardHeader>
        <CardTitle>Resource details</CardTitle>
        <CardDescription>
          Files up to {MAX_UPLOAD_MB} MB · published immediately after upload
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <select
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Course</Label>
            <select
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              required
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Semester</Label>
              <select
                value={form.semester}
                onChange={(e) =>
                  setForm({ ...form, semester: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Campus</Label>
              <select
                value={form.campus}
                onChange={(e) => setForm({ ...form, campus: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                required
              >
                <option value="">Select campus</option>
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">File (PDF, DOC, etc.) — max {MAX_UPLOAD_MB} MB</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
              onChange={handleFileChange}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            By uploading, you agree to our{" "}
            <a href="/content-policy" className="text-vault-gold hover:underline">
              Content Policy
            </a>
            . Uploads appear in the directory immediately.
          </p>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Uploading..." : "Submit for Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function UploadResourcePage() {
  return (
    <ProtectedRoute>
      <div className="pb-12">
        <div className="border-b bg-gradient-to-br from-vault-navy via-vault-blue to-vault-navy px-4 py-10 text-white">
          <div className="mx-auto max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-vault-gold">
              Contribute
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Upload Resource</h1>
            <p className="mt-2 text-sm text-white/75">
              Share notes, past papers, and study guides with students nationwide.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-lg px-4 py-10">
          <UploadForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
