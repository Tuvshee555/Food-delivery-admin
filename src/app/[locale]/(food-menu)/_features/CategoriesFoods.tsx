/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FoodCategoryList } from "../_components/FoodCategoryList";
import { FoodType, CategoryType } from "@/type/type";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type CategoriesFoodsProps = {
  category: CategoryType[];
};

export const CategoriesFoods: React.FC<CategoriesFoodsProps> = ({
  category,
}) => {
  const { t } = useI18n();
  const [foodData, setFoodData] = useState<FoodType[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeFood = (food: any): FoodType => ({
    ...food,
    _id: food.id,
    category: food.category || food.categoryId,
    foodData: [],
    categories: "",
  });

  const getFoodData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food`
      );
      setFoodData(response.data.map(normalizeFood));
    } catch {
      /* silent fail – UI handles empty */
    } finally {
      setLoading(false);
    }
  };

  const refreshFood = async () => {
    await getFoodData();
  };

  useEffect(() => {
    getFoodData();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t("loading")}</p>;
  }

  if (category.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t("no_categories")}</p>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      {category.map((c) => (
        <FoodCategoryList
          key={c.id}
          category={c}
          foodData={foodData}
          refreshFood={refreshFood}
        />
      ))}
    </div>
  );
};
