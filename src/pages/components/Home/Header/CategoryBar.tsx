import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface SubItem {
  key: string;
}

interface Category {
  id: string;
  labelKey: string;
  subs: SubItem[] | null;
}

const CATEGORIES: Category[] = [
  { id: "fashion", labelKey: "category.fashion.label", subs: [
    { key: "men" },
    { key: "women" },
    { key: "clothesShoes" },
    { key: "hats" },
    { key: "accessories" },
  ] },
  { id: "electronics", labelKey: "category.electronics.label", subs: [
    { key: "phones" },
    { key: "laptops" },
    { key: "audio" },
    { key: "accessories" },
  ] },
  { id: "homeLiving", labelKey: "category.homeLiving.label", subs: [
    { key: "furniture" },
    { key: "kitchen" },
    { key: "decor" },
    { key: "bedding" },
  ] },
  { id: "beauty", labelKey: "category.beauty.label", subs: [
    { key: "skincare" },
    { key: "makeup" },
    { key: "fragrance" },
  ] },
  { id: "motherBaby", labelKey: "category.motherBaby.label", subs: [
    { key: "diapers" },
    { key: "formula" },
    { key: "toys" },
    { key: "clothes" },
  ] },
  { id: "sports", labelKey: "category.sports.label", subs: [
    { key: "gym" },
    { key: "football" },
    { key: "bicycle" },
    { key: "swimming" },
  ] },
  { id: "booksOffice", labelKey: "category.booksOffice.label", subs: [
    { key: "books" },
    { key: "stationery" },
    { key: "schoolSupplies" },
  ] },
  { id: "handmade", labelKey: "category.handmade.label", subs: [
    { key: "decor" },
    { key: "jewelry" },
    { key: "gifts" },
  ] },
];

const PANEL_WIDTH = 224; // w-56

interface Hovered {
  id: string;
  left: number;
  width: number;
  hasSubs: boolean;
}

const CategoryBar = () => {
  const { t } = useTranslation();
  const barRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Hovered | null>(null);

  const handleItemEnter = (catId: string, hasSubs: boolean) => (e: React.MouseEvent<HTMLElement>) => {
    const bar = barRef.current;
    const item = e.currentTarget;
    if (!bar) return;
    const barRect = bar.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setHovered({
      id: catId,
      left: itemRect.left - barRect.left,
      width: itemRect.width,
      hasSubs,
    });
  };

  const hoveredCat = hovered ? CATEGORIES.find((c) => c.id === hovered.id) : null;

  const panelLeft = (() => {
    if (!hovered) return 0;
    const barWidth = barRef.current?.getBoundingClientRect().width ?? 0;
    const center = hovered.left + hovered.width / 2;
    const half = PANEL_WIDTH / 2;
    return Math.min(Math.max(center, half + 8), Math.max(barWidth - half - 8, half + 8));
  })();

  return (
    <div
      ref={barRef}
      className="relative bg-ink text-white"
      onMouseLeave={() => setHovered(null)}
    >
      <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-1 px-6 py-3 whitespace-nowrap lg:justify-center lg:gap-x-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onMouseEnter={handleItemEnter(cat.id, !!cat.subs)}
            className={`block py-1 text-sm transition-colors ${
              hovered?.id === cat.id ? "text-gold" : "text-white hover:text-gold"
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}

        <button
          type="button"
          onMouseEnter={handleItemEnter("sell", false)}
          className={`block py-1 text-sm font-semibold transition-colors ${
            hovered?.id === "sell" ? "text-gold-deep" : "text-gold hover:text-gold-deep"
          }`}
        >
          {t("category.sellWithVendora")} <span aria-hidden>→</span>
        </button>
      </div>

      {hovered && (
        <span
          className="absolute bottom-0 h-[3px] bg-teal-light transition-none"
          style={{ left: hovered.left, width: hovered.width }}
        />
      )}

      {hoveredCat?.subs && (
        <div
          className="absolute top-full z-30 border-t border-line bg-white py-2 text-ink shadow-xl"
          style={{
            width: PANEL_WIDTH,
            left: panelLeft,
            transform: "translateX(-50%)",
          }}
        >
          {hoveredCat.subs.map((sub) => (
            <button
              key={sub.key}
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-paper-2 hover:text-gold-deep"
            >
              {t(`category.${hoveredCat.id}.items.${sub.key}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBar;
