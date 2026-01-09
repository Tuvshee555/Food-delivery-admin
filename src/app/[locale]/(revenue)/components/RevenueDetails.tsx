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
import { OrderStatus, STATUS_BADGE } from "../../(orders)/components/type";

type Props = {
  t: (key: string) => string;
  chartData: { date: string; revenue: number }[];
  payments: Payment[];
  loading: boolean;
};

export function RevenueDetails({ t, chartData, payments, loading }: Props) {
  const hasRevenue = chartData.some((d) => d.revenue > 0);

  return (
    <div className="space-y-6">
      {/* CHART */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t("last_7_days")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full">
            {loading ? (
              <div className="h-full bg-muted rounded" />
            ) : hasRevenue ? (
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
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
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
      <Card>
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

                <div className="text-right space-y-1">
                  <div className="font-medium">
                    {p.amount.toLocaleString()} ₮
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      STATUS_BADGE[p.status as OrderStatus]
                    }`}
                  >
                    {t(`order_status.${p.status}`)}
                  </span>
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
