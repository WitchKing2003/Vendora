import { useTranslation } from 'react-i18next';

/**
 * SIGNATURE DETAIL — the thread rating.
 *
 * Instead of stock stars, Vendora rates in woven diamonds: five small lozenges
 * stitched in gold. It reads at a glance, works at 8px, and is instantly
 * identifiable as this brand's rating control.
 */
export default function Rating({
  value,
  count,
  size = 10,
  showValue = false,
  className = '',
}: {
  /** 0–5, halves supported (4.5 renders four full and one half). */
  value: number;
  count?: number;
  /** Diamond edge length in px. */
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      role="img"
      aria-label={t('feedback.ratingLabel', {
        value: value.toFixed(1),
        defaultValue: 'Đánh giá {{value}} trên 5',
      })}
    >
      <span aria-hidden className="inline-flex items-center gap-[3px]">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = value >= i + 1 ? 'full' : value >= i + 0.5 ? 'half' : 'empty';
          return (
            <span
              key={i}
              className="inline-block rotate-45 border border-gold-deep/70"
              style={{
                width: size,
                height: size,
                background:
                  fill === 'full'
                    ? 'var(--color-gold)'
                    : fill === 'half'
                      ? 'linear-gradient(90deg, var(--color-gold) 50%, transparent 50%)'
                      : 'transparent',
              }}
            />
          );
        })}
      </span>

      {showValue && (
        <span className="nums font-body text-xs font-bold text-ink">{value.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="nums font-body text-xs text-ink/45">({count})</span>
      )}
    </span>
  );
}
