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
    } catch (err) {
      console.error("Failed to load revenue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">💼 Business Dashboard</h1>
        <Button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="text-green-600" /> Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats ? stats.totalRevenue.toLocaleString() : "-"} ₮
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="text-blue-600" /> This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats ? stats.monthlyRevenue.toLocaleString() : "-"} ₮
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-l-4 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-yellow-600" /> This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats ? stats.weeklyRevenue.toLocaleString() : "-"} ₮
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>📊 Last 7 Days Revenue</CardTitle>
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
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>🧾 Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-2 border">Order ID</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{p.orderId}</td>
                      <td className="px-4 py-2">
                        {p.amount.toLocaleString()} ₮
                      </td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          p.status === "PAID"
                            ? "text-green-600"
                            : "text-gray-500"
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
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No recent payments
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
