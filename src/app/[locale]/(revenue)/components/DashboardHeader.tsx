"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type Props = {
  t: (key: string) => string;
  loading: boolean;
  onRefresh: () => void;
};

export function DashboardHeader({ t, loading, onRefresh }: Props) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-semibold">{t("dashboard")}</h1>

      <Button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <RefreshCcw className="w-4 h-4" />
        {t("refresh")}
      </Button>
    </div>
  );
}
