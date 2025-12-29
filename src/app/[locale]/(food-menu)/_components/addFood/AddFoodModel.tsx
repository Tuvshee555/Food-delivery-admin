/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { uploadImage } from "@/utils/UploadImage";
import { AddFoodForm } from "./AddFoodForm";
import { AddFoodFooter } from "./AddFoodFooter";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

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
  const { t } = useI18n();

  const [foodData, setFoodData] = useState({
    foodName: "",
    price: "",
    ingredients: "",
    categoryId: category.id,
  });

  const [oldPrice, setOldPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!foodData.foodName.trim())
      return { ok: false, msg: t("food.validation.name") };

    const priceNum = Number(foodData.price);
    if (!foodData.price || Number.isNaN(priceNum) || priceNum <= 0)
      return { ok: false, msg: t("food.validation.price") };

    if (oldPrice) {
      const op = Number(oldPrice);
      if (Number.isNaN(op) || op <= 0)
        return { ok: false, msg: t("food.validation.old_price") };
    }

    return { ok: true };
  };

  const addFood = async () => {
    const valid = validateInputs();
    if (!valid.ok) {
      toast.error(valid.msg);
      return;
    }

    try {
      setLoading(true);

      const uploadedImages = await Promise.all(
        images.map((img) => uploadImage(img))
      );
      const uploadedVideo = video ? await uploadImage(video) : null;

      const payload: any = {
        foodName: foodData.foodName,
        price: Number(foodData.price),
        ingredients: foodData.ingredients,
        categoryId: foodData.categoryId,
        image: uploadedImages[0] || "",
        extraImages: uploadedImages.slice(1),
        video: uploadedVideo,
        sizes,
        isFeatured,
      };

      if (oldPrice) payload.oldPrice = Number(oldPrice);

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, payload);

      toast.success(t("food.toast.success"));
      refreshFood();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(t("food.toast.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className="
          bg-card
          text-foreground
          p-6
          rounded-2xl
          w-full max-w-[640px]
          shadow-lg
          max-h-[90vh]
          overflow-y-auto
        "
      >
        <AddFoodForm
          category={category}
          foodData={foodData}
          setFoodData={setFoodData}
          oldPrice={oldPrice}
          setOldPrice={setOldPrice}
          images={images}
          setImages={setImages}
          imagePreviews={imagePreviews}
          setImagePreviews={setImagePreviews}
          // video={video}
          setVideo={setVideo}
          videoPreview={videoPreview}
          setVideoPreview={setVideoPreview}
          sizes={sizes}
          setSizes={setSizes}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          closeModal={closeModal}
        />

        <AddFoodFooter
          loading={loading}
          onCancel={closeModal}
          onSubmit={addFood}
        />
      </div>
    </div>
  );
};
