"use client";

import { Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderItems } from "./OrderItems";
import { RawOrder } from "./type";
import { normalizeDelivery } from "@/utils/normalizeDelivery";

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
      <div className="grid md:grid-cols-3 gap-6">
        <OrderItems items={items} orderId={order.id} t={t} />

        <div className="space-y-3">
          {/* Delivery */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-2">
              {t("delivery")}
            </div>

            <div className="text-sm">
              <Row label={t("name")}>
                {delivery?.firstName ?? ""} {delivery?.lastName ?? ""}
              </Row>

              <Row label={t("phone")}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{delivery?.phone ?? "-"}</span>
                  {delivery?.phone && (
                    <button
                      onClick={() => copy(delivery.phone ?? "")}
                      className="text-xs text-muted-foreground flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> {t("copy")}
                    </button>
                  )}
                </div>
              </Row>

              <Row label={t("city")}>{delivery?.city ?? "-"}</Row>
              <Row label={t("district")}>{delivery?.district ?? "-"}</Row>
              <Row label={t("khoroo")}>{delivery?.khoroo ?? "-"}</Row>

              <Block label={t("address")}>{delivery?.address ?? "-"}</Block>

              {delivery?.notes && (
                <Block label={t("notes")}>{delivery.notes}</Block>
              )}
            </div>
          </div>

          {/* Order meta */}
          <div className="bg-card border border-border rounded-lg p-3 text-sm">
            <Row label={t("order_id")}>{order.id}</Row>

            {order.orderNumber && (
              <Row label={t("order_number")}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">#{order.orderNumber}</span>
                  <button
                    onClick={() => copy(order.orderNumber ?? "")}
                    className="text-xs text-muted-foreground flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> {t("copy")}
                  </button>
                </div>
              </Row>
            )}

            <Row label={t("created_at")}>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "-"}
            </Row>

            <Row label={t("payment_method")}>{order.paymentMethod ?? "-"}</Row>
          </div>

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
    </div>
  );
}

/* small internal helpers — no exports */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between mt-2">
      <span>{label}</span>
      <span className="font-medium">{children}</span>
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
    <div className="mt-3 text-xs text-muted-foreground">
      <div>{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
