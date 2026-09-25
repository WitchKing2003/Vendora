import { Outlet } from 'react-router-dom';
import HeaderPage from '../components/Home/Header/HeaderPage';
import FooterPage from '../components/Home/Footer/FooterPage';
import MobileNav from '../components/Home/Header/MobileNav';
import MobileTabBar from '../components/Home/Header/MobileTabBar';
import CartDrawer from '../../components/feedback/CartDrawer';
import QuickView from '../../components/feedback/QuickView';
import Toaster from '../../components/feedback/Toaster';
import PageTransition from '../../components/feedback/PageTransition';
import { FlyToCartLayer } from '../../components/feedback/FlyToCart';

/**
 * The storefront shell.
 *
 * Everything that is global and stateful lives here exactly once: the page
 * transition, the cart drawer, quick view, the mobile menu and tab bar, the
 * toast stack and the fly-to-cart layer. Pages only describe themselves.
 */
const MainLayout = () => {
  return (
    <>
      {/* Keyboard users should never have to tab through a 40-link header. */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:border focus:border-ink focus:bg-surface focus:px-4 focus:py-2 focus:font-body focus:text-sm focus:font-semibold focus:text-ink"
      >
        Bỏ qua tới nội dung
      </a>

      <HeaderPage />

      {/* Bottom padding clears the mobile tab bar without adding a gap on desktop. */}
      <div className="pb-[3.75rem] lg:pb-0">
        <main id="content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <FooterPage />
      </div>

      <MobileTabBar />
      <MobileNav />
      <CartDrawer />
      <QuickView />
      <Toaster />
      <FlyToCartLayer />
    </>
  );
};

export default MainLayout;
