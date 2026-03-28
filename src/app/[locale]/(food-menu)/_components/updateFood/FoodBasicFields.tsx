"use client";

import { FoodFormState } from "@/type/type";

type Props = {
  updatedFood: FoodFormState;
  setUpdatedFood: React.Dispatch<React.SetStateAction<FoodFormState>>;
};

export default function FoodBasicFields({ updatedFood, setUpdatedFood }: Props) {
  return (
    <div className="grid gap-3">
      {/* name + price */}
      <div className="flex gap-2">
        <input
          value={updatedFood.foodName ?? ""}
          onChange={(e) =>
            setUpdatedFood((p) => ({ ...p, foodName: e.target.value }))
          }
          placeholder="Food name"
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          value={updatedFood.price}
          onChange={(e) =>
            setUpdatedFood((p) => ({ ...p, price: e.target.value }))
          }
          placeholder="Price"
          className="border p-2 rounded w-32"
        />
      </div>

      {/* old price */}
      <div className="flex gap-2">
        <input
          type="number"
          value={updatedFood.oldPrice ?? ""}
          onChange={(e) =>
            setUpdatedFood((p) => ({ ...p, oldPrice: e.target.value }))
          }
          placeholder="Old price"
          className="border p-2 rounded w-full"
        />
      </div>

      {/* ingredients */}
      <textarea
        value={updatedFood.ingredients ?? ""}
        onChange={(e) =>
          setUpdatedFood((p) => ({ ...p, ingredients: e.target.value }))
        }
        placeholder="Ingredients / description"
        rows={3}
        className="border p-2 rounded resize-none"
      />
    </div>
  );
}
