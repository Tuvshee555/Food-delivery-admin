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
import { Trash } from "lucide-react";
import { SelectCategory } from "./SelectCategory";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export const UpdateFoodButton: React.FC<FoodCardPropsType> = ({
  food,
  refreshFood,
}) => {
  const [updatedFood, setUpdatedFood] = useState<FoodType>({ ...food });
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
      const target = e.target as HTMLInputElement;
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
    } else {
      setUpdatedFood((prev) => ({ ...prev, [e.name]: e.value }));
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
      console.log("Error while updating image", error);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    try {
      setLoading(true);

      const imageUrl =
        updatedFood.image instanceof File
          ? await uploadImage(updatedFood.image)
          : updatedFood.image;

      console.log(imageUrl);

      console.log(updatedFood);

      const response = await axios.put("http://localhost:4000/food", {
        _id: food._id,
        foodName: updatedFood.foodName,
        price: updatedFood.price,
        ingredients: updatedFood.ingredients,
        image: imageUrl,
        category: updatedFood.category,
      });
      console.log("updatedFood", response.data);
      setUpdatedFood(response.data);
      toast("succesfully updated food data");
      refreshFood();
    } catch (error) {
      console.log("Error updating food", error);
      toast.error("Failed to update food data");
    } finally {
      setLoading(false);
    }
  };

  const DeleteFood = async () => {
    try {
      await axios.delete(`http://localhost:4000/food/${food._id}`);
      toast("succesfully deleted food");
    } catch (error) {
      console.log("Delete", error);
      toast("failed to delete food");
    } finally {
      refreshFood();
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="absolute bottom-2 z-10 right-2 h-11 w-11 items-center flex justify-center rounded-full bg-[white] hover:cursor-pointer">
            <Pencil className="text-[red] h-5 w-5" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[white]">
          <DialogHeader>
            <DialogTitle>Dishes info</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
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
            <SelectCategory
              updatedFood={updatedFood}
              handleChange={handleChange}
            />
            <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
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
            <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
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
            <div className="border rounded-md p-2 flex flex-col items-center">
              <label htmlFor="image" className="text-right">
                Image
              </label>
              {photo ? (
                <img
                  className="h-[138px] w-[412px] bg-[red] object-cover"
                  alt="Preview"
                  src={photo}
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
            <Button type="button" onClick={DeleteFood}>
              <Trash />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
