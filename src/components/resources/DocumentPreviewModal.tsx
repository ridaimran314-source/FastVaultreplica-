"use client";

import { X } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="truncate font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
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
