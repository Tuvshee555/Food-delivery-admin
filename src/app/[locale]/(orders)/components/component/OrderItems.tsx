/* eslint-disable @next/next/no-img-element */
"use client";

import { FoodItem, PLACEHOLDER } from "../type";

type Props = {
  items?: FoodItem[];
  orderId: string;
  t: (key: string) => string;
};

export function OrderItems({ items = [], orderId, t }: Props) {
  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="text-sm text-muted-foreground">{t("no_items")}</div>
      )}

      {items.map((it, i) => {
        const food = it.food;
        const price = food?.price ?? 0;
        const qty = it.quantity;
        const subtotal = price * qty;

        return (
          <div
            key={`${orderId}-${i}-${food?.id ?? "nofood"}`}
            className="bg-background border border-border rounded-lg p-3 flex items-center gap-3"
          >
            <img
              src={food?.image ?? PLACEHOLDER}
              alt={food?.foodName ?? "food"}
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
              }}
              className="w-14 h-14 rounded-md object-cover"
            />

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {food?.foodName ?? "(no name)"}
              </div>
              <div className="text-xs text-muted-foreground">
                id: {food?.id ?? "(none)"} •{" "}
                {food?.categoryId ? `cat: ${food.categoryId}` : "cat: (none)"}
              </div>
            </div>

            <div className="text-sm text-right">
              <div>₮{price.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">×{qty}</div>
              <div className="text-xs mt-1 font-semibold">
                ₮{subtotal.toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
