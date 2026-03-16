"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { PaginationControls } from "./components/PaginationControls";
import { OrderHeader } from "./components/OrderHeader";
import { OrderExpandedDetails } from "./components/OrderExpandedDetails";
import { useOrdersAdmin } from "./components/function/useOrdersAdmin";
import { normalizeOrderId } from "@/utils/normalizeOrderId";

export default function OrdersAdmin() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const {
    orders,
    expanded,
    page,
    limit,
    loading,
    fetchError,
    totalPages,
    totalOrders,
    setPage,
    toggle,
    copy,
    changeStatus,
  } = useOrdersAdmin(token, t, normalizeOrderId(search));

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-background text-foreground px-4 py-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t("orders")}</h1>

        <div className="text-sm text-muted-foreground">
          {t("page_of", { page, total: totalPages })}
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // always jump to first page when searching
          }}
          placeholder="Search order ID (ex: #AGP9T1QK)"
          className="h-11 w-full md:max-w-md rounded-xl border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            className="h-11 px-4 rounded-xl border border-border text-sm font-medium"
          >
            Clear
          </button>

          <div className="text-sm text-muted-foreground">
            {search ? `${totalOrders} found` : `${totalOrders} total`}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      )}

      {/* Error */}
      {fetchError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4">
          {fetchError}
        </div>
      )}

      {/* Empty */}
      {!loading && !fetchError && orders.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {search ? "No matching order found" : t("orders_empty")}
        </div>
      )}

      {/* Orders */}
      {!loading &&
        orders.map((order, idx) => {
          const items = order.foodOrderItems ?? order.items ?? [];
          return (
            <section
              key={order.id}
              className="w-full max-w-full bg-card border border-border rounded-2xl overflow-hidden mb-5"
            >
              <OrderHeader
                order={order}
                idx={idx}
                page={page}
                limit={limit}
                itemsCount={items.length}
                t={t}
                copy={copy}
                toggle={toggle}
                changeStatus={changeStatus}
              />

              <OrderExpandedDetails
                order={order}
                expanded={expanded.has(order.id)}
                items={items}
                t={t}
                copy={copy}
              />
            </section>
          );
        })}

      {/* Pagination */}
      <PaginationControls
        loading={loading}
        hasData={totalOrders > 0}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        t={t}
      />
    </div>
  );
}
