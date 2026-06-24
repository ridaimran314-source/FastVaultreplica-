"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getFileExtension,
  getFileNameFromUrl,
  getOfficePreviewUrl,
  getPdfJsViewerUrl,
  isOfficeFile,
  isPdfFile,
} from "@/lib/document-preview";

interface DocumentPreviewModalProps {
  title: string;
  fileUrl: string;
  onClose: () => void;
}

export function DocumentPreviewModal({
  title,
  fileUrl,
  onClose,
}: DocumentPreviewModalProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const fileName = getFileNameFromUrl(fileUrl);
  const extension = getFileExtension(fileUrl).toUpperCase();
  const pdf = isPdfFile(fileUrl);
  const office = isOfficeFile(fileUrl);

  const viewerSrc = pdf
    ? getPdfJsViewerUrl(fileUrl)
    : office
      ? getOfficePreviewUrl(fileUrl)
      : fileUrl;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const openInBrowser = () => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-vault-navy sm:bg-vault-navy/90">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-background px-3 py-3 sm:px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vault-gold/15">
          <FileText className="h-5 w-5 text-vault-gold" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight">{title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {fileName} · {extension}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Preview area */}
      <div className="relative min-h-0 flex-1 bg-zinc-900">
        {loadFailed ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-vault-gold/20">
              <FileText className="h-8 w-8 text-vault-gold" />
            </div>
            <p className="text-lg font-semibold text-white">{fileName}</p>
            <p className="mt-2 max-w-xs text-sm text-white/60">
              Inline preview isn&apos;t available on this device. Open the file in
              your browser to read it.
            </p>
            <Button size="lg" className="mt-6 w-full max-w-xs" onClick={openInBrowser}>
              <ExternalLink className="h-4 w-4" />
              Open Document
            </Button>
          </div>
        ) : (
          <iframe
            src={viewerSrc}
            title={title}
            className="h-full w-full border-0 bg-white"
            onError={() => setLoadFailed(true)}
          />
        )}
      </div>

      {/* Mobile bottom actions */}
      <div
        className="flex shrink-0 gap-2 border-t border-white/10 bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden"
      >
        <Button className="flex-1" onClick={openInBrowser}>
          <ExternalLink className="h-4 w-4" />
          Open
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
            Save
          </a>
        </Button>
      </div>

      {/* Desktop toolbar */}
      <div className="hidden shrink-0 items-center justify-end gap-2 border-t bg-muted/40 px-4 py-2 sm:flex">
        <Button variant="outline" size="sm" onClick={openInBrowser}>
          <ExternalLink className="h-4 w-4" />
          Open in new tab
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
            Download
          </a>
        </Button>
      </div>
    </div>
  );
}
