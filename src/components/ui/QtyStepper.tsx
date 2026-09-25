import { useTranslation } from 'react-i18next';
import ButtonCustom from '../ButtonComponent/ButtonCustom';
import Icon from '../brand/Icon';

/**
 * Quantity stepper.
 *
 * 44×44 touch targets on all breakpoints (comfortably above the 24px minimum,
 * meeting the 44px recommendation on touch), a live region so screen readers
 * hear the new value, and clamped bounds.
 */
export default function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}) {
  const { t } = useTranslation();
  const btn =
    size === 'sm'
      ? 'h-9 w-9'
      : 'h-11 w-11 sm:h-10 sm:w-10';
  const box = size === 'sm' ? 'min-w-9 px-2 text-sm' : 'min-w-11 px-3 text-base sm:min-w-10';

  const clamp = (n: number) => Math.min(Math.max(n, min), max);

  return (
    <div className="inline-flex items-stretch border border-line bg-surface">
      <ButtonCustom
        variant="raw"
        ariaLabel={t('common.decrease', 'Giảm số lượng')}
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className={`flex items-center justify-center text-ink transition-colors hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-35 ${btn}`}
      >
        <Icon name="minus" className="h-4 w-4" />
      </ButtonCustom>
      <span
        aria-live="polite"
        className={`nums flex items-center justify-center border-x border-line font-body font-semibold text-ink ${box}`}
      >
        {value}
      </span>
      <ButtonCustom
        variant="raw"
        ariaLabel={t('common.increase', 'Tăng số lượng')}
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className={`flex items-center justify-center text-ink transition-colors hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-35 ${btn}`}
      >
        <Icon name="plus" className="h-4 w-4" />
      </ButtonCustom>
    </div>
  );
}
