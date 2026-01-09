"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Payment } from "../RevenueDashboard";

type Props = {
  t: (key: string) => string;
  chartData: { date: string; revenue: number }[];
  payments: Payment[];
};

export function RevenueDetails({ t, chartData, payments }: Props) {
  const hasRevenue = chartData.some((d) => d.revenue > 0);

  return (
    <div className="space-y-6">
      {/* CHART */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-sm">{t("last_7_days")}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-[260px] w-full">
            {hasRevenue ? (
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
                {t("no_revenue_last_7_days")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PAYMENTS */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-sm">{t("recent_payments")}</CardTitle>
        </CardHeader>

        <CardContent className="divide-y divide-border">
          {payments.length > 0 ? (
            payments.map((p) => (
              <div
                key={p.id}
                className="py-3 flex items-center justify-between text-sm"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.orderId}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium">
                    {p.amount.toLocaleString()} ₮
                  </div>
                  <div
                    className={`text-xs ${
                      p.status === "PAID"
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {p.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t("no_payments")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
