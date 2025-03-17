import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { ChangeEvent, useState } from "react";

type Food = {
  foodName: string;
  price: string;
  image?: File | string;
  ingredients: string;
  category: string;
  _id: string;
};

type FoodCardProps = {
  food: Food;
  refreshFood: () => void;
};

export const UpdateFoodButton: React.FC<FoodCardProps> = ({
  food,
  refreshFood,
}) => {
  const [updatedFood, setUpdatedFood] = useState<Food>({ ...food });
  const [photo, setPhoto] = useState<string | undefined>(
    typeof food.image === "string" ? food.image : undefined
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    
    if (name === "image" && files) {
      const file = files[0];
      setUpdatedFood((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setUpdatedFood((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Tushka");

      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dbzydfkhc/image/upload",
        formData
      );

      return data.secure_url;
    } catch (error) {
      console.error("Error while uploading image", error);
      return "";
    }
  };

  const updateData = async () => {
    try {
      setLoading(true);

      const imageUrl =
        updatedFood.image instanceof File
          ? await uploadImage(updatedFood.image)
          : updatedFood.image;

      const response = await axios.put("http://localhost:4000/food", {
        _id: food._id,
        foodName: updatedFood.foodName,
        price: updatedFood.price,
        ingredients: updatedFood.ingredients,
        image: imageUrl,
        category: updatedFood.category,
      });

      console.log("Updated Food:", response.data);
      setUpdatedFood(response.data);
      refreshFood();
    } catch (error) {
      console.error("Error updating food:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <div className="h-[30px] w-[30px] bg-red-500 flex items-center justify-center text-white rounded-full">
            +
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Dishes Info</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 border rounded-md p-2">
            <label htmlFor="foodName">Dish Name</label>
            <Input id="foodName" name="foodName" value={updatedFood.foodName} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border rounded-md p-2">
            <label htmlFor="category">Dish Category</label>
            <Input id="category" name="category" value={updatedFood.category} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border rounded-md p-2">
            <label htmlFor="ingredients">Ingredients</label>
            <textarea id="ingredients" name="ingredients" value={updatedFood.ingredients} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border rounded-md p-2">
            <label htmlFor="price">Price</label>
            <Input id="price" name="price" value={updatedFood.price} onChange={handleChange} />
          </div>
          <div className="border rounded-md p-2 flex flex-col items-center">
            <label htmlFor="image">Image</label>
            {photo ? (
              <img className="h-[138px] w-full object-cover mb-2" src={photo} alt="Preview" />
            ) : (
              <span className="text-gray-500">No image selected</span>
            )}
            <Input type="file" name="image" accept="image/*" id="fileUpload" onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={updateData} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
