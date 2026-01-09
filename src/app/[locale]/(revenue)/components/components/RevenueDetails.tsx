"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Payment } from "../RevenueStatsCards";

type Props = {
  t: (key: string) => string;
  chartData: { date: string; revenue: number }[];
  payments: Payment[];
  loading: boolean;
};

export function RevenueDetails({ t, chartData, payments, loading }: Props) {
  return (
    <div className="space-y-6">
      {/* CHART */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-sm">{t("last_7_days")}</CardTitle>
        </CardHeader>

        <CardContent className="h-[260px]">
          {loading ? (
            <div className="h-full animate-pulse bg-muted rounded" />
          ) : chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              {t("no_paid_revenue")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PAYMENTS */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-sm">{t("recent_payments")}</CardTitle>
        </CardHeader>

        <CardContent className="divide-y divide-border">
          {loading ? (
            <div className="h-24 animate-pulse bg-muted rounded" />
          ) : payments.length ? (
            payments.map((p) => (
              <div
                key={p.id}
                className="py-3 flex items-center justify-between text-sm"
              >
                <div className="truncate">{p.orderId}</div>
                <div className="font-medium">₮{p.amount.toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t("no_paid_revenue")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
