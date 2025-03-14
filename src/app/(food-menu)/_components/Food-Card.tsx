import { Edit2 } from "lucide-react";
import { UpdateFoodButton } from "./Update-Food-Button";

type Food = {
  foodName: string;
  price: string;
  image?: string;
  ingredients: string;
};

type FoodCardProps = {
  food: Food;
  categoryName: string;
  refreshFood: () => void;
};

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  return (
    <div className="bg-white shadow-md p-4 gap-5 border-[1px] rounded-2xl flex flex-col items-center w-[271px] max-w-[241px]">
      <div className="relative">
        <img
          src={food.image}
          className="w-[240px] h-[130px] gap-2 rounded-2xl object-cover"
          alt={food.foodName}
        />
        <div className="absolute bottom-2 z-10 right-2 h-11 w-11 items-center flex justify-center rounded-full bg-[white]">
          {/* <Edit2 size={20} stroke="#EF4444" className="items-center" /> */}
          <UpdateFoodButton food={food} />
        </div>
      </div>

      <div className="text-center mt-2 w-full g-[8px]">
        <div className="flex justify-between">
          <h3 className="text-red-500 font-500">{food.foodName}</h3>
          <h3 className="text-[black] font-[500]">${food.price}</h3>
        </div>
        <p className="text-[black] line-clamp-2 text-start">
          {food.ingredients}
        </p>
      </div>
    </div>
  );
};
