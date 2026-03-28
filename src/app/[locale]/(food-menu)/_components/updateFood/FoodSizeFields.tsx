"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { FoodFormState } from "@/type/type";

type Props = {
  updatedFood: FoodFormState;
  setUpdatedFood: React.Dispatch<React.SetStateAction<FoodFormState>>;
};

export default function FoodSizeFields({ updatedFood, setUpdatedFood }: Props) {
  const [newSize, setNewSize] = useState("");

  const addSize = () => {
    if (!newSize.trim()) return;
    setUpdatedFood((p) => ({
      ...p,
      sizes: [...(p.sizes || []), newSize.trim()],
    }));
    setNewSize("");
  };

  const removeSize = (index: number) => {
    setUpdatedFood((p) => ({
      ...p,
      sizes: p.sizes.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">Sizes</label>

      <div className="flex gap-2">
        <input
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="S, M, 42, etc."
        />
        <button
          type="button"
          onClick={addSize}
          className="bg-red-500 text-white px-3 rounded"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(updatedFood.sizes || []).map((size, i) => (
          <div
            key={i}
            className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1 text-sm"
          >
            {size}
            <X
              onClick={() => removeSize(i)}
              className="w-4 h-4 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
