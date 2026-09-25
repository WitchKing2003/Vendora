import type { ReactNode } from 'react';

/**
 * The small vocabulary of brand marks that appear on every page. Keeping them
 * here is what makes the identity feel systematic instead of decorative.
 */

/** A hairline of gold stitching — used to open sections and separate rows. */
export const StitchRule = ({
  className = '',
  tone = 'gold',
}: {
  className?: string;
  tone?: 'gold' | 'line' | 'light';
}) => (
  <span
    aria-hidden
    className={`stitch-rule block ${className}`}
    style={{
      ['--stitch-color' as string]:
        tone === 'gold' ? '#C68A2E' : tone === 'light' ? 'rgba(255,255,255,.4)' : '#C2B79E',
    }}
  />
);

/**
 * The eyebrow that opens every section: a short stitch of thread, then the
 * label. It is the single most repeated branded detail on the site.
 */
export const Kicker = ({
  children,
  tone = 'gold',
  className = '',
}: {
  children: ReactNode;
  tone?: 'gold' | 'light';
  className?: string;
}) => (
  <span className={`inline-flex items-center gap-3 ${className}`}>
    <span
      aria-hidden
      className={`h-px w-7 ${tone === 'light' ? 'bg-gold-soft' : 'bg-gold'}`}
    />
    <span
      className={`font-body text-[11px] font-bold uppercase tracking-[0.22em] ${
        tone === 'light' ? 'text-gold-soft' : 'text-gold-deep'
      }`}
    >
      {children}
    </span>
  </span>
);

/**
 * Section heading: kicker, display title, optional description and the
 * "view all" action on the right. One component so every section on the site
 * has identical rhythm.
 */
export const SectionHeading = ({
  kicker,
  title,
  description,
  action,
  tone = 'gold',
  className = '',
  id,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  tone?: 'gold' | 'light';
  className?: string;
  id?: string;
}) => (
  <div className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-4 ${className}`}>
    <div className="min-w-0 max-w-2xl">
      {kicker && (
        <Kicker tone={tone} className="mb-3">
          {kicker}
        </Kicker>
      )}
      <h2
        id={id}
        className={`font-display text-3xl leading-[1.12] tracking-[-0.02em] sm:text-[2.6rem] ${
          tone === 'light' ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 max-w-xl font-body text-sm leading-relaxed sm:text-base ${
            tone === 'light' ? 'text-white/70' : 'text-ink/60'
          }`}
        >
          {description}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

/**
 * A wax-seal badge. Used for discounts, "new in", stall verification — any
 * stamp of authority. Rendered as a stitched circle so it reads as pressed
 * wax rather than a stock pill.
 */
export const Seal = ({
  children,
  className = '',
  rotate = -6,
  tone = 'gold',
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  tone?: 'gold' | 'lacquer' | 'teal' | 'ink';
}) => {
  const bg =
    tone === 'lacquer'
      ? 'bg-lacquer'
      : tone === 'teal'
        ? 'bg-teal'
        : tone === 'ink'
          ? 'bg-ink'
          : 'bg-gold';
  return (
    <span
      className={`seal inline-flex items-center justify-center gap-1 px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-white ${bg} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
};

/**
 * The brand's picture frame: gold stitched corner brackets that grow on hover.
 * Wrap any image, card, or panel with it.
 */
export const BrandFrame = ({
  children,
  className = '',
  size = 14,
  hoverColor = 'var(--color-gold-deep)',
}: {
  children: ReactNode;
  className?: string;
  size?: number;
  hoverColor?: string;
}) => (
  <div
    className={`brand-frame ${className}`}
    style={{
      ['--frame-size' as string]: `${size}px`,
      ['--frame-color-hover' as string]: hoverColor,
    }}
  >
    {children}
  </div>
);

/**
 * A "woven swatch": the branded stand-in for product photography. Every
 * colour variant gets its own weave, so cards stay recognisable and never
 * look like a broken image.
 */
export const WovenSwatch = ({
  color,
  label,
  className = '',
  loom = true,
  seedIndex = 0,
}: {
  color: string;
  label?: string;
  className?: string;
  loom?: boolean;
  seedIndex?: number;
}) => (
  <div
    className={`relative isolate overflow-hidden ${className}`}
    style={{ backgroundColor: color }}
  >
    {loom && <span aria-hidden className="loom loom-strong absolute inset-0" />}
    {/* A soft light source so flat swatches gain depth */}
    <span
      aria-hidden
      className="absolute inset-0"
      style={{
        background: `radial-gradient(120% 90% at ${
          24 + (seedIndex % 4) * 16
        }% 12%, rgba(255,255,255,.5) 0%, rgba(255,255,255,0) 62%)`,
      }}
    />
    {label && (
      <span
        aria-hidden
        className="absolute bottom-2 right-3 font-display text-[3.4rem] leading-none text-ink/10 sm:text-[4.5rem]"
      >
        {label}
      </span>
    )}
  </div>
);
