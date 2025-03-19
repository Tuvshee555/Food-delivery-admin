import axios from "axios";

export const uploadImage = async (file: File): Promise<string | undefined> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Tushka");

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/dbzydfkhc/image/upload`,
      formData
    );

    return data.secure_url;
  } catch (error) {
    console.error("Image upload error: ", error);
    return undefined;
  }
};
