import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import TextCustom from "../../../components/TextComponent/TextCustom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import { useAdminStore } from "../../../stores/adminStore";
import { useOrderStore } from "../../../stores/orderStore";
import { BarChart, DonutChart, Pill, StatCard, series, vnd, vndShort } from "./AdminUi";

type Range = "day" | "week" | "month" | "year";

const RANGES: Range[] = ["day", "week", "month", "year"];
const RANGE_MULT: Record<Range, number> = { day: 0.03, week: 0.22, month: 1, year: 11.6 };
const PALETTE = ["#C68A2E", "#2C4A43", "#9DB8B2", "#9C6B1F", "#D9D0BC", "#1A1B1E", "#74301f", "#4a6b5c"];

const AdminAnalyticsPage = () => {
  const { t } = useTranslation();
  const { products, categories } = useAdminStore();
  const history = useOrderStore((s) => s.history);
  const [range, setRange] = useState<Range>("month");

  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
  const mult = RANGE_MULT[range];

  const rows = useMemo(() => {
    const idToCat = new Map(products.map((p) => [p.id, p.category]));
    const map = new Map<string, { revenue: number; units: number; orders: number }>();
    history
      .filter((o) => o.status !== "canceled")
      .forEach((o) => {
        const seen = new Set<string>();
        o.items.forEach((it) => {
          const cat = idToCat.get(it.productId) ?? "other";
          const row = map.get(cat) ?? { revenue: 0, units: 0, orders: 0 };
          row.revenue += it.price * it.qty * mult;
          row.units += Math.round(it.qty * mult);
          if (!seen.has(cat)) {
            row.orders += 1;
            seen.add(cat);
          }
          map.set(cat, row);
        });
      });
    const totalRev = [...map.values()].reduce((a, r) => a + r.revenue, 0) || 1;
    return [...map.entries()]
      .map(([slug, v], i) => ({ slug, name: catName(slug), ...v, share: (v.revenue / totalRev) * 100, color: PALETTE[i % PALETTE.length] }))
      .sort((a, b) => b.revenue - a.revenue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, products, categories, mult]);

  const totals = useMemo(
    () => ({
      revenue: rows.reduce((a, r) => a + r.revenue, 0),
      units: rows.reduce((a, r) => a + r.units, 0),
      orders: Math.round(history.filter((o) => o.status !== "canceled").length * mult),
    }),
    [rows, history, mult]
  );

  const trend = useMemo(() => series(range.length + 5, 12, 120 * mult, 180 * mult), [range, mult]);
  const trendLabels = useMemo(() => {
    if (range === "year") return Array.from({ length: 12 }, (_, i) => `${2020 + i}`);
    if (range === "day") return Array.from({ length: 12 }, (_, i) => `${i + 8}h`);
    return Array.from({ length: 12 }, (_, i) => `T${i + 1}`);
  }, [range]);

  const maxShare = Math.max(...rows.map((r) => r.share), 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.analytics.title")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.analytics.subtitle")}
          </TextCustom>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {RANGES.map((r) => (
            <ButtonCustom
              key={r}
              variant="raw"
              onClick={() => setRange(r)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                range === r ? "bg-ink text-white" : "border border-line bg-white text-ink hover:border-ink"
              }`}
            >
              {t(`admin.analytics.range.${r}`)}
            </ButtonCustom>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t("admin.dashboard.revenue")} value={`${vndShort(totals.revenue)}đ`} delta={`11,2% ${t("admin.dashboard.vsLastMonth")}`} />
        <StatCard label={t("admin.dashboard.orders")} value={String(totals.orders)} delta={`6,4% ${t("admin.dashboard.vsLastMonth")}`} />
        <StatCard label={t("admin.dashboard.unitsSold")} value={String(totals.units)} delta={`9,8% ${t("admin.dashboard.vsLastMonth")}`} />
      </div>

      <section className="border border-line bg-white p-6">
        <TextCustom variant="h4">{t("admin.analytics.trend")}</TextCustom>
        <TextCustom as="p" variant="caption" className="mt-1">
          {t(`admin.analytics.trendDesc.${range}`)}
        </TextCustom>
        <div className="mt-6">
          <BarChart
            data={trendLabels.map((label, i) => ({ label, value: trend[i] * 1_000_000 }))}
            format={(v) => vndShort(v)}
            height={190}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden border border-line bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-5">
            <TextCustom variant="h4">{t("admin.analytics.byCategory")}</TextCustom>
            <TextCustom as="span" variant="caption">
              {t("admin.analytics.categoriesCount", { count: rows.length })}
            </TextCustom>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper-2/60 text-xs uppercase tracking-wide text-ink/60">
                  <th className="px-6 py-3.5 font-bold">{t("admin.analytics.colCategory")}</th>
                  <th className="px-4 py-3.5 font-bold">{t("admin.analytics.colSold")}</th>
                  <th className="px-4 py-3.5 font-bold">{t("admin.dashboard.orders")}</th>
                  <th className="px-4 py-3.5 font-bold">{t("admin.dashboard.revenue")}</th>
                  <th className="px-6 py-3.5 font-bold">{t("admin.analytics.colShare")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.slug} className="transition-colors hover:bg-paper-2/40">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 shrink-0" style={{ background: r.color }} />
                        <TextCustom as="span" variant="body-sm" className="font-bold text-ink">
                          {r.name}
                        </TextCustom>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <TextCustom as="span" variant="body-sm" className="text-ink/70">
                        {r.units}
                      </TextCustom>
                    </td>
                    <td className="px-4 py-3.5">
                      <TextCustom as="span" variant="body-sm" className="text-ink/70">
                        {r.orders}
                      </TextCustom>
                    </td>
                    <td className="px-4 py-3.5">
                      <TextCustom as="span" variant="body-sm" className="font-bold text-gold-deep">
                        {vnd(r.revenue)}
                      </TextCustom>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 bg-paper-2">
                          <div className="h-full bg-teal" style={{ width: `${(r.share / maxShare) * 100}%` }} />
                        </div>
                        <TextCustom as="span" variant="caption" className="font-bold !text-ink">
                          {r.share.toFixed(1)}%
                        </TextCustom>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <div className="p-10 text-center">
                <TextCustom variant="body" color="!text-ink/50">
                  {t("admin.noResults")}
                </TextCustom>
              </div>
            )}
          </div>
        </section>

        <section className="border border-line bg-white p-6">
          <TextCustom variant="h4">{t("admin.analytics.revenueShare")}</TextCustom>
          <div className="mt-5">
            <DonutChart slices={rows.slice(0, 6).map((r) => ({ label: r.name, value: r.revenue, color: r.color }))} />
          </div>
          <div className="mt-6 border-t border-line pt-5">
            <TextCustom variant="h4" className="!text-base">
              {t("admin.analytics.bestSeller")}
            </TextCustom>
            {rows[0] && (
              <div className="mt-3 flex items-center justify-between gap-3">
                <TextCustom as="span" variant="body-sm" className="font-bold text-ink">
                  {rows[0].name}
                </TextCustom>
                <Pill tone="gold">
                  {vndShort(rows[0].revenue)}đ · {rows[0].units} {t("admin.dashboard.unitsSold")}
                </Pill>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
