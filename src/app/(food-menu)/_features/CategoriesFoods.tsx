import { useEffect, useState } from "react";
import axios from "axios";
import { FoodCategoryList } from "../_components/FoodCategoryList";
import { CategoriesProps, FoodType } from "@/type/type";

export const CategoriesFoods = ({ category }: CategoriesProps) => {
  const [foodData, setFoodData] = useState<FoodType[]>([]);

  // Normalize backend food data for frontend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizeFood = (food: any): FoodType => ({
    ...food,
    _id: food.id, // frontend expects _id
    category: food.category || food.categoryId, // fallback if category is null
  });

  // Fetch all foods
  const getFoodData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food`
      );
      const normalizedData = response.data.map(normalizeFood);
      setFoodData(normalizedData);
    } catch (error) {
      console.error("Error fetching foodData", error);
    }
  };

  // Refresh food list
  const refreshFood = async () => {
    await getFoodData();
  };

  useEffect(() => {
    getFoodData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex flex-col gap-[24px] mt-[20px]">
      {category.map((e) => (
        <FoodCategoryList
          key={e._id || e.id} // avoid React key warnings
          category={e}
          foodData={foodData}
          refreshFood={refreshFood}
        />
      ))}
    </div>
  );
};
