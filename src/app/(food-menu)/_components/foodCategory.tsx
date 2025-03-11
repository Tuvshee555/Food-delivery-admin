import AddFoodButton from "./AddFoodButton";
import FoodCard from "./FoodCard";

type FoodCategoryProps = {
  category: { _id: string; categoryName: string };
  foodData: any[];
  refreshFood: () => void;
};

const FoodCategory = ({
  category,
  foodData,
  refreshFood,
}: FoodCategoryProps) => {
  return (
    <div className="flex flex-col gap-[16px]">
      {/* Category Title */}
      <h2 className="text-[24px] font-semibold">
        {category.categoryName}{" "}
        <span className="text-gray-500">
          {foodData.filter((dish) => dish.categoryId === category._id).length}
        </span>
      </h2>

      <div className="flex gap-[16px] items-start">
        {/* Add new dish button */}
        <AddFoodButton
          categoryName={category.categoryName}
          refreshFood={refreshFood}
        />

        {/* Display food items */}
        <div className="flex gap-[16px]">
          {foodData
            .filter((dish) => dish.categoryId === category._id)
            .map((dish) => (
              <FoodCard key={dish._id} food={dish} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FoodCategory;
