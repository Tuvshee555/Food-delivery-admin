export async function uploadToCloudinary(
  file: File,
  type: "image" | "video"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET!);

  const endpoint = type === "video" ? "auto" : "image";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dbzydfkhc/${endpoint}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}
