import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

const ICONS: Record<string, ReactNode> = {
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
      <path d="M1.5 6h12v10h-12z" strokeLinejoin="round" />
      <path d="M13.5 9h4l3 3v4h-7" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
      <path d="M12 3l7.5 2.8v5.4c0 4.5-3.2 8.2-7.5 9.8-4.3-1.6-7.5-5.3-7.5-9.8V5.8L12 3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  returns: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
      <path d="M3 12a9 9 0 1 0 2.6-6.3" strokeLinecap="round" />
      <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  payment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
      <path d="M20 12H4" strokeLinecap="round" />
      <path d="M10 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const TrustBar = () => {
  const { t } = useTranslation();

  const items = ["shipping", "seller", "returns", "payment"] as const;

  return (
    <section className="border-t border-line bg-paper-2/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-10">
        {items.map((key, i) => (
          <div
            key={key}
            className={`flex items-center gap-3 px-2 lg:justify-center lg:px-6 ${
              i > 0 ? "lg:border-l lg:border-line" : ""
            }`}
          >
            <span className="shrink-0 text-gold-deep">{ICONS[key]}</span>
            <div>
              <p className="text-sm font-bold text-ink">
                {t(`trust.${key}.title`)}
              </p>
              <p className="text-xs text-ink/60">{t(`trust.${key}.sub`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
