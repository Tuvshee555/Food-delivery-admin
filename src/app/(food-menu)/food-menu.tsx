"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import { CategoriesFoods } from "./_components/categories-foods";

type Datas = {
  categoryName: string;
  _id: string;
};

export const FoodMenu = () => {
  const [category, setCategory] = useState<Datas[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoryName: "" });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/category");
      setCategory(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const addCategory = async () => {
    if (!newCategory.categoryName.trim()) return; // Prevent empty submissions
    try {
      setLoading(true);
      await axios.post("http://localhost:4000/category", newCategory);
      setNewCategory({ categoryName: "" }); // Clear input after adding
      getData(); // Refresh categories
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-white text-black flex">
      {/* Sidebar */}
      <div className="h-screen w-[205px] p-[36px] flex flex-col border-r border-gray-300">
        <div>
          <div className="flex mb-[24px] items-center">
            <img src="/order.png" className="w-[36px] h-[30px]" />
            <div className="ml-2">
              <div className="text-[18px] font-semibold">NomNom</div>
              <div className="text-[12px] font-medium text-[#71717a]">
                Swift delivery
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[8px] text-gray-700">
            <div>Food menu</div>
            <div>Orders</div>
            <div>Settings</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col gap-[16px]">
            <div className="text-[20px] font-semibold">Dishes category</div>
            <div className="flex flex-wrap gap-[16px]">
              {category.map((c) => (
                <div
                  key={c._id}
                  className="py-2 px-4 text-sm rounded-[20px] border border-gray-400"
                >
                  {c.categoryName}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Category Dialog */}
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <button>
                <div className="h-[30px] w-[30px] bg-red-500 flex items-center justify-center text-white rounded-full">
                  +
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Category Name
                  </label>
                  <input
                    id="name"
                    className="border p-2 rounded-md w-full"
                    value={newCategory.categoryName}
                    onChange={(e) =>
                      setNewCategory({ categoryName: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                  type="button"
                  className="py-2 px-4 bg-black text-white rounded-md text-sm"
                  onClick={addCategory}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Category"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CategoriesFoods category={category}/>
      </div>
    </div>
  );
};
