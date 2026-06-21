"use client";

import Link from "next/link";
import {
  Download,
  Bookmark,
  Share2,
  Eye,
  FileText,
} from "lucide-react";
import type { Resource } from "@/lib/types";
import { capitalize, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResourceCardProps {
  resource: Resource;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export function ResourceCard({
  resource,
  isBookmarked,
  onBookmark,
  onDownload,
  onShare,
}: ResourceCardProps) {
  return (
    <Card className="transition-all hover:border-vault-gold/50 hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-vault-gold" />
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {capitalize(resource.type)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(resource.created_at)}
          </span>
        </div>

        <h3 className="mb-1 font-semibold line-clamp-2">{resource.title}</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          {resource.course} · Sem {resource.semester} ·{" "}
          {capitalize(resource.campus)}
        </p>

        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{resource.downloads} downloads</span>
          {resource.uploader_name && (
            <span>by {resource.uploader_name}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/resources/${resource.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onBookmark}
            className={isBookmarked ? "border-vault-gold text-vault-gold" : ""}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
