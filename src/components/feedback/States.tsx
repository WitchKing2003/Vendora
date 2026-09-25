import type { ReactNode } from 'react';
import Icon, { type IconName } from '../brand/Icon';
import { Kicker } from '../brand/Stitch';

/**
 * Loading, empty and error states are where most stores go generic. Here they
 * carry the same stitch, loom and paper language as everything else, so a
 * "nothing found" moment still feels like Vendora.
 */

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <span
    aria-hidden
    className={`relative block overflow-hidden bg-paper-2 ${className}`}
  >
    <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/55 to-transparent" />
  </span>
);

export const TextSkeleton = ({ lines = 2, className = '' }: { lines?: number; className?: string }) => (
  <span className={`block space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </span>
);

/** Mirrors the real product card so the layout never jumps on load. */
export const ProductCardSkeleton = () => (
  <div aria-hidden className="border border-line bg-surface p-3">
    <Skeleton className="aspect-square w-full" />
    <Skeleton className="mt-3 h-2.5 w-1/3" />
    <Skeleton className="mt-2 h-3.5 w-full" />
    <Skeleton className="mt-1.5 h-3.5 w-2/3" />
    <Skeleton className="mt-2.5 h-4 w-1/2" />
  </div>
);

export const ProductGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
    {Array.from({ length: count }, (_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Friendly empty state: a stitched ring holding the icon, a warm line of copy,
 * and one clear way forward. Never a dead end.
 */
export const EmptyState = ({
  icon = 'thread',
  title,
  message,
  action,
  className = '',
}: {
  icon?: IconName;
  title: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
  className?: string;
}) => (
  <div className={`flex flex-col items-center px-6 py-12 text-center ${className}`}>
    <span className="relative flex h-20 w-20 items-center justify-center">
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-dashed border-gold/60"
      />
      <span aria-hidden className="absolute inset-2 rounded-full bg-gold-mist/70" />
      <Icon name={icon} className="relative h-7 w-7 text-gold-deep" />
    </span>
    <p className="mt-5 font-display text-xl text-ink">{title}</p>
    {message && (
      <p className="mt-2 max-w-sm font-body text-sm leading-relaxed text-ink/60">{message}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

/** Errors explain what happened and put the fix within reach. */
export const ErrorState = ({
  title,
  message,
  action,
  className = '',
}: {
  title: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
  className?: string;
}) => (
  <div
    role="alert"
    className={`flex flex-col items-center border border-dashed border-lacquer/40 bg-lacquer/5 px-6 py-12 text-center ${className}`}
  >
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lacquer/10 text-lacquer">
      <Icon name="alert" className="h-6 w-6" />
    </span>
    <p className="mt-5 font-display text-xl text-ink">{title}</p>
    {message && (
      <p className="mt-2 max-w-sm font-body text-sm leading-relaxed text-ink/60">{message}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

/** Small inline note used in forms and detail pages. */
export const InlineNote = ({
  icon = 'info',
  children,
  tone = 'neutral',
  className = '',
}: {
  icon?: IconName;
  children: ReactNode;
  tone?: 'neutral' | 'gold' | 'success' | 'danger';
  className?: string;
}) => {
  const tones = {
    neutral: 'text-ink/70',
    gold: 'text-gold-deep',
    success: 'text-success',
    danger: 'text-danger',
  } as const;
  return (
    <p className={`flex items-start gap-2 font-body text-xs leading-relaxed ${tones[tone]} ${className}`}>
      <Icon name={icon} className="mt-px h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
};

/** A labelled section placeholder that keeps the brand's rhythm while loading. */
export const SectionSkeleton = ({ kicker = '…', cards = 4 }: { kicker?: string; cards?: number }) => (
  <section className="bg-paper">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
      <Kicker>{kicker}</Kicker>
      <Skeleton className="mt-4 h-8 w-64 max-w-full" />
      <div className="mt-8">
        <ProductGridSkeleton count={cards} />
      </div>
    </div>
  </section>
);
