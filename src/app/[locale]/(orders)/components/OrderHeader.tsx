"use client";

import { Copy, ChevronDown, ChevronUp } from "lucide-react";
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
  const isExpanded = Boolean(order.__expanded); // or however you track it

  return (
    <div className="flex items-start justify-between p-5 gap-4">
      {/* LEFT */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-foreground">
            #{idx + 1 + (page - 1) * limit}
          </span>

          <h2 className="text-sm font-semibold truncate text-foreground">
            {order.orderNumber ? `#${order.orderNumber}` : order.id}
          </h2>

          <button
            onClick={() => copy(order.id)}
            className="inline-flex items-center"
            title={t("copy")}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm mt-2 text-foreground">
          {order.user?.email ?? t("no_email")}
          {order.user?.id && ` · user:${order.user.id}`}
        </div>

        <div className="text-sm mt-1 text-foreground">
          {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-3">
        <div className="text-sm font-semibold text-foreground">
          ₮{(order.totalPrice ?? 0).toLocaleString()}
        </div>

        <div className="flex items-center gap-3">
          {/* Status badge */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_BADGE[status]}`}
          >
            {status}
          </span>

          {/* Status select */}
          <select
            value={status}
            onChange={(e) =>
              changeStatus(order.id, e.target.value as OrderStatus)
            }
            className="px-3 py-1.5 text-xs rounded-full border font-medium text-foreground"
            title={t("change_status")}
          >
            <option value={status}>{status}</option>
            {STATUS_FLOW[status].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Expand details (REAL ACTION) */}
          <button
            onClick={() => toggle(order.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border rounded-full text-foreground"
          >
            {itemsCount} {t("items_short")}
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
