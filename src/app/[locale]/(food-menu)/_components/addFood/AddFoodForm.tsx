/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { ChangeEvent, useState } from "react";
import { X, Plus } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

interface Props {
  category: { id: string; categoryName: string };
  foodData: any;
  setFoodData: (v: any) => void;
  oldPrice: string;
  setOldPrice: (v: string) => void;
  images: File[];
  setImages: (v: File[]) => void;
  imagePreviews: string[];
  setImagePreviews: (v: string[]) => void;
  setVideo: (v: File | null) => void;
  videoPreview: string | null;
  setVideoPreview: (v: string | null) => void;
  sizes: string[];
  setSizes: (v: string[]) => void;
  isFeatured: boolean;
  setIsFeatured: (v: boolean) => void;
  closeModal: () => void;
}

export const AddFoodForm = ({
  category,
  foodData,
  setFoodData,
  oldPrice,
  setOldPrice,
  images,
  setImages,
  imagePreviews,
  setImagePreviews,
  setVideo,
  videoPreview,
  setVideoPreview,
  sizes,
  setSizes,
  isFeatured,
  setIsFeatured,
  closeModal,
}: Props) => {
  const { t } = useI18n();
  const [newSize, setNewSize] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFoodData((p: any) => ({ ...p, [name]: value }));
  };

  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const list = Array.from(files);
    setImages([...images, ...list]);
    setImagePreviews([
      ...imagePreviews,
      ...list.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (i: number) => {
    setImages(images.filter((_, idx) => idx !== i));
    setImagePreviews(imagePreviews.filter((_, idx) => idx !== i));
  };

  const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const addSize = () => {
    if (!newSize.trim()) return;
    setSizes([...sizes, newSize.trim()]);
    setNewSize("");
  };

  const removeSize = (i: number) =>
    setSizes(sizes.filter((_, idx) => idx !== i));

  return (
    <>
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">
          {t("food.add_title", { category: category.categoryName })}
        </h2>

        <button
          onClick={closeModal}
          className="h-[44px] w-[44px] flex items-center justify-center rounded-md hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="grid gap-4">
        <div className="flex gap-3">
          <input
            name="foodName"
            placeholder={t("food.fields.name")}
            className="h-[44px] w-full rounded-md border border-border bg-background px-3 text-sm"
            value={foodData.foodName}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            placeholder={t("food.fields.price")}
            className="h-[44px] w-full rounded-md border border-border bg-background px-3 text-sm"
            value={foodData.price}
            onChange={handleChange}
          />
        </div>

        <input
          type="number"
          placeholder={t("food.fields.old_price")}
          className="h-[44px] rounded-md border border-border bg-background px-3 text-sm"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          {t("food.fields.featured")}
        </label>

        <textarea
          name="ingredients"
          placeholder={t("food.fields.description")}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed"
          rows={3}
          value={foodData.ingredients}
          onChange={handleChange}
        />

        <input type="file" multiple accept="image/*" onChange={handleImages} />

        <div className="flex gap-2 flex-wrap">
          {imagePreviews.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} className="w-24 h-24 object-cover rounded-md" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background flex items-center justify-center border border-border"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <input type="file" accept="video/*" onChange={handleVideo} />
        {videoPreview && (
          <video
            src={videoPreview}
            controls
            className="w-full h-[180px] rounded-md bg-black"
          />
        )}

        <div className="flex gap-2">
          <input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder={t("food.fields.size")}
            className="h-[44px] w-full rounded-md border border-border bg-background px-3 text-sm"
          />
          <button
            onClick={addSize}
            className="h-[44px] w-[44px] rounded-md bg-primary text-primary-foreground flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {sizes.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-sm bg-muted flex items-center gap-2"
            >
              {s}
              <X
                className="w-4 h-4 cursor-pointer"
                onClick={() => removeSize(i)}
              />
            </span>
          ))}
        </div>
      </div>
    </>
  );
};
