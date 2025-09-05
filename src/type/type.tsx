import React from "react";

export type FoodType = {
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
  category: { _id: string; categoryName: string };
  closeModal: () => void;
  refreshFood: () => void;
};

export type CategoryType = {
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
