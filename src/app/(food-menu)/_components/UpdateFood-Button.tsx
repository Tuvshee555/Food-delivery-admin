/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, ChangeEvent } from "react";
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
    price: food.price ?? "",
    oldPrice: (food as any).oldPrice ?? "",
    discount: (food as any).discount ?? "",
    ingredients: food.ingredients || "",
    image: food.image,
    categoryId: food.categoryId || "",
    video: food.video || "",
    sizes: food.sizes || [],
    extraImages: food.extraImages || [],
    isFeatured: !!food.isFeatured,
    salesCount: typeof food.salesCount === "number" ? food.salesCount : 0,
  } as unknown as FoodType);

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

  // price/oldPrice/discount input helper (track last edited to auto-calc)
  const [lastEdited, setLastEdited] = useState<
    "none" | "price" | "oldPrice" | "discount"
  >("none");

  const handleMainImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUpdatedFood((p) => ({ ...p, image: file } as any));
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

  // price/oldPrice/discount change handlers (store as strings for inputs)
  const handlePriceChange = (v: string) => {
    setUpdatedFood((p: any) => ({ ...p, price: v }));
    setLastEdited("price");
  };
  const handleOldPriceChange = (v: string) => {
    setUpdatedFood((p: any) => ({ ...p, oldPrice: v }));
    setLastEdited("oldPrice");
  };
  const handleDiscountChange = (v: string) => {
    // allow empty or 0-100 numeric
    if (v === "" || /^\d{0,3}$/.test(v)) {
      setUpdatedFood((p: any) => ({ ...p, discount: v }));
      setLastEdited("discount");
    }
  };

  // auto-calc rules (mirror AddFoodModel behavior)
  useEffect(() => {
    const p = Number(updatedFood.price);
    const op =
      updatedFood.oldPrice === "" ? undefined : Number(updatedFood.oldPrice);
    const d =
      updatedFood.discount === "" ? undefined : Number(updatedFood.discount);

    if (lastEdited === "oldPrice" || lastEdited === "discount") {
      if (
        typeof op === "number" &&
        !Number.isNaN(op) &&
        typeof d === "number" &&
        !Number.isNaN(d)
      ) {
        const boundedD = Math.max(0, Math.min(100, d));
        const computed = Number((op * (1 - boundedD / 100)).toFixed(2));
        setUpdatedFood((p) => ({ ...p, price: String(computed) } as any));
      } else if (
        typeof op === "number" &&
        !Number.isNaN(op) &&
        (updatedFood.discount === "" || updatedFood.discount === "0")
      ) {
        setUpdatedFood((p) => ({ ...p, price: String(op) } as any));
      }
    } else if (lastEdited === "price") {
      if (
        !Number.isNaN(p) &&
        typeof op === "number" &&
        (updatedFood.discount === "" || updatedFood.discount === "0")
      ) {
        if (op > 0) {
          const calc = Math.round(((op - p) / op) * 100);
          setUpdatedFood(
            (p) =>
              ({
                ...p,
                discount: String(Math.max(0, Math.min(100, calc))),
              } as any)
          );
        }
      } else if (
        !Number.isNaN(p) &&
        updatedFood.discount !== "" &&
        (updatedFood.oldPrice === "" || updatedFood.oldPrice === undefined)
      ) {
        const dd = Math.max(
          0,
          Math.min(100, Number(updatedFood.discount || 0))
        );
        if (dd >= 100) {
          setUpdatedFood((p) => ({ ...p, oldPrice: String(p) } as any));
        } else {
          const calcOld = Number((p / (1 - dd / 100)).toFixed(2));
          setUpdatedFood((p) => ({ ...p, oldPrice: String(calcOld) } as any));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lastEdited,
    updatedFood.price,
    updatedFood.oldPrice,
    updatedFood.discount,
  ]);

  const updateData = async () => {
    if (!updatedFood.id) return toast.error("Missing food ID");

    try {
      setLoading(true);

      const mainImageUrl =
        updatedFood.image instanceof File
          ? await uploadImage(updatedFood.image)
          : (updatedFood.image as string);

      const uploadedExtras = await Promise.all([
        ...extraFiles.map((file) => uploadImage(file)),
        ...(Array.isArray(updatedFood.extraImages)
          ? (updatedFood.extraImages as any[])
          : []
        ).filter((i): i is string => typeof i === "string"),
      ]);

      const videoUrl = videoFile
        ? await uploadImage(videoFile)
        : (updatedFood.video as string | undefined);

      // prepare numeric fields
      const parsedPrice =
        updatedFood.price === "" ? undefined : Number(updatedFood.price);
      const parsedOldPrice =
        updatedFood.oldPrice === "" ? undefined : Number(updatedFood.oldPrice);
      const parsedDiscount =
        updatedFood.discount === ""
          ? undefined
          : Math.round(Number(updatedFood.discount));

      let finalPrice =
        typeof parsedPrice === "number" && !Number.isNaN(parsedPrice)
          ? parsedPrice
          : undefined;
      let finalOldPrice =
        typeof parsedOldPrice === "number" && !Number.isNaN(parsedOldPrice)
          ? parsedOldPrice
          : undefined;
      let finalDiscount =
        typeof parsedDiscount === "number" && !Number.isNaN(parsedDiscount)
          ? Math.max(0, Math.min(100, parsedDiscount))
          : undefined;

      if (typeof finalPrice === "undefined") {
        if (
          typeof finalOldPrice === "number" &&
          typeof finalDiscount === "number"
        ) {
          finalPrice = Number(
            (finalOldPrice * (1 - finalDiscount / 100)).toFixed(2)
          );
        } else if (typeof finalOldPrice === "number") {
          finalPrice = Number(finalOldPrice);
          finalDiscount = finalDiscount ?? 0;
        }
      }

      if (typeof finalOldPrice === "undefined") {
        if (
          typeof finalPrice === "number" &&
          typeof finalDiscount === "number"
        ) {
          if (finalDiscount >= 100) {
            finalOldPrice = finalPrice;
          } else {
            finalOldPrice = Number(
              (finalPrice / (1 - finalDiscount / 100)).toFixed(2)
            );
          }
        }
      }

      if (typeof finalDiscount === "undefined") {
        if (
          typeof finalOldPrice === "number" &&
          typeof finalPrice === "number" &&
          finalOldPrice > 0
        ) {
          finalDiscount = Math.round(
            ((finalOldPrice - finalPrice) / finalOldPrice) * 100
          );
          finalDiscount = Math.max(0, Math.min(100, finalDiscount));
        } else {
          finalDiscount = 0;
        }
      }

      const payload: any = {
        foodName: updatedFood.foodName,
        price: typeof finalPrice === "number" ? Number(finalPrice) : undefined,
        ingredients: updatedFood.ingredients,
        image: mainImageUrl,
        extraImages: uploadedExtras,
        video: videoUrl,
        categoryId: updatedFood.categoryId || food.categoryId,
        sizes,
        isFeatured: !!updatedFood.isFeatured,
        // allow manual override of salesCount only if number provided in state
        salesCount:
          typeof updatedFood.salesCount === "number"
            ? updatedFood.salesCount
            : undefined,
      };

      // only include optional numeric fields when they exist
      if (typeof finalOldPrice === "number")
        payload.oldPrice = Number(finalOldPrice);
      if (typeof finalDiscount === "number")
        payload.discount = Number(finalDiscount);

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${updatedFood.id}`,
        payload
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-2 right-2 h-11 w-11 flex items-center justify-center bg-white rounded-full cursor-pointer hover:shadow-lg transition">
          <Pencil className="text-red-500 h-5 w-5" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] bg-white rounded-2xl shadow-lg border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Food Item
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Update details, add photos, video, sizes, discount or featured flag.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="flex gap-3">
            <input
              value={updatedFood.foodName}
              onChange={(e) =>
                setUpdatedFood((p: any) => ({ ...p, foodName: e.target.value }))
              }
              placeholder="Food name"
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="number"
              value={updatedFood.price as any}
              onChange={(e) => {
                handlePriceChange(e.target.value);
              }}
              placeholder="Price"
              className="border p-2 rounded-md w-[150px] focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              value={updatedFood.oldPrice as any}
              onChange={(e) => handleOldPriceChange(e.target.value)}
              placeholder="Old price (optional)"
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="number"
              value={updatedFood.discount as any}
              onChange={(e) => handleDiscountChange(e.target.value)}
              placeholder="Discount % (optional)"
              className="border p-2 rounded-md w-[150px] focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Онцлох (Featured)</label>
            <input
              type="checkbox"
              checked={!!updatedFood.isFeatured}
              onChange={(e) =>
                setUpdatedFood((p: any) => ({
                  ...p,
                  isFeatured: e.target.checked,
                }))
              }
            />
            <div className="text-sm text-gray-600 ml-4">
              Sales:{" "}
              <span className="font-medium">{updatedFood.salesCount ?? 0}</span>
            </div>
          </div>

          <textarea
            value={updatedFood.ingredients}
            onChange={(e) =>
              setUpdatedFood((p: any) => ({
                ...p,
                ingredients: e.target.value,
              }))
            }
            placeholder="Ingredients or description..."
            rows={3}
            className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
          />

          <SelectCategory
            handleChange={(e) =>
              setUpdatedFood((p: any) => ({ ...p, categoryId: e.value }))
            }
            updatedFood={updatedFood}
          />

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
