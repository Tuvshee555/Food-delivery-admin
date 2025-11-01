import { Key } from "react";

// Food type
export type FoodType = {
  id: Key | null | undefined;
  categoryId: string;
  foodName: string;
  price: string;
  image?: File | string;
  ingredients: string;
  category: string;
  foodData: [];
  categories: string;
};

// Props for Food Card
export type FoodCardPropsType = {
  food: FoodType;
  refreshFood: () => void;
};

// Props for AddFood modal
export type FoodData = {
  foodName: string;
  price: string;
  ingredients: string;
  image: File | null;
  category: string;
};

export type FoodModelProps = {
  category: {
    id: string;
    categoryName: string;
  };
  closeModal: () => void;
  refreshFood: () => void;
};

// Category type
export type CategoryType = {
  id: string; // use only id
  categoryName: string;
  foodCount: number;
};

// Props for SelectCategory
export type SelectCategoryProps = {
  handleChange: (e: { name: string; value: string }) => void;
  updatedFood?: FoodType;
};

export type User = {
  email: string;
  password: string;
  repassword: string;
  role?: string;
};

// props for CreatePassword
export type UserType = {
  setUser: React.Dispatch<React.SetStateAction<User>>;
  nextStep: () => void;
  stepBack: () => void;
  user: User;
};
