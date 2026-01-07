/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { uploadMedia } from "@/utils/uploadMedia";
import { FoodCardPropsType, FoodType } from "@/type/type";

import FoodBasicFields from "./FoodBasicFields";
import FoodFooterActions from "./FoodFooterActions";
import { SelectCategory } from "../SelectCategory";
import FoodMediaFields from "./FoodMediaFields";
import FoodSizeFields from "./FoodSizeFields";

export default function UpdateFoodButton({
  food,
  refreshFood,
}: FoodCardPropsType) {
  const [updatedFood, setUpdatedFood] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [mainPreview, setMainPreview] = useState("");
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");

  const createdUrls = useRef<string[]>([]);
  const existingExtraCount = useRef(0);

  useEffect(() => {
    setUpdatedFood({
      ...food,
      price: String(food.price ?? ""),
      oldPrice: food.oldPrice ? String(food.oldPrice) : "",
      discount: food.discount ? String(food.discount) : "",
      sizes: Array.isArray(food.sizes)
        ? food.sizes.map((s: any) => s.label ?? s)
        : [],
    });

    setMainPreview(typeof food.image === "string" ? food.image : "");

    setExtraPreviews(
      Array.isArray(food.extraImages)
        ? food.extraImages.filter(
            (img): img is string => typeof img === "string"
          )
        : []
    );

    setVideoPreview(typeof food.video === "string" ? food.video : "");

    existingExtraCount.current = food.extraImages?.length ?? 0;
  }, [food]);

  useEffect(() => {
    return () => createdUrls.current.forEach(URL.revokeObjectURL);
  }, []);

  const updateData = async () => {
    try {
      setLoading(true);

      // 🔥 upload new main image if replaced
      const image =
        updatedFood.image instanceof File
          ? (await uploadMedia([updatedFood.image]))[0]
          : updatedFood.image;

      // 🔥 upload newly added extra images
      const newExtras = extraFiles.length ? await uploadMedia(extraFiles) : [];

      const finalExtras = [
        ...(updatedFood.extraImages || []).filter(
          (i: any) => typeof i === "string"
        ),
        ...newExtras,
      ];

      // 🔥 upload new video if replaced
      const video = videoFile
        ? (await uploadMedia([videoFile]))[0]
        : updatedFood.video;

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${food.id}`,
        {
          ...updatedFood,
          image,
          extraImages: finalExtras,
          video,
          price: Number(updatedFood.price),
          oldPrice: updatedFood.oldPrice
            ? Number(updatedFood.oldPrice)
            : undefined,
          discount: updatedFood.discount
            ? Number(updatedFood.discount)
            : undefined,
        }
      );

      toast.success("Updated");
      refreshFood();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
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
      toast.success("Deleted");
      refreshFood();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-2 right-2 h-11 w-11 bg-white rounded-full flex items-center justify-center">
          <Pencil className="w-5 h-5 text-red-500" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Food</DialogTitle>
          <DialogDescription>Update item details</DialogDescription>
        </DialogHeader>

        <FoodBasicFields
          updatedFood={updatedFood}
          setUpdatedFood={setUpdatedFood}
        />

        <SelectCategory
          updatedFood={updatedFood as FoodType}
          handleChange={(e) =>
            setUpdatedFood((p: any) => ({ ...p, categoryId: e.value }))
          }
        />

        <FoodMediaFields
          updatedFood={updatedFood}
          setUpdatedFood={setUpdatedFood}
          mainPreview={mainPreview}
          setMainPreview={setMainPreview}
          extraPreviews={extraPreviews}
          setExtraPreviews={setExtraPreviews}
          extraFiles={extraFiles}
          setExtraFiles={setExtraFiles}
          videoPreview={videoPreview}
          setVideoPreview={setVideoPreview}
          setVideoFile={setVideoFile}
          createdUrls={createdUrls}
          existingExtraCount={existingExtraCount}
        />

        <FoodSizeFields
          updatedFood={updatedFood}
          setUpdatedFood={setUpdatedFood}
        />

        <FoodFooterActions
          loading={loading}
          onSave={updateData}
          onDelete={deleteFood}
        />
      </DialogContent>
    </Dialog>
  );
}
