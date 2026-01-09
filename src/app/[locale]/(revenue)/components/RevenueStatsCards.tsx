"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RevenueData } from "../RevenueDashboard";

type Trend = { value: number; direction: "up" | "down" | "flat" } | null;

type Props = {
  t: (key: string) => string;
  stats: RevenueData | null;
  loading: boolean;
  trend?: Trend;
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-2 text-xl md:text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function RevenueStatsCards({ t, stats, loading, trend }: Props) {
  const total = stats
    ? `₮${stats.totalRevenue.toLocaleString()}`
    : loading
    ? "—"
    : "-";
  const month = stats
    ? `₮${stats.monthlyRevenue.toLocaleString()}`
    : loading
    ? "—"
    : "-";
  const week = stats
    ? `₮${stats.weeklyRevenue.toLocaleString()}`
    : loading
    ? "—"
    : "-";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard label={t("total_revenue")} value={total} />
      <StatCard label={t("this_month")} value={month} />
      <StatCard label={t("this_week")} value={week} />

      {/* Trend small inline on the right of the grid (desktop) */}
      <div className="md:col-span-3 flex items-center justify-end text-sm text-muted-foreground">
        {trend ? (
          trend.direction === "up" ? (
            <span className="text-emerald-600">
              ▲ {trend.value}% {t("vs_last_period")}
            </span>
          ) : trend.direction === "down" ? (
            <span className="text-rose-600">
              ▼ {trend.value}% {t("vs_last_period")}
            </span>
          ) : (
            <span>0% {t("vs_last_period")}</span>
          )
        ) : null}
      </div>
    </div>
  );
}
