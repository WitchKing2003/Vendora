import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import {
  CATEGORY_DEFS,
  COLOR_SWATCHES,
  PRICE_BOUNDS,
  countBy,
  countStatus,
  getSellersWithCounts,
  type ListingProduct,
} from "../../../data/categoryData";
import type { FilterState } from "./filterTypes";

const getSubs = (slug: string) => CATEGORY_DEFS.find((c) => c.slug === slug)?.subs ?? [];

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  totalProducts: ListingProduct[];
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Stars = ({ value }: { value: number }) => (
  <span className="text-sm text-gold">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < value ? "★" : "☆"}</span>
    ))}
  </span>
);

const Section = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-5 first:pt-0">
      <ButtonCustom
        variant="raw"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left text-base font-bold text-ink"
      >
        {title}
        <ChevronIcon open={open} />
      </ButtonCustom>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ filters, onChange, totalProducts }: FilterSidebarProps) => {
  const { t } = useTranslation();
  const { category = "" } = useParams();
  const bounds = PRICE_BOUNDS[category] ?? { min: 0, max: 5_000_000 };
  const statusCounts = countStatus(category);

  const toggleArrayValue = <T,>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <aside>
      {/* Danh mục — links to sibling categories with counts */}
      <Section title={t("listing.filters.category")}>
        <Link
          to={`/category/${category}`}
          className={`flex items-center justify-between py-1.5 text-sm transition-colors hover:text-gold-deep ${
            !filters.subSlug ? "font-bold text-ink" : "text-ink/80"
          }`}
        >
          {t("listing.filters.allInCategory", {
            category: t(`category.${category}.label`),
          })}
          <span className="text-ink/40">{totalProducts.length.toLocaleString("vi-VN")}</span>
        </Link>

        {getSubs(category).map((sub) => (
          <Link
            key={sub.slug}
            to={`/category/${category}/${sub.slug}`}
            onClick={() => onChange({ ...filters, subSlug: sub.slug })}
            className={`flex items-center justify-between py-1.5 text-sm transition-colors hover:text-gold-deep ${
              filters.subSlug === sub.slug ? "font-bold text-ink" : "text-ink/80"
            }`}
          >
            {t(sub.labelKey)}
            <span className="text-ink/40">{countBy(category, "subSlug", sub.slug)}</span>
          </Link>
        ))}
      </Section>

      {/* Khoảng giá — dual range slider + two number boxes */}
      <Section title={t("listing.filters.priceRange")}>
        <div className="relative h-5">
          {/* Shared track with gold fill between the two thumbs */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-paper-2">
            <div
              className="absolute h-full rounded-full bg-gold"
              style={{
                left: `${((filters.price[0] - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                width: `${((filters.price[1] - filters.price[0]) / (bounds.max - bounds.min)) * 100}%`,
              }}
            />
          </div>
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={10_000}
            value={filters.price[0]}
            aria-label={t("listing.filters.priceFrom")}
            onChange={(e) =>
              onChange({
                ...filters,
                price: [Math.min(+e.target.value, filters.price[1] - 10_000), filters.price[1]],
              })
            }
            className="range-thumb pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={10_000}
            value={filters.price[1]}
            aria-label={t("listing.filters.priceTo")}
            onChange={(e) =>
              onChange({
                ...filters,
                price: [filters.price[0], Math.max(+e.target.value, filters.price[0] + 10_000)],
              })
            }
            className="range-thumb pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={filters.price[0].toLocaleString("vi-VN").replace(/,/g, ".") + "đ"}
            aria-label={t("listing.filters.priceFrom")}
            onChange={(e) => {
              const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
              if (!Number.isNaN(n))
                onChange({ ...filters, price: [Math.min(n, filters.price[1] - 10_000), filters.price[1]] });
            }}
            className="w-full border border-line bg-white px-3 py-2 text-center text-sm text-ink outline-none focus:border-gold"
          />
          <span className="text-ink/40">—</span>
          <input
            type="text"
            inputMode="numeric"
            value={filters.price[1].toLocaleString("vi-VN").replace(/,/g, ".") + "đ"}
            aria-label={t("listing.filters.priceTo")}
            onChange={(e) => {
              const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
              if (!Number.isNaN(n))
                onChange({ ...filters, price: [filters.price[0], Math.max(n, filters.price[0] + 10_000)] });
            }}
            className="w-full border border-line bg-white px-3 py-2 text-center text-sm text-ink outline-none focus:border-gold"
          />
        </div>
      </Section>

      {/* Người bán */}
      <Section title={t("listing.filters.sellers")}>
        <div className="space-y-2.5">
          {getSellersWithCounts(category)
            .slice(0, 6)
            .map((s) => (
              <label key={s.name} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={filters.sellers.includes(s.name)}
                  onChange={() =>
                    onChange({ ...filters, sellers: toggleArrayValue(filters.sellers, s.name) })
                  }
                  className="h-4 w-4 accent-gold"
                />
                <span className="flex-1">{s.name}</span>
                <span className="text-ink/40">{s.count}</span>
              </label>
            ))}
        </div>
      </Section>

      {/* Màu sắc */}
      <Section title={t("listing.filters.colors")}>
        <div className="flex flex-wrap gap-2.5">
          {COLOR_SWATCHES.map((c) => {
            const active = filters.colors.includes(c.hex);
            return (
              <ButtonCustom
                key={c.key}
                variant="raw"
                title={t(`listing.colors.${c.key}`)}
                ariaLabel={t(`listing.colors.${c.key}`)}
                aria-pressed={active}
                onClick={() =>
                  onChange({ ...filters, colors: toggleArrayValue(filters.colors, c.hex) })
                }
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                  active
                    ? "border-ink ring-2 ring-ink/30"
                    : "border-line hover:border-ink/40"
                }`}
                style={{ backgroundColor: c.hex }}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    c.hex === "#FFFFFF" ? "border border-line bg-white" : "bg-transparent"
                  }`}
                />
              </ButtonCustom>
            );
          })}
        </div>
      </Section>

      {/* Đánh giá */}
      <Section title={t("listing.filters.rating")}>
        <div className="space-y-2.5">
          {[5, 4, 3].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                checked={filters.minRating === r}
                onChange={() =>
                  onChange({ ...filters, minRating: filters.minRating === r ? null : r })
                }
                className="h-4 w-4 accent-gold"
              />
              <Stars value={r} />
              <span>{t("listing.filters.ratingUp")}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Tình trạng */}
      <Section title={t("listing.filters.status")}>
        <div className="space-y-2.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            <span className="flex-1">{t("listing.filters.inStock")}</span>
            <span className="text-ink/40">{statusCounts.inStock}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={(e) => onChange({ ...filters, onSaleOnly: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            <span className="flex-1">{t("listing.filters.onSale")}</span>
            <span className="text-ink/40">{statusCounts.onSale}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={filters.isNewOnly}
              onChange={(e) => onChange({ ...filters, isNewOnly: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            <span className="flex-1">{t("listing.filters.isNew")}</span>
            <span className="text-ink/40">{statusCounts.isNew}</span>
          </label>
        </div>
      </Section>

      <ButtonCustom
        variant="outline"
        fullWidth
        onClick={() =>
          onChange({
            subSlug: filters.subSlug,
            price: [bounds.min, bounds.max],
            sellers: [],
            colors: [],
            minRating: null,
            inStockOnly: false,
            onSaleOnly: false,
            isNewOnly: false,
          })
        }
        className="mt-6 bg-transparent py-3"
      >
        {t("listing.filters.clearAll")}
      </ButtonCustom>
    </aside>
  );
};

export default FilterSidebar;
