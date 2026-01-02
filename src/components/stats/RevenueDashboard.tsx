"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, CalendarDays, DollarSign, RefreshCcw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type RevenueData = {
  totalRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
};

type Payment = {
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">{t("dashboard")}</h1>

        <Button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          {t("refresh")}
        </Button>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4" />
              {t("total_revenue")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {stats ? stats.totalRevenue.toLocaleString() : "-"} ₮
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4" />
              {t("this_month")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {stats ? stats.monthlyRevenue.toLocaleString() : "-"} ₮
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              {t("this_week")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {stats ? stats.weeklyRevenue.toLocaleString() : "-"} ₮
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-sm">{t("last_7_days")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payments */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-sm">{t("recent_payments")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-border">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">{t("order_id")}</th>
                  <th className="px-4 py-2 text-left">{t("amount")}</th>
                  <th className="px-4 py-2 text-left">{t("status")}</th>
                  <th className="px-4 py-2 text-left">{t("date")}</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-2">{p.orderId}</td>
                      <td className="px-4 py-2">
                        {p.amount.toLocaleString()} ₮
                      </td>

                      {/* semantic status color preserved */}
                      <td
                        className={`px-4 py-2 font-medium ${
                          p.status === "PAID"
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {p.status}
                      </td>

                      <td className="px-4 py-2">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-muted-foreground"
                    >
                      {t("no_payments")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
