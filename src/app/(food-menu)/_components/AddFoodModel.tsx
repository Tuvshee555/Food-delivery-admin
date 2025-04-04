import { useState, ChangeEvent } from "react";
import { uploadImage } from "@/utils/UploadImage";
import axios from "axios";
import { FoodData, FoodModelProps } from "@/type/type";
import { toast } from "sonner";
import { X } from "lucide-react";

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
    category: category._id,
  });
  const [photo, setPhoto] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLImageElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    setFoodData((prev) => ({
      ...prev,
      [name]: name === "image" && files ? files[0] : value,
    }));

    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader?.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto("");
  };

  const addFood = async () => {
    if (!foodData.foodName || !foodData.price || !foodData.ingredients) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = foodData.image ? await uploadImage(foodData.image) : "";

      const res = await axios.post("http://localhost:4000/food", {
        foodName: foodData.foodName,
        price: foodData.price,
        ingredients: foodData.ingredients,
        image: imageUrl,
        category: foodData.category,
      });

      console.log(res);

      setFoodData({
        foodName: "",
        price: "",
        ingredients: "",
        image: null,
        category: "",
      });
      refreshFood();
      closeModal(); // Close modal after adding food
      toast("Successfully added food");
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Failed to add food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 position-absolute z-50">
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
            <div className="gap-2 flex flex-col w-full">
              <label className="text-sm font-medium">Food Name</label>
              <input
                name="foodName"
                placeholder="Type food name"
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={foodData.foodName}
                onChange={handleChange}
              />
            </div>

            <div className="gap-2 flex flex-col w-full">
              <label className="text-sm font-medium">Food Price</label>
              <input
                name="price"
                type="number"
                placeholder="Enter price..."
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={foodData.price}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>

          <div className="gap-2 flex flex-col">
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

          <div className="gap-2 flex flex-col">
            <label className="text-sm font-medium">Food Image</label>
            {foodData?.image && photo ? (
              <div className="relative">
                <img
                  className="h-[138px] w-full rounded-xl bg-[red] object-fit"
                  src={photo}
                />
                <X
                  className="absolute h-[20px] w-[20px] align-center flex justify-center bg-black text-[white] right-2 top-2 rounded-full"
                  onClick={() => removePhoto()}
                ></X>
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
                <label htmlFor="fileUpload" className="cursor-pointer p-[50px]">
                  <span className="text-center">
                    Choose a file or drag & drop it here
                  </span>
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
