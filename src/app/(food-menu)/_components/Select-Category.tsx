import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FoodCardPropsType } from "@/type/type";

export const SelectCategory: React.FC<FoodCardPropsType> = ({category}) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <div>
          {category.map((categories) => (
            <div key={categories._id} >
                <div>{categories.categoryName}</div>
            </div>
          ))}
          </div>
          <SelectItem key={categories._id}>Apple</SelectItem>

        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
