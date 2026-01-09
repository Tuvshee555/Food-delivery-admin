"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { PaginationControls } from "./components/PaginationControls";
import { OrderHeader } from "./components/OrderHeader";
import { OrderExpandedDetails } from "./components/OrderExpandedDetails";
import { useOrdersAdmin } from "./components/function/useOrdersAdmin";

export default function OrdersAdmin() {
  const { t } = useI18n();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const {
    orders,
    paged,
    expanded,
    page,
    limit,
    loading,
    fetchError,
    totalPages,
    setPage,
    toggle,
    copy,
    changeStatus,
  } = useOrdersAdmin(token, t);

  return (
    <div className="bg-background text-foreground p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t("orders")}</h1>
        <div className="text-sm text-muted-foreground">
          {t("page_of", { page, total: totalPages })}
        </div>
      </div>

      {loading && <p className="text-muted-foreground">{t("loading")}</p>}
      {fetchError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded">
          {fetchError}
        </div>
      )}

      {!loading && !fetchError && paged.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t("orders_empty")}
        </div>
      )}

      {!loading &&
        paged.map((o, idx) => {
          const items = o.foodOrderItems ?? o.items ?? [];

          return (
            <section
              key={o.id}
              className="bg-card border border-border rounded-2xl overflow-hidden mb-5"
            >
              <OrderHeader
                order={o}
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
                order={o}
                expanded={expanded.has(o.id)}
                items={o.items ?? o.foodOrderItems}
                t={t}
                copy={copy}
              />
            </section>
          );
        })}

      <PaginationControls
        loading={loading}
        hasData={orders.length > 0}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        t={t}
      />
    </div>
  );
}
