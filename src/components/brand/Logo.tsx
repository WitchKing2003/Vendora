/**
 * The Vendora mark: a "V" over the stall silhouette, split between ink and
 * gold leaf, sealed with a small gold diamond. It reads as a woven stall from
 * across the room and still works at 16px as a favicon.
 */
const Mark = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
    <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="4" fill="currentColor" />
    <path
      d="M9.6 10.4 16 24.2l6.4-13.8"
      stroke="#F3EFE6"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M9.6 10.4 16 23.2"
      stroke="#C68A2E"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <rect
      x="14.4"
      y="5.6"
      width="3.2"
      height="3.2"
      transform="rotate(45 16 7.2)"
      fill="#C68A2E"
    />
  </svg>
);

export interface LogoProps {
  /** Show the woven mark next to the wordmark. */
  withMark?: boolean;
  markClassName?: string;
  /** Wordmark size, e.g. "text-2xl". */
  className?: string;
  /** `light` renders the wordmark on ink backgrounds. */
  tone?: 'ink' | 'light';
  /** Accent colour of the final "a" — the brand's small signature. */
  accentClassName?: string;
}

/**
 * `<Logo />` — the wordmark. Always typeset in the display face with a hair
 * of negative tracking, and always with the gold leaf "a".
 */
export default function Logo({
  withMark = false,
  markClassName = 'h-8 w-8',
  className = 'text-2xl',
  tone = 'ink',
  accentClassName = 'text-gold-leaf',
}: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {withMark && (
        <Mark className={`${markClassName} ${tone === 'light' ? 'text-ink' : 'text-ink'}`} />
      )}
      <span
        className={`font-display font-semibold leading-none tracking-[-0.02em] ${
          tone === 'light' ? 'text-white' : 'text-ink'
        } ${className}`}
      >
        Vendor<span className={accentClassName}>a</span>
      </span>
    </span>
  );
}

/** Standalone mark, for favicons, loaders and compact placements. */
export const LogoMark = Mark;
