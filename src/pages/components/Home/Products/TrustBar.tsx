import { useTranslation } from "react-i18next";
import Icon, { type IconName } from "../../../../components/brand/Icon";

/*
 * One glyph per promise, taken from the brand set so the stroke weight matches
 * every other icon on the site (the keys used to drift from `items`, which
 * silently dropped two of the four icons).
 */
const ICONS: Record<string, IconName> = {
  shipping: "truck",
  seller: "shield",
  returns: "refresh",
  payment: "wallet",
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
            <span className="shrink-0 text-gold-deep">
              <Icon name={ICONS[key]} className="h-7 w-7" />
            </span>
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
