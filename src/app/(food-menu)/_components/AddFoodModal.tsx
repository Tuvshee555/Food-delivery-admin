import { useState, ChangeEvent } from "react";
import axios from "axios";

type AddFoodModalProps = {
  categoryName: string;
  closeModal: () => void;
  refreshFood: () => void;
};

type FoodData = {
  foodName: string;
  price: string;
  ingredients: string;
  image: File | null;
};

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  categoryName,
  closeModal,
  refreshFood,
}) => {
  const [foodData, setFoodData] = useState<FoodData>({
    foodName: "",
    price: "",
    ingredients: "",
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    setFoodData((prev) => ({
      ...prev,
      [name]: name === "image" && files ? files[0] : value,
    }));
  };

  const uploadImage = async (file: File): Promise<string | undefined> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Tushka");

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/dbzydfkhc/image/upload`,
        formData
      );

      return data.secure_url;
    } catch (error) {
      console.error("Image upload error: ", error);
      return undefined;
    }
  };

  const addFood = async () => {
    try {
      setLoading(true);
      const imageUrl = foodData.image ? await uploadImage(foodData.image) : "";

      await axios.post("http://localhost:4000/food", {
        foodName: foodData.foodName,
        price: foodData.price,
        ingredients: foodData.ingredients,
        image: imageUrl,
      });

      setFoodData({ foodName: "", price: "", ingredients: "", image: null });
      refreshFood();
      closeModal();
    } catch (error) {
      console.error("Error adding food:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[480px] shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add new Dish to {categoryName}</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-black text-xl">
            ✕
          </button>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Food Name</label>
            <input
              name="foodName"
              placeholder="Type food name"
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={foodData.foodName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Food Price</label>
            <input
              name="price"
              placeholder="Enter price..."
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={foodData.price}
              onChange={handleChange}
            />
          </div>

          <div>
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

          <div>
            <label className="text-sm font-medium">Food Image</label>
            <div className="border border-dashed p-4 rounded-md flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100">
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                id="fileUpload"
                onChange={handleChange}
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <span className="text-center">Choose a file or drag & drop it here</span>
              </label>
            </div>
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
