/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { CategoryTree } from "./_components/categoryThree/CategoryTree";
import { FoodCategoryList } from "./_components/FoodCategoryList";
import { FoodType } from "@/type/type";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export const FoodMenu = () => {
  const { t } = useI18n();

  const [loadingCats, setLoadingCats] = useState(false);
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [flatCats, setFlatCats] = useState<CategoryNode[]>([]);
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  /* ---------- helpers ---------- */

  const flattenTree = (nodes: CategoryNode[]): CategoryNode[] => {
    const result: CategoryNode[] = [];
    const walk = (n: CategoryNode) => {
      result.push(n);
      n.children?.forEach(walk);
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

      if (!selectedCategoryId && flat.length > 0) {
        setSelectedCategoryId(flat[0].id);
      }
    } finally {
      setLoadingCats(false);
    }
  };

  const reloadFoods = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`);
    setFoods(res.data || []);
  };

  useEffect(() => {
    Promise.all([reloadCategories(), reloadFoods()]);
  }, []);

  /* ---------- derived ---------- */

  const selectedCategory = useMemo(
    () => flatCats.find((c) => c.id === selectedCategoryId) ?? null,
    [flatCats, selectedCategoryId]
  );

  const foodsInSelectedCategory = useMemo(() => {
    if (!selectedCategoryId) return [];
    return foods.filter((f) => f.categoryId === selectedCategoryId);
  }, [foods, selectedCategoryId]);

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="p-6 flex gap-6">
        {/* LEFT */}
        <aside
          className="
            w-[260px]
            bg-card
            border border-border
            rounded-lg
            p-4
          "
        >
          <CategoryTree
            tree={tree}
            loading={loadingCats}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            onChanged={reloadCategories}
          />
        </aside>

        {/* RIGHT */}
        <main className="flex-1">
          {!selectedCategory ? (
            <div
              className="
                bg-card
                border border-border
                rounded-lg
                p-8
              "
            >
              <p className="text-sm text-muted-foreground">
                {t("select_category_hint")}
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
