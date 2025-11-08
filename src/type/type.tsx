import { Key } from "react";

// -------------------- FOOD TYPES --------------------

// Represents a single food item
export type FoodType = {
  id: Key | null | undefined;
  foodName: string;
  price: string | number;
  ingredients: string;
  categoryId: string;
  category?: string | { id: string; categoryName: string };

  // 🖼 Main image
  image?: File | string;

  // 🖼 Multiple extra images
  extraImages?: (File | string)[];

  // 🎥 Optional video
  video?: string | File | null;

  // 📏 Sizes (array of strings or objects like { label: string })
  sizes?: { label: string }[] | string[];

  // Misc frontend-only helper fields
  foodData?: [];
  categories?: string;
};

// Props for FoodCard component
export type FoodCardPropsType = {
  food: FoodType;
  refreshFood: () => void;
  category?: CategoryType;
};

// Props for AddFood modal/component
export type FoodData = {
  foodName: string;
  price: string;
  ingredients: string;
  image: File | null;
  category: string;
};

// Props for FoodModel (add/edit food modal)
export type FoodModelProps = {
  category: {
    id: string;
    categoryName: string;
  };
  closeModal: () => void;
  refreshFood: () => void;
};

// Props for FoodCategoryList component
export type FoodCategoryListPropsType = {
  category: CategoryType & { _id?: string }; // support _id from backend if exists
  foodData: FoodType[];
  refreshFood: () => void;
};

// -------------------- CATEGORY TYPES --------------------

// Represents a single category
export type CategoryType = {
  id: string;
  categoryName: string;
  foodCount: number;
};

// Props for SelectCategory component
export type SelectCategoryProps = {
  handleChange: (e: { name: string; value: string }) => void;
  updatedFood?: FoodType;
};

// -------------------- USER TYPES --------------------

// Represents a user object
export type User = {
  email: string;
  password: string;
  repassword: string;
  role?: string;
};

// Props for CreatePassword step/component
export type UserType = {
  setUser: React.Dispatch<React.SetStateAction<User>>;
  nextStep: () => void;
  stepBack: () => void;
  user: User;
};

export type SignUpEmailStepType = {
  nextStep: () => void;
  stepBack?: () => void;
  setUser: React.Dispatch<React.SetStateAction<User>>; // use User type
  user: User; // use full User type
};

export type Datas = {
  username: string | number | readonly string[] | undefined;
  categoryName: string;
  _id: string;
  foodCount: number;
};
