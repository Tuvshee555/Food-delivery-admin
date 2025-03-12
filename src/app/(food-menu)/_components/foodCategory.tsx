import { AddFoodButton } from "./AddFoodButton";
import { FoodCard } from "./FoodCard";

type FoodCategoryProps = {
  category: { _id: string; categoryName: string };
  foodData: any[];
  refreshFood: () => void;
};

export const FoodCategory = ({
  category,
  foodData,
  refreshFood,
}: FoodCategoryProps) => {
  const filteredFood = foodData.filter((dish) => dish.categoryId === category._id);

  return (
    <div className="flex flex-col gap-4 bg-white rounded-md p-5">
      <h2 className="text-2xl font-semibold">
        {category.categoryName}{" "}
        <span className="text-gray-500">({filteredFood.length})</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AddFoodButton categoryName={category.categoryName} refreshFood={refreshFood} />
        {filteredFood.map((dish) => (
          <FoodCard
            key={dish._id}
            food={dish}
            categoryName={category.categoryName}
            refreshFood={refreshFood}
          />
        ))}
      </div>
    </div>
  );
};
