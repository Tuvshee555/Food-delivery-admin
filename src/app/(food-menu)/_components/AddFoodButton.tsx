import { useState } from "react";
import { AddFoodModal } from "./AddFoodModal";

interface AddFoodButtonProps {
  categoryName: string;
  refreshFood: () => void;
}

export const AddFoodButton: React.FC<AddFoodButtonProps> = ({
  categoryName,
  refreshFood,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className="w-[260px] h-[240px] flex flex-col items-center justify-center border border-gray-300 rounded-lg cursor-pointer hover:shadow-md transition"
        onClick={() => setOpen(true)}
      >
        <div className="h-[40px] w-[40px] bg-red-500 flex items-center justify-center text-white rounded-full shadow-lg">
          +
        </div>
        <p className="mt-2 text-center text-gray-600 text-sm">
          Add new Dish to {categoryName}
        </p>
      </div>

      {open && (
        <AddFoodModal
          categoryName={categoryName}
          closeModal={() => setOpen(false)}
          refreshFood={refreshFood}
        />
      )}
    </>
  );
};
