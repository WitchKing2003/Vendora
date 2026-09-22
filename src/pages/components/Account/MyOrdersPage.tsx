import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAuthStore } from "../../../stores/authStore";
import {
  ORDER_STATUS_TABS,
  useOrderStore,
  type Order,
  type OrderStatus,
} from "../../../stores/orderStore";

export interface AccountNavItem {
  icon: string;
  labelKey: string;
  to?: string;
}

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.4-6 8-6s6.5 2 8 6", labelKey: "account.profile" },
  { icon: "M4 10l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9zM9 21v-6h6v6", labelKey: "tracking.myOrders", to: "/account/orders" },
  { icon: "M5 21V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13M3 21h18", labelKey: "account.addresses" },
  { icon: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z", labelKey: "account.wishlist" },
  { icon: "M4 7h16l-1.5 13h-13L4 7zM9 7V5a3 3 0 0 1 6 0v2", labelKey: "account.vouchers" },
  { icon: "M12 17.3l-6.2 3.7 1.7-7L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.5 4.8 1.7 7z", labelKey: "account.reviews" },
];

export const AccountSidebar = ({ activeLabelKey }: { activeLabelKey: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  return (
    <div className="space-y-5">
      <aside className="h-fit border border-line bg-white p-3 lg:sticky lg:top-6">
        <nav className="space-y-1">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const active = item.labelKey === activeLabelKey;
            const content = (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5 shrink-0">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t(item.labelKey)}
              </>
            );
            return item.to ? (
              <ButtonCustom
                key={item.labelKey}
                variant="raw"
                fullWidth
                onClick={() => navigate(item.to!)}
                className={`flex items-center gap-3 px-4 py-3.5 text-left text-sm ${
                  active ? "bg-ink font-bold text-white" : "font-medium text-ink/80 transition-colors hover:bg-paper-2 hover:text-gold-deep"
                }`}
              >
                {content}
              </ButtonCustom>
            ) : (
              <span
                key={item.labelKey}
                className={`flex items-center gap-3 px-4 py-3.5 text-sm ${
                  active ? "bg-ink font-bold text-white" : "font-medium text-ink/80"
                }`}
              >
                {content}
              </span>
            );
          })}
        </nav>
      </aside>
      <aside className="h-fit border border-line bg-white p-3 lg:sticky lg:top-6">
        <ButtonCustom
          variant="raw"
          fullWidth
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5 shrink-0">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("account.logout")}
        </ButtonCustom>
      </aside>
    </div>
  );
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: "bg-line/60 text-ink/70",
  shipping: "bg-gold/15 text-gold-deep",
  delivered: "bg-teal-light/40 text-teal",
  canceled: "bg-[#8B3A2B]/10 text-[#8B3A2B]",
};

const STATUS_LABEL_KEY: Record<OrderStatus, string> = {
  pending: "tracking.statusPending",
  shipping: "tracking.statusShipping",
  delivered: "tracking.statusDelivered",
  canceled: "tracking.statusCanceled",
};

const OrderCard = ({ order }: { order: Order }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const thumbs = order.items.slice(0, 3);
  const sellers = [...new Set(order.items.map((i) => i.seller))].join(", ");
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <button
      type="button"
      onClick={() => navigate(`/account/orders/${encodeURIComponent(order.code)}`)}
      className="block w-full border border-line bg-white text-left transition-colors hover:border-ink/50"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-paper-2/60 px-5 py-4 sm:px-6">
        <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
          {order.code}
        </TextCustom>
        <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mx-auto">
          {t("tracking.placedOn", { date: order.placedDate })}
        </TextCustom>
        <span className={`px-2.5 py-1 text-xs font-bold ${STATUS_BADGE[order.status]}`}>
          {t(STATUS_LABEL_KEY[order.status])}
        </span>
      </div>

      {/* Body */}
      <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
        <div className="flex -space-x-3">
          {thumbs.map((item, i) => (
            <span
              key={item.id}
              className={`block aspect-square w-14 border-2 border-white ${i > 0 ? "" : ""}`}
              style={{ backgroundColor: item.colorHex, zIndex: thumbs.length - i }}
            >
              <span className="placeholder-diagonal block h-full w-full opacity-40" />
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
            {t("tracking.itemsCount", { count: itemCount })}
          </TextCustom>
          <TextCustom as="p" variant="caption" className="mt-0.5 block">
            {sellers}
          </TextCustom>
        </div>
        <div className="shrink-0 text-right">
          <TextCustom variant="price-sm">{order.total.toLocaleString("vi-VN").replace(/,/g, ".")}đ</TextCustom>
          <TextCustom as="p" variant="caption" className="mt-0.5 block">
            {t("tracking.viewDetail")} ↓
          </TextCustom>
        </div>
      </div>
    </button>
  );
};

const MyOrdersPage = () => {
  const { t } = useTranslation();
  const history = useOrderStore((s) => s.history);
  const [tab, setTab] = useState<OrderStatus | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: history.length };
    for (const s of ["pending", "shipping", "delivered", "canceled"] as OrderStatus[]) {
      c[s] = history.filter((o) => o.status === s).length;
    }
    return c;
  }, [history]);

  const filtered = tab === "all" ? history : history.filter((o) => o.status === tab);

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink/50">
          <Link to="/" className="transition-colors hover:text-gold-deep">
            {t("listing.breadcrumbHome")}
          </Link>
          <span aria-hidden>/</span>
          <span>{t("account.profile")}</span>
          <span aria-hidden>/</span>
          <span className="font-semibold text-ink">{t("tracking.myOrders")}</span>
        </nav>

        <TextCustom variant="h1" className="mt-4">
          {t("tracking.myOrdersTitle")}
        </TextCustom>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <AccountSidebar activeLabelKey="tracking.myOrders" />

          <div className="min-w-0">
            {/* Status tabs */}
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUS_TABS.map(({ key, labelKey }) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 border-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? "border-gold bg-white text-ink"
                        : "border-line bg-paper-2/50 text-ink/60 hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {t(labelKey)}
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${
                        active ? "bg-gold text-white" : "bg-line text-ink/60"
                      }`}
                    >
                      {counts[key] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Orders */}
            <div className="mt-6 space-y-5">
              {filtered.length === 0 ? (
                <p className="border border-line bg-white py-16 text-center text-sm text-ink/60">
                  {t("tracking.empty")}
                </p>
              ) : (
                filtered.map((order) => <OrderCard key={order.code} order={order} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
