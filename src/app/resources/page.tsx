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
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent } from "@/components/ui/card";

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

  const hasFilters =
    campus !== "all" ||
    course !== "all" ||
    department !== "all" ||
    semester !== "all" ||
    type !== "all" ||
    search.trim().length > 0;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Academic Library"
        title="Course Resources"
        description="Past papers, notes, and study materials from every FAST-NUCES campus."
      >
        <Button size="lg" className="mt-4 md:mt-0" asChild>
          <Link href="/resources/upload">
            <Plus className="h-4 w-4" />
            Upload Resource
          </Link>
        </Button>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Card className="mb-8 border-border/80 shadow-card">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-muted-foreground">
                Filter & search
              </p>
              {hasFilters && (
                <button
                  type="button"
                  className="text-sm font-medium text-vault-gold hover:underline"
                  onClick={() => {
                    setCampus("all");
                    setCourse("all");
                    setDepartment("all");
                    setSemester("all");
                    setType("all");
                    setSearch("");
                  }}
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-6">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title or course..."
                  className="pl-9"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
              </div>
              <NativeSelect
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
              >
                <option value="all">All Campuses</option>
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
              <NativeSelect
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="all">All Courses</option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </NativeSelect>
              <NativeSelect
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </NativeSelect>
              <NativeSelect
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="all">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </NativeSelect>
              <NativeSelect value={type} onChange={(e) => setType(e.target.value)}>
                <option value="all">All Types</option>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{resources.length}</span>{" "}
            {resources.length === 1 ? "resource" : "resources"} found
          </p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="mb-6 rounded-xl border border-vault-gold/50 bg-vault-gold/10 p-4 text-sm">
            Supabase is not configured. Copy <code>.env.example</code> to{" "}
            <code>.env.local</code> and add your Supabase credentials.
          </div>
        )}

        {resources.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-semibold">No resources found</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Try clearing your filters or be the first to upload study material
                for your course.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/resources/upload">Upload Resource</Link>
              </Button>
            </CardContent>
          </Card>
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
    </div>
  );
}
