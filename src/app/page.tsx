"use client";
import { useState } from "react";
import { Sidebar } from "../components/Side-Bar";
import { MainContent } from "../components/Main-Content";
import { FoodMenu } from "./(food-menu)/food-menu";

export default function Home() {
  const [page, setPage] = useState("/Food-menu");
  return (
    <>
      <div className="flex">
        <div className="w-[15%]">
          <Sidebar setPage={setPage} />
        </div>
        <div >
          <FoodMenu />
        </div>
      </div>
    </>
  );
}
