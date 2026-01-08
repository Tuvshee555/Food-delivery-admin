"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RevenueDashboard from "@/components/stats/RevenueDashboard";
import { FoodMenu } from "../(food-menu)/FoodMenu";
import OrdersAdmin from "../(orders)/OrdersAdmin";

export default function HomePage() {
  const [page, setPage] = useState("Food-menu");

  return (
    <AdminLayout setPage={setPage}>
      {page === "Food-menu" && <FoodMenu />}
      {page === "Orders" && <OrdersAdmin />}
      {page === "Revenue-dashboard" && <RevenueDashboard />}
    </AdminLayout>
  );
}
