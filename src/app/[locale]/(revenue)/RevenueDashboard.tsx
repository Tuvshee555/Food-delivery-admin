"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { RevenueStatsCards } from "./components/RevenueStatsCards";
import { RevenueDetails } from "./components/RevenueDetails";
import { DashboardHeader } from "./components/DashboardHeader";

export type RevenueData = {
  totalRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
};

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  status: string;
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

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/revenue`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/payments`),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();

      setStats(data1);
      setPayments(data2.recentPayments || []);
      setChartData(data2.dailyRevenue || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex flex-col gap-8">
      <DashboardHeader t={t} loading={loading} onRefresh={fetchStats} />

      <RevenueStatsCards t={t} stats={stats} />

      <RevenueDetails t={t} chartData={chartData} payments={payments} />
    </div>
  );
}
