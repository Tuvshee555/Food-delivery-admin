"use client";
import { useState } from "react";
import { Sidebar } from "../components/Side-Bar";
import { FoodMenu } from "@/app/(food-menu)/FoodMenu";
import { Orders } from "@/app/(orders)/_component/Orders";

export const MenuOrder = () => {
  const [page, setPage] = useState("Food-menu");
  return (
    <>
      <div className="flex">
        <div className="w-[15%]">
          <Sidebar setPage={setPage} />
        </div>
        <div>
          {page === "Food-menu" && <FoodMenu />}
          {page === "Orders" && <Orders />}
        </div>
      </div>
    </>
  );
};
