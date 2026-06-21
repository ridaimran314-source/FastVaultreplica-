export function getFirebaseErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof Error) {
    const code = (error as Error & { code?: string }).code;
    if (code === "storage/unauthorized" || code === "storage/unauthenticated") {
      return "Upload denied. Sign in again, then retry. If this persists, deploy storage rules: firebase deploy --only storage";
    }
    if (code === "permission-denied") {
      return "Firestore permission denied. Deploy rules: firebase deploy --only firestore:rules";
    }
    if (
      error.message.includes("offline") ||
      code === "unavailable" ||
      code === "storage/retry-limit-exceeded"
    ) {
      return "Firebase is unreachable. Enable Firestore and Storage in Firebase Console, then restart the dev server.";
    }
    if (error.message.includes("timed out")) {
      return error.message;
    }
    return error.message || fallback;
  }
  return fallback;
}

export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ]);
}
