import type { ReactNode } from 'react';

/**
 * Payment marks — the artwork, not the UI.
 *
 * Logos instead of words: a badge a shopper can recognise at a glance, in a
 * row that costs half the height a text pill does. Visa and the e-wallets are
 * drawn as brand-coloured marks; COD and bank transfer are glyphs, because
 * cash and transfers have no brand.
 *
 * Lives apart from `components/ui/PaymentMarks` so the component file only
 * ever exports components (fast refresh stays happy).
 */
export type PaymentMark = { label: string; art: ReactNode };

export const PAYMENT_MARKS: PaymentMark[] = [
  {
    label: 'Visa',
    art: (
      <text
        x="22"
        y="19"
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fontStyle="italic"
        letterSpacing="0.5"
        fill="#1A1F71"
      >
        VISA
      </text>
    ),
  },
  {
    label: 'Mastercard',
    art: (
      <>
        <circle cx="18" cy="14" r="7.5" fill="#EB001B" />
        <circle cx="26" cy="14" r="7.5" fill="#F79E1B" fillOpacity="0.92" />
      </>
    ),
  },
  {
    label: 'Ví MoMo',
    art: (
      <>
        <rect width="44" height="28" fill="#A50064" />
        <text x="22" y="20" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">
          m
        </text>
      </>
    ),
  },
  {
    label: 'ZaloPay',
    art: (
      <>
        <rect width="44" height="28" fill="#0068FF" />
        <text x="22" y="20" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">
          Z
        </text>
      </>
    ),
  },
  {
    label: 'Thanh toán khi nhận hàng',
    art: (
      <g fill="none" stroke="#1A1B1E" strokeWidth="1.5">
        <rect x="8" y="7.5" width="28" height="14" rx="2.5" />
        <circle cx="22" cy="14.5" r="3.2" />
        <path d="M12.5 11.5h.01M31.5 17.5h.01" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    ),
  },
];

const BANK_MARK: PaymentMark = {
  label: 'Chuyển khoản ngân hàng',
  art: (
    <g fill="none" stroke="#1A1B1E" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M7.5 11 22 5.5 36.5 11" />
      <path d="M11.5 12.5v8M18.5 12.5v8M25.5 12.5v8M32.5 12.5v8" />
      <path d="M8.5 21.5h27M8.5 24h27" />
    </g>
  ),
};

/** Lookup used where a method is chosen (checkout) rather than listed. */
export const PAYMENT_MARK_BY_ID: Record<string, PaymentMark> = {
  cod: PAYMENT_MARKS[4],
  momo: PAYMENT_MARKS[2],
  visa: PAYMENT_MARKS[0],
  bank: BANK_MARK,
};
