/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Copy } from "lucide-react";

type Props = {
  order: any;
  t: (key: string) => string;
  copy: (value: string) => void;
  Row: any;
};

export function OrderMetaInfo({ order, t, copy, Row }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm">
      <Row label={t("order_id")}>{order?.id ?? "-"}</Row>

      {order?.orderNumber && (
        <Row label={t("order_number")}>
          <div className="flex items-center gap-2">
            <span className="font-medium">#{order.orderNumber}</span>
            <button
              onClick={() => copy(order.orderNumber)}
              className="text-xs text-muted-foreground flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {t("copy")}
            </button>
          </div>
        </Row>
      )}

      <Row label={t("created_at")}>
        {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
      </Row>

      <Row label={t("payment_method")}>{order?.paymentMethod ?? "-"}</Row>
    </div>
  );
}
