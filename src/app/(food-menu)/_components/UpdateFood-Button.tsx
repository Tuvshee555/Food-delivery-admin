/* eslint-disable @next/next/no-img-element */
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
import { FoodCardPropsType, FoodType } from "../../../type/type";
import { Trash, Pencil } from "lucide-react";
import { SelectCategory } from "./SelectCategory";
import { toast } from "sonner";

export const UpdateFoodButton: React.FC<FoodCardPropsType> = ({
  food,
  refreshFood,
}) => {
  const [updatedFood, setUpdatedFood] = useState<FoodType>({
    ...food,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: food._id || (food as any).id, // fallback to id
  });

  const [photo, setPhoto] = useState<string | undefined>(
    typeof food.image === "string" ? food.image : undefined
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) => {
    if ("target" in e) {
      const target = e.target;

      if (target instanceof HTMLInputElement) {
        const { name, value, files } = target;

        if (name === "image" && files?.length) {
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
      // for select category
      setUpdatedFood((prev) => ({ ...prev, category: e.value }));
    }
  };

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
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const updateData = async () => {
    if (!updatedFood._id) {
      toast.error("Food ID is missing. Cannot update.");
      return;
    }

    if (!updatedFood.category || typeof updatedFood.category !== "string") {
      toast.error("Please select a valid category.");
      return;
    }

    try {
      setLoading(true);

      const imageUrl =
        updatedFood.image instanceof File
          ? await uploadImage(updatedFood.image)
          : updatedFood.image;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food`,
        {
          _id: updatedFood._id, // now guaranteed to exist
          foodName: updatedFood.foodName,
          price: Number(updatedFood.price),
          ingredients: updatedFood.ingredients,
          image: imageUrl,
          categoryId: updatedFood.category,
        }
      );

      setUpdatedFood(response.data);
      toast.success("Food updated successfully");
      refreshFood();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error updating food:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update food");
    } finally {
      setLoading(false);
    }
  };

  const deleteFood = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${food._id}`
      );
      toast("Successfully deleted food");
      refreshFood();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-2 z-10 right-2 h-11 w-11 flex items-center justify-center rounded-full bg-white hover:cursor-pointer">
          <Pencil className="text-red-500 h-5 w-5" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Dish Info</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Dish Name */}
          <div className="grid grid-cols-4 items-center gap-4 border rounded-md px-2 py-1">
            <label htmlFor="foodName" className="text-right">
              Dish Name
            </label>
            <Input
              id="foodName"
              name="foodName"
              className="col-span-3"
              value={updatedFood.foodName}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4 border rounded-md px-2 py-1">
            <label className="text-right">Category</label>
            <div className="col-span-3">
              <SelectCategory
                updatedFood={updatedFood}
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="grid grid-cols-4 items-center gap-4 border rounded-md px-2 py-1">
            <label htmlFor="ingredients" className="text-right">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              className="col-span-3"
              value={updatedFood.ingredients}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-4 items-center gap-4 border rounded-md px-2 py-1">
            <label htmlFor="price" className="text-right">
              Price
            </label>
            <Input
              id="price"
              name="price"
              className="col-span-3"
              value={updatedFood.price}
              onChange={handleChange}
            />
          </div>

          {/* Image */}
          <div className="border rounded-md p-2 flex flex-col items-center">
            <label htmlFor="image" className="text-right">
              Image
            </label>
            {photo ? (
              <img
                className="h-[138px] w-[412px] object-cover"
                src={photo}
                alt="Preview"
              />
            ) : (
              <span className="text-gray-500">No image selected</span>
            )}
            <Input
              type="file"
              name="image"
              accept="image/*"
              id="fileUpload"
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={updateData} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
          <Button type="button" onClick={deleteFood} disabled={loading}>
            <Trash />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
