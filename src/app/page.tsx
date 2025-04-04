"use client";
import { useState } from "react";
import { Sidebar } from "../components/Side-Bar";
import { FoodMenu } from "./(food-menu)/FoodMenu";
import { Orders } from "./(orders)/Orders";

export default function Home() {
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
}
