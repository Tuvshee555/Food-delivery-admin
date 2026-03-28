/* eslint-disable @next/next/no-img-element */
"use client";

import { X } from "lucide-react";
import { ChangeEvent, MutableRefObject } from "react";
import { FoodFormState } from "@/type/type";

type Props = {
  updatedFood: FoodFormState;
  setUpdatedFood: React.Dispatch<React.SetStateAction<FoodFormState>>;

  mainPreview: string;
  setMainPreview: (v: string) => void;

  extraPreviews: string[];
  setExtraPreviews: React.Dispatch<React.SetStateAction<string[]>>;

  extraFiles: File[];
  setExtraFiles: React.Dispatch<React.SetStateAction<File[]>>;

  videoPreview: string;
  setVideoPreview: (v: string) => void;
  setVideoFile: (f: File | null) => void;

  createdUrls: MutableRefObject<string[]>;
  existingExtraCount: MutableRefObject<number>;
};

export default function FoodMediaFields({
  setUpdatedFood,
  mainPreview,
  setMainPreview,
  extraPreviews,
  setExtraPreviews,
  extraFiles,
  setExtraFiles,
  videoPreview,
  setVideoPreview,
  setVideoFile,
  createdUrls,
  existingExtraCount,
}: Props) {
  const handleMainImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    createdUrls.current.push(url);

    setUpdatedFood((p) => ({ ...p, image: file }));
    setMainPreview(url);
  };

  const handleExtraImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previews = files.map((f) => {
      const url = URL.createObjectURL(f);
      createdUrls.current.push(url);
      return url;
    });

    setExtraPreviews((p) => [...p, ...previews]);
    setExtraFiles((p) => [...p, ...files]);
    setUpdatedFood((p) => ({
      ...p,
      extraImages: [...(p.extraImages || []), ...files],
    }));
  };

  const removeExtra = (index: number) => {
    setExtraPreviews((p) => p.filter((_, i) => i !== index));

    if (index < existingExtraCount.current) {
      setUpdatedFood((p) => ({
        ...p,
        extraImages: (p.extraImages || []).filter((_, i) => i !== index),
      }));
      existingExtraCount.current--;
    } else {
      const fileIndex = index - existingExtraCount.current;
      const file = extraFiles[fileIndex];

      setExtraFiles((p) => p.filter((_, i) => i !== fileIndex));
      setUpdatedFood((p) => ({
        ...p,
        extraImages: (p.extraImages || []).filter(
          (x) =>
            !(x instanceof File && x.name === file.name && x.size === file.size)
        ),
      }));
    }
  };

  const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    createdUrls.current.push(url);

    setVideoFile(file);
    setVideoPreview(url);
    setUpdatedFood((p) => ({ ...p, video: file }));
  };

  return (
    <div className="grid gap-4">
      {/* main image */}
      <div>
        <label className="text-sm font-medium">Main image</label>
        <input type="file" accept="image/*" onChange={handleMainImage} />
        {mainPreview && (
          <img
            src={mainPreview}
            alt="Main preview"
            className="w-full h-40 object-cover rounded-lg mt-2"
          />
        )}
      </div>

      {/* extra images */}
      <div>
        <label className="text-sm font-medium">Extra images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleExtraImages}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {extraPreviews.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} alt={`Extra ${i}`} className="w-20 h-20 rounded-md object-cover" />
              <X
                onClick={() => removeExtra(i)}
                className="absolute top-1 right-1 w-4 h-4 bg-black/70 text-white rounded-full cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* video */}
      <div>
        <label className="text-sm font-medium">Video (optional)</label>
        <input type="file" accept="video/*" onChange={handleVideo} />
        {videoPreview && (
          <video
            src={videoPreview}
            controls
            className="w-full h-52 rounded-lg mt-2"
          />
        )}
      </div>
    </div>
  );
}
