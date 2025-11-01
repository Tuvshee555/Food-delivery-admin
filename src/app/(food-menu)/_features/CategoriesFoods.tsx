import { useEffect, useState } from "react";
import axios from "axios";
import { FoodCategoryList } from "../_components/FoodCategoryList";
import { FoodType, CategoryType } from "@/type/type";

type CategoriesFoodsProps = {
  category: CategoryType[]; // type the category prop
};

export const CategoriesFoods: React.FC<CategoriesFoodsProps> = ({
  category,
}) => {
  const [foodData, setFoodData] = useState<FoodType[]>([]);

  // Normalize backend food data for frontend
  const normalizeFood = (food: any): FoodType => ({
    ...food,
    _id: food.id, // frontend expects _id
    category: food.category || food.categoryId, // fallback if category is null
    foodData: [],
    categories: "",
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
          key={e.id} // use id as key
          category={e}
          foodData={foodData}
          refreshFood={refreshFood}
        />
      ))}
    </div>
  );
};
