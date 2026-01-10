/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { DashboardHeader } from "./components/DashboardHeader";
import { RevenueStatsCards } from "./components/RevenueStatsCards";
import { RevenueDetails } from "./components/RevenueDetails";
import { calcTrend } from "@/utils/revenue";

/* Types */
export type RevenueData = {
  totalRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
};

export type PaymentLike = {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
};

/* Revenue statuses (your rule) */
const REVENUE_STATUSES = ["PAID", "DELIVERING", "DELIVERED"] as const;

export default function RevenueDashboard() {
  const { t } = useI18n();

  const [stats, setStats] = useState<RevenueData | null>(null);
  const [payments, setPayments] = useState<PaymentLike[]>([]);
  const [chartData, setChartData] = useState<
    { date: string; revenue: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [trend, setTrend] = useState<{
    value: number;
    direction: "up" | "down" | "flat";
  } | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (!token) {
        setStats(null);
        setPayments([]);
        setChartData([]);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // unauthorized or error
        setStats(null);
        setPayments([]);
        setChartData([]);
        return;
      }

      const data = await res.json();
      // data is expected to be array of orders (your /order returns list)
      const orders: any[] = Array.isArray(data)
        ? data
        : data.orders ?? data.ordersList ?? [];

      // normalize to PaymentLike array only for revenue statuses
      const revenueOrders: PaymentLike[] = orders
        .filter((o) => REVENUE_STATUSES.includes(o.status))
        .map((o) => ({
          id: o.id,
          orderId: o.orderNumber ?? o.id,
          amount: Number(o.totalPrice ?? 0),
          status: o.status,
          createdAt: o.createdAt,
        }));

      setPayments(revenueOrders);

      // build daily revenue map
      const dailyMap: Record<string, number> = {};
      revenueOrders.forEach((p) => {
        const day = new Date(p.createdAt).toISOString().slice(0, 10); // YYYY-MM-DD
        dailyMap[day] = (dailyMap[day] || 0) + (p.amount || 0);
      });

      // ensure sorted by date ascending
      const daily = Object.entries(dailyMap)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setChartData(daily);

      // compute stats from revenueOrders
      const now = new Date();
      const totalRevenue = revenueOrders.reduce(
        (s, p) => s + (p.amount || 0),
        0
      );

      const weeklyRevenue = revenueOrders
        .filter(
          (p) =>
            now.getTime() - new Date(p.createdAt).getTime() <=
            7 * 24 * 60 * 60 * 1000
        )
        .reduce((s, p) => s + (p.amount || 0), 0);

      const monthlyRevenue = revenueOrders
        .filter((p) => {
          const d = new Date(p.createdAt);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        })
        .reduce((s, p) => s + (p.amount || 0), 0);

      setStats({ totalRevenue, weeklyRevenue, monthlyRevenue });

      // trend: compare last range vs previous same-length range
      // Build an array of daily sums (sorted). We'll compute sum of last N and previous N.
      const days = range === "7d" ? 7 : 30;
      const lastNDays = daily.slice(-days);
      const prevNDays = daily.slice(-days * 2, -days);

      const lastTotal = lastNDays.reduce((s, d) => s + (d.revenue || 0), 0);
      const prevTotal = prevNDays.reduce((s, d) => s + (d.revenue || 0), 0);

      setTrend(calcTrend(lastTotal, prevTotal));
    } catch (err) {
      // console.error("fetch orders for revenue error", err);
      setStats(null);
      setPayments([]);
      setChartData([]);
      setTrend(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount; DashboardHeader refresh button calls fetchOrders

  // Recompute trend when range or chart changes (user can toggle)
  useEffect(() => {
    const days = range === "7d" ? 7 : 30;
    const lastNDays = chartData.slice(-days);
    const prevNDays = chartData.slice(-days * 2, -days);

    const lastTotal = lastNDays.reduce((s, d) => s + (d.revenue || 0), 0);
    const prevTotal = prevNDays.reduce((s, d) => s + (d.revenue || 0), 0);

    setTrend(calcTrend(lastTotal, prevTotal));
  }, [range, chartData]);

  const filteredChart = useMemo(() => {
    const days = range === "7d" ? 7 : 30;
    return chartData.slice(-days);
  }, [chartData, range]);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-background text-foreground px-4 py-4 md:p-6 space-y-6">
      <DashboardHeader
        t={t}
        loading={loading}
        onRefresh={fetchOrders}
        range={range}
        setRange={setRange}
      />

      <RevenueStatsCards t={t} stats={stats} loading={loading} trend={trend} />

      <RevenueDetails
        t={t}
        chartData={filteredChart}
        payments={payments}
        loading={loading}
      />
    </div>
  );
}
