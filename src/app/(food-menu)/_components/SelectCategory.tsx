import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CategoryType, SelectCategoryProps } from "../../../type/type";

export const SelectCategory: React.FC<SelectCategoryProps> = ({
  handleChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatedFood,
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<CategoryType[]>(
        "http://localhost:4000/category"
      );
      setCategories(response.data);
      setError(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error)
    return <div className="text-red-500">Error loading categories</div>;

  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories.map((cat) => (
            <SelectItem
              key={cat._id}
              value={String(cat._id)}
              className="text-[16px] text-red-500 flex flex-col"
              onClick={() =>
                handleChange({ name: "category", value: String(cat._id) })
              }
            >
              {cat.categoryName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
