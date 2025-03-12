import { useEffect, useState } from "react";
import axios from "axios";
import { FoodCategory } from "../_components/foodCategory";


type CategoryType = {
  _id: string;
  categoryName: string;
};

type CategoriesProps = {
  category: CategoryType[];
};

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
        <FoodCategory
          key={e._id}
          category={e}
          foodData={foodData}
          refreshFood={getFoodData}
        />
      ))}
    </div>
  );
};
