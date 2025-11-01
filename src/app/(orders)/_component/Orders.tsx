/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronRight as NextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

/* ---------- TYPES ---------- */
type FoodItem = {
  food: any;
  foodId: { id: string; foodName: string; image: string };
  quantity: number;
};

type Order = {
  id: string;
  createdAt: string;
  status: "PENDING" | "DELIVERED" | "CANCELLED";
  totalPrice: number;
  user: { email: string; address: string };
  foodOrderItems: FoodItem[];
};

/* ---------- HOOK ---------- */
export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  /* ---- real pagination ---- */
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // keep it fixed for simplicity
  const [total, setTotal] = useState(0);

  /* ---- fetch ---- */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
          { params: { page, limit } }
        );

        // adapt to either response style
        if (Array.isArray(data)) {
          setOrders(data);
          setTotal(data.length);
        } else {
          setOrders(data.orders || []);
          setTotal(data.total || 0);
        }
      } catch (e) {
        console.error("Error fetching orders:", e);
        setOrders([]);
      }
    };
    fetchOrders();
  }, [page, limit]);

  /* ---- helpers ---- */
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const changeStatus = async (id: string, status: Order["status"]) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${id}`, {
        status,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const totalPages = Math.ceil(total / limit);

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

        {/* cards */}
        <div className="grid gap-4">
          {orders.map((o, idx) => (
            <section
              key={o.id}
              className="rounded-xl bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
            >
              {/* header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-400">
                    #{idx + 1 + (page - 1) * limit}
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    {o.user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggle(o.id)}
                    className="gap-1 text-gray-500"
                  >
                    {o.foodOrderItems.length} items
                    {expanded.has(o.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    ${o.totalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600 max-w-[160px] truncate">
                    {o.user.address}
                  </span>

                  <select
                    value={o.status}
                    onChange={(e) =>
                      changeStatus(o.id, e.target.value as Order["status"])
                    }
                    className={`px-3 py-1 text-xs rounded-full border font-medium
                      ${
                        o.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : o.status === "DELIVERED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                  >
                    <option>PENDING</option>
                    <option>DELIVERED</option>
                    <option>CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* expanded items */}
              {expanded.has(o.id) && (
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                  {o.foodOrderItems.map((item, index) => (
                    <div
                      key={`${o.id}-${item.food.id}-${index}`}
                      className="w-20 text-center"
                    >
                      <img
                        src={item.food.image}
                        alt={item.food.foodName}
                        className="w-16 h-16 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm mt-1">{item.food.foodName}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* real pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="gap-1"
            >
              Next <NextIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
