import { FoodCard } from "./FoodCard";
import { AddFoodButton } from "./AddFoodButton";
import { FoodCategoryListPropsType } from "@/type/type";

export const FoodCategoryList: React.FC<FoodCategoryListPropsType> = ({
  category,
  foodData,
  refreshFood,
}) => {
  const categoryId = category._id || category.id;
  const foodsInCategory = foodData.filter((f) => f.categoryId === categoryId);

  return (
    <div className="flex flex-col gap-4 bg-white rounded-md p-5">
      {/* Category Name */}
      <h2 className="text-lg font-bold">
        {category.categoryName} ({foodsInCategory.length})
      </h2>

      {/* Food Cards */}
      <div className="flex gap-4 flex-wrap">
        {/* Add Food Button */}
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
    </div>
  );
};
