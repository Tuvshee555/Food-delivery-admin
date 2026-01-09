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
  return (
    <>
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
    </>
  );
}
