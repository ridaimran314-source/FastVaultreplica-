export function getDocumentPreviewUrl(fileUrl: string): string | null {
  const path = fileUrl.split("?")[0].toLowerCase();

  if (path.endsWith(".pdf")) {
    return fileUrl;
  }

  if (/\.(doc|docx|ppt|pptx|xls|xlsx)$/.test(path)) {
    return `https://docs.google.com/gviewer?embedded=true&url=${encodeURIComponent(fileUrl)}`;
  }

  return null;
}

export function canPreviewDocument(fileUrl: string): boolean {
  return getDocumentPreviewUrl(fileUrl) !== null;
}
