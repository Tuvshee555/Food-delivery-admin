/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { FoodCardPropsType, FoodType } from "@/type/type";
import { SelectCategory } from "./SelectCategory";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const UpdateFoodButton: React.FC<FoodCardPropsType> = ({
  food,
  refreshFood,
}) => {
  // const [updatedFood, setUpdatedFood] = useState<FoodType>({ ...food });
  const [updatedFood, setUpdatedFood] = useState<FoodType>({
    id: food.id,
    foodName: food.foodName || "",
    price: food.price || "",
    ingredients: food.ingredients || "",
    image: food.image,
    category: food.category || "",
    categoryId: food.categoryId || "",
    foodData: [],
    categories: "",
  });

  const [photo, setPhoto] = useState<string | undefined>(
    typeof food.image === "string" ? food.image : undefined
  );
  const [loading, setLoading] = useState(false);

  // Handles inputs, textarea, and category select
  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) => {
    if ("target" in e) {
      const target = e.target;

      if (target instanceof HTMLInputElement) {
        const { name, value } = target;
        const files = target.files;

        if (name === "image" && files && files.length > 0) {
          const file = files[0];
          setUpdatedFood((prev) => ({ ...prev, image: file }));

          const reader = new FileReader();
          reader.onload = () => setPhoto(reader.result as string);
          reader.readAsDataURL(file);
          return;
        }

        setUpdatedFood((prev) => ({ ...prev, [name]: value }));
      } else if (target instanceof HTMLTextAreaElement) {
        const { name, value } = target;
        setUpdatedFood((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      // Category selection
      setUpdatedFood((prev) => ({ ...prev, category: e.value }));
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Tushka");
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/dbzydfkhc/image/upload`,
        formData
      );
      return data.secure_url;
    } catch (err) {
      console.error("Image upload error:", err);
      return "";
    }
  };

  // Update food API call
  const updateData = async () => {
    if (!updatedFood.id) return toast.error("Food ID missing");
    if (!updatedFood.category) return toast.error("Please select a category");

    try {
      setLoading(true);

      const imageUrl =
        updatedFood.image instanceof File
          ? await uploadImage(updatedFood.image)
          : updatedFood.image;

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${updatedFood.id}`,
        {
          foodName: updatedFood.foodName || "",
          price: Number(updatedFood.price) || 0,
          ingredients: updatedFood.ingredients || "",
          image: imageUrl,
          categoryId: updatedFood.category,
        }
      );

      toast.success("Food updated successfully");
      refreshFood();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update food front end");
    } finally {
      setLoading(false);
    }
  };

  // Delete food API call
  const deleteFood = async () => {
    if (!updatedFood.id) return toast.error("Food ID missing");
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${updatedFood.id}`
      );
      toast.success("Food deleted");
      refreshFood();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-2 right-2 h-11 w-11 flex items-center justify-center bg-white rounded-full cursor-pointer hover:shadow-md">
          <Pencil className="text-red-500 h-5 w-5" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Dish Info</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Dish Name */}
          <input
            name="foodName"
            value={updatedFood.foodName}
            onChange={handleChange}
            placeholder="Dish Name"
            className="border p-2 rounded-md"
          />

          {/* Category Select */}
          <SelectCategory
            handleChange={handleChange}
            updatedFood={updatedFood}
          />

          {/* Ingredients */}
          <textarea
            name="ingredients"
            value={updatedFood.ingredients || ""}
            onChange={handleChange}
            placeholder="Ingredients"
            className="border p-2 rounded-md"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            value={updatedFood.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 rounded-md"
          />

          {/* Image */}
          <div>
            {photo && (
              <img
                src={photo}
                className="h-[138px] w-full object-cover rounded-md mb-2"
              />
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button onClick={updateData} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={deleteFood}
            disabled={loading}
            className="bg-red-500 text-white"
          >
            <Trash />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
