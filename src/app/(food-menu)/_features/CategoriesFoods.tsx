import { useEffect, useState } from "react";
import axios from "axios";
import { FoodCategoryList } from "../_components/FoodCategoryList";
import { CategoriesProps } from "@/type/type";

export const CategoriesFoods = ({ category }: CategoriesProps) => {
  const [foodData, setFoodData] = useState([]);

  const getFoodData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/food");
      console.log(response.data);
      setFoodData(response.data);
    } catch (error) {
      console.log("Error fetching foodData", error);
    }
  };

  useEffect(() => {
    getFoodData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-[24px] mt-[20px]">
      {category.map((e) => (
        <FoodCategoryList
          key={e._id}
          category={e}
          foodData={foodData}
          refreshFood={getFoodData}
        />
      ))}
    </div>
  );
};
