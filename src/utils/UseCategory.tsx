import { useState } from "react";
import axios from "axios";

export const useCategory = () => {
  const [category, setCategory] = useState({ username: "" });

  const postData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/category",
        category
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return { category, setCategory, postData };
};
