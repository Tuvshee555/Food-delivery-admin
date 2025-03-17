export type FoodType = {
    _id: string;
    foodName: string;
    price: string;
    image?: File | string 
    ingredients: string;
    category: string;
    refreshFood: () => void;
    foodData: any[];
    categories: string
  };

  export type FoodCardPropsType = {
    food: FoodType;
    refreshFood: () => void;
    category: { _id: string; categoryName: string };
    
  };