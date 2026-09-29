import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ButtonCustom from '../../../../components/ButtonComponent/ButtonCustom';
import Icon from '../../../../components/brand/Icon';
import Logo from '../../../../components/brand/Logo';
import { cartCount, useCartStore } from '../../../../stores/cartStore';
import { useAuthStore } from '../../../../stores/authStore';
import { useUiStore } from '../../../../stores/uiStore';
import { useWishlistStore } from '../../../../stores/wishlistStore';
import AnnouncementBar from './AnnouncementBar';
import BrandSearch from './BrandSearch';
import MainNav from './MainNav';

/**
 * The sticky header.
 *
 * Order is fixed and always the same, so the shopper never has to re-learn it:
 * menu → brand → search → wishlist → cart → account. The announcement strip
 * above it scrolls away with the page (it is NOT inside this sticky element —
 * an in-header fold changed the header height while scrolling and jittered
 * against the browser's scroll anchoring). Only a hairline shadow appears
 * once the page is scrolled.
 */
const HeaderPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const cartItems = useCartStore((s) => s.items);
  const cartBadge = cartCount(cartItems);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const bumpToken = useUiStore((s) => s.cartBumpToken);
  const openCart = useUiStore((s) => s.openCart);
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  /*
   * Fold state with hysteresis.
   *
   * The announcement bar sits inside this sticky header, so folding it
   * changes the header's height by ~40px. With a single threshold the
   * browser's scroll anchoring compensates that shift by nudging scrollY
   * back across the threshold, and the bar fold/unfolds in an endless
   * jitter loop while scrolling slowly near the boundary (bottom-of-page
   * scroll clamping triggers the same loop). Two thresholds wider than the
   * bar itself make the compensation physically unable to re-cross:
   * fold above 64px, only unfold back below 8px. rAF-throttled so we
   * evaluate at most once per frame.
   */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled((prev) => {
        const y = window.scrollY;
        if (prev) return y > 8;
        return y > 64;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // The account sheet never survives a navigation. Adjusted during render —
  // the documented way to react to a changed value without an effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setAccountOpen(false);
  }

  const iconButton =
    'relative flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-gold-deep';

  const accountItems = user
    ? [
        { key: 'header.accountInfo', to: '/account', icon: 'user' as const },
        { key: 'header.myOrders', to: '/account/orders', icon: 'package' as const },
        { key: 'nav.wishlist', to: '/wishlist', icon: 'heart' as const },
      ]
    : [];

  return (
    <>
      {/* Sits in normal flow above the sticky header: it scrolls away with
          the page instead of folding inside the sticky element, so header
          height never changes while scrolling (the old in-header max-h fold
          fought the browser's scroll anchoring and jittered). */}
      <AnnouncementBar />

      <header className="sticky top-0 z-[70]">

      <div
        className={`border-b bg-paper/92 backdrop-blur-md transition-all duration-300 ease-[var(--ease-brand)] ${
          scrolled ? 'border-line shadow-soft' : 'border-line/60'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 lg:gap-6 lg:px-10">
          {/* Menu — mobile only */}
          <ButtonCustom
            variant="raw"
            ariaLabel={t('nav.openMenu', 'Mở menu')}
            onClick={() => setMenuOpen(true)}
            className={`${iconButton} -ml-2 lg:hidden`}
          >
            <Icon name="menu" className="h-5.5 w-5.5" />
          </ButtonCustom>

          {/* Brand */}
          <Link to="/" aria-label="Vendora" className="shrink-0">
            <Logo
              withMark
              markClassName="h-8 w-8 sm:h-9 sm:w-9"
              className="text-xl sm:text-2xl"
            />
          </Link>

          {/* Search */}
          <div className="mx-auto hidden w-full min-w-0 max-w-2xl md:block">
            <BrandSearch />
          </div>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
            <ButtonCustom
              variant="raw"
              ariaLabel={t('header.search.submit', 'Tìm kiếm')}
              onClick={() => navigate('/search')}
              className={`${iconButton} md:hidden`}
            >
              <Icon name="search" className="h-5.5 w-5.5" />
            </ButtonCustom>

            <Link
              to="/wishlist"
              aria-label={t('nav.wishlist', 'Yêu thích')}
              className={iconButton}
            >
              <Icon name="heart" className="h-5.5 w-5.5" />
              {wishlistCount > 0 && (
                <span
                  key={wishlistCount}
                  className="nums absolute right-1.5 top-1.5 flex h-4 min-w-4 animate-wish-pop items-center justify-center rounded-full bg-lacquer px-1 font-body text-[10px] font-bold text-white"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart — the fly-to-cart landing zone and the bump reaction */}
            <span data-cart-target className="relative inline-flex">
              <ButtonCustom
                variant="raw"
                ariaLabel={t('header.cart', 'Giỏ hàng')}
                onClick={openCart}
                className={iconButton}
              >
                <span
                  key={bumpToken}
                  className={`inline-flex ${bumpToken > 0 ? 'animate-cart-bump' : ''}`}
                >
                  <Icon name="cart" className="h-5.5 w-5.5" />
                </span>
                {cartBadge > 0 && (
                  <span className="nums absolute right-1 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold px-1 font-body text-[10px] font-bold text-white">
                    {cartBadge > 99 ? '99+' : cartBadge}
                  </span>
                )}
              </ButtonCustom>
            </span>

            <ButtonCustom
              variant="raw"
              ariaLabel={t('header.account', 'Tài khoản')}
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((v) => !v)}
              className={iconButton}
            >
              <Icon name="user" className="h-5.5 w-5.5" />
            </ButtonCustom>

            {accountOpen && (
              <>
                <div
                  className="fixed inset-0 z-[74] bg-ink/40 sm:hidden"
                  onClick={() => setAccountOpen(false)}
                />
                <div className="fixed inset-x-3 bottom-3 z-[75] animate-sheet-up overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-float sm:hidden">
                  <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <span className="font-body text-sm">
                      {user ? (
                        <>
                          <span className="block text-[11px] uppercase tracking-[0.14em] text-ink/45">
                            {t('header.hello', 'Xin chào,')}
                          </span>
                          <span className="font-semibold text-ink">{user.name}</span>
                        </>
                      ) : (
                        <span className="font-semibold text-ink">
                          {t('header.guest', 'Khách của Vendora')}
                        </span>
                      )}
                    </span>
                    <ButtonCustom
                      variant="raw"
                      ariaLabel={t('nav.closeMenu', 'Đóng')}
                      onClick={() => setAccountOpen(false)}
                      className="flex h-9 w-9 items-center justify-center text-ink/45"
                    >
                      <Icon name="close" className="h-4 w-4" />
                    </ButtonCustom>
                  </div>

                  {(user
                    ? [...accountItems, { key: 'header.logout', to: null, icon: 'logout' as const }]
                    : [
                        { key: 'header.signIn', to: '/login', icon: 'user' as const },
                        { key: 'header.signUp', to: '/signup', icon: 'thread' as const },
                      ]
                  ).map((item) => (
                    <ButtonCustom
                      key={item.key}
                      variant="raw"
                      fullWidth
                      onClick={() => {
                        setAccountOpen(false);
                        if (item.to) navigate(item.to);
                        else logout();
                      }}
                      className="flex items-center gap-3 px-4 py-3.5 text-left font-body text-[15px] font-normal text-ink transition-colors hover:bg-paper-2"
                    >
                      <Icon name={item.icon} className="h-4 w-4 text-ink/45" />
                      {t(item.key)}
                    </ButtonCustom>
                  ))}
                </div>

                {/* Desktop dropdown */}
                <div
                  className="fixed inset-0 z-[74] hidden sm:block"
                  onClick={() => setAccountOpen(false)}
                />
                <div className="absolute right-4 top-full z-[75] mt-2 hidden w-64 animate-fade overflow-hidden rounded-xl border border-line bg-surface shadow-float sm:block lg:right-10">
                  <div className="brand-frame relative border-b border-line bg-paper-2/60 px-4 py-2.5">
                    <p className="flex min-w-0 items-baseline gap-2">
                      <span className="shrink-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep">
                        {user ? t('header.hello', 'Xin chào,') : t('header.welcome', 'Chào mừng')}
                      </span>
                      <span className="truncate font-display text-[15px] font-semibold leading-tight text-ink">
                        {user ? user.name : t('header.guestName', 'bạn ghé phiên chợ')}
                      </span>
                    </p>
                  </div>

                  {user ? (
                    <>
                      {accountItems.map((item) => (
                        <ButtonCustom
                          key={item.key}
                          variant="raw"
                          fullWidth
                          onClick={() => {
                            setAccountOpen(false);
                            navigate(item.to);
                          }}
                          className="flex items-center gap-3 border-b border-line/70 px-4 py-2.5 text-left font-body text-sm font-normal text-ink transition-colors hover:bg-paper-2"
                        >
                          <Icon name={item.icon} className="h-4 w-4 text-ink/45" />
                          {t(item.key)}
                        </ButtonCustom>
                      ))}
                      <ButtonCustom
                        variant="raw"
                        fullWidth
                        onClick={() => {
                          logout();
                          setAccountOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-left font-body text-sm font-normal text-lacquer transition-colors hover:bg-lacquer/5"
                      >
                        <Icon name="logout" className="h-4 w-4" />
                        {t('header.logout', 'Đăng xuất')}
                      </ButtonCustom>
                    </>
                  ) : (
                    <>
                      <ButtonCustom
                        variant="raw"
                        fullWidth
                        onClick={() => {
                          setAccountOpen(false);
                          navigate('/login');
                        }}
                        className="flex items-center gap-3 border-b border-line/70 px-4 py-2.5 text-left font-body text-sm font-normal text-ink transition-colors hover:bg-paper-2"
                      >
                        <Icon name="user" className="h-4 w-4 text-ink/45" />
                        {t('header.signIn', 'Đăng nhập')}
                      </ButtonCustom>
                      <ButtonCustom
                        variant="raw"
                        fullWidth
                        onClick={() => {
                          setAccountOpen(false);
                          navigate('/signup');
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-left font-body text-sm font-normal text-ink transition-colors hover:bg-paper-2"
                      >
                        <Icon name="thread" className="h-4 w-4 text-ink/45" />
                        {t('header.signUp', 'Đăng ký')}
                      </ButtonCustom>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <MainNav />
    </header>
    </>
  );
};

export default HeaderPage;
