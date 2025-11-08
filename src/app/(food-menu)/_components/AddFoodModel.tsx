/* eslint-disable @next/next/no-img-element */
import { useState, ChangeEvent } from "react";
import axios from "axios";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/utils/UploadImage";
import { FoodData } from "@/type/type";

interface FoodModelProps {
  category: { id: string; categoryName: string };
  closeModal: () => void;
  refreshFood: () => void;
}

export const AddFoodModel: React.FC<FoodModelProps> = ({
  category,
  closeModal,
  refreshFood,
}) => {
  const [foodData, setFoodData] = useState({
    foodName: "",
    price: "",
    ingredients: "",
    categoryId: category.id,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [newSize, setNewSize] = useState("");

  // handle basic text/number change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFoodData((prev) => ({ ...prev, [name]: value }));
  };

  // handle multiple image uploads
  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);

    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  // remove one image
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // handle video upload
  const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // handle size add
  const addSize = () => {
    const trimmed = newSize.trim();
    if (!trimmed) return;
    setSizes((prev) => [...prev, trimmed]);
    setNewSize("");
  };

  // remove size
  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const addFood = async () => {
    if (!foodData.foodName || !foodData.price || !foodData.ingredients) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      // Upload all images
      const uploadedImages = await Promise.all(
        images.map(async (img) => await uploadImage(img))
      );

      // Upload video if exists
      const uploadedVideo = video ? await uploadImage(video) : null;

      // Send request to backend
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, {
        foodName: foodData.foodName,
        price: Number(foodData.price),
        ingredients: foodData.ingredients,
        categoryId: foodData.categoryId,
        image: uploadedImages[0] || "", // main image
        extraImages: uploadedImages.slice(1), // additional photos
        video: uploadedVideo,
        sizes: sizes, // ["S", "M", "L"] etc
      });

      toast.success("✅ Successfully added item!");
      refreshFood();
      closeModal();
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("❌ Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-[520px] shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            Add new item to {category.categoryName}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-600 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4">
          {/* Food name & price */}
          <div className="flex gap-3">
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium">Name</label>
              <input
                name="foodName"
                placeholder="Type product name"
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={foodData.foodName}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm font-medium">Price</label>
              <input
                name="price"
                type="number"
                placeholder="Enter price..."
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={foodData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Description / Ingredients
            </label>
            <textarea
              name="ingredients"
              placeholder="Describe or list materials..."
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={foodData.ingredients}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Images */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <X
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-4 h-4 bg-black text-white rounded-full cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Optional Video</label>
            <input type="file" accept="video/*" onChange={handleVideo} />
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="w-full h-[180px] rounded-md mt-2"
              />
            )}
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Sizes (optional)</label>
            <div className="flex items-center gap-2">
              <input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="e.g. S, 38, 120cm..."
                className="border p-2 rounded-md w-full"
              />
              <button
                onClick={addSize}
                type="button"
                className="bg-black text-white rounded-md px-3 py-2 hover:bg-gray-900"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {size}
                  <X
                    className="w-4 h-4 cursor-pointer text-gray-600"
                    onClick={() => removeSize(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded-md text-sm"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 disabled:bg-gray-400"
            onClick={addFood}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
};
