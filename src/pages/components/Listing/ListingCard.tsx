import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
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
      <ButtonCustom
        variant="raw"
        aria-pressed={liked}
        ariaLabel={t("listing.addToWishlist")}
        onClick={(e) => {
          e.stopPropagation();
          setLiked((v) => !v);
        }}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-sm transition-transform hover:scale-105"
      >
        <HeartIcon filled={liked} />
      </ButtonCustom>
    </div>
  );

  if (variant === "list") {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group flex cursor-pointer gap-5 border border-line bg-white p-4 transition-colors hover:border-ink/40"
      >
        {image}
        <div className="flex min-w-0 flex-1 flex-col">
          <Link to={`/shop/${encodeURIComponent(product.seller)}`} className="w-fit text-sm text-ink/60 transition-colors hover:text-gold-deep">
            {product.seller}
          </Link>
          <TextCustom variant="card-title" className="mt-1">
            {product.name}
          </TextCustom>
          <div className="mt-1 flex items-center gap-1.5">
            <Stars value={product.rating} />
            <TextCustom variant="caption">({product.reviews})</TextCustom>
          </div>
          <TextCustom
            as="p"
            variant="body-sm"
            className="mt-2 hidden sm:line-clamp-2"
          >
            {t("listing.shortDesc", { seller: product.seller })}
          </TextCustom>
          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <TextCustom variant="price-sm">{formatVnd(product.price)}</TextCustom>
            {product.oldPrice && (
              <TextCustom variant="price-old-sm">{formatVnd(product.oldPrice)}</TextCustom>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block cursor-pointer"
    >
      {image}
      <Link
        to={`/shop/${encodeURIComponent(product.seller)}`}
        className="mt-3 block w-fit text-sm text-ink/60 transition-colors hover:text-gold-deep"
      >
        {product.seller}
      </Link>
      <TextCustom variant="card-title" className="mt-0.5">
        {product.name}
      </TextCustom>
      <div className="mt-1 flex items-center gap-1.5">
        <Stars value={product.rating} />
        <TextCustom variant="caption">({product.reviews})</TextCustom>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <TextCustom variant="price-sm">{formatVnd(product.price)}</TextCustom>
        {product.oldPrice && (
          <TextCustom variant="price-old-sm">{formatVnd(product.oldPrice)}</TextCustom>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;
