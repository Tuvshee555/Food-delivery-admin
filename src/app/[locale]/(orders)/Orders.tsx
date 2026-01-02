/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronRight as NextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

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

/* ---------- COMPONENT ---------- */
export const Orders = () => {
  const { t } = useI18n();

  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

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
  }, [page]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const changeStatus = async (id: string, status: Order["status"]) => {
    await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${id}`, {
      status,
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-background text-foreground p-6">
      <h1 className="text-xl font-semibold mb-6">{t("orders")}</h1>

      {/* loading */}
      {loading && (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-1/3 mb-3" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* orders */}
      {!loading && (
        <div className="grid gap-5">
          {orders.map((o, idx) => (
            <section
              key={o.id}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* header */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    #{idx + 1 + (page - 1) * limit}
                  </span>

                  <span className="text-sm font-medium">{o.user.email}</span>

                  <button
                    onClick={() => toggle(o.id)}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    {t("items", { count: o.foodOrderItems.length })}
                    {expanded.has(o.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-5">
                  <span className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>

                  <span className="text-sm font-medium">
                    ${o.totalPrice.toFixed(2)}
                  </span>

                  <span className="text-sm text-muted-foreground max-w-[160px] truncate">
                    {o.user.address}
                  </span>

                  {/* STATUS COLORS — INTENTIONALLY KEPT */}
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

              {/* items */}
              {expanded.has(o.id) && (
                <div className="border-t border-border bg-muted/50 px-5 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {o.foodOrderItems.map((item, index) => (
                      <div
                        key={`${o.id}-${item.food.id}-${index}`}
                        className="bg-card border border-border rounded-xl p-3"
                      >
                        <img
                          src={item.food.image}
                          alt={item.food.foodName}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <p className="text-xs mt-2 truncate">
                          {item.food.foodName}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
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

      {/* pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("previous")}
          </Button>

          <span className="text-muted-foreground">
            {t("page_of", { page, total: totalPages })}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="gap-1"
          >
            {t("next")}
            <NextIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
