export function getFileNameFromUrl(fileUrl: string): string {
  try {
    const path = fileUrl.split("?")[0];
    const raw = path.split("/").pop() || "document";
    const decoded = decodeURIComponent(raw);
    return decoded.replace(/^\d+_/, "") || decoded;
  } catch {
    return "document";
  }
}

export function getFileExtension(fileUrl: string): string {
  const path = fileUrl.split("?")[0].toLowerCase();
  const match = path.match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "file";
}

export function isPdfFile(fileUrl: string): boolean {
  return getFileExtension(fileUrl) === "pdf";
}

export function isOfficeFile(fileUrl: string): boolean {
  return /\.(doc|docx|ppt|pptx|xls|xlsx)$/.test(
    fileUrl.split("?")[0].toLowerCase()
  );
}

export function canPreviewDocument(fileUrl: string): boolean {
  return isPdfFile(fileUrl) || isOfficeFile(fileUrl);
}

/** PDF.js viewer — works better on mobile than raw iframe */
export function getPdfJsViewerUrl(fileUrl: string): string {
  return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
}

export function getOfficePreviewUrl(fileUrl: string): string {
  return `https://docs.google.com/gviewer?embedded=true&url=${encodeURIComponent(fileUrl)}`;
}

export function getDocumentPreviewUrl(fileUrl: string): string | null {
  if (isPdfFile(fileUrl)) return getPdfJsViewerUrl(fileUrl);
  if (isOfficeFile(fileUrl)) return getOfficePreviewUrl(fileUrl);
  return null;
}
