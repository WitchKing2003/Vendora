import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ButtonCustom from '../../../../components/ButtonComponent/ButtonCustom';
import Icon, { type IconName } from '../../../../components/brand/Icon';
import { cartCount, useCartStore } from '../../../../stores/cartStore';
import { useUiStore } from '../../../../stores/uiStore';
import { useWishlistStore } from '../../../../stores/wishlistStore';

interface Tab {
  key: string;
  icon: IconName;
  to?: string;
  onClick?: () => void;
  owns: (pathname: string) => boolean;
  badge?: number;
}

/**
 * Mobile bottom navigation.
 *
 * Five destinations, thumb-reachable, with the two that matter most (cart and
 * the menu) acting instantly instead of navigating. It sits on top of the
 * safe-area inset so it clears the home indicator on a notch device, and each
 * target is 56px tall — comfortably tappable.
 */
const MobileTabBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = useCartStore((s) => s.items);
  const wishlist = useWishlistStore((s) => s.items);
  const openCart = useUiStore((s) => s.openCart);
  const openMenu = useUiStore((s) => s.setMenuOpen);

  const tabs: Tab[] = [
    { key: 'nav.home', icon: 'home', to: '/', owns: (p) => p === '/' },
    {
      key: 'nav.categories',
      icon: 'weave',
      onClick: () => openMenu(true),
      owns: (p) => p.startsWith('/category') || p === '/categories',
    },
    {
      key: 'nav.search',
      icon: 'search',
      to: '/search',
      owns: (p) => p === '/search',
    },
    {
      key: 'nav.wishlist',
      icon: 'heart',
      to: '/wishlist',
      owns: (p) => p === '/wishlist',
      badge: wishlist.length,
    },
    {
      key: 'nav.cart',
      icon: 'cart',
      onClick: openCart,
      owns: (p) => p === '/cart' || p === '/checkout',
      badge: cartCount(items),
    },
  ];

  return (
    <nav
      aria-label={t('nav.mobileTabs', 'Điều hướng nhanh')}
      className="fixed inset-x-0 bottom-0 z-[78] border-t border-line bg-surface/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = tab.owns(pathname);
          const content = (
            <>
              <span className="relative">
                <Icon
                  name={tab.icon}
                  className={`h-5 w-5 transition-transform duration-300 ${
                    active ? 'scale-110' : ''
                  }`}
                  filled={tab.icon === 'heart' && active}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="nums absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 font-body text-[10px] font-bold text-white">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </span>
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.08em]">
                {t(tab.key)}
              </span>
              <span
                aria-hidden
                className={`absolute inset-x-4 top-0 h-[2px] origin-center bg-gold transition-transform duration-300 ${
                  active ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </>
          );

          const classes = `relative flex h-14 flex-col items-center justify-center gap-1 transition-colors ${
            active ? 'text-gold-deep' : 'text-ink/60'
          }`;

          return (
            <li key={tab.key}>
              {tab.to ? (
                <Link
                  to={tab.to}
                  aria-current={active ? 'page' : undefined}
                  className={classes}
                  onClick={(e) => {
                    if (tab.key === 'nav.search' && pathname === '/search') {
                      e.preventDefault();
                      navigate('/search');
                    }
                  }}
                >
                  {content}
                </Link>
              ) : (
                <ButtonCustom
                  variant="raw"
                  onClick={tab.onClick}
                  ariaLabel={t(tab.key)}
                  fullWidth
                  className={classes}
                >
                  {content}
                </ButtonCustom>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileTabBar;
