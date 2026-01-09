/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { RevenueDetails } from "./components/RevenueDetails";
import { DashboardHeader } from "./components/DashboardHeader";
import { RevenueStatsCards } from "./components/components/RevenueStatsCards";

export type RevenueData = {
  totalRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
};

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  status: "PAID";
  createdAt: string;
};

export default function RevenueDashboard() {
  const { t } = useI18n();

  const [stats, setStats] = useState<RevenueData | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [chartData, setChartData] = useState<
    { date: string; revenue: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<"7d" | "30d">("7d");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/payments`
      );
      const data = await res.json();

      // ✅ PAID ONLY
      const paid = (data.recentPayments || []).filter(
        (p: any) => p.status === "PAID"
      );

      setPayments(paid);

      // ✅ BUILD DAILY REVENUE FROM PAID PAYMENTS
      const dailyMap: Record<string, number> = {};
      paid.forEach((p: Payment) => {
        const day = p.createdAt.slice(0, 10);
        dailyMap[day] = (dailyMap[day] || 0) + p.amount;
      });

      const daily = Object.entries(dailyMap).map(([date, revenue]) => ({
        date,
        revenue,
      }));

      setChartData(daily);

      // ✅ STATS FROM PAID ONLY
      const now = new Date();
      const totalRevenue = paid.reduce(
        (s: any, p: { amount: any }) => s + p.amount,
        0
      );

      const weeklyRevenue = paid
        .filter(
          (p: { createdAt: string | number | Date }) =>
            now.getTime() - new Date(p.createdAt).getTime() <=
            7 * 24 * 60 * 60 * 1000
        )
        .reduce((s: any, p: { amount: any }) => s + p.amount, 0);

      const monthlyRevenue = paid
        .filter((p: { createdAt: string | number | Date }) => {
          const d = new Date(p.createdAt);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        })
        .reduce((s: any, p: { amount: any }) => s + p.amount, 0);

      setStats({ totalRevenue, weeklyRevenue, monthlyRevenue });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredChart = useMemo(() => {
    const days = range === "7d" ? 7 : 30;
    return chartData.slice(-days);
  }, [chartData, range]);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-background text-foreground px-4 py-4 md:p-6 space-y-6">
      <DashboardHeader
        t={t}
        loading={loading}
        onRefresh={fetchStats}
        range={range}
        setRange={setRange}
      />

      <RevenueStatsCards t={t} stats={stats} loading={loading} />

      <RevenueDetails
        t={t}
        chartData={filteredChart}
        payments={payments}
        loading={loading}
      />
    </div>
  );
}
