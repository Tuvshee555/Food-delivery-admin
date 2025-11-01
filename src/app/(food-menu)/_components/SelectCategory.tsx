import React, { useEffect, useState } from "react";
import axios from "axios";
import { CategoryType, SelectCategoryProps } from "@/type/type";

export const SelectCategory: React.FC<SelectCategoryProps> = ({
  handleChange,
  updatedFood,
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch categories from backend
  const getCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<CategoryType[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`
      );
      setCategories(data);
      setError(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error)
    return <div className="text-red-500">Error loading categories</div>;

  // Use the food's current category as the default
  const currentCategoryId = updatedFood?.category || "";

  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((cat) => {
        const isSelected = cat.id === currentCategoryId;

        return (
          <div
            key={cat.id}
            className={`p-4 rounded-lg cursor-pointer border transition ${
              isSelected
                ? "border-red-500 bg-red-100"
                : "border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => handleChange({ name: "category", value: cat.id })}
          >
            <h3 className="text-base font-medium">{cat.categoryName}</h3>
            <p className="text-sm text-gray-500">{cat.foodCount} dishes</p>
          </div>
        );
      })}
    </div>
  );
};
