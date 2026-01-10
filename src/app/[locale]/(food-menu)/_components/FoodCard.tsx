/* eslint-disable @next/next/no-img-element */
"use client";

import { FoodCardPropsType } from "@/type/type";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import UpdateFoodButton from "./updateFood/UpdateFoodButton";
import { useEffect, useMemo } from "react";

export const FoodCard: React.FC<FoodCardPropsType> = ({
  food,
  refreshFood,
  category,
}) => {
  const { t } = useI18n();

  const imgSrc = useMemo(() => {
    if (!food.image) return null;

    if (typeof food.image === "string") {
      const trimmed = food.image.trim();
      return trimmed.length > 0 ? trimmed : null;
    }

    return URL.createObjectURL(food.image);
  }, [food.image]);

  useEffect(() => {
    if (imgSrc && typeof food.image !== "string") {
      return () => URL.revokeObjectURL(imgSrc);
    }
  }, [imgSrc, food.image]);

  return (
    <div
      className="
        bg-card
        text-foreground
        border border-border
        rounded-2xl
        p-4
        flex flex-col
        gap-4
        w-full
        h-[240px]
      "
    >
      <div className="relative w-full">
        {imgSrc ? (
          <img
            src={imgSrc}
            className="w-full h-[140px] rounded-xl object-cover"
            alt={food.foodName}
          />
        ) : (
          <div className="w-full h-[140px] rounded-xl border border-border bg-muted" />
        )}

        <UpdateFoodButton
          food={food}
          refreshFood={refreshFood}
          category={category}
        />
      </div>

      <div className="w-full space-y-1.5 flex-1 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium truncate">{food.foodName}</h3>
          <span className="text-sm font-medium shrink-0">{food.price}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {food.ingredients || t("no_description")}
        </p>
      </div>
    </div>
  );
};
