"use client";

import { useState } from "react";
import {
  Download,
  Bookmark,
  Share2,
  Eye,
  FileText,
} from "lucide-react";
import type { Resource } from "@/lib/types";
import { capitalize, formatDate } from "@/lib/utils";
import {
  canPreviewDocument,
  getDocumentPreviewUrl,
} from "@/lib/document-preview";
import { DocumentPreviewModal } from "@/components/resources/DocumentPreviewModal";
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewUrl = getDocumentPreviewUrl(resource.file_url);
  const canPreview = canPreviewDocument(resource.file_url);

  const handleView = () => {
    if (canPreview && previewUrl) {
      setPreviewOpen(true);
      return;
    }
    window.open(resource.file_url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Card className="group overflow-hidden border-border/80 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-vault-gold/50 hover:shadow-soft">
        <div className="h-1 bg-gradient-to-r from-vault-gold via-amber-300 to-vault-gold opacity-80" />
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-vault-gold/15">
                <FileText className="h-4 w-4 text-vault-gold" />
              </div>
              <span className="rounded-full bg-vault-navy px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                {capitalize(resource.type)}
              </span>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDate(resource.created_at)}
            </span>
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-semibold tracking-tight group-hover:text-vault-navy">
            {resource.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {resource.course} · Sem {resource.semester} ·{" "}
            {capitalize(resource.campus)}
          </p>

          <div className="mb-5 flex items-center justify-between border-t border-dashed pt-4 text-xs text-muted-foreground">
            <span>{resource.downloads} downloads</span>
            {resource.uploader_name && <span>by {resource.uploader_name}</span>}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleView}
              className="flex-1 sm:flex-none"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onBookmark}
              className={isBookmarked ? "border-vault-gold text-vault-gold" : ""}
              aria-label="Bookmark"
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewOpen && previewUrl && (
        <DocumentPreviewModal
          title={resource.title}
          previewUrl={previewUrl}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}
