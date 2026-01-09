/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Copy } from "lucide-react";

type Props = {
  delivery?: any;
  t: (key: string) => string;
  copy: (value: string) => void;
  Row: any;
  Block: any;
};

export function DeliveryInfo({ delivery, t, copy, Row, Block }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-xs text-muted-foreground mb-2">{t("delivery")}</div>

      <div className="text-sm">
        <Row label={t("name")}>
          {delivery?.firstName ?? ""} {delivery?.lastName ?? ""}
        </Row>

        <Row label={t("phone")}>
          <div className="flex items-center gap-2">
            <span className="font-medium">{delivery?.phone ?? "-"}</span>
            {delivery?.phone && (
              <button
                onClick={() => copy(delivery.phone)}
                className="text-xs text-muted-foreground flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {t("copy")}
              </button>
            )}
          </div>
        </Row>

        <Row label={t("city")}>{delivery?.city ?? "-"}</Row>
        <Row label={t("district")}>{delivery?.district ?? "-"}</Row>
        <Row label={t("khoroo")}>{delivery?.khoroo ?? "-"}</Row>

        <Block label={t("address")}>{delivery?.address ?? "-"}</Block>

        {delivery?.notes && <Block label={t("notes")}>{delivery.notes}</Block>}
      </div>
    </div>
  );
}
