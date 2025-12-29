/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { X } from "lucide-react";
import { ChangeEvent, MutableRefObject } from "react";

type Props = {
  updatedFood: any;
  setUpdatedFood: (fn: any) => void;

  mainPreview: string;
  setMainPreview: (v: string) => void;

  extraPreviews: string[];
  setExtraPreviews: (fn: any) => void;

  extraFiles: File[];
  setExtraFiles: (fn: any) => void;

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

    setUpdatedFood((p: any) => ({ ...p, image: file }));
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

    setExtraPreviews((p: string[]) => [...p, ...previews]);
    setExtraFiles((p: File[]) => [...p, ...files]);
    setUpdatedFood((p: any) => ({
      ...p,
      extraImages: [...(p.extraImages || []), ...files],
    }));
  };

  const removeExtra = (index: number) => {
    setExtraPreviews((p: string[]) => p.filter((_, i) => i !== index));

    if (index < existingExtraCount.current) {
      setUpdatedFood((p: any) => ({
        ...p,
        extraImages: p.extraImages.filter((_: any, i: number) => i !== index),
      }));
      existingExtraCount.current--;
    } else {
      const fileIndex = index - existingExtraCount.current;
      const file = extraFiles[fileIndex];

      setExtraFiles((p: any[]) =>
        p.filter((_: any, i: number) => i !== fileIndex)
      );
      setUpdatedFood((p: any) => ({
        ...p,
        extraImages: p.extraImages.filter(
          (x: any) =>
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
    setUpdatedFood((p: any) => ({ ...p, video: file }));
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
              <img src={src} className="w-20 h-20 rounded-md object-cover" />
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
