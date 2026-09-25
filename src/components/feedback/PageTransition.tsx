import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

/**
 * SIGNATURE INTERACTION #3 — the page turn.
 *
 * Every route change replays one restrained rise-and-fade, so navigation feels
 * like turning to the next page of a catalogue. It is 460ms and never blocks
 * input; with reduced motion it resolves instantly.
 *
 * It also resets scroll to the top on navigation, which a client-rendered
 * storefront otherwise forgets to do.
 */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
};

export default PageTransition;
