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
  updatedFood,
}) => {
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [error, setError] = useState<boolean>(false);

  const getData = async () => {
    try {
      setError(true);
      const response = await axios.get<CategoryType[]>(
        "http://localhost:4000/category"
      );
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setError(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (error)
    return <div className="text-red-500">Error loading categories</div>;

  return (
    <Select
      value={updatedFood.category}
      onValueChange={(value: string) =>
        handleChange({ name: "category", value })
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {category.map((cat) => (
            <SelectItem
              key={cat._id}
              value={cat._id}
              className="text-[16px] text-[red] flex flex-col"
            >
              {cat.categoryName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};