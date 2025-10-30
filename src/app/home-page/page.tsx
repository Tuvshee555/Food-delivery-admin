"use client";

// import QPayPage from "../qpay/page";

import { useState } from "react";
import { FoodMenu } from "@/app/(food-menu)/FoodMenu";
import { Orders } from "@/app/(orders)/_component/Orders";
import { Sidebar } from "@/components/Side-Bar";
import Header from "@/components/Header";

export default function HomePage() {
  const [page, setPage] = useState("Food-menu");
  return (
    <>
      <div className="flex">
        <div className="w-[15%]">
          <Sidebar setPage={setPage} />
        </div>
        <div>
          <Header />
          {page === "Food-menu" && <FoodMenu />}
          {page === "Orders" && <Orders />}
        </div>
      </div>
      {/* <QPayPage /> */}
    </>
  );
}
