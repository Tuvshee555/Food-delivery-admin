"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RevenueData } from "../RevenueStatsCards";

type Props = {
  t: (key: string) => string;
  stats: RevenueData | null;
  loading: boolean;
};

export function RevenueStatsCards({ t, stats, loading }: Props) {
  const Item = ({ label, value }: { label: string; value: string }) => (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-2 text-2xl font-semibold">
          {loading ? "—" : value}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Item
        label={t("total_revenue")}
        value={`₮${stats?.totalRevenue.toLocaleString() ?? "-"}`}
      />
      <Item
        label={t("this_month")}
        value={`₮${stats?.monthlyRevenue.toLocaleString() ?? "-"}`}
      />
      <Item
        label={t("this_week")}
        value={`₮${stats?.weeklyRevenue.toLocaleString() ?? "-"}`}
      />
    </div>
  );
}
