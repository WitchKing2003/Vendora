import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import ButtonCustom from '../../../components/ButtonComponent/ButtonCustom';
import Icon from '../../../components/brand/Icon';
import { Kicker } from '../../../components/brand/Stitch';
import { EmptyState } from '../../../components/feedback/States';
import ProductCard from '../../../components/product/ProductCard';
import Pagination from '../Listing/Pagination';
import { sortProducts, type SortKey } from '../Listing/filterTypes';
import {
  ALL_PRODUCTS,
  NEW_ARRIVALS,
  ON_SALE,
  searchProducts,
} from '../../../data/catalogue';
import type { ListingProduct } from '../../../data/categoryData';
import { useSearchStore } from '../../../stores/searchStore';

export type DiscoverMode = 'all' | 'new' | 'sale' | 'search';

const PER_PAGE = 24;

const SORTS: { key: SortKey; labelKey: string }[] = [
  { key: 'relevant', labelKey: 'listing.sort.relevant' },
  { key: 'newest', labelKey: 'listing.sort.newest' },
  { key: 'priceAsc', labelKey: 'listing.sort.priceAsc' },
  { key: 'priceDesc', labelKey: 'listing.sort.priceDesc' },
];

const TITLE_KEY: Record<Exclude<DiscoverMode, 'search'>, { kicker: string; title: string; desc: string }> = {
  all: { kicker: 'discover.all.kicker', title: 'discover.all.title', desc: 'discover.all.desc' },
  new: { kicker: 'discover.new.kicker', title: 'discover.new.title', desc: 'discover.new.desc' },
  sale: { kicker: 'discover.sale.kicker', title: 'discover.sale.title', desc: 'discover.sale.desc' },
};

/**
 * One page, four collections.
 *
 * "Shop", "New arrivals", "Sale" and search results are the same experience —
 * a branded grid, a predictable sort, clear counts and a human empty state —
 * so browsing feels identical wherever the shopper arrived from.
 */
const DiscoverPage = ({ mode }: { mode: DiscoverMode }) => {
  const [params] = useSearchParams();
  const query = (params.get('q') ?? '').trim();
  const pushRecent = useSearchStore((s) => s.push);

  // Remembering a search is personalisation the shopper asked for.
  useEffect(() => {
    if (mode === 'search' && query) pushRecent(query);
  }, [mode, query, pushRecent]);

  // Re-keying the view on mode/query is what resets paging and sorting —
  // no synchronising effects, and a fresh page for every new search.
  return <DiscoverView key={`${mode}:${query}`} mode={mode} query={query} />;
};

const DiscoverView = ({ mode, query }: { mode: DiscoverMode; query: string }) => {
  const { t } = useTranslation();
  const [sort, setSort] = useState<SortKey>(mode === 'sale' ? 'priceAsc' : 'relevant');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  const products: ListingProduct[] = useMemo(() => {
    if (mode === 'new') return NEW_ARRIVALS;
    if (mode === 'sale') return ON_SALE;
    if (mode === 'search') return query ? searchProducts(query, 240).map((h) => h.product) : [];
    return ALL_PRODUCTS;
  }, [mode, query]);

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const pageSafe = Math.min(page, totalPages);
  const paged = sorted.slice((pageSafe - 1) * PER_PAGE, pageSafe * PER_PAGE);

  const copy =
    mode === 'search'
      ? {
          kicker: t('discover.search.kicker', 'Kết quả tìm kiếm'),
          title: query
            ? t('discover.search.title', { q: query, defaultValue: 'Kết quả cho “{{q}}”' })
            : t('discover.search.emptyTitle', 'Bạn muốn tìm gì?'),
          desc: query
            ? t('discover.search.desc', {
                count: sorted.length,
                defaultValue: 'Tìm thấy {{count}} sản phẩm từ các gian hàng độc lập.',
              })
            : t(
                'discover.search.emptyDesc',
                'Nhập từ khoá ở thanh tìm kiếm, hoặc bắt đầu từ một trong các tìm kiếm phổ biến bên dưới.'
              ),
        }
      : {
          kicker: t(TITLE_KEY[mode].kicker),
          title: t(TITLE_KEY[mode].title),
          desc: t(TITLE_KEY[mode].desc, { count: sorted.length }),
        };

  const sortControl = (
    <div className="flex flex-wrap items-center gap-2.5">
      <label className="flex items-center gap-2 border border-line bg-surface px-3 py-2">
        <Icon name="sort" className="h-4 w-4 shrink-0 text-ink/50" />
        <span className="sr-only">{t('listing.sortLabel', 'Sắp xếp theo')}</span>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortKey);
            setPage(1);
          }}
          className="bg-transparent font-body text-sm text-ink outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {t(s.labelKey)}
            </option>
          ))}
        </select>
      </label>

      <div className="flex border border-line bg-surface">
        {(
          [
            { key: 'grid', icon: 'grid', label: t('listing.viewGrid', 'Dạng lưới') },
            { key: 'list', icon: 'list', label: t('listing.viewList', 'Dạng danh sách') },
          ] as const
        ).map((v) => (
          <ButtonCustom
            key={v.key}
            variant="raw"
            ariaLabel={v.label}
            aria-pressed={view === v.key}
            onClick={() => setView(v.key)}
            className={`flex h-9 w-10 items-center justify-center transition-colors ${
              view === v.key ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink'
            }`}
          >
            <Icon name={v.icon} className="h-4 w-4" />
          </ButtonCustom>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body text-xs text-ink/50">
          <Link to="/" className="transition-colors hover:text-gold-deep">
            {t('listing.breadcrumbHome', 'Trang chủ')}
          </Link>
          <span aria-hidden className="h-1 w-1 rotate-45 bg-gold/60" />
          <span className="text-ink/70">{copy.title}</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="max-w-2xl">
            <Kicker>{copy.kicker}</Kicker>
            <h1 className="mt-3 font-display text-3xl leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.75rem]">
              {copy.title}
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink/60">{copy.desc}</p>
          </div>
          {mode === 'search' && !query ? null : sortControl}
        </div>

        <div className="stitch-rule my-7" />

        {paged.length === 0 ? (
          <div className="border border-line bg-surface">
            <EmptyState
              icon="search"
              title={
                mode === 'search'
                  ? t('discover.noResults', { q: query, defaultValue: 'Chưa có gian hàng nào cho “{{q}}”' })
                  : t('listing.empty', 'Không có sản phẩm phù hợp.')
              }
              message={t(
                'discover.noResultsHint',
                'Thử một từ khoá ngắn hơn, hoặc duyệt theo danh mục xem sao.'
              )}
              action={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/categories"
                    className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-teal"
                  >
                    <Icon name="weave" className="h-4 w-4" />
                    {t('nav.allCategories', 'Toàn bộ danh mục')}
                  </Link>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 border border-ink px-5 py-2.5 font-body text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
                  >
                    {t('discover.browseAll', 'Xem toàn bộ sản phẩm')}
                  </Link>
                </div>
              }
            />
          </div>
        ) : (
          <>
            {view === 'grid' ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
                {paged.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      seller: p.seller,
                      price: p.price,
                      oldPrice: p.oldPrice,
                      color: p.color,
                      colorHex: p.colorHex,
                      rating: p.rating,
                      reviews: p.reviews,
                      badge: p.badge,
                      subSlug: p.subSlug,
                      inStock: p.inStock,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {paged.map((p) => (
                  <ProductCard
                    key={p.id}
                    layout="list"
                    product={{
                      id: p.id,
                      name: p.name,
                      seller: p.seller,
                      price: p.price,
                      oldPrice: p.oldPrice,
                      color: p.color,
                      colorHex: p.colorHex,
                      rating: p.rating,
                      reviews: p.reviews,
                      badge: p.badge,
                      subSlug: p.subSlug,
                      inStock: p.inStock,
                    }}
                  />
                ))}
              </div>
            )}

            <p className="mt-8 text-center font-body text-xs text-ink/50">
              {t('listing.showing', {
                from: (pageSafe - 1) * PER_PAGE + 1,
                to: Math.min(pageSafe * PER_PAGE, sorted.length),
                total: sorted.length,
                defaultValue: 'Hiển thị {{from}}–{{to}} / {{total}}',
              })}
            </p>

            <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
