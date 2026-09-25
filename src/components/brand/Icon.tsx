/**
 * Vendora icon language.
 *
 * One geometry for the whole product so icons read as a family: a 24×24 grid,
 * 1.6px strokes, rounded caps and joins, and never a filled glyph except the
 * wax-seal star. Slightly "carved" rather than perfectly geometric — the icon
 * set is part of the brand, not a stock library.
 */
import type { SVGProps } from 'react';

export type IconName =
  | 'search'
  | 'cart'
  | 'heart'
  | 'user'
  | 'close'
  | 'chevronDown'
  | 'chevronUp'
  | 'chevronLeft'
  | 'chevronRight'
  | 'arrowRight'
  | 'arrowLeft'
  | 'menu'
  | 'filter'
  | 'grid'
  | 'list'
  | 'check'
  | 'checkCircle'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'star'
  | 'tag'
  | 'truck'
  | 'shield'
  | 'refresh'
  | 'wallet'
  | 'sparkles'
  | 'location'
  | 'eye'
  | 'compare'
  | 'share'
  | 'sort'
  | 'home'
  | 'package'
  | 'clock'
  | 'copy'
  | 'lock'
  | 'mail'
  | 'phone'
  | 'gift'
  | 'bell'
  | 'calendar'
  | 'stall'
  | 'thread'
  | 'weave'
  | 'logout'
  | 'info'
  | 'alert'
  | 'image'
  | 'external';

const PATHS: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M15.5 15.5 21 21" strokeLinecap="round" />
    </>
  ),
  cart: (
    <>
      <circle cx="9.2" cy="20" r="1.4" />
      <circle cx="17.2" cy="20" r="1.4" />
      <path
        d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L20 8H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  heart: (
    <path
      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1.5-3.2 4-4.6 7-4.6s5.5 1.4 7 4.6" strokeLinecap="round" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />,
  chevronDown: <path d="M6 9.5l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />,
  chevronUp: <path d="M6 14.5l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />,
  chevronLeft: <path d="M14.5 5.5l-6 6.5 6 6.5" strokeLinecap="round" strokeLinejoin="round" />,
  chevronRight: <path d="M9.5 5.5l6 6.5-6 6.5" strokeLinecap="round" strokeLinejoin="round" />,
  arrowRight: (
    <>
      <path d="M4 12h15" strokeLinecap="round" />
      <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M20 12H5" strokeLinecap="round" />
      <path d="M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" strokeLinecap="round" />,
  filter: (
    <>
      <path d="M3.5 6.5h17M6.5 12h11M10 17.5h4" strokeLinecap="round" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </>
  ),
  list: (
    <>
      <path d="M9 6.5h11M9 12h11M9 17.5h11" strokeLinecap="round" />
      <circle cx="4.6" cy="6.5" r="1.1" />
      <circle cx="4.6" cy="12" r="1.1" />
      <circle cx="4.6" cy="17.5" r="1.1" />
    </>
  ),
  check: <path d="M5 12.5l4.2 4.2L19 6.5" strokeLinecap="round" strokeLinejoin="round" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M8.2 12.4l2.6 2.6 5-5.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" strokeLinecap="round" />,
  minus: <path d="M5.5 12h13" strokeLinecap="round" />,
  trash: (
    <>
      <path
        d="M4 7h16M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2m-8.5 0 .9 12.1a1 1 0 0 0 1 .9h6.2a1 1 0 0 0 1-.9l.9-12.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.4 11v5M13.6 11v5" strokeLinecap="round" />
    </>
  ),
  star: (
    <path
      d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.8 1.1-5.9L3.5 9.8l5.9-.8L12 3.6z"
      strokeLinejoin="round"
    />
  ),
  tag: (
    <>
      <path
        d="M3.5 3.5h8L21 13l-7.5 7.5L3.5 11v-7.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.3" />
    </>
  ),
  truck: (
    <>
      <path d="M1.8 6.2h11.6v9.6H1.8z" strokeLinejoin="round" />
      <path d="M13.4 9.2h3.8l3 3v3.6h-6.8" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="16.8" cy="18" r="1.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.6 2.8v5.4c0 4.6-3.2 8.3-7.6 9.9-4.4-1.6-7.6-5.3-7.6-9.9V5.8L12 3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  refresh: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" strokeLinecap="round" />
      <path d="M3.5 4.5v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" strokeLinejoin="round" />
      <path d="M3 10.5h18" />
      <circle cx="17" cy="14.8" r="1.1" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11.5 3l1.5 4.4 4.4 1.5-4.4 1.5L11.5 15 10 10.4 5.6 8.9 10 7.4 11.5 3z" strokeLinejoin="round" />
      <path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" strokeLinejoin="round" />
    </>
  ),
  location: (
    <>
      <path d="M12 21.2s7-5.4 7-11.2a7 7 0 1 0-14 0c0 5.8 7 11.2 7 11.2z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.2 12S6 5.6 12 5.6 21.8 12 21.8 12 18 18.4 12 18.4 2.2 12 2.2 12z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  compare: (
    <>
      <path d="M7 4.5v15M4 16.5l3 3 3-3M17 19.5v-15M14 7.5l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8" strokeLinecap="round" />
    </>
  ),
  sort: (
    <>
      <path d="M4 7.5h9M4 12h6M4 16.5h3.5" strokeLinecap="round" />
      <path d="M18 9.5v10M15 16.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  home: (
    <path
      d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  package: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeLinejoin="round" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" strokeLinejoin="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11.5" height="11.5" rx="2" strokeLinejoin="round" />
      <path d="M5.5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5v1" strokeLinecap="round" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" strokeLinejoin="round" />
      <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" strokeLinecap="round" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" strokeLinejoin="round" />
      <path d="M3.8 6.5l8.2 5.8 8.2-5.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  phone: (
    <path
      d="M6.6 3.5h2.9l1.5 4-2 1.4a11.2 11.2 0 0 0 6.1 6.1l1.4-2 4 1.5v2.9a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  gift: (
    <>
      <path d="M4 11.5h16v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8z" strokeLinejoin="round" />
      <path d="M3 7.5h18v4H3z" strokeLinejoin="round" />
      <path d="M12 7.5v13" />
      <path d="M12 7.5S10.8 3 8 3a2.3 2.3 0 0 0 0 4.5h4zM12 7.5S13.2 3 16 3a2.3 2.3 0 0 1 0 4.5h-4z" strokeLinejoin="round" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9.5a6 6 0 1 1 12 0c0 4.7 1.8 5.8 1.8 5.8H4.2S6 14.2 6 9.5z" strokeLinejoin="round" />
      <path d="M10.4 19a2 2 0 0 0 3.2 0" strokeLinecap="round" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" strokeLinejoin="round" />
      <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
    </>
  ),
  /** A market stall — the brand's core metaphor. */
  stall: (
    <>
      <path d="M4 9.5l1.6-5.2h12.8L20 9.5M4 9.5v10.8a.7.7 0 0 0 .7.7h14.6a.7.7 0 0 0 .7-.7V9.5M4 9.5h16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 21v-5.5h5V21" strokeLinejoin="round" />
    </>
  ),
  /** A length of thread with a needle eye — signals "handmade". */
  thread: (
    <>
      <path d="M3.5 17.5c2.6-.6 3.4-4.4 6.2-5.4 2.4-.9 3-3.3 5.3-4.2 1.6-.6 3.2 0 4.4 1.2" strokeLinecap="round" />
      <path d="M19.4 9.1l2.1-.6-.6 2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 20.5h5M11 20.5h9.5" strokeLinecap="round" strokeDasharray="1 3" />
    </>
  ),
  /** A woven bamboo lattice — the surface motif. */
  weave: (
    <>
      <path d="M3.5 8.5h17M3.5 15.5h17" />
      <path d="M8.5 3.5v17M15.5 3.5v17" />
    </>
  ),
  logout: (
    <>
      <path d="M14.5 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 12h8.5M18 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 11v5.5M12 7.9h.01" strokeLinecap="round" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.2 21 19.5H3L12 4.2z" strokeLinejoin="round" />
      <path d="M12 9.6v4.2M12 16.6h.01" strokeLinecap="round" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" strokeLinejoin="round" />
      <circle cx="8.8" cy="10" r="1.8" />
      <path d="M4 17l4.6-4.3 3.4 3 3.2-2.6L20 17" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  external: (
    <>
      <path d="M14 4.5h5.5V10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 4.5 12 12" strokeLinecap="round" />
      <path d="M18 14v5.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H10" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** Rendered size in Tailwind classes, e.g. "h-4 w-4". */
  className?: string;
  strokeWidth?: number;
  /** Filled variant (used for the wishlist heart when active). */
  filled?: boolean;
}

/**
 * `<Icon name="cart" className="h-5 w-5" />`
 *
 * Icons are decorative by default (`aria-hidden`); pass `role="img"` and a
 * `<title>` yourself when an icon carries meaning on its own.
 */
export default function Icon({
  name,
  className = 'h-5 w-5',
  strokeWidth = 1.6,
  filled = false,
  ...rest
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled && name !== 'star' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled && name !== 'star' ? 0 : strokeWidth}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
