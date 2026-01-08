"use client";

import { useState } from "react";
import { AddFoodModel } from "./addFood/AddFoodModel";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

interface AddFoodButtonProps {
  category: {
    id: string;
    categoryName: string;
  };
  refreshFood: () => void;
}

export const AddFoodButton: React.FC<AddFoodButtonProps> = ({
  category,
  refreshFood,
}) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          w-full
          sm:w-[240px]
          h-[240px]
          rounded-xl
          border border-dashed border-border
          bg-background
          flex flex-col items-center justify-center
          gap-2
          text-foreground
          hover:bg-muted
        "
      >
        <div
          className="
            h-[44px] w-[44px]
            rounded-full
            bg-primary
            text-primary-foreground
            flex items-center justify-center
            text-lg
          "
        >
          +
        </div>

        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          {t("food.add_to_category", {
            category: category.categoryName,
          })}
        </p>
      </button>

      {open && (
        <AddFoodModel
          category={category}
          closeModal={() => setOpen(false)}
          refreshFood={refreshFood}
        />
      )}
    </>
  );
};
