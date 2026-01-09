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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4" />
            {t("total_revenue")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold">
            {stats ? stats.totalRevenue.toLocaleString() : "-"} ₮
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4" />
            {t("this_month")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold">
            {stats ? stats.monthlyRevenue.toLocaleString() : "-"} ₮
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            {t("this_week")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold">
            {stats ? stats.weeklyRevenue.toLocaleString() : "-"} ₮
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
