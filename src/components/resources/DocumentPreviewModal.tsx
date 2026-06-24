"use client";

import { X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentPreviewModalProps {
  title: string;
  previewUrl: string;
  onClose: () => void;
}

export function DocumentPreviewModal({
  title,
  previewUrl,
  onClose,
}: DocumentPreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-vault-navy/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b bg-muted/40 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-vault-gold">
              Document Preview
            </p>
            <h2 className="truncate font-semibold">{title}</h2>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <Maximize2 className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <iframe
          src={previewUrl}
          title={title}
          className="h-full w-full flex-1 bg-muted"
        />
      </div>
    </div>
  );
}
