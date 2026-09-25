import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ButtonCustom from '../../../../components/ButtonComponent/ButtonCustom';
import Icon from '../../../../components/brand/Icon';
import { Kicker, Seal } from '../../../../components/brand/Stitch';
import { CATEGORY_DEFS, PRODUCTS_BY_CATEGORY } from '../../../../data/categoryData';
import { CATEGORY_ICON } from '../../../../data/categoryMeta';
import { formatVnd } from '../../../../utils/format';
import { swatchLabel } from '../../../../types/product';

interface NavItem {
  key: string;
  to: string;
  /** Paths that should light this item up. */
  owns: (pathname: string) => boolean;
}

/** The gold stitch that marks the section you are currently in. */
const Indicator = ({ active }: { active: boolean }) => (
  <span
    aria-hidden
    className={`absolute inset-x-2.5 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-300 ease-[var(--ease-brand)] ${
      active ? 'scale-x-100' : 'scale-x-0'
    }`}
  />
);

const PRIMARY: NavItem[] = [
  { key: 'nav.home', to: '/', owns: (p) => p === '/' },
  { key: 'nav.shop', to: '/shop', owns: (p) => p === '/shop' || p.startsWith('/product') },
  { key: 'nav.new', to: '/new', owns: (p) => p === '/new' },
  { key: 'nav.sale', to: '/sale', owns: (p) => p === '/sale' },
];

/**
 * The desktop navigation.
 *
 * A single stitched row, plus the mega menu. The shopper always knows where
 * they are (an active gold stitch under the current section) and the way back
 * is always the same distance away. The mega menu does more than list links:
 * it shows a real product from the section being browsed, so "Categories"
 * itself becomes a place to discover.
 */
const MainNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [megaOpen, setMegaOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(CATEGORY_DEFS[0].slug);

  // Any navigation closes the menu — the shopper has already chosen.
  // (Adjusted during render, the documented way to react to a changed input.)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMegaOpen(false);
  }

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMegaOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [megaOpen]);

  const activeDef = CATEGORY_DEFS.find((c) => c.slug === activeSlug) ?? CATEGORY_DEFS[0];
  const featured = (PRODUCTS_BY_CATEGORY[activeDef.slug] ?? [])[0];
  const categoriesActive = pathname.startsWith('/category') || pathname === '/categories';

  const itemClass = (active: boolean) =>
    `relative inline-flex items-center gap-1.5 px-3.5 py-2.5 font-body text-[13px] tracking-wide transition-colors ${
      active ? 'font-semibold text-ink' : 'font-medium text-ink/70 hover:text-ink'
    }`;

  return (
    <nav
      aria-label={t('nav.main', 'Điều hướng chính')}
      className="relative hidden border-t border-line/70 bg-paper/85 backdrop-blur lg:block"
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
        <ul className="flex items-center">
          {PRIMARY.slice(0, 2).map((item) => {
            const active = item.owns(pathname);
            return (
              <li key={item.key} className="group">
                <Link
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={itemClass(active)}
                >
                  {t(item.key)}
                  <Indicator active={active} />
                </Link>
              </li>
            );
          })}

          {/* Mega menu trigger */}
          <li className="group">
            <ButtonCustom
              variant="raw"
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
              className={itemClass(categoriesActive || megaOpen)}
            >
              <Icon name="weave" className="h-4 w-4" />
              {t('nav.categories')}
              <Icon
                name="chevronDown"
                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                  megaOpen ? 'rotate-180' : ''
                }`}
              />
              <Indicator active={categoriesActive || megaOpen} />
            </ButtonCustom>
          </li>

          {PRIMARY.slice(2).map((item) => {
            const active = item.owns(pathname);
            return (
              <li key={item.key} className="group">
                <Link
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={itemClass(active)}
                >
                  {t(item.key)}
                  {item.key === 'nav.sale' && (
                    <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-lacquer" />
                  )}
                  <Indicator active={active} />
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          to="/openshop"
          className="group inline-flex items-center gap-2 py-2.5 font-body text-[13px] font-semibold text-gold-deep transition-colors hover:text-ink"
        >
          <Icon name="stall" className="h-4 w-4" />
          {t('category.sellWithVendora', 'Mở gian hàng cùng Vendora')}
          <Icon
            name="arrowRight"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Mega menu */}
      {megaOpen && (
        <div className="absolute inset-x-0 top-full z-[75] animate-fade border-y border-line bg-surface shadow-float">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-7 lg:grid-cols-[16rem_1fr_17rem] lg:px-10">
            {/* Category rail */}
            <ul className="border-line lg:border-r lg:pr-5">
              {CATEGORY_DEFS.map((cat) => {
                const active = cat.slug === activeSlug;
                return (
                  <li key={cat.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveSlug(cat.slug)}
                      onFocus={() => setActiveSlug(cat.slug)}
                      onClick={() => navigate(`/category/${cat.slug}`)}
                      aria-current={active ? 'true' : undefined}
                      className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left font-body text-sm transition-colors ${
                        active
                          ? 'bg-ink font-semibold text-white'
                          : 'text-ink/75 hover:bg-paper-2 hover:text-ink'
                      }`}
                    >
                      <Icon
                        name={CATEGORY_ICON[cat.slug] ?? 'tag'}
                        className={`h-4.5 w-4.5 ${active ? 'text-gold-soft' : 'text-gold-deep'}`}
                      />
                      <span className="flex-1">{t(cat.labelKey)}</span>
                      <Icon
                        name="chevronRight"
                        className={`h-3.5 w-3.5 ${active ? 'text-white/60' : 'text-ink/30'}`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Sub-categories */}
            <div>
              <Kicker>{t('nav.browse', 'Duyệt theo nhóm')}</Kicker>
              <h3 className="mt-2.5 font-display text-2xl text-ink">{t(activeDef.labelKey)}</h3>
              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
                {activeDef.subs.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/category/${activeDef.slug}/${sub.slug}`}
                    className="group/sub flex items-center gap-2 border-b border-transparent py-1.5 font-body text-sm text-ink/70 transition-colors hover:border-gold/50 hover:text-gold-deep"
                  >
                    <span
                      aria-hidden
                      className="h-1 w-1 rotate-45 bg-gold/60 transition-transform duration-300 group-hover/sub:scale-150"
                    />
                    {t(sub.labelKey)}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-5">
                <Link
                  to={`/category/${activeDef.slug}`}
                  className="inline-flex items-center gap-1.5 font-body text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:text-gold-deep"
                >
                  {t('nav.viewAllIn', {
                    category: t(activeDef.labelKey),
                    defaultValue: 'Tất cả {{category}}',
                  })}
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-1.5 font-body text-xs font-bold uppercase tracking-[0.14em] text-gold-deep transition-colors hover:text-ink"
                >
                  <Icon name="weave" className="h-3.5 w-3.5" />
                  {t('nav.allCategories', 'Toàn bộ danh mục')}
                </Link>
              </div>
            </div>

            {/* A real product from the section — discovery inside the menu */}
            {featured && (
              <Link
                to={`/product/${featured.id}`}
                className="brand-frame group/tile relative block overflow-hidden border border-line bg-paper p-4 transition-colors hover:border-ink/30"
              >
                <span
                  className="loom loom-strong relative block aspect-[4/3] w-full overflow-hidden"
                  style={{ backgroundColor: featured.color }}
                >
                  <span className="absolute bottom-2 right-3 font-display text-5xl text-ink/12">
                    {swatchLabel(featured.name)}
                  </span>
                  {featured.badge === 'new' && (
                    <Seal tone="ink" rotate={-6} className="absolute left-2 top-2">
                      {t('product.badgeNew', 'Mới')}
                    </Seal>
                  )}
                </span>
                <p className="mt-3 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">
                  {t('nav.featured', 'Nổi bật trong nhóm')}
                </p>
                <p className="mt-1 line-clamp-2 font-display text-base leading-snug text-ink">
                  {featured.name}
                </p>
                <p className="nums mt-1.5 font-body text-sm font-bold text-gold-deep">
                  {formatVnd(featured.price)}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 font-body text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition-colors group-hover/tile:text-gold-deep">
                  {t('nav.viewProduct', 'Xem sản phẩm')}
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNav;
