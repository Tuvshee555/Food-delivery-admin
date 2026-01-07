// src/utils/uploadMedia.ts
import axios from "axios";

export async function uploadMedia(files: File[]): Promise<string[]> {
  if (!files.length) return [];

  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/media`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data.urls;
}
