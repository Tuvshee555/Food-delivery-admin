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
import { ChangeEvent, useEffect, useState } from "react";
import { read } from "fs";
import { Files } from "lucide-react";

type Food = {
  foodName: string;
  price: string;
  image?: string;
  ingredients: string;
  category: string;
  refreshFood: () => void
  foodData: any[]
};

type FoodCardProps = {
  food: Food;
  refreshFood: () => void
};

export const UpdateFoodButton: React.FC<FoodCardProps> = ({ food, refreshFood }) => {
  const [updatedFood, setUpdatedFood] = useState<Food>({ ...food });
  const [photo, setPhoto] = useState<boolean>(false)
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLImageElement>) => {
    const { name, value, files } = e.target as HTMLInputElement
    setUpdatedFood((prev) => ({
      ...prev,
      [name]: name === "image" && files ? files[0]: value
    }));
    if (files){
      const file = files[0];
      const reader = new FileReader()
      reader.onload = () => {
        setPhoto(reader?.result as string)
        setLoading(false)
      }
      reader.readAsDataURL(file)
    }
  };

  const updateData = async () => {
    try {
      setLoading(true);
      await axios.put("http://localhost:4000/food", updatedFood);
      refreshFood
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);

    }
  };
  useEffect(() => {
    updateData()

  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <div className="h-[30px] w-[30px] bg-red-500 flex items-center justify-center text-white rounded-full">
            +
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[white]">
        <DialogHeader>
          <DialogTitle>Dishes info</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
            <label htmlFor="foodName" className="text-right">Dish Name</label>
            <Input id="foodName" name="foodName" className="col-span-3" value={updatedFood.foodName} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
            <label htmlFor="category" className="text-right">Dish Category</label>
            <Input id="category" name="category" className="col-span-3" value={updatedFood.category} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
            <label htmlFor="ingredients" className="text-right">Ingredients</label>
            <textarea id="ingredients" name="ingredients" className="col-span-3" value={updatedFood.ingredients} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
            <label htmlFor="price" className="text-right">Price</label>
            <Input id="price" name="price" className="col-span-3" value={updatedFood.price} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
            <label htmlFor="image" className="text-right">Image</label>
            {updatedFood?.image && photo ? (
              <img className="h-[138px] w-[412px] bg-[red] object-cover" src={photo} /> 
            ) : <div>
              <Input type="file" name="name" accept="image/*" className="hidden" id="fileUpload" onChange={handleChange} />
              <label htmlFor="fileUpload" className="cursor-pointer p-[50px]"> 
                <span className="text-center">
                  Choose a file or drag & drop it here


                </span>


              </label>
              
              </div>}
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
