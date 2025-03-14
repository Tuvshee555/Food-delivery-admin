import { Button } from "@/components/ui/button";
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

type FoodCardProps = {
  food: Food;
};
type Food = {
  foodName: string;
  price: string;
  image?: string;
  ingredients: string;
};


export const UpdateFoodButton: React.FC<FoodCardProps> = ({food}) => {
  const [updatedFood, setUpdatedFood] = useState({
    foodName: "",
    price: "",
    ingredients: "",
    image: null,
  })
  
  const [Loading, setLoading] = useState(false)
  const handleChange = (e: ChangeEvent) => {
    const value = e.target as HTMLInputElement
    setUpdatedFood((prev) => ({
      ...prev, 
      value
      
    }) )
  }
  const updataData = async () => {
    try {
      setLoading(true)
      const response = await axios.put("http://localhost:4000/food", 
        {
          foodName: updatedFood.foodName
        }
      )

    } catch (error) {
      console.log(error)
      
    } finally {
      setLoading(false)
    }
  }
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
            <label htmlFor="name" className="text-right">
              Dish Name
            </label>
            <input id="name" className="col-span-3" value={food.foodName} onChange={handleChange}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
            <label htmlFor="name" className="text-right">
              Dish category
            </label>
            {/* <input id="name" className="col-span-3" value={food.price} onChange={handleChange}> ???? */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
            <label htmlFor="name" className="text-right">
              Ingredients
            </label>
            <textarea id="name" className="col-span-3" value={food.ingredients} onChange={handleChange}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
            <label htmlFor="username" className="text-right">
              Price
            </label>
            <input id="username" className="col-span-3" value={food.price} onChange={handleChange}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4 border-[1px] rounded-md">
            <label htmlFor="username" className="text-right">
              Image
            </label>
            <input id="username" className="col-span-3" value={food.image} onChange={handleChange}/>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
