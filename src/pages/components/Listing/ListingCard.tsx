import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ListingProduct } from "../../../data/categoryData";
import { formatVnd } from "../Home/Products/ProductSection";

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "#8B3A2B" : "none"}
    stroke={filled ? "#8B3A2B" : "currentColor"}
    strokeWidth={2}
    className="h-5 w-5"
  >
    <path
      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Stars = ({ value }: { value: number }) => (
  <span className="text-sm text-gold" aria-hidden>
    {Array.from({ length: 5 }, (_, i) => {
      const full = value >= i + 1;
      const half = !full && value >= i + 0.5;
      return (
        <span key={i} className={full || half ? "" : "text-gold/40"}>
          {full ? "★" : half ? "⯨" : "★"}
        </span>
      );
    })}
  </span>
);

interface ListingCardProps {
  product: ListingProduct;
  variant?: "grid" | "list";
}

const ListingCard = ({ product, variant = "grid" }: ListingCardProps) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);

  const image = (
    <div
      className={`relative shrink-0 overflow-hidden ${
        variant === "grid" ? "aspect-square w-full" : "aspect-square w-40 sm:w-48"
      }`}
      style={{ backgroundColor: product.color }}
    >
      <div className="placeholder-diagonal absolute inset-6 opacity-40" />
      {product.badge && (
        <span
          className={`absolute left-3 top-3 px-2.5 py-1 text-xs font-bold text-white ${
            product.badge === "new" ? "bg-gold" : "bg-gold-deep"
          }`}
        >
          {product.badge === "new"
            ? t("product.badgeNew")
            : t("product.badgeSale", {
                percent: Math.round(
                  (1 - product.price / (product.oldPrice ?? product.price)) * 100
                ),
              })}
        </span>
      )}
      <button
        type="button"
        aria-pressed={liked}
        aria-label={t("listing.addToWishlist")}
        onClick={(e) => {
          e.stopPropagation();
          setLiked((v) => !v);
        }}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-sm transition-transform hover:scale-105"
      >
        <HeartIcon filled={liked} />
      </button>
    </div>
  );

  if (variant === "list") {
    return (
      <div className="group flex cursor-pointer gap-5 border border-line bg-white p-4 transition-colors hover:border-ink/40">
        {image}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-sm text-ink/60">{product.seller}</p>
          <h3 className="mt-1 text-base font-semibold text-ink transition-colors group-hover:text-gold-deep">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5">
            <Stars value={product.rating} />
            <span className="text-xs text-ink/50">({product.reviews})</span>
          </div>
          <p className="mt-2 hidden text-sm text-ink/60 sm:line-clamp-2">
            {t("listing.shortDesc", { seller: product.seller })}
          </p>
          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <span className="text-lg font-bold text-ink">{formatVnd(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-ink/40 line-through decoration-ink/40">
                {formatVnd(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer">
      {image}
      <p className="mt-3 text-sm text-ink/60">{product.seller}</p>
      <h3 className="mt-0.5 text-base font-semibold text-ink transition-colors group-hover:text-gold-deep">
        {product.name}
      </h3>
      <div className="mt-1 flex items-center gap-1.5">
        <Stars value={product.rating} />
        <span className="text-xs text-ink/50">({product.reviews})</span>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-bold text-ink">{formatVnd(product.price)}</span>
        {product.oldPrice && (
          <span className="text-sm text-ink/40 line-through decoration-ink/40">
            {formatVnd(product.oldPrice)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
