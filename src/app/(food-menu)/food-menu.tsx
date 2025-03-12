// pages/FoodMenu.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar } from "./_components/SideBar";
import { CategoryList } from "./_components/CategoryList";
import { AddCategoryDialog } from "./_components/AddCategoryDialog";
import { CategoriesFoods } from "./_features/Categories-foods";

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
    if (!newCategory.categoryName.trim()) return;
    try {
      setLoading(true);
      await axios.post("http://localhost:4000/category", newCategory);
      setNewCategory({ categoryName: "" });
      getData();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen bg-white text-black flex">
      <Sidebar />

      <div className="p-6 bg-[#f4f4f5] strech w-screen">
        <div className="bg-[white] rounded-[8px] p-[24px]">
          <div className="text-[20px] font-semibold">Dishes category</div>
          <div className="flex">
            <CategoryList categories={category} loading={loading} />
            <AddCategoryDialog
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              addCategory={addCategory}
              loading={loading}
            />
          </div>
        </div>
        <CategoriesFoods category={category} />
      </div>
    </div>
  );
};
