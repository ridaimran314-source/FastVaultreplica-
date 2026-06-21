"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { db, functions, isFirebaseConfigured, requireDb, requireFunctions } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireAuth } from "@/lib/auth/useProtectedRoute";
import { CAMPUSES, DEPARTMENTS, RESOURCE_TYPES } from "@/lib/constants";
import type { Resource } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { LoadingPage, SkeletonCard } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResourcesPage() {
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [campus, setCampus] = useState("all");
  const [course, setCourse] = useState("all");
  const [department, setDepartment] = useState("all");
  const [semester, setSemester] = useState("all");
  const [type, setType] = useState("all");
  const [courses, setCourses] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campusParam = params.get("campus");
    if (campusParam) setCampus(campusParam);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
      setLoading(false);
      return;
    }

    let q = query(
      collection(db, "resources"),
      where("status", "==", "published"),
      orderBy("created_at", "desc")
    );

    if (campus !== "all") {
      q = query(q, where("campus", "==", campus));
    }
    if (department !== "all") {
      q = query(q, where("department", "==", department));
    }
    if (semester !== "all") {
      q = query(q, where("semester", "==", Number(semester)));
    }
    if (type !== "all") {
      q = query(q, where("type", "==", type));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title,
            description: data.description,
            type: data.type,
            course: data.course,
            semester: data.semester,
            campus: data.campus,
            department: data.department,
            file_url: data.file_url,
            downloads: data.downloads ?? 0,
            uploaded_by: data.uploaded_by,
            uploader_name: data.uploader_name,
            status: data.status,
            search_keywords: data.search_keywords,
            created_at: data.created_at?.toDate?.() ?? new Date(),
          } as Resource;
        });

        const courseSet = new Set(items.map((r) => r.course));
        setCourses(Array.from(courseSet).sort());

        let filtered = items;
        if (course !== "all") {
          filtered = filtered.filter((r) => r.course === course);
        }
        if (search.trim()) {
          const term = search.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.title.toLowerCase().includes(term) ||
              r.course.toLowerCase().includes(term) ||
              r.search_keywords?.some((k) => k.includes(term))
          );
        }

        setResources(filtered);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsubscribe;
  }, [campus, course, department, semester, type, search]);

  useEffect(() => {
    if (!user || !isFirebaseConfigured() || !db) return;

    const q = query(
      collection(db, "bookmarks"),
      where("user_id", "==", user.uid),
      where("type", "==", "resource")
    );

    getDocs(q).then((snapshot) => {
      setBookmarks(new Set(snapshot.docs.map((d) => d.data().resource_id)));
    });
  }, [user]);

  const handleBookmark = async (resourceId: string) => {
    if (!requireAuth() || !user) return;
    const firestore = requireDb();

    if (bookmarks.has(resourceId)) {
      const q = query(
        collection(firestore, "bookmarks"),
        where("user_id", "==", user.uid),
        where("resource_id", "==", resourceId)
      );
      const snapshot = await getDocs(q);
      snapshot.docs.forEach((d) => deleteDoc(doc(firestore, "bookmarks", d.id)));
      setBookmarks((prev) => {
        const next = new Set(prev);
        next.delete(resourceId);
        return next;
      });
    } else {
      await addDoc(collection(firestore, "bookmarks"), {
        user_id: user.uid,
        resource_id: resourceId,
        type: "resource",
        created_at: serverTimestamp(),
      });
      setBookmarks((prev) => new Set(prev).add(resourceId));
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      if (isFirebaseConfigured()) {
        const incrementDownload = httpsCallable(requireFunctions(), "incrementDownloadCount");
        await incrementDownload({ resourceId: resource.id, collection: "resources" });
      }
    } catch {
      // Continue with download even if counter fails
    }
    window.open(resource.file_url, "_blank");
  };

  const handleShare = (resource: Resource) => {
    const url = `${window.location.origin}/resources/${resource.id}`;
    if (navigator.share) {
      navigator.share({ title: resource.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => setSearch(value), 300),
    []
  );

  if (loading) return <LoadingPage message="Loading resources..." />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Resources</h1>
          <p className="text-muted-foreground">
            Past papers, notes, and study materials from all campuses
          </p>
        </div>
        <Link href="/resources/upload">
          <Button>
            <Plus className="h-4 w-4" />
            Upload Resource
          </Button>
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <select
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Campuses</option>
          {CAMPUSES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {!isFirebaseConfigured() && (
        <div className="mb-6 rounded-lg border border-vault-gold/50 bg-vault-gold/10 p-4 text-sm">
          Firebase is not configured. Copy <code>.env.example</code> to{" "}
          <code>.env.local</code> and add your Firebase credentials to load resources.
        </div>
      )}

      {resources.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No resources found. Be the first to upload!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isBookmarked={bookmarks.has(resource.id)}
              onBookmark={() => handleBookmark(resource.id)}
              onDownload={() => handleDownload(resource)}
              onShare={() => handleShare(resource)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
