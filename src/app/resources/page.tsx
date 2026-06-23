"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapResource } from "@/lib/supabase/mappers";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireAuth } from "@/lib/auth/useProtectedRoute";
import { CAMPUSES, COURSES, DEPARTMENTS, RESOURCE_TYPES } from "@/lib/constants";
import type { Resource } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { LoadingPage } from "@/components/shared/LoadingSpinner";
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campusParam = params.get("campus");
    if (campusParam) setCampus(campusParam);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    async function loadResources() {
      const supabase = getSupabase();
      let query = supabase
        .from("resources")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (campus !== "all") query = query.eq("campus", campus);
      if (department !== "all") query = query.eq("department", department);
      if (semester !== "all") query = query.eq("semester", Number(semester));
      if (type !== "all") query = query.eq("type", type);
      if (course !== "all") query = query.eq("course", course);

      const { data, error } = await query;
      if (error) {
        setLoading(false);
        return;
      }

      let items = (data ?? []).map((row) => mapResource(row));

      if (search.trim()) {
        const term = search.toLowerCase();
        items = items.filter(
          (r) =>
            r.title.toLowerCase().includes(term) ||
            r.course.toLowerCase().includes(term) ||
            r.search_keywords?.some((k) => k.includes(term))
        );
      }

      setResources(items);
      setLoading(false);
    }

    loadResources();
  }, [campus, course, department, semester, type, search]);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return;

    getSupabase()
      .from("bookmarks")
      .select("resource_id")
      .eq("user_id", user.id)
      .eq("type", "resource")
      .then(({ data }) => {
        setBookmarks(new Set((data ?? []).map((b) => b.resource_id)));
      });
  }, [user]);

  const handleBookmark = async (resourceId: string) => {
    if (!requireAuth() || !user) return;
    const supabase = getSupabase();

    if (bookmarks.has(resourceId)) {
      setBookmarks((prev) => {
        const next = new Set(prev);
        next.delete(resourceId);
        return next;
      });
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", resourceId)
        .eq("type", "resource");
    } else {
      setBookmarks((prev) => new Set(prev).add(resourceId));
      await supabase.from("bookmarks").insert({
        user_id: user.id,
        resource_id: resourceId,
        type: "resource",
      });
    }
  };

  const handleDownload = async (resource: Resource) => {
    getSupabase()
      .from("resources")
      .update({ downloads: resource.downloads + 1 })
      .eq("id", resource.id)
      .then(() => {});
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
    debounce((value: string) => setSearch(value), 200),
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
          {COURSES.map((c) => (
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

      {!isSupabaseConfigured() && (
        <div className="mb-6 rounded-lg border border-vault-gold/50 bg-vault-gold/10 p-4 text-sm">
          Supabase is not configured. Copy <code>.env.example</code> to{" "}
          <code>.env.local</code> and add your Supabase credentials.
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
