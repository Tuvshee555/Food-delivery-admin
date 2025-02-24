"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import { FoodCatagories } from "./_features/Food-catagories";

export const FoodMenu = () => {
  const [catagory, setCatagory] = useState({ username: "" });
  const postData = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/catagory`,
        catagory
      );
      console.log(response);
      
      
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="w-[1171px] p-[24px]">
        <div className="text-[black] font-600 font-inter text-[20px]  mb-[26px]">
          Dish catagory
        </div>

        <div>
          <Dialog>
            <DialogTrigger asChild>
              <button>
                <div className="h-[30px] w-[30px] bg-[red] items-center flex justify-center text-[white] rounded-full">
                  +
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  {
                    <input
                      id="name"
                      className="col-span-3"
                      onChange={(e) =>
                        setCatagory({ ...catagory, username: e.target.value })
                      }
                    />
                  }
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="username" className="text-right">
                    Username
                  </label>
                  <input id="username" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <button type="submit" onClick={postData}>
                  Save changes
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <FoodCatagories />
          <FoodCatagories />
          <FoodCatagories />
        </div>
      </div>
    </>
  );
};

