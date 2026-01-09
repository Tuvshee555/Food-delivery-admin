"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, CalendarDays, TrendingUp } from "lucide-react";
import { RevenueData } from "../RevenueDashboard";

type Props = {
  t: (key: string) => string;
  stats: RevenueData | null;
};

export function RevenueStatsCards({ t, stats }: Props) {
  return (
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
  );
}
