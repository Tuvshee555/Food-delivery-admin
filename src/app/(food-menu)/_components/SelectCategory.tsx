import React, { useEffect, useState } from "react";
import axios from "axios";
import { CategoryType, SelectCategoryProps } from "@/type/type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const SelectCategory: React.FC<SelectCategoryProps> = ({
  handleChange,
  updatedFood,
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  const getCategories = async () => {
    try {
      const { data } = await axios.get<CategoryType[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`
      );
      setCategories(data);
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

  const currentCategoryId = updatedFood?.categoryId || "";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  const selectedCategory =
    categories.find((c) => c.id === currentCategoryId)?.categoryName ||
    "Select category";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left border border-gray-300 hover:bg-gray-100"
        >
          {selectedCategory}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-white">
        <DialogHeader>
          <DialogTitle>Select a Category</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-3">
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
                onClick={() => {
                  handleChange({ name: "category", value: cat.id });
                  setOpen(false);
                }}
              >
                <h3 className="text-base font-medium">{cat.categoryName}</h3>
                <p className="text-sm text-gray-500">{cat.foodCount} dishes</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
