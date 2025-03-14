"use client";
import { useState } from "react";
import { Sidebar } from "../components/Side-Bar";
import { FoodMenu } from "./(food-menu)/food-menu";
import { Orders } from "./(orders)/Orders";
import { Settings } from "./(settings)/settings";

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
          {page === "Settings" && <Settings />}
        </div>
      </div>
    </>
  );
}
