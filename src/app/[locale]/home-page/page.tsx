"use client";

// import QPayPage from "../qpay/page";

import { useState } from "react";
import { Sidebar } from "@/components/Side-Bar";
import RevenueDashboard from "@/components/stats/RevenueDashboard";
import { FoodMenu } from "../(food-menu)/FoodMenu";
import { Orders } from "../(orders)/Orders";

export default function HomePage() {
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
          {page === "Revenue-dashboard" && <RevenueDashboard />}
        </div>
      </div>
    </>
  );
}
