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

/* ---------- TYPES ---------- */
type FoodItem = {
  food: { id: string; foodName: string; image: string };
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
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ---- fetch ---- */
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
        params: { page, limit },
      })
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setOrders(data);
          setTotal(data.length);
        } else {
          setOrders(data.orders || []);
          setTotal(data.total || 0);
        }
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
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
    <div className=" bg-gray-50 p-6 flex gap-[80px]">
      <div className="">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Orders</h1>

        {/* skeleton while loading */}
        {loading && (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-5 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* cards */}
        {!loading && (
          <div className="grid gap-5">
            {orders.map((o, idx) => (
              <section
                key={o.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100
                           hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {/* header row */}
                <div className="flex items-center justify-between p-5 g-[20px]">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-gray-400">
                      #{idx + 1 + (page - 1) * limit}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {o.user.email}
                    </span>
                    <button
                      onClick={() => toggle(o.id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-indigo-600
                                 text-sm font-medium transition"
                    >
                      {o.foodOrderItems.length} items
                      {expanded.has(o.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-5">
                    <span className="text-sm text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${o.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-600 max-w-[180px] truncate">
                      {o.user.address}
                    </span>

                    <select
                      value={o.status}
                      onChange={(e) =>
                        changeStatus(o.id, e.target.value as Order["status"])
                      }
                      className={`px-3 py-1.5 text-xs rounded-full border font-medium
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

                {/* expanded items – the pretty part */}
                {expanded.has(o.id) && (
                  <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {o.foodOrderItems.map((item, index) => (
                        <div
                          key={`${o.id}-${item.food.id}-${index}`}
                          className="relative bg-white rounded-xl p-3 shadow-sm border border-gray-100
               hover:shadow-md hover:-translate-y-0.5 transition"
                        >
                          <img
                            src={item.food.image}
                            alt={item.food.foodName}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <p className="text-xs text-gray-700 mt-2 truncate">
                            {item.food.foodName}
                          </p>
                          <span className="text-[10px] text-gray-500">
                            ×{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* real pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 text-sm">
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
