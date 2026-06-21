"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { requireDb } from "@/lib/firebase/client";
import { getFirebaseErrorMessage, withTimeout } from "@/lib/firebase/errors";
import { uploadUserFile } from "@/lib/firebase/upload";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ADMISSION_SUBCATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AdmissionUploadForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subcategory, setSubcategory] = useState("guide");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;

    setLoading(true);
    setError("");

    try {
      const firestore = requireDb();
      const fileUrl = await uploadUserFile(user.uid, file);

      await withTimeout(
        addDoc(collection(firestore, "admission_resources"), {
          title,
          subcategory,
          file_url: fileUrl,
          downloads: 0,
          uploaded_by: user.uid,
          status: "pending",
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
            Your admission resource is in review (2–5 business days).
          </p>
          <Button onClick={() => router.push("/admission")}>
            Back to Admission Portal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Share Admission Resource</CardTitle>
        <CardDescription>
          Upload test materials, guides, or past papers for admission
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              {ADMISSION_SUBCATEGORIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Uploading..." : "Submit for Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdmissionUploadPage() {
  return (
    <ProtectedRoute>
      <div className="px-4 py-12">
        <AdmissionUploadForm />
      </div>
    </ProtectedRoute>
  );
}
