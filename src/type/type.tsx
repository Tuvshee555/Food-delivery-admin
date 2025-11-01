import React, { Key } from "react";

export type FoodType = {
  id: Key | null | undefined;
  categoryId: string;
  _id: string;
  foodName: string;
  price: string;
  image?: File | string;
  ingredients: string;
  category: string;
  foodData: [];
  categories: string;
};

export type FoodCardPropsType = {
  food: FoodType;
  refreshFood: () => void;
  category: { _id: string; categoryName: string };
};

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
    _id: string;
    categoryName: string;
  };
  closeModal: () => void;
  refreshFood: () => void;
};

export type CategoryType = {
  id: string;
  categoryName: string;
  _id: string;
  foodCount: number;
};

export type SelectCategoryProps = {
  handleChange: (e: { name: string; value: string }) => void;
  updatedFood: FoodType;
};

export type Datas = {
  categoryName: string;
  _id: string;
  foodCount: number;
  category: string;
  prev: undefined | [];
  username: string;
};

export type CategoriesProps = {
  category: CategoryType[];
};

export type SignUpEmailStepType = {
  nextStep: () => void;
  stepBack: () => void;
  setUser: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      repassword: string;
    }>
  >;
  user: { email: string; password: string; repassword: string };
};
// user state type
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

export type FoodCategoryListPropsType = {
  category: {
    _id: string;
    id?: string; // optional in case some categories use `id`
    categoryName: string;
  };
  foodData: FoodType[];
  refreshFood: () => void;
};
