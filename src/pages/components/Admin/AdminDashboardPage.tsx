import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import { useAdminStore } from "../../../stores/adminStore";
import { useOrderStore } from "../../../stores/orderStore";
import { BarChart, DonutChart, Pill, StatCard, series, vnd, vndShort } from "./AdminUi";

const MONTHS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

const STATUS_TONE = {
  pending: "amber",
  shipping: "teal",
  delivered: "green",
  canceled: "red",
} as const;

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { products, users, applications, settings } = useAdminStore();
  const history = useOrderStore((s) => s.history);

  const stats = useMemo(() => {
    const revenue = history
      .filter((o) => o.status !== "canceled")
      .reduce((a, o) => a + o.total, 0);
    const customers = users.filter((u) => u.role === "customer").length;
    const unitsSold = history
      .filter((o) => o.status !== "canceled")
      .reduce((a, o) => a + o.items.reduce((b, it) => b + it.qty, 0), 0);
    const lowStock = products
      .filter((p) => p.stock <= settings.lowStockThreshold)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 6);
    const statusCount = history.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {});
    return { revenue, customers, unitsSold, lowStock, statusCount };
  }, [history, products, users, settings.lowStockThreshold]);

  // Revenue by category (order items mapped back to product categories).
  const categoryRevenue = useMemo(() => {
    const idToCat = new Map(products.map((p) => [p.id, p.category]));
    const map = new Map<string, { revenue: number; units: number; orders: number }>();
    history
      .filter((o) => o.status !== "canceled")
      .forEach((o) => {
        const seen = new Set<string>();
        o.items.forEach((it) => {
          const cat = idToCat.get(it.productId) ?? "other";
          const row = map.get(cat) ?? { revenue: 0, units: 0, orders: 0 };
          row.revenue += it.price * it.qty;
          row.units += it.qty;
          if (!seen.has(cat)) {
            row.orders += 1;
            seen.add(cat);
          }
          map.set(cat, row);
        });
      });
    return map;
  }, [history, products]);

  const topCategories = useMemo(() => {
    const nameOf = (slug: string) => useAdminStore.getState().categories.find((c) => c.slug === slug)?.name ?? slug;
    return [...categoryRevenue.entries()]
      .map(([slug, v]) => ({ slug, name: nameOf(slug), ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [categoryRevenue]);

  const revenueSeries = useMemo(() => series(7, 12, 180, 220), []);
  const orderSeries = useMemo(() => series(3, 12, 40, 60), []);
  const userSeries = useMemo(() => series(11, 12, 20, 40), []);

  const donut = useMemo(() => {
    const palette = ["#C68A2E", "#2C4A43", "#9DB8B2", "#9C6B1F", "#D9D0BC", "#1A1B1E"];
    return [...categoryRevenue.entries()]
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 6)
      .map(([slug, v], i) => ({
        label: useAdminStore.getState().categories.find((c) => c.slug === slug)?.name ?? slug,
        value: v.revenue,
        color: palette[i % palette.length],
      }));
  }, [categoryRevenue]);

  const recent = useMemo(() => {
    const orderRows = history.slice(0, 5).map((o) => ({
      key: `o-${o.code}`,
      at: o.placedAt,
      kind: "order" as const,
      titleKey: "admin.dashboard.actNewOrder",
      detail: o.code,
      status: o.status,
      total: o.total,
    }));
    const appRows = applications
      .filter((a) => a.status === "pending")
      .slice(0, 2)
      .map((a) => ({
        key: `a-${a.id}`,
        at: "",
        kind: "application" as const,
        titleKey: "admin.dashboard.actApplication",
        detail: a.shopName,
        status: "",
        total: 0,
      }));
    return [...orderRows, ...appRows];
  }, [history, applications]);

  const statusRows = (["pending", "shipping", "delivered", "canceled"] as const).map((k) => ({
    key: k,
    label: t(`tracking.status.${k}`),
    count: stats.statusCount[k] ?? 0,
    tone: STATUS_TONE[k],
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.dashboard.title")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.dashboard.subtitle")}
          </TextCustom>
        </div>
        <Link to="/admin/analytics">
          <ButtonCustom variant="outline">{t("admin.dashboard.fullAnalytics")} →</ButtonCustom>
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("admin.dashboard.revenue")}
          value={vnd(stats.revenue)}
          delta={`12,4% ${t("admin.dashboard.vsLastMonth")}`}
          spark={revenueSeries}
          icon="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        />
        <StatCard
          label={t("admin.dashboard.orders")}
          value={String(history.length)}
          delta={`8,1% ${t("admin.dashboard.vsLastMonth")}`}
          spark={orderSeries}
          icon="M6 2l1.5 3h9L18 2M3 6h18l-1.5 14H4.5L3 6z"
        />
        <StatCard
          label={t("admin.dashboard.products")}
          value={String(products.length)}
          delta={`${stats.unitsSold} ${t("admin.dashboard.unitsSold")}`}
          deltaUp
          spark={userSeries}
          icon="M20 7l-8-4-8 4v10l8 4 8-4V7zM4 7l8 4 8-4M12 21V11"
        />
        <StatCard
          label={t("admin.dashboard.customers")}
          value={String(stats.customers)}
          delta={`+3 ${t("admin.dashboard.newThisWeek")}`}
          spark={userSeries}
          icon="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        />
      </div>

      {/* Sales overview + order status */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="border border-line bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <TextCustom variant="h4">{t("admin.dashboard.salesOverview")}</TextCustom>
              <TextCustom as="p" variant="caption" className="mt-1">
                {t("admin.dashboard.last12Months")}
              </TextCustom>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 bg-gold/25" />
                <TextCustom as="span" variant="caption">
                  {t("admin.dashboard.revenue")}
                </TextCustom>
              </span>
            </div>
          </div>
          <div className="mt-6">
            <BarChart
              data={MONTHS.map((m, i) => ({ label: m, value: revenueSeries[i] * 1_000_000 }))}
              format={(v) => vndShort(v)}
              height={200}
            />
          </div>
        </section>

        <section className="border border-line bg-white p-6">
          <TextCustom variant="h4">{t("admin.dashboard.orderStatus")}</TextCustom>
          <ul className="mt-5 space-y-4">
            {statusRows.map((r) => {
              const total = history.length || 1;
              const pct = Math.round((r.count / total) * 100);
              return (
                <li key={r.key}>
                  <div className="flex items-center justify-between gap-3">
                    <Pill tone={r.tone}>{r.label}</Pill>
                    <TextCustom as="span" variant="body-sm" className="font-bold text-ink">
                      {r.count}
                    </TextCustom>
                  </div>
                  <div className="mt-2 h-2 w-full bg-paper-2">
                    <div
                      className="h-full bg-gold"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 border-t border-line pt-5">
            <TextCustom variant="h4" className="!text-base">
              {t("admin.dashboard.revenueShare")}
            </TextCustom>
            <div className="mt-4">
              {donut.length > 0 ? <DonutChart slices={donut} /> : <TextCustom variant="body-sm">{t("admin.noResults")}</TextCustom>}
            </div>
          </div>
        </section>
      </div>

      {/* Top categories, low stock, activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="border border-line bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <TextCustom variant="h4">{t("admin.dashboard.topCategories")}</TextCustom>
            <Link to="/admin/analytics" className="text-xs font-bold text-gold-deep hover:underline">
              {t("admin.dashboard.viewAll")}
            </Link>
          </div>
          <ul className="mt-5 space-y-4">
            {topCategories.map((c) => (
              <li key={c.slug} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-paper-2 text-xs font-bold text-ink/60">
                  {c.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <TextCustom as="p" variant="body-sm" className="truncate font-bold text-ink">
                    {c.name}
                  </TextCustom>
                  <TextCustom as="p" variant="caption">
                    {c.units} {t("admin.dashboard.unitsSold")} · {c.orders} {t("admin.dashboard.ordersLower")}
                  </TextCustom>
                </div>
                <TextCustom as="span" variant="body-sm" className="font-bold text-gold-deep">
                  {vndShort(c.revenue)}đ
                </TextCustom>
              </li>
            ))}
            {topCategories.length === 0 && <TextCustom variant="body-sm">{t("admin.noResults")}</TextCustom>}
          </ul>
        </section>

        <section className="border border-line bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <TextCustom variant="h4">{t("admin.dashboard.lowStock")}</TextCustom>
            <Link to="/admin/products" className="text-xs font-bold text-gold-deep hover:underline">
              {t("admin.dashboard.viewAll")}
            </Link>
          </div>
          <ul className="mt-5 space-y-3">
            {stats.lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 border-b border-line/60 pb-3 last:border-0">
                <div className="min-w-0">
                  <TextCustom as="p" variant="body-sm" className="truncate font-semibold text-ink">
                    {p.name}
                  </TextCustom>
                  <TextCustom as="p" variant="caption">
                    {p.seller}
                  </TextCustom>
                </div>
                <Pill tone={p.stock === 0 ? "red" : "amber"}>
                  {p.stock} {t("admin.dashboard.left")}
                </Pill>
              </li>
            ))}
            {stats.lowStock.length === 0 && (
              <TextCustom as="p" variant="body-sm" color="!text-ink/50">
                {t("admin.dashboard.noLowStock")}
              </TextCustom>
            )}
          </ul>
        </section>

        <section className="border border-line bg-white p-6">
          <TextCustom variant="h4">{t("admin.dashboard.recentActivity")}</TextCustom>
          <ul className="mt-5 space-y-4">
            {recent.map((r) => (
              <li key={r.key} className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    r.kind === "order" ? "bg-gold" : "bg-teal-light"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <TextCustom as="p" variant="body-sm" className="text-ink">
                    {t(r.titleKey)}{" "}
                    <strong className="font-bold">{r.detail}</strong>
                  </TextCustom>
                  <div className="mt-1 flex items-center gap-2">
                    {r.kind === "order" && r.status && (
                      <Pill tone={STATUS_TONE[r.status as keyof typeof STATUS_TONE]}>{t(`tracking.status.${r.status}`)}</Pill>
                    )}
                    {r.total > 0 && (
                      <TextCustom as="span" variant="caption" className="font-bold !text-gold-deep">
                        {vnd(r.total)}
                      </TextCustom>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {recent.length === 0 && <TextCustom variant="body-sm">{t("admin.noResults")}</TextCustom>}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
