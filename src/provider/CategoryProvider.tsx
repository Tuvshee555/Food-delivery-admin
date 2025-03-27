import { Datas } from "@/type/type";

import axios from "axios";
import { createContext, ReactNode, useContext } from "react";
type CategoryProviderType = {
  category: Datas[];
  refetchCategory: () => void;
};

const getData = async () => {
  try {
    const response = await axios.get("http://localhost:4000/category");
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
const CategoriesContext = createContext<CategoryProviderType | null>(null);

export const CategoriesProvider = ({children}:{childer:ReactNode}) => {


    <CategoriesContext.Provider value={{category, refetchCategory}}>
        {children}
    </CategoriesContext.Provider>
}
export const useCategory = () => {
    const context = useContext(CategoriesContext)
    return context
}
