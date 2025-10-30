import { useState } from "react";
import { AddFoodModel } from "./AddFoodModel";

interface AddFoodButtonProps {
  category: { _id: string; categoryName: string };
  refreshFood: () => void;
}

export const AddFoodButton: React.FC<AddFoodButtonProps> = ({
  category,
  refreshFood,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="w-[240px] h-[241px] rounded-[20px] flex flex-col items-center justify-center border border-red-500 border-dashed cursor-pointer hover:shadow-md transition"
        onClick={() => setOpen(true)}
      >
        <div className="h-[40px] w-[40px] bg-red-500 flex items-center justify-center text-white rounded-full shadow-lg">
          +
        </div>
        <p className="mt-2 text-center text-gray-600 text-sm">
          Add new Dish to {category.categoryName}
        </p>
      </div>

      {open && (
        <AddFoodModel
          category={category} // now matches type
          closeModal={() => setOpen(false)}
          refreshFood={refreshFood}
        />
      )}
    </>
  );
};
