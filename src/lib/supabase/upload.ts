import { getSupabase } from "@/lib/supabase/client";
import { getSupabaseErrorMessage } from "@/lib/supabase/errors";

export async function uploadUserFile(
  userId: string,
  file: File,
  options?: { maxBytes?: number }
): Promise<string> {
  if (options?.maxBytes) {
    if (file.size > options.maxBytes) {
      const maxMb = (options.maxBytes / 1024 / 1024).toFixed(0);
      throw new Error(`File is too large. Maximum size is ${maxMb} MB.`);
    }
  }

  const supabase = getSupabase();
  const path = `${userId}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("uploads")
    .upload(path, file, { upsert: false });

  if (uploadError) {
    throw new Error(getSupabaseErrorMessage(uploadError, "Upload failed."));
  }

  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
}
