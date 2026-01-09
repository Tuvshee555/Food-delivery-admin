"use client";

import { Copy } from "lucide-react";
import { OrderStatus, RawOrder, STATUS_BADGE, STATUS_FLOW } from "./type";

type Props = {
  order: RawOrder;
  idx: number;
  page: number;
  limit: number;
  itemsCount: number;
  t: (key: string) => string;
  copy: (id: string) => void;
  toggle: (id: string) => void;
  changeStatus: (id: string, status: OrderStatus) => void;
};

export function OrderHeader({
  order,
  idx,
  page,
  limit,
  itemsCount,
  t,
  copy,
  toggle,
  changeStatus,
}: Props) {
  const status = order.status ?? "PENDING";

  return (
    <div className="flex items-start justify-between p-5 gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="text-xs text-muted-foreground">
            #{idx + 1 + (page - 1) * limit}
          </span>

          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium truncate">
              {order.orderNumber ? `#${order.orderNumber}` : order.id}
            </h2>

            <button
              onClick={() => copy(order.id)}
              className="text-xs text-muted-foreground flex items-center gap-1"
              title={t("copy_order_id")}
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          {order.user?.email ?? t("no_email")} ·{" "}
          {order.user?.id ? `user:${order.user.id}` : ""}
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="text-sm font-semibold">
          ₮{(order.totalPrice ?? 0).toLocaleString()}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${STATUS_BADGE[status]}`}
          >
            {status}
          </span>

          <select
            value={status}
            onChange={(e) =>
              changeStatus(order.id, e.target.value as OrderStatus)
            }
            className="px-3 py-1.5 text-xs rounded-full border font-medium"
            title={t("change_status")}
          >
            <option value={status}>{status}</option>
            {STATUS_FLOW[status].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => toggle(order.id)}
            className="text-sm text-muted-foreground"
          >
            {itemsCount} {t("items_short")}
          </button>
        </div>
      </div>
    </div>
  );
}
