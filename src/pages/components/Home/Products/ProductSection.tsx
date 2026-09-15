import { useTranslation } from "react-i18next";

export interface Product {
  id: string;
  seller: string;
  name: string;
  price: number;
  oldPrice?: number;
  badge?: "new" | "sale";
  color: string;
}

export const formatVnd = (n: number) =>
  n.toLocaleString("vi-VN").replace(/,/g, ".") + "\u00a0\u0111";

const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useTranslation();

  return (
    <div className="group cursor-pointer">
      {/* Image area */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: product.color }}
      >
        {/* Diagonal placeholder texture like the mockup */}
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
      </div>

      {/* Info */}
      <p className="mt-3 text-sm text-ink/60">{product.seller}</p>
      <h3 className="mt-0.5 text-base font-semibold text-ink transition-colors group-hover:text-gold-deep">
        {product.name}
      </h3>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-bold text-ink">
          {formatVnd(product.price)}
        </span>
        {product.oldPrice && (
          <span className="text-sm text-ink/40 line-through decoration-ink/40">
            {formatVnd(product.oldPrice)}
          </span>
        )}
      </div>
    </div>
  );
};

interface ProductSectionProps {
  titleKey: string;
  viewAllKey: string;
  products: Product[];
}

const ProductSection = ({ titleKey, viewAllKey, products }: ProductSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            {t(titleKey)}
          </h2>
          <button
            type="button"
            className="shrink-0 text-sm font-semibold text-ink underline decoration-ink underline-offset-8 transition-colors hover:text-gold-deep"
          >
            {t(viewAllKey)}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
