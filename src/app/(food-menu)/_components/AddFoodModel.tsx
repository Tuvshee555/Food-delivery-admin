/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState, ChangeEvent } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/utils/UploadImage";
import { FoodData } from "@/type/type";

interface FoodModelProps {
  category: { _id: string; categoryName: string };
  closeModal: () => void;
  refreshFood: () => void;
}

export const AddFoodModel: React.FC<FoodModelProps> = ({
  category,
  closeModal,
  refreshFood,
}) => {
  const [foodData, setFoodData] = useState<FoodData>({
    foodName: "",
    price: "",
    ingredients: "",
    image: null,
    category: category._id, // <-- ensures categoryId is set
  });

  const [photo, setPhoto] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    setFoodData((prev) => ({
      ...prev,
      [name]: name === "image" && files ? files[0] : value,
    }));

    if (files) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  const removePhoto = () => {
    setPhoto(undefined);
    setFoodData((prev) => ({ ...prev, image: null }));
  };

  const addFood = async () => {
    if (!foodData.foodName || !foodData.price || !foodData.ingredients) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = foodData.image ? await uploadImage(foodData.image) : "";

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, {
        foodName: foodData.foodName,
        price: foodData.price,
        ingredients: foodData.ingredients,
        image: imageUrl,
        categoryId: foodData.category, // this is _id from category
      });

      toast("Successfully added food");
      setFoodData({
        foodName: "",
        price: "",
        ingredients: "",
        image: null,
        category: category._id,
      });
      setPhoto(undefined);
      refreshFood(); // immediately updates list
      closeModal();
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Failed to add food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[480px] shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            Add new Dish to {category.categoryName}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-600 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4">
          <div className="flex w-full gap-3 justify-between">
            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-medium">Food Name</label>
              <input
                name="foodName"
                placeholder="Type food name"
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={foodData.foodName}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-medium">Food Price</label>
              <input
                name="price"
                type="number"
                placeholder="Enter price..."
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={foodData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Ingredients</label>
            <textarea
              name="ingredients"
              placeholder="List ingredients..."
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={foodData.ingredients}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Food Image</label>
            {foodData.image && photo ? (
              <div className="relative">
                <img
                  className="h-[138px] w-full rounded-xl object-cover"
                  src={photo}
                />
                <X
                  className="absolute h-[20px] w-[20px] right-2 top-2 bg-black text-white rounded-full cursor-pointer"
                  onClick={removePhoto}
                />
              </div>
            ) : (
              <div className="border border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="hidden"
                  id="fileUpload"
                  onChange={handleChange}
                />
                <label
                  htmlFor="fileUpload"
                  className="p-[50px] cursor-pointer text-center"
                >
                  Choose a file or drag & drop it here
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded-md text-sm"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 disabled:bg-gray-400"
            onClick={addFood}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Dish"}
          </button>
        </div>
      </div>
    </div>
  );
};
