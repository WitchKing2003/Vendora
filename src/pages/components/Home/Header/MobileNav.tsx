import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ButtonCustom from '../../../../components/ButtonComponent/ButtonCustom';
import Icon from '../../../../components/brand/Icon';
import Logo from '../../../../components/brand/Logo';
import { Kicker } from '../../../../components/brand/Stitch';
import { CATEGORY_DEFS } from '../../../../data/categoryData';
import { CATEGORY_ICON } from '../../../../data/categoryMeta';
import { useAuthStore } from '../../../../stores/authStore';
import { useUiStore } from '../../../../stores/uiStore';
import {
  useBodyScrollLock,
  useEscapeKey,
  useFocusTrap,
  usePresence,
} from '../../../../hooks/useOverlay';
import BrandSearch from './BrandSearch';

const QUICK_LINKS = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.shop', to: '/shop' },
  { key: 'nav.new', to: '/new' },
  { key: 'nav.sale', to: '/sale' },
  { key: 'nav.wishlist', to: '/wishlist' },
];

/**
 * The mobile menu.
 *
 * Slides in as a full-height sheet: search first (the thing people open it
 * for), then the essential sections, then categories as a tap-to-expand
 * accordion rather than a nested maze. Account and language live at the
 * bottom, where the thumb already is.
 */
const MobileNav = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const open = useUiStore((s) => s.menuOpen);
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [expanded, setExpanded] = useState<string | null>(null);
  const { mounted, open: isOpen } = usePresence(open, 360);

  useBodyScrollLock(open);
  useEscapeKey(open, () => setMenuOpen(false));
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  // Choosing a destination closes the menu.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  if (!mounted) return null;

  return (
    <>
      <div
        aria-hidden
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[96] bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu', 'Menu')}
        tabIndex={-1}
        className={`fixed left-0 top-0 z-[97] flex h-full w-[88%] max-w-sm flex-col border-r border-line bg-paper shadow-float transition-transform duration-360 ease-[var(--ease-brand)] lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3.5">
          <Link to="/" aria-label="Vendora">
            <Logo withMark markClassName="h-8 w-8" className="text-xl" />
          </Link>
          <ButtonCustom
            variant="raw"
            ariaLabel={t('nav.closeMenu', 'Đóng menu')}
            onClick={() => setMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center text-ink/55 transition-colors hover:text-ink"
          >
            <Icon name="close" className="h-5 w-5" />
          </ButtonCustom>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-3.5">
          <BrandSearch />

          <nav aria-label={t('nav.main', 'Điều hướng chính')} className="mt-5">
            <ul className="border-t border-line">
              {QUICK_LINKS.map((item) => {
                const active = item.to === '/' ? pathname === '/' : pathname === item.to;
                return (
                  <li key={item.key} className="border-b border-line">
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between py-3.5 font-body text-[15px] transition-colors ${
                        active ? 'font-semibold text-ink' : 'text-ink/80'
                      }`}
                    >
                      {t(item.key)}
                      {active && <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-6">
            <Kicker>{t('nav.categories', 'Danh mục')}</Kicker>
            <ul className="mt-3 border-t border-line">
              {CATEGORY_DEFS.map((cat) => {
                const isExpanded = expanded === cat.slug;
                return (
                  <li key={cat.slug} className="border-b border-line">
                    <div className="flex items-stretch">
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : cat.slug)}
                        aria-expanded={isExpanded}
                        className="flex flex-1 items-center gap-3 py-3 text-left font-body text-[15px] text-ink"
                      >
                        <Icon
                          name={CATEGORY_ICON[cat.slug] ?? 'tag'}
                          className="h-4.5 w-4.5 text-gold-deep"
                        />
                        {t(cat.labelKey)}
                      </button>
                      <button
                        type="button"
                        aria-label={t('nav.openCategory', {
                          category: t(cat.labelKey),
                          defaultValue: 'Mở {{category}}',
                        })}
                        onClick={() => navigate(`/category/${cat.slug}`)}
                        className="flex w-11 items-center justify-center text-ink/40"
                      >
                        <Icon name="chevronRight" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={t('nav.expandCategory', 'Mở rộng')}
                        onClick={() => setExpanded(isExpanded ? null : cat.slug)}
                        className="flex w-9 items-center justify-center text-ink/40"
                      >
                        <Icon
                          name="chevronDown"
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {isExpanded && (
                      <ul className="animate-fade pb-2.5 pl-8">
                        {cat.subs.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to={`/category/${cat.slug}/${sub.slug}`}
                              className="flex items-center gap-2 py-2 font-body text-sm text-ink/70"
                            >
                              <span aria-hidden className="h-1 w-1 rotate-45 bg-gold/70" />
                              {t(sub.labelKey)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            <Link
              to="/categories"
              className="mt-4 inline-flex items-center gap-1.5 font-body text-xs font-bold uppercase tracking-[0.14em] text-gold-deep"
            >
              <Icon name="weave" className="h-3.5 w-3.5" />
              {t('nav.allCategories', 'Toàn bộ danh mục')}
            </Link>
          </div>

          <div className="mt-7 border-t border-line pt-4">
            <Kicker>{t('nav.account', 'Tài khoản')}</Kicker>
            <ul className="mt-3 space-y-0.5">
              {user ? (
                <>
                  <li className="pb-2 font-body text-sm text-ink/60">
                    {t('header.hello', 'Xin chào,')}{' '}
                    <span className="font-semibold text-ink">{user.name}</span>
                  </li>
                  {[
                    { key: 'header.accountInfo', to: '/account', icon: 'user' as const },
                    { key: 'header.myOrders', to: '/account/orders', icon: 'package' as const },
                    { key: 'nav.wishlist', to: '/wishlist', icon: 'heart' as const },
                  ].map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="flex items-center gap-3 py-2.5 font-body text-sm text-ink/80"
                      >
                        <Icon name={item.icon} className="h-4 w-4 text-ink/45" />
                        {t(item.key)}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-2.5 font-body text-sm text-lacquer"
                    >
                      <Icon name="logout" className="h-4 w-4" />
                      {t('header.logout', 'Đăng xuất')}
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="flex items-center gap-3 py-2.5 font-body text-sm text-ink/80"
                    >
                      <Icon name="user" className="h-4 w-4 text-ink/45" />
                      {t('header.signIn', 'Đăng nhập')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="flex items-center gap-3 py-2.5 font-body text-sm text-ink/80"
                    >
                      <Icon name="thread" className="h-4 w-4 text-ink/45" />
                      {t('header.signUp', 'Đăng ký')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-4 border-t border-line pt-4 font-body text-sm">
            <button
              type="button"
              onClick={() => i18n.changeLanguage('vi')}
              className={i18n.language === 'vi' ? 'font-bold text-ink' : 'text-ink/55'}
            >
              {t('footer.langVi', 'Tiếng Việt')}
            </button>
            <span aria-hidden className="text-ink/25">
              /
            </span>
            <button
              type="button"
              onClick={() => i18n.changeLanguage('en')}
              className={i18n.language === 'en' ? 'font-bold text-ink' : 'text-ink/55'}
            >
              {t('footer.langEn', 'English')}
            </button>
          </div>

          <Link
            to="/openshop"
            className="mt-6 flex items-center justify-between gap-3 border border-ink bg-ink px-4 py-3 text-white"
          >
            <span className="flex items-center gap-2 font-body text-sm font-semibold">
              <Icon name="stall" className="h-4.5 w-4.5 text-gold-soft" />
              {t('category.sellWithVendora', 'Mở gian hàng cùng Vendora')}
            </span>
            <Icon name="arrowRight" className="h-4 w-4 text-gold-soft" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
