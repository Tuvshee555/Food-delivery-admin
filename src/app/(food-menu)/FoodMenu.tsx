/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { CategoryTree } from "./_components/CategoryTree";
import { FoodCategoryList } from "./_components/FoodCategoryList";
import { FoodType } from "@/type/type";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export const FoodMenu = () => {
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingFoods, setLoadingFoods] = useState(false);

  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [flatCats, setFlatCats] = useState<CategoryNode[]>([]);
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // --- helpers ---
  const flattenTree = (nodes: CategoryNode[]): CategoryNode[] => {
    const result: CategoryNode[] = [];
    const walk = (n: CategoryNode) => {
      result.push(n);
      if (n.children && n.children.length) {
        n.children.forEach(walk);
      }
    };
    nodes.forEach(walk);
    return result;
  };

  const reloadCategories = async () => {
    try {
      setLoadingCats(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/tree`
      );
      const data: CategoryNode[] = res.data || [];
      setTree(data);
      const flat = flattenTree(data);
      setFlatCats(flat);

      // if nothing selected, select first category (if exists)
      if (!selectedCategoryId && flat.length > 0) {
        setSelectedCategoryId(flat[0].id);
      }
    } catch (err) {
      console.error("Error fetching category tree:", err);
    } finally {
      setLoadingCats(false);
    }
  };

  const reloadFoods = async () => {
    try {
      setLoadingFoods(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food`
      );
      setFoods(res.data || []);
    } catch (err) {
      console.error("Error fetching foods:", err);
    } finally {
      setLoadingFoods(false);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([reloadCategories(), reloadFoods()]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCategory = useMemo(
    () => flatCats.find((c) => c.id === selectedCategoryId) || null,
    [flatCats, selectedCategoryId]
  );

  const foodsInSelectedCategory = useMemo(() => {
    if (!selectedCategoryId) return [];
    return foods.filter((f) => f.categoryId === selectedCategoryId);
  }, [foods, selectedCategoryId]);

  return (
    <div className="w-full bg-[#f4f4f5] text-black flex min-h-screen">
      <div className="p-6 w-screen flex gap-6">
        {/* LEFT: Category Tree */}
        <aside className="w-[260px] bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <CategoryTree
            tree={tree}
            loading={loadingCats}
            selectedId={selectedCategoryId}
            onSelect={(id) => setSelectedCategoryId(id)}
            onChanged={reloadCategories}
          />
        </aside>

        {/* RIGHT: Foods in selected category */}
        <main className="flex-1">
          {!selectedCategory ? (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm">
                Please create a category and select it from the left to manage
                foods.
              </p>
            </div>
          ) : (
            <FoodCategoryList
              category={selectedCategory as any}
              foodData={foodsInSelectedCategory}
              refreshFood={reloadFoods}
            />
          )}
        </main>
      </div>
    </div>
  );
};
