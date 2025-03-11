import { useState } from "react";
import axios from "axios";

type AddFoodModalProps = {
  categoryName: string;
  closeModal: () => void;
  refreshFood: () => void;
};

type FoodData = {
  foodName: string;
  price: string;
  image: File | null;
  ingredients: string;
};

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  categoryName,
  closeModal,
  refreshFood,
}) => {
  const [newFoodData, setNewFoodData] = useState<FoodData>({
    foodName: "",
    price: "",
    image: null,
    ingredients: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const CLOUDINARY_UPLOAD_PRESET = "Tushka";
  const CLOUDINARY_CLOUD_NAME = "dbzydfxhc";

  const addFoodData = async () => {
    try {
      setLoading(true);

      let imageUrl = "";
      if (newFoodData.image) {
        const formData = new FormData();
        formData.append("file", newFoodData.image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        imageUrl = response.data.secure_url; // Get the uploaded image URL
      }

      // Step 2: Now, send the rest of the food data to your backend with the image URL
      const foodData = {
        foodName: newFoodData.foodName,
        price: newFoodData.price,
        ingredients: newFoodData.ingredients,
        image: imageUrl, // Attach the Cloudinary image URL
      };

      await axios.post("http://localhost:4000/food", foodData);

      setNewFoodData({ foodName: "", price: "", image: null, ingredients: "" });
      refreshFood(); // Refresh the list of foods
      closeModal(); // Close the modal
    } catch (error) {
      console.log("Error adding food", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-[460px]">
        <h2 className="text-lg font-bold">Add New Dish to {categoryName}</h2>

        <div className="grid gap-[20px] py-4">
          <input
            placeholder="Food Name"
            className="border p-2 rounded-md w-full"
            value={newFoodData.foodName}
            onChange={(e) =>
              setNewFoodData({ ...newFoodData, foodName: e.target.value })
            }
          />
          <input
            placeholder="Price"
            className="border p-2 rounded-md w-full"
            value={newFoodData.price}
            onChange={(e) =>
              setNewFoodData({ ...newFoodData, price: e.target.value })
            }
          />
          <input
            placeholder="Ingredients"
            className="border p-2 rounded-md w-full"
            value={newFoodData.ingredients}
            onChange={(e) =>
              setNewFoodData({ ...newFoodData, ingredients: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded-md w-full"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setNewFoodData({ ...newFoodData, image: e.target.files[0] });
              }
            }}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded-md"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={addFoodData}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Dish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFoodModal;
