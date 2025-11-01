import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CategoryType, SelectCategoryProps } from "@/type/type";

export const SelectCategory: React.FC<SelectCategoryProps> = ({
  handleChange,
  updatedFood,
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

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

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const currentCategoryId = updatedFood?.category || "";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <>
      <button
        className="px-4 py-2 border rounded-md hover:bg-gray-100"
        onClick={openDialog}
      >
        {currentCategoryId
          ? categories.find((c) => c.id === currentCategoryId)?.categoryName ||
            "Select category"
          : "Select category"}
      </button>

      <dialog ref={dialogRef} className="p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-3">Select a Category</h2>
        <section className="grid grid-cols-2 gap-3">
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
                  closeDialog();
                }}
              >
                <h3 className="text-base font-medium">{cat.categoryName}</h3>
                <p className="text-sm text-gray-500">{cat.foodCount} dishes</p>
              </div>
            );
          })}
        </section>

        <button
          onClick={closeDialog}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
        >
          Close
        </button>
      </dialog>
    </>
  );
};
