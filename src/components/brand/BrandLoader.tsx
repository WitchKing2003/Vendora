import { useTranslation } from 'react-i18next';

/**
 * The branded loading animation.
 *
 * A gold thread is woven across a bamboo loom, over and over — the brand's
 * core metaphor (a stall being set up) rendered as motion. Used for route
 * suspense, optimistic states and the pre-checkout hand-off.
 *
 * Honours reduced motion: the sweep collapses to a static stitched loom.
 */
export default function BrandLoader({
  label,
  className = '',
  size = 64,
}: {
  label?: string;
  className?: string;
  size?: number;
}) {
  const { t } = useTranslation();
  const text = label ?? t('common.loading', 'Đang dệt gian hàng…');

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="text-ink"
      >
        {/* Loom frame */}
        <rect x="6.5" y="6.5" width="51" height="51" rx="3" stroke="currentColor" strokeOpacity="0.22" />
        {/* Warp threads */}
        <path d="M16 12v40M32 12v40M48 12v40" stroke="currentColor" strokeOpacity="0.16" />
        <path d="M12 16h40M12 32h40M12 48h40" stroke="currentColor" strokeOpacity="0.16" />
        {/* The weft: a length of gold thread travelling the loom */}
        <path
          d="M10 20h44M10 32h44M10 44h44"
          stroke="#C68A2E"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="10 34"
          className="animate-thread"
        />
        {/* Needle eye, sealing the weave */}
        <rect x="28.6" y="28.6" width="6.8" height="6.8" rx="1" transform="rotate(45 32 32)" fill="#1A1B1E" />
        <rect x="30.4" y="30.4" width="3.2" height="3.2" rx="0.6" transform="rotate(45 32 32)" fill="#C68A2E" />
      </svg>

      <span className="font-body text-xs font-semibold uppercase tracking-[0.28em] text-ink/45">
        {text}
      </span>
    </div>
  );
}
