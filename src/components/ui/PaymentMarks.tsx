import { PAYMENT_MARKS, type PaymentMark } from '../../data/paymentMarks';

export type { PaymentMark };

const CHIP = 'flex h-7 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white';

/** One payment badge. */
export const PaymentMarkChip = ({
  mark,
  tone = 'onLight',
}: {
  mark: PaymentMark;
  tone?: 'onLight' | 'onDark';
}) => (
  <span
    role="img"
    aria-label={mark.label}
    title={mark.label}
    className={`${CHIP} ${tone === 'onDark' ? 'border-white/20 shadow-hair' : 'border-line'}`}
  >
    <svg viewBox="0 0 44 28" className="h-full w-full" aria-hidden focusable="false">
      {mark.art}
    </svg>
  </span>
);

/** The full row of accepted payment methods. */
const PaymentMarks = ({
  tone = 'onLight',
  className = '',
}: {
  tone?: 'onLight' | 'onDark';
  className?: string;
}) => (
  <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
    {PAYMENT_MARKS.map((mark) => (
      <PaymentMarkChip key={mark.label} mark={mark} tone={tone} />
    ))}
  </div>
);

export default PaymentMarks;
