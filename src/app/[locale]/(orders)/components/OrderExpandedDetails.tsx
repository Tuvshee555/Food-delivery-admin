"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderItems } from "./component/OrderItems";
import { RawOrder } from "./type";
import { normalizeDelivery } from "@/utils/normalizeDelivery";
import { DeliveryInfo } from "./component/DeliveryInfo";
import { OrderMetaInfo } from "./component/OrderMetaInfo";

type Props = {
  order: RawOrder;
  expanded: boolean;
  items: RawOrder["items"] | RawOrder["foodOrderItems"];
  t: (key: string) => string;
  copy: (value: string) => void;
};

export function OrderExpandedDetails({
  order,
  expanded,
  items,
  t,
  copy,
}: Props) {
  if (!expanded) return null;

  const delivery = normalizeDelivery(order);

  return (
    <div className="border-t border-border px-5 py-4">
      <div className="flex flex-col gap-6">
        {/* Items */}
        <OrderItems items={items} orderId={order.id} t={t} />

        {/* Delivery */}
        <DeliveryInfo
          delivery={delivery}
          t={t}
          copy={copy}
          Row={Row}
          Block={Block}
        />

        {/* Order meta */}
        <OrderMetaInfo order={order} t={t} copy={copy} Row={Row} />

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.open(`/admin/orders/${order.id}`, "_blank")}
          >
            <FileText className="w-4 h-4 mr-2" />
            {t("view_details")}
          </Button>

          <Button
            className="flex-1"
            onClick={() => {
              const summary = `Order ${order.orderNumber ?? order.id} - ₮${(
                order.totalPrice ?? 0
              ).toLocaleString()}`;
              copy(summary);
            }}
          >
            {t("copy_summary")}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* helpers */

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4 mt-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{children}</span>
    </div>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
