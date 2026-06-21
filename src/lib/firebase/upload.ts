import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { requireStorage } from "@/lib/firebase/client";
import { getFirebaseErrorMessage, withTimeout } from "@/lib/firebase/errors";

const UPLOAD_TIMEOUT_MS = 45_000;

export async function uploadUserFile(
  userId: string,
  file: File
): Promise<string> {
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
  if (!bucket) {
    throw new Error(
      "Storage bucket missing. Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local (Firebase Console → Project settings → Your apps)."
    );
  }

  const firebaseStorage = requireStorage();
  const storageRef = ref(
    firebaseStorage,
    `uploads/${userId}/${Date.now()}_${file.name}`
  );

  try {
    await withTimeout(
      uploadBytes(storageRef, file),
      UPLOAD_TIMEOUT_MS,
      "File upload timed out. Enable Firebase Storage (Build → Storage → Get started), then try again."
    );

    return await withTimeout(
      getDownloadURL(storageRef),
      15_000,
      "Upload finished but download URL timed out. Check Firebase Storage is enabled."
    );
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error, "Upload failed."));
  }
}
