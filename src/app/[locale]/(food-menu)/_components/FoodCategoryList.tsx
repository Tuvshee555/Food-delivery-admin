"use client";

import { FoodCard } from "./FoodCard";
import { AddFoodButton } from "./AddFoodButton";
import { FoodCategoryListPropsType } from "@/type/type";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const FoodCategoryList: React.FC<FoodCategoryListPropsType> = ({
  category,
  foodData,
  refreshFood,
}) => {
  const { t } = useI18n();

  const categoryId = category.id;
  const foodsInCategory = foodData.filter((f) => f.categoryId === categoryId);

  return (
    <section
      className="
        bg-card
        text-foreground
        border border-border
        rounded-xl
        p-5
        flex flex-col
        gap-4
      "
    >
      <h2 className="text-base font-semibold">
        {t("category_with_count", {
          name: category.categoryName,
          count: foodsInCategory.length,
        })}
      </h2>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-4
        "
      >
        <AddFoodButton category={category} refreshFood={refreshFood} />

        {foodsInCategory.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            category={category}
            refreshFood={refreshFood}
          />
        ))}
      </div>
    </section>
  );
};
