import type { ReactNode } from "react";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";

export const inputCls =
  "w-full border border-line bg-paper-2/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:bg-white";

export const TONE: Record<string, string> = {
  neutral: "bg-paper-2/70 text-ink/70",
  ink: "bg-ink text-white",
  gold: "bg-gold/15 text-gold-deep",
  teal: "bg-teal-light/40 text-teal",
  green: "bg-[#2C4A43]/12 text-[#2C4A43]",
  red: "bg-[#8B3A2B]/10 text-[#8B3A2B]",
  amber: "bg-gold/15 text-gold-deep",
};

export interface PillProps {
  tone?: keyof typeof TONE;
  children: ReactNode;
  className?: string;
}

export const Pill = ({ tone = "neutral", children, className = "" }: PillProps) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${TONE[tone]} ${className}`}
  >
    {children}
  </span>
);

export interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  icon?: string;
  spark?: number[];
  accent?: string;
}

export const Sparkline = ({ data, color = "var(--color-gold)" }: { data: number[]; color?: string }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1 || 1)) * 100},${28 - ((v - min) / range) * 24}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-7 w-full">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

export const StatCard = ({ label, value, delta, deltaUp = true, icon, spark }: StatCardProps) => (
  <section className="border border-line bg-white p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <TextCustom as="p" variant="caption" className="font-bold uppercase tracking-wide">
          {label}
        </TextCustom>
        <TextCustom as="p" className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
          {value}
        </TextCustom>
      </div>
      {icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper-2/60 text-gold-deep">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
            <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </div>
    <div className="mt-3 flex items-end justify-between gap-3">
      {delta && (
        <TextCustom as="span" variant="caption" className={`font-bold ${deltaUp ? "!text-[#2C4A43]" : "!text-[#8B3A2B]"}`}>
          {deltaUp ? "▲" : "▼"} {delta}
        </TextCustom>
      )}
      {spark && (
        <div className="w-24 shrink-0">
          <Sparkline data={spark} color={deltaUp === false ? "var(--color-gold-deep)" : "var(--color-gold)"} />
        </div>
      )}
    </div>
  </section>
);

export const BarChart = ({
  data,
  format = (v: number) => String(v),
  height = 180,
}: {
  data: { label: string; value: number }[];
  format?: (v: number) => string;
  height?: number;
}) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <TextCustom as="span" variant="caption" className="opacity-0 transition-opacity group-hover:opacity-100">
            {format(d.value)}
          </TextCustom>
          <div
            className="w-full bg-gold/25 transition-colors group-hover:bg-gold"
            style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
          />
          <TextCustom as="span" variant="caption" className="truncate">
            {d.label}
          </TextCustom>
        </div>
      ))}
    </div>
  );
};

export const DonutChart = ({ slices }: { slices: { label: string; value: number; color: string }[] }) => {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const R = 54;
  const C = 2 * Math.PI * R;
  // Precompute each arc's length + start offset so nothing is mutated during render.
  const arcs = slices.reduce<{ slice: (typeof slices)[number]; len: number; offset: number }[]>((acc, slice) => {
    const prev = acc[acc.length - 1];
    acc.push({
      slice,
      len: (slice.value / total) * C,
      offset: prev ? prev.offset + prev.len : 0,
    });
    return acc;
  }, []);
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-40 w-40 shrink-0 -rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--color-paper-2)" strokeWidth="16" />
        {arcs.map(({ slice, len, offset }, i) => (
          <circle
            key={i}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={slice.color}
            strokeWidth="16"
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-offset}
          />
        ))}
      </svg>
      <ul className="space-y-2">
        {slices.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0" style={{ background: s.color }} />
            <TextCustom as="span" variant="body-sm" className="text-ink/80">
              {s.label}
            </TextCustom>
            <TextCustom as="span" variant="caption" className="font-bold !text-ink">
              {Math.round((s.value / total) * 100)}%
            </TextCustom>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Modal = ({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 sm:items-center" onClick={onClose}>
    <section
      className={`my-8 w-full ${wide ? "max-w-2xl" : "max-w-lg"} border border-line bg-white p-6`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4">
        <TextCustom variant="h4">{title}</TextCustom>
        <ButtonCustom
          variant="raw"
          aria-label="Close"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center text-ink/50 transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </ButtonCustom>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  </div>
);

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <TextCustom as="span" variant="caption" className="font-bold uppercase tracking-wide">
      {label}
    </TextCustom>
    <div className="mt-1.5">{children}</div>
  </label>
);

export const Toggle = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) => (
  <ButtonCustom
    variant="raw"
    type="button"
    onClick={() => onChange(!checked)}
    aria-pressed={checked}
    className="flex items-center gap-3"
  >
    <span
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-teal" : "bg-line"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
      />
    </span>
    {label && (
      <TextCustom as="span" variant="body-sm" className="font-semibold text-ink">
        {label}
      </TextCustom>
    )}
  </ButtonCustom>
);

export const EmptyState = ({ text }: { text: string }) => (
  <div className="p-10 text-center">
    <TextCustom as="p" variant="body" color="!text-ink/50">
      {text}
    </TextCustom>
  </div>
);

/** Deterministic pseudo-random series so charts look alive without real APIs. */
export const series = (seed: number, n: number, base: number, spread: number) =>
  Array.from({ length: n }, (_, i) => {
    const v = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
    return Math.round(base + (v - Math.floor(v)) * spread);
  });

export const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;
export const vndShort = (n: number) =>
  n >= 1_000_000_000
    ? `${(n / 1_000_000_000).toFixed(1)} tỷ`
    : n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)} tr`
      : n >= 1_000
        ? `${(n / 1_000).toFixed(0)}k`
        : `${n}`;
