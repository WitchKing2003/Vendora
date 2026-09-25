import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import {
  PRICE_BOUNDS,
  PRODUCTS_BY_CATEGORY,
  getCategory,
  type ListingProduct,
} from "../../../data/categoryData";
import { formatVnd } from "../../../utils/format";
import FilterSidebar from "./FilterSidebar";
import ListingCard from "./ListingCard";
import Pagination from "./Pagination";
import {
  applyFilters,
  makeDefaultFilters,
  sortProducts,
  type FilterState,
  type SortKey,
} from "./filterTypes";

const PER_PAGE_GRID = 24;

const SORTS: { key: SortKey; labelKey: string }[] = [
  { key: "relevant", labelKey: "listing.sort.relevant" },
  { key: "newest", labelKey: "listing.sort.newest" },
  { key: "priceAsc", labelKey: "listing.sort.priceAsc" },
  { key: "priceDesc", labelKey: "listing.sort.priceDesc" },
];

const COLOR_LABEL_KEYS: Record<string, string> = {
  "#1A1B1E": "listing.colors.black",
  "#FFFFFF": "listing.colors.white",
  "#8B3A2B": "listing.colors.red",
  "#2C4A43": "listing.colors.green",
  "#C68A2E": "listing.colors.gold",
  "#5B4636": "listing.colors.brown",
  "#3E5C76": "listing.colors.blue",
};

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
);

const CategoryPage = () => {
  const { t } = useTranslation();
  const { category, sub } = useParams();
  const cat = getCategory(category);

  const [sort, setSort] = useState<SortKey>("relevant");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(() =>
    makeDefaultFilters(
      PRICE_BOUNDS[category ?? ""]?.min ?? 0,
      PRICE_BOUNDS[category ?? ""]?.max ?? 5_000_000,
      sub ?? null
    )
  );

  // Reset state when navigating between categories/subcategories
  useEffect(() => {
    const bounds = PRICE_BOUNDS[category ?? ""] ?? { min: 0, max: 5_000_000 };
    setFilters(makeDefaultFilters(bounds.min, bounds.max, sub ?? null));
    setPage(1);
    setSort("relevant");
  }, [category, sub]);

  const all: ListingProduct[] = PRODUCTS_BY_CATEGORY[category ?? ""] ?? [];

  const filtered = useMemo(() => applyFilters(all, filters), [all, filters]);
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE_GRID));
  const pageSafe = Math.min(page, totalPages);
  const paged = sorted.slice((pageSafe - 1) * PER_PAGE_GRID, pageSafe * PER_PAGE_GRID);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageSafe]);

  if (!cat) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-10">
        <TextCustom variant="h2">{t("listing.notFound")}</TextCustom>
        <Link to="/" className="mt-4 inline-block text-sm text-gold-deep underline underline-offset-4">
          {t("listing.backHome")}
        </Link>
      </div>
    );
  }

  // Unique sellers of the filtered result set (for chips)
  const sellerChipNames = filters.sellers;

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.subSlug) {
    const subDef = cat.subs.find((s) => s.slug === filters.subSlug);
    chips.push({
      key: "sub",
      label: subDef ? t(subDef.labelKey) : filters.subSlug,
      onRemove: () => {
        setFilters((f) => ({ ...f, subSlug: null }));
        setPage(1);
      },
    });
  }
  chips.push({
    key: "price",
    label: `${formatVnd(filters.price[0])} – ${formatVnd(filters.price[1])}`,
    onRemove: () => {
      const bounds = PRICE_BOUNDS[category ?? ""] ?? { min: 0, max: 5_000_000 };
      setFilters((f) => ({ ...f, price: [bounds.min, bounds.max] }));
      setPage(1);
    },
  });
  sellerChipNames.forEach((s) =>
    chips.push({
      key: `seller-${s}`,
      label: s,
      onRemove: () => {
        setFilters((f) => ({ ...f, sellers: f.sellers.filter((v) => v !== s) }));
        setPage(1);
      },
    })
  );
  filters.colors.forEach((c) =>
    chips.push({
      key: `color-${c}`,
      label: t(COLOR_LABEL_KEYS[c] ?? "listing.colors.black"),
      onRemove: () => {
        setFilters((f) => ({ ...f, colors: f.colors.filter((v) => v !== c) }));
        setPage(1);
      },
    })
  );
  if (filters.minRating !== null)
    chips.push({
      key: "rating",
      label: "★".repeat(filters.minRating) + " " + t("listing.filters.ratingUp"),
      onRemove: () => {
        setFilters((f) => ({ ...f, minRating: null }));
        setPage(1);
      },
    });
  if (filters.inStockOnly)
    chips.push({
      key: "stock",
      label: t("listing.filters.inStock"),
      onRemove: () => {
        setFilters((f) => ({ ...f, inStockOnly: false }));
        setPage(1);
      },
    });
  if (filters.onSaleOnly)
    chips.push({
      key: "sale",
      label: t("listing.filters.onSale"),
      onRemove: () => {
        setFilters((f) => ({ ...f, onSaleOnly: false }));
        setPage(1);
      },
    });
  if (filters.isNewOnly)
    chips.push({
      key: "new",
      label: t("listing.filters.isNew"),
      onRemove: () => {
        setFilters((f) => ({ ...f, isNewOnly: false }));
        setPage(1);
      },
    });

  const clearAll = () => {
    const bounds = PRICE_BOUNDS[category ?? ""] ?? { min: 0, max: 5_000_000 };
    setFilters(makeDefaultFilters(bounds.min, bounds.max, filters.subSlug));
    setPage(1);
  };

  const uniqueSellerCount = new Set(all.map((p) => p.seller)).size;

  const sidebar = (
    <FilterSidebar
      filters={filters}
      onChange={(next) => {
        setFilters(next);
        setPage(1);
      }}
      totalProducts={all}
    />
  );

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink/50">
          <Link to="/" className="transition-colors hover:text-gold-deep">
            {t("listing.breadcrumbHome")}
          </Link>
          <span aria-hidden>/</span>
          <Link to={`/category/${category}`} className="transition-colors hover:text-gold-deep">
            {t(cat.labelKey)}
          </Link>
          {filters.subSlug && (
            <>
              <span aria-hidden>/</span>
              <span className="font-semibold text-ink">
                {t(cat.subs.find((s) => s.slug === filters.subSlug)?.labelKey ?? "")}
              </span>
            </>
          )}
        </nav>

        {/* Title */}
        <TextCustom variant="h1" className="mt-4">
          {filters.subSlug
            ? t(cat.subs.find((s) => s.slug === filters.subSlug)?.labelKey ?? cat.labelKey)
            : t(cat.labelKey)}
        </TextCustom>
        <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-3">
          <strong className="font-bold text-ink">{sorted.length.toLocaleString("vi-VN")}</strong>{" "}
          {t("listing.resultCount", { sellers: uniqueSellerCount })}
        </TextCustom>

        <hr className="mt-6 border-line" />

        <div className="mt-8 flex gap-10">
          {/* Sidebar — hidden on mobile, opened via "Bộ lọc" button */}
          <aside className="hidden w-64 shrink-0 lg:block">{sidebar}</aside>

          {/* Main column */}
          <div className="min-w-0 flex-1">
            {/* Chips + Xoá hết */}
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <ButtonCustom
                  key={chip.key}
                  variant="raw"
                  onClick={chip.onRemove}
                  className="flex items-center gap-1.5 border border-ink bg-white px-3 py-1.5 text-sm font-normal text-ink transition-colors hover:bg-paper-2"
                >
                  {chip.label}
                  <XIcon />
                </ButtonCustom>
              ))}
              {chips.length > 1 && (
                <ButtonCustom
                  variant="raw"
                  onClick={clearAll}
                  className="px-1 text-sm font-semibold text-gold-deep underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {t("listing.clearAll")}
                </ButtonCustom>
              )}
            </div>

            {/* Toolbar: result range, sort, view toggle */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <TextCustom as="p" variant="body-sm" color="!text-ink/70">
                {t("listing.showing", {
                  from: (pageSafe - 1) * PER_PAGE_GRID + 1,
                  to: Math.min(pageSafe * PER_PAGE_GRID, sorted.length),
                  total: sorted.length.toLocaleString("vi-VN"),
                })}
              </TextCustom>

              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortKey);
                    setPage(1);
                  }}
                  aria-label={t("listing.sortLabel")}
                  className="border border-ink bg-white px-4 py-2.5 text-sm text-ink outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {t(s.labelKey)}
                    </option>
                  ))}
                </select>

                <div className="hidden border border-ink sm:flex">
                  <ButtonCustom
                    variant="raw"
                    aria-pressed={view === "grid"}
                    ariaLabel={t("listing.viewGrid")}
                    onClick={() => setView("grid")}
                    className={`flex h-10 w-12 items-center justify-center ${
                      view === "grid" ? "bg-ink text-white" : "bg-white text-ink hover:bg-paper-2"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
                    </svg>
                  </ButtonCustom>
                  <ButtonCustom
                    variant="raw"
                    aria-pressed={view === "list"}
                    ariaLabel={t("listing.viewList")}
                    onClick={() => setView("list")}
                    className={`flex h-10 w-12 items-center justify-center ${
                      view === "list" ? "bg-ink text-white" : "bg-white text-ink hover:bg-paper-2"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                    </svg>
                  </ButtonCustom>
                </div>

                {/* Mobile filter toggle */}
                <ButtonCustom
                  variant="outline"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden"
                >
                  {t("listing.openFilters")}
                </ButtonCustom>
              </div>
            </div>

            {/* Product grid / list */}
            {paged.length === 0 ? (
              <p className="py-24 text-center text-sm text-ink/60">{t("listing.empty")}</p>
            ) : view === "grid" ? (
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 xl:grid-cols-4">
                {paged.map((p) => (
                  <ListingCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-4">
                {paged.map((p) => (
                  <ListingCard key={p.id} product={p} variant="list" />
                ))}
              </div>
            )}

            <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <ButtonCustom
            variant="raw"
            ariaLabel={t("listing.closeFilters")}
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <TextCustom variant="label" className="text-base">
                {t("listing.filtersTitle")}
              </TextCustom>
              <ButtonCustom
                variant="raw"
                ariaLabel={t("listing.closeFilters")}
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-9 w-9 items-center justify-center border border-line text-ink"
              >
                <XIcon />
              </ButtonCustom>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2">{sidebar}</div>
            <div className="border-t border-line p-4">
              <ButtonCustom
                variant="primary"
                fullWidth
                onClick={() => setMobileFiltersOpen(false)}
                className="py-3"
              >
                {t("listing.showResults", { count: sorted.length.toLocaleString("vi-VN") })}
              </ButtonCustom>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
