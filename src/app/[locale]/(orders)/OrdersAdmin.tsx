/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { toast } from "sonner";

type OrderStatus =
  | "PENDING"
  | "WAITING_PAYMENT"
  | "COD_PENDING"
  | "PAID"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELLED";

type FoodItem = {
  id?: string;
  quantity: number;
  food?: {
    id?: string;
    foodName?: string;
    price?: number;
    image?: string | null;
    categoryId?: string | null;
  } | null;
};

type RawOrder = {
  id: string;
  orderNumber?: string;
  totalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: OrderStatus;
  paymentMethod?: string;
  user?: { id?: string; email?: string; address?: string | null } | null;
  delivery?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    city?: string | null;
    district?: string | null;
    khoroo?: string | null;
    address?: string | null;
    notes?: string | null;
  };
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  city?: string | null;
  district?: string | null;
  khoroo?: string | null;
  address?: string | null;
  notes?: string | null;
  foodOrderItems?: Array<{
    id?: string;
    quantity: number;
    food?: {
      id?: string;
      foodName?: string;
      price?: number;
      image?: string | null;
      categoryId?: string | null;
    } | null;
  }>;
  items?: FoodItem[];
};

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["WAITING_PAYMENT", "PAID", "CANCELLED"],
  WAITING_PAYMENT: ["PAID", "CANCELLED"],
  COD_PENDING: ["DELIVERING", "CANCELLED"],
  PAID: ["DELIVERING"],
  DELIVERING: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='16'>No image</text></svg>`
  );

const STATUS_BADGE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  WAITING_PAYMENT: "bg-orange-50 text-orange-700 border-orange-200",
  COD_PENDING: "bg-sky-50 text-sky-700 border-sky-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DELIVERING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function OrdersAdmin() {
  const { t } = useI18n();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [orders, setOrders] = useState<RawOrder[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setFetchError(t("unauthorized"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data?.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (Array.isArray(data?.ordersList)) {
          // sometimes API shapes vary
          setOrders(data.ordersList);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => {
        console.error("fetch orders error", err?.response ?? err);
        setFetchError(t("fetch_failed"));
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [token, t]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copy_failed"));
    }
  };

  const changeStatus = async (orderId: string, nextStatus: OrderStatus) => {
    if (!token) {
      toast.error(t("unauthorized"));
      return;
    }

    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return;

    const current = orders[idx];
    const currentStatus = (current.status || "PENDING") as OrderStatus;

    if (!STATUS_FLOW[currentStatus].includes(nextStatus)) {
      toast.error(t("invalid_status_transition"));
      return;
    }

    const before = orders[idx];
    const updated = [...orders];
    updated[idx] = { ...before, status: nextStatus };
    setOrders(updated);

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("status_updated"));
    } catch (err) {
      setOrders((prev) => {
        const copyPrev = [...prev];
        const pos = copyPrev.findIndex((p) => p.id === orderId);
        if (pos !== -1) copyPrev[pos] = before;
        return copyPrev;
      });
      console.error("status update error", err ?? err);
      toast.error(t("status_update_failed"));
    }
  };

  const totalPages = Math.max(1, Math.ceil(orders.length / limit));
  const paged = orders.slice((page - 1) * limit, page * limit);

  return (
    <div className="bg-background text-foreground p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t("orders")}</h1>
        <div className="text-sm text-muted-foreground">
          {t("page_of", { page, total: totalPages })}
        </div>
      </div>

      {loading && <p className="text-muted-foreground">{t("loading")}</p>}
      {fetchError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded">
          {fetchError}
        </div>
      )}

      {!loading && !fetchError && paged.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t("orders_empty")}
        </div>
      )}

      {!loading &&
        paged.map((o, idx) => {
          const items = o.foodOrderItems ?? o.items ?? [];
          const delivery =
            o.delivery ??
            (o.firstName ||
            o.lastName ||
            o.phone ||
            o.city ||
            o.district ||
            o.khoroo ||
            o.address ||
            o.notes
              ? {
                  firstName: o.firstName,
                  lastName: o.lastName,
                  phone: o.phone,
                  city: o.city,
                  district: o.district,
                  khoroo: o.khoroo,
                  address: o.address,
                  notes: o.notes,
                }
              : null);

          return (
            <section
              key={o.id}
              className="bg-card border border-border rounded-2xl overflow-hidden mb-5"
            >
              <div className="flex items-start justify-between p-5 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs text-muted-foreground">
                      #{idx + 1 + (page - 1) * limit}
                    </span>

                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-medium truncate">
                        {o.orderNumber ? `#${o.orderNumber}` : o.id}
                      </h2>

                      <button
                        onClick={() => copy(o.id)}
                        className="text-xs text-muted-foreground flex items-center gap-1"
                        title={t("copy_order_id")}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mt-2">
                    {o.user?.email ?? t("no_email")} ·{" "}
                    {o.user?.id ? `user:${o.user.id}` : ""}
                  </div>

                  <div className="text-xs text-muted-foreground mt-2">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-sm font-semibold">
                    ₮{(o.totalPrice ?? 0).toLocaleString()}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${
                        STATUS_BADGE[(o.status ?? "PENDING") as OrderStatus]
                      }`}
                    >
                      {o.status ?? "PENDING"}
                    </span>

                    <select
                      value={o.status ?? "PENDING"}
                      onChange={(e) =>
                        changeStatus(o.id, e.target.value as OrderStatus)
                      }
                      className="px-3 py-1.5 text-xs rounded-full border font-medium"
                      title={t("change_status")}
                    >
                      <option value={o.status ?? "PENDING"}>
                        {o.status ?? "PENDING"}
                      </option>
                      {STATUS_FLOW[(o.status ?? "PENDING") as OrderStatus].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        )
                      )}
                    </select>

                    <button
                      onClick={() => toggle(o.id)}
                      className="text-sm text-muted-foreground"
                    >
                      {items.length} {t("items_short")}
                    </button>
                  </div>
                </div>
              </div>

              {expanded.has(o.id) && (
                <div className="border-t border-border px-5 py-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                      {items.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                          {t("no_items")}
                        </div>
                      )}

                      {items.map((it, i) => {
                        const food = it.food ?? (it as any);
                        const imgSrc = food?.image ?? PLACEHOLDER;
                        const price = food?.price ?? 0;
                        const qty = it.quantity ?? 0;
                        const subtotal = price * qty;
                        return (
                          <div
                            key={`${o.id}-${i}-${food?.id ?? "nofood"}`}
                            className="bg-background border border-border rounded-lg p-3 flex items-center gap-3"
                          >
                            <img
                              src={imgSrc}
                              alt={food?.foodName ?? "food"}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  PLACEHOLDER;
                              }}
                              className="w-14 h-14 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {food?.foodName ?? "(no name)"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                id: {food?.id ?? "(none)"}
                                {" • "}
                                {food?.categoryId
                                  ? `cat: ${food.categoryId}`
                                  : "cat: (none)"}
                              </div>
                            </div>
                            <div className="text-sm text-right">
                              <div>₮{price.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">
                                ×{qty}
                              </div>
                              <div className="text-xs mt-1 font-semibold">
                                ₮{subtotal.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3">
                      <div className="bg-card border border-border rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-2">
                          {t("delivery")}
                        </div>

                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span>{t("name")}</span>
                            <span className="font-medium">
                              {delivery?.firstName ?? ""}{" "}
                              {delivery?.lastName ?? ""}
                            </span>
                          </div>

                          <div className="flex justify-between mt-2">
                            <span>{t("phone")}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {delivery?.phone ?? "-"}
                              </span>
                              {delivery?.phone && (
                                <button
                                  onClick={() => copy(delivery?.phone ?? "")}
                                  className="text-xs text-muted-foreground flex items-center gap-1"
                                >
                                  <Copy className="w-3 h-3" /> {t("copy")}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between mt-2">
                            <span>{t("city")}</span>
                            <span className="font-medium">
                              {delivery?.city ?? "-"}
                            </span>
                          </div>

                          <div className="flex justify-between mt-2">
                            <span>{t("district")}</span>
                            <span className="font-medium">
                              {delivery?.district ?? "-"}
                            </span>
                          </div>

                          <div className="flex justify-between mt-2">
                            <span>{t("khoroo")}</span>
                            <span className="font-medium">
                              {delivery?.khoroo ?? "-"}
                            </span>
                          </div>

                          <div className="mt-3 text-xs text-muted-foreground">
                            <div>{t("address")}</div>
                            <div className="text-sm">
                              {delivery?.address ?? "-"}
                            </div>
                          </div>

                          {delivery?.notes && (
                            <div className="mt-3 text-xs text-muted-foreground">
                              <div>{t("notes")}</div>
                              <div className="text-sm">{delivery.notes}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-3 text-sm">
                        <div className="flex justify-between">
                          <span>{t("order_id")}</span>
                          <span className="font-medium">{o.id}</span>
                        </div>
                        {o.orderNumber && (
                          <div className="flex justify-between mt-2">
                            <span>{t("order_number")}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                #{o.orderNumber}
                              </span>
                              <button
                                onClick={() => copy(o.orderNumber ?? "")}
                                className="text-xs text-muted-foreground flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" /> {t("copy")}
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between mt-2">
                          <span>{t("created_at")}</span>
                          <span className="font-medium">
                            {o.createdAt
                              ? new Date(o.createdAt).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span>{t("payment_method")}</span>
                          <span className="font-medium">
                            {o.paymentMethod ?? "-"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            window.open(`/admin/orders/${o.id}`, "_blank");
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />{" "}
                          {t("view_details")}
                        </Button>

                        <Button
                          className="flex-1"
                          onClick={() => {
                            const summary = `Order ${
                              o.orderNumber ?? o.id
                            } - ₮${(o.totalPrice ?? 0).toLocaleString()}`;
                            copy(summary);
                          }}
                        >
                          {t("copy_summary")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}

      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            {t("previous")}
          </Button>

          <div className="text-sm text-muted-foreground">
            {t("page_of", { page, total: totalPages })}
          </div>

          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            {t("next")}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
