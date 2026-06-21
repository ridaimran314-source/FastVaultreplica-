"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { requireDb } from "@/lib/firebase/client";
import { getFirebaseErrorMessage, withTimeout } from "@/lib/firebase/errors";
import { uploadUserFile } from "@/lib/firebase/upload";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import { useAuth } from "@/lib/auth/AuthProvider";
import { CAMPUSES, DEPARTMENTS, RESOURCE_TYPES } from "@/lib/constants";
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
    course: "",
    semester: "1",
    campus: profile?.campus || "",
    department: "CS",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const firestore = requireDb();
      const fileUrl = await uploadUserFile(user.uid, file);

      const keywords = [
        form.title.toLowerCase(),
        form.course.toLowerCase(),
        ...form.course.toLowerCase().split(" "),
      ];

      await withTimeout(
        addDoc(collection(firestore, "resources"), {
          title: form.title,
          description: form.description,
          type: form.type,
          course: form.course,
          semester: Number(form.semester),
          campus: form.campus,
          department: form.department,
          file_url: fileUrl,
          downloads: 0,
          uploaded_by: user.uid,
          uploader_name: profile?.name || user.email,
          status: "pending",
          search_keywords: keywords,
          created_at: serverTimestamp(),
        }),
        20_000,
        "Saving resource timed out. Enable Firestore (Build → Firestore → Create database), then try again."
      );

      setSuccess(true);
    } catch (err) {
      setError(getFirebaseErrorMessage(err, "Upload failed."));
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
            Your resource is in review and will typically be processed within
            2–5 business days. You&apos;ll see it in the directory once approved.
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
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Upload Resource</CardTitle>
        <CardDescription>
          Share academic materials with students across all campuses
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
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              placeholder="e.g. Data Structures"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              required
            />
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
            <Label htmlFor="file">File (PDF, DOC, etc.)</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            By uploading, you agree to our{" "}
            <a href="/content-policy" className="text-vault-gold hover:underline">
              Content Policy
            </a>
            . Uploads are reviewed before publication.
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
      <div className="px-4 py-12">
        <UploadForm />
      </div>
    </ProtectedRoute>
  );
}
