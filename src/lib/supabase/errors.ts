export function getSupabaseErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message: string }).message);
    if (message.includes("duplicate key") || message.includes("already registered")) {
      return "This email is already registered. Go to Login instead.";
    }
    if (message.includes("Password")) return message;
    if (message.includes("Invalid login")) return "Invalid email or password.";
    if (
      message.includes("payload too large") ||
      message.includes("object exceeded maximum size")
    ) {
      return "File is too large. Maximum size is 5 MB.";
    }
    return message || fallback;
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function validateFileSize(file: File): string | null {
  if (file.size > MAX_UPLOAD_BYTES) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 5 MB.`;
  }
  return null;
}
