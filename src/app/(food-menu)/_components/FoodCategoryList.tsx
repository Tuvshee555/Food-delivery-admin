import { FoodType } from "@/type/type";
import { AddFoodButton } from "./AddFoodButton";
import { FoodCard } from "./FoodCard";

type FoodCategoryProps = {
  category: { _id: string; categoryName: string };
  foodData: FoodType[];
  refreshFood: () => void;
};

export const FoodCategoryList = ({
  category,
  foodData,
  refreshFood,
}: FoodCategoryProps) => {
  const filteredFood = foodData.filter(
    (dish) => dish.category === category._id
  );

  return (
    <div className="flex flex-col gap-4 bg-white rounded-md p-5">
      <h2 className="text-2xl font-semibold">
        {category.categoryName}{" "}
        <span className="text-gray-500">({filteredFood.length})</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AddFoodButton category={category} refreshFood={refreshFood} />
        {filteredFood.map((dish) => (
          <FoodCard
            key={dish._id}
            food={dish}
            refreshFood={refreshFood}
            category={category}
          />
        ))}
      </div>
    </div>
  );
};
