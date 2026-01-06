/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/UploadImage.tsx
import axios from "axios";

export const uploadImage = async (file: File): Promise<string> => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Tushka"); // your Cloudinary preset name

  // Detect file type
  const isVideo = file.type.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";

  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/dbzydfkhc/${resourceType}/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data.secure_url;
  } catch (error: any) {
    console.error("Upload failed:", error.response?.data || error.message);
    throw new Error("Failed to upload file to Cloudinary");
  }
};
