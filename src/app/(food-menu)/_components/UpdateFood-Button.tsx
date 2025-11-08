/* eslint-disable @next/next/no-img-element */
import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { FoodCardPropsType, FoodType } from "@/type/type";
import { SelectCategory } from "./SelectCategory";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash, Pencil, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { uploadImage } from "@/utils/UploadImage";

export const UpdateFoodButton: React.FC<FoodCardPropsType> = ({
  food,
  refreshFood,
}) => {
  const [updatedFood, setUpdatedFood] = useState<FoodType>({
    id: food.id,
    foodName: food.foodName || "",
    price: food.price || "",
    ingredients: food.ingredients || "",
    image: food.image,
    categoryId: food.categoryId || "",
    video: food.video || "",
    sizes: food.sizes || [],
    extraImages: food.extraImages || [],
  });

  // media & UI states
  const [mainPreview, setMainPreview] = useState<string>(
    typeof food.image === "string" ? food.image : ""
  );
  const [extraPreviews, setExtraPreviews] = useState<string[]>(
    Array.isArray(food.extraImages)
      ? food.extraImages.filter((i): i is string => typeof i === "string")
      : []
  );
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [videoPreview, setVideoPreview] = useState<string>(
    typeof food.video === "string" ? food.video : ""
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<string[]>(
    Array.isArray(food.sizes) ? food.sizes.map((s: any) => s.label ?? s) : []
  );
  const [newSize, setNewSize] = useState("");
  const [loading, setLoading] = useState(false);

  /* ------------------------------- Handlers ------------------------------- */
  const handleMainImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUpdatedFood((p) => ({ ...p, image: file }));
    const reader = new FileReader();
    reader.onload = () => setMainPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleExtraImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setExtraFiles((prev) => [...prev, ...newFiles]);
    setExtraPreviews((prev) => [...prev, ...previews]);
  };

  const removeExtraImage = (index: number) => {
    setExtraFiles((prev) => prev.filter((_, i) => i !== index));
    setExtraPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const addSize = () => {
    const val = newSize.trim();
    if (!val) return;
    setSizes((prev) => [...prev, val]);
    setNewSize("");
  };

  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  /* ------------------------------- Update ------------------------------- */
  const updateData = async () => {
    if (!updatedFood.id) return toast.error("Missing food ID");

    try {
      setLoading(true);

      const mainImageUrl =
        updatedFood.image instanceof File
          ? await uploadImage(updatedFood.image)
          : updatedFood.image;

      const uploadedExtras = await Promise.all([
        ...extraFiles.map((file) => uploadImage(file)),
        ...(updatedFood.extraImages || []).filter(
          (i): i is string => typeof i === "string"
        ),
      ]);

      const videoUrl = videoFile
        ? await uploadImage(videoFile)
        : updatedFood.video;

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${updatedFood.id}`,
        {
          foodName: updatedFood.foodName,
          price: Number(updatedFood.price),
          ingredients: updatedFood.ingredients,
          image: mainImageUrl,
          extraImages: uploadedExtras,
          video: videoUrl,
          categoryId: updatedFood.categoryId || food.categoryId,
          sizes,
        }
      );

      toast.success("✅ Item updated successfully");
      refreshFood();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------- Delete ------------------------------- */
  const deleteFood = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${food.id}`
      );
      toast.success("🗑 Deleted successfully");
      refreshFood();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------- UI ------------------------------- */
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-2 right-2 h-11 w-11 flex items-center justify-center bg-white rounded-full cursor-pointer hover:shadow-lg transition">
          <Pencil className="text-red-500 h-5 w-5" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] bg-white rounded-2xl shadow-lg border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Food Item
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Update details, add photos, video, or sizes below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Food name and price */}
          <div className="flex gap-3">
            <input
              value={updatedFood.foodName}
              onChange={(e) =>
                setUpdatedFood((p) => ({ ...p, foodName: e.target.value }))
              }
              placeholder="Food name"
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="number"
              value={updatedFood.price}
              onChange={(e) =>
                setUpdatedFood((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="Price"
              className="border p-2 rounded-md w-[150px] focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Ingredients */}
          <textarea
            value={updatedFood.ingredients}
            onChange={(e) =>
              setUpdatedFood((p) => ({ ...p, ingredients: e.target.value }))
            }
            placeholder="Ingredients or description..."
            rows={3}
            className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Category Selector */}
          <SelectCategory
            handleChange={(e) =>
              setUpdatedFood((p) => ({ ...p, categoryId: e.value }))
            }
            updatedFood={updatedFood}
          />

          {/* Main Image */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-gray-700">
              Main Image
            </label>
            <input type="file" accept="image/*" onChange={handleMainImage} />
            {mainPreview && (
              <img
                src={mainPreview}
                className="w-full h-40 object-cover rounded-xl border"
                alt="Main"
              />
            )}
          </div>

          {/* Extra Images */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-gray-700">
              Extra Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleExtraImages}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {extraPreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <X
                    onClick={() => removeExtraImage(index)}
                    className="absolute top-1 right-1 bg-black/70 text-white w-4 h-4 rounded-full cursor-pointer p-[1px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-gray-700">
              Optional Video
            </label>
            <input type="file" accept="video/*" onChange={handleVideo} />
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="w-full h-[220px] rounded-xl mt-2 border"
              />
            )}
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-gray-700">
              Sizes (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Add size (S, M, 38, etc.)"
                className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button
                onClick={addSize}
                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm border"
                >
                  {size}
                  <X
                    onClick={() => removeSize(index)}
                    className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-4">
          <Button
            onClick={updateData}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white font-medium"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={deleteFood}
            disabled={loading}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <Trash className="w-4 h-4 mr-1" /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
