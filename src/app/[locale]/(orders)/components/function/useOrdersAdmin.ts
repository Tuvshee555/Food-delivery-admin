/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrderStatus, RawOrder, STATUS_FLOW } from "../type";

export function useOrdersAdmin(
  token: string | null,
  t: (key: string) => string
) {
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
        if (Array.isArray(data)) setOrders(data);
        else if (Array.isArray(data?.orders)) setOrders(data.orders);
        else if (Array.isArray(data?.ordersList)) setOrders(data.ordersList);
        else setOrders([]);
      })
      .catch((err) => {
        // console.error("fetch orders error", err?.response ?? err);
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
    const currentStatus = (current.status ?? "PENDING") as OrderStatus;

    if (!STATUS_FLOW[currentStatus].includes(nextStatus)) {
      toast.error(t("invalid_status_transition"));
      return;
    }

    const before = orders[idx];
    const optimistic = [...orders];
    optimistic[idx] = { ...before, status: nextStatus };
    setOrders(optimistic);

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("status_updated"));
    } catch (err) {
      setOrders((prev) => {
        const rollback = [...prev];
        rollback[idx] = before;
        return rollback;
      });
      // console.error("status update error", err ?? err);
      toast.error(t("status_update_failed"));
    }
  };

  const totalPages = Math.max(1, Math.ceil(orders.length / limit));
  const paged = orders.slice((page - 1) * limit, page * limit);

  return {
    orders,
    setOrders,
    paged,
    expanded,
    page,
    limit,
    loading,
    fetchError,
    totalPages,
    setPage,
    toggle,
    copy,
    changeStatus,
  };
}
