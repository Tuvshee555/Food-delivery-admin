"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type Props = {
  t: (key: string) => string;
  loading: boolean;
  onRefresh: () => void;
  range: "7d" | "30d";
  setRange: (r: "7d" | "30d") => void;
};

export function DashboardHeader({
  t,
  loading,
  onRefresh,
  range,
  setRange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 justify-between">
      <h1 className="text-xl font-semibold">{t("dashboard")}</h1>

      <div className="flex items-center gap-2">
        <Button
          variant={range === "7d" ? "default" : "outline"}
          size="sm"
          onClick={() => setRange("7d")}
        >
          7D
        </Button>
        <Button
          variant={range === "30d" ? "default" : "outline"}
          size="sm"
          onClick={() => setRange("30d")}
        >
          30D
        </Button>

        <Button
          onClick={onRefresh}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          <RefreshCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
