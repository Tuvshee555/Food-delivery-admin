import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const useCa = () => {
  const [category, setCategory] = useState({ username: "" });

  const postData = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`,
        category
      );
      toast("So easy added category");
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add category");
    }
  };

  return { category, setCategory, postData };
};
