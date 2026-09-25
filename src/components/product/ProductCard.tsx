import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ButtonCustom from '../ButtonComponent/ButtonCustom';
import Icon from '../brand/Icon';
import { Seal, WovenSwatch } from '../brand/Stitch';
import Rating from './Rating';
import { useUiStore } from '../../stores/uiStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useToastStore } from '../../stores/toastStore';
import useAddToCart from '../../hooks/useAddToCart';
import { formatVnd } from '../../utils/format';
import { shade } from '../../utils/color';
import { discountPercent, swatchLabel, type ProductSnapshot } from '../../types/product';

export interface ProductCardProps {
  product: ProductSnapshot & { inStock?: boolean };
  /** `list` is the wide row used by the listing page's list view. */
  layout?: 'grid' | 'list';
  /** `compact` tightens type and spacing for horizontal rails. */
  density?: 'comfortable' | 'compact';
  className?: string;
  /** Hide the quick-view / add-to-cart bar (admin previews, read-only rails). */
  actions?: boolean;
}

/**
 * SIGNATURE COMPONENT — the product card.
 *
 * This is where the brand lives or dies: a shopper sees this dozens of times
 * per session. It carries four identifiers at once —
 *
 *   • the stitched gold frame around the visual, which grows on hover
 *   • the woven "maker's mark" tag with the stall's initial
 *   • wax-seal badges instead of stock ribbons
 *   • the thread-diamond rating
 *
 * …and it does real work too: hover reveals the second variant and the two
 * actions people actually want (quick view, add to cart) without leaving the
 * grid, while the whole visual stays a single tap to the product page.
 */
const ProductCard = ({
  product,
  layout = 'grid',
  density = 'comfortable',
  className = '',
  actions = true,
}: ProductCardProps) => {
  const { t } = useTranslation();
  const addToCart = useAddToCart();
  const openQuickView = useUiStore((s) => s.openQuickView);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const pushToast = useToastStore((s) => s.push);

  const [burst, setBurst] = useState(false);
  const [visual, setVisual] = useState<HTMLDivElement | null>(null);

  const discount = discountPercent(product.price, product.oldPrice);
  const compact = density === 'compact';
  const soldOut = product.inStock === false;
  const cartColor = product.colorHex ?? product.color;

  const handleWishlist = () => {
    const added = toggleWishlist({
      id: product.id,
      name: product.name,
      seller: product.seller,
      price: product.price,
      oldPrice: product.oldPrice,
      color: product.color,
      colorHex: product.colorHex,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      subSlug: product.subSlug,
      categorySlug: product.categorySlug,
    });
    setBurst(true);
    window.setTimeout(() => setBurst(false), 560);
    pushToast({
      tone: added ? 'success' : 'info',
      title: added
        ? t('feedback.wishlistAdded', 'Đã lưu vào yêu thích')
        : t('feedback.wishlistRemoved', 'Đã bỏ khỏi yêu thích'),
      message: product.name,
      icon: 'heart',
      swatchLabel: swatchLabel(product.name),
      duration: 2600,
    });
  };

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      seller: product.seller,
      price: product.price,
      oldPrice: product.oldPrice,
      colorHex: cartColor,
      colorKey: 'detail.colors.brown',
      qty: 1,
      stock: 99,
      inStock: !soldOut,
      origin: visual,
      swatch: product.color,
    });
  };

  /* ------------------------------ visuals ------------------------------ */

  const visualBlock = (
    <div
      ref={setVisual}
      data-fly-origin
      className={`brand-frame relative shrink-0 overflow-hidden border border-line bg-paper-2 ${
        layout === 'grid' ? 'aspect-square w-full' : compact ? 'aspect-square w-28' : 'aspect-square w-36 sm:w-48'
      }`}
    >
      {/* base tone */}
      <WovenSwatch
        color={product.color}
        label={compact ? undefined : swatchLabel(product.name)}
        className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-brand)] group-hover:scale-[1.04]"
      />
      {/* the second variant, revealed on hover: same product, turned in the light */}
      <WovenSwatch
        color={shade(product.color, -0.14)}
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-[var(--ease-brand)] group-hover:opacity-100 group-focus-within:opacity-100"
        seedIndex={2}
      />
      {/* loom weave deepens on hover — the surface itself reacts */}
      <span
        aria-hidden
        className="loom loom-strong absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-85"
      />

      {/* Wax seals */}
      {(product.badge === 'new' || discount) && (
        <div className="absolute left-2.5 top-2.5 z-[4] flex flex-col items-start gap-1.5">
          {product.badge === 'new' && (
            <Seal tone="ink" rotate={-6} className="animate-seal-in">
              {t('product.badgeNew', 'Mới')}
            </Seal>
          )}
          {discount && (
            <Seal tone="lacquer" rotate={-4}>
              −{discount}%
            </Seal>
          )}
        </div>
      )}

      {/* Wishlist — 44px touch target, bursts on save */}
      {actions && (
        <div className="absolute right-2 top-2 z-[6]">
          <ButtonCustom
            variant="raw"
            ariaLabel={
              wishlisted
                ? t('feedback.wishlistRemove', 'Bỏ khỏi yêu thích')
                : t('listing.addToWishlist', 'Thêm vào yêu thích')
            }
            aria-pressed={wishlisted}
            onClick={handleWishlist}
            className={`relative flex h-11 w-11 items-center justify-center border bg-surface/85 backdrop-blur-sm transition-all duration-300 sm:h-10 sm:w-10 ${
              wishlisted
                ? 'border-lacquer text-lacquer'
                : 'border-transparent text-ink/70 hover:border-line hover:text-ink'
            }`}
          >
            {burst && (
              <span
                aria-hidden
                className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-lacquer"
              />
            )}
            <Icon
              name="heart"
              className={`h-4.5 w-4.5 ${burst ? 'animate-wish-pop' : ''}`}
              filled={wishlisted}
            />
          </ButtonCustom>
        </div>
      )}

      {/* Maker's mark — the stall's initial, stitched into the corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2.5 left-2.5 z-[4] flex h-7 min-w-7 items-center justify-center border border-white/25 bg-ink/85 px-1.5 font-display text-xs text-gold-soft backdrop-blur-sm"
        title={product.seller}
      >
        {swatchLabel(product.seller)}
      </span>

      {soldOut && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center bg-paper/72 backdrop-blur-[1px]">
          <span className="border border-ink px-3 py-1 font-body text-[11px] font-bold uppercase tracking-[0.18em] text-ink">
            {t('card.outOfStock', 'Hết hàng')}
          </span>
        </div>
      )}

      {/* Hover/focus action bar. Always visible on touch, revealed on desktop. */}
      {actions && !soldOut && (
        <div className="absolute inset-x-0 bottom-0 z-[6] flex translate-y-0 items-stretch gap-px border-t border-gold/30 bg-ink/92 backdrop-blur-sm transition-transform duration-[380ms] ease-[var(--ease-brand)] sm:translate-y-full sm:group-hover:translate-y-0 sm:group-focus-within:translate-y-0">
          <ButtonCustom
            variant="raw"
            onClick={() => openQuickView(product.id)}
            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 font-body text-[11px] font-bold uppercase tracking-[0.12em] text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name="eye" className="h-3.5 w-3.5" />
            {t('card.quickView', 'Xem nhanh')}
          </ButtonCustom>
          <span aria-hidden className="w-px bg-white/15" />
          <ButtonCustom
            variant="raw"
            onClick={handleAdd}
            className="flex flex-[1.25] items-center justify-center gap-1.5 py-2.5 font-body text-[11px] font-bold uppercase tracking-[0.12em] text-gold-soft transition-colors hover:bg-gold hover:text-ink"
          >
            <Icon name="cart" className="h-3.5 w-3.5" />
            {t('card.addToCart', 'Thêm vào giỏ')}
          </ButtonCustom>
        </div>
      )}

      {/* Whole-visual link sits above the artwork, below the controls */}
      <Link
        to={`/product/${product.id}`}
        className="absolute inset-0 z-[3]"
        aria-label={t('card.openProduct', { name: product.name, defaultValue: 'Xem {{name}}' })}
      />
    </div>
  );

  /* -------------------------------- list -------------------------------- */

  if (layout === 'list') {
    return (
      <article className={`group relative flex gap-4 border border-line bg-surface p-3 transition-colors hover:border-ink/40 sm:gap-5 sm:p-4 ${className}`}>
        {visualBlock}

        <div className="flex min-w-0 flex-1 flex-col">
          <Link
            to={`/shop/${encodeURIComponent(product.seller)}`}
            className="w-fit font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/50 transition-colors hover:text-gold-deep"
          >
            {product.seller}
          </Link>
          <h3 className="mt-1.5 font-display text-lg leading-snug">
            <Link
              to={`/product/${product.id}`}
              className="text-ink transition-colors hover:text-gold-deep"
            >
              {product.name}
            </Link>
          </h3>

          {product.rating !== undefined && (
            <div className="mt-1.5">
              <Rating value={product.rating} count={product.reviews} />
            </div>
          )}

          <p className="mt-2 hidden font-body text-sm leading-relaxed text-ink/60 sm:line-clamp-2">
            {t('listing.shortDesc', { seller: product.seller, defaultValue: 'Được làm thủ công bởi {{seller}}, giao toàn quốc.' })}
          </p>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
            <div className="flex items-baseline gap-2">
              <span className="nums font-display text-xl font-semibold text-ink">
                {formatVnd(product.price)}
              </span>
              {product.oldPrice && (
                <span className="nums font-body text-xs text-ink/40 line-through">
                  {formatVnd(product.oldPrice)}
                </span>
              )}
            </div>

            {actions && !soldOut && (
              <div className="flex items-center gap-2">
                <ButtonCustom
                  variant="outline"
                  size="sm"
                  onClick={() => openQuickView(product.id)}
                  className="rounded-none"
                  icon={<Icon name="eye" className="h-3.5 w-3.5" />}
                >
                  {t('card.quickView', 'Xem nhanh')}
                </ButtonCustom>
                <ButtonCustom
                  variant="primary"
                  size="sm"
                  onClick={handleAdd}
                  className="rounded-none"
                  icon={<Icon name="cart" className="h-3.5 w-3.5" />}
                >
                  {t('card.addToCart', 'Thêm vào giỏ')}
                </ButtonCustom>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  /* -------------------------------- grid -------------------------------- */

  return (
    <article className={`group relative flex flex-col ${className}`}>
      {visualBlock}

      <div className="mt-3 flex min-w-0 flex-1 flex-col">
        <Link
          to={`/shop/${encodeURIComponent(product.seller)}`}
          className="w-fit font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45 transition-colors hover:text-gold-deep"
        >
          {product.seller}
        </Link>

        <h3 className={`mt-1 font-display leading-snug ${compact ? 'text-sm' : 'text-base'}`}>
          <Link
            to={`/product/${product.id}`}
            className="line-clamp-2 text-ink transition-colors hover:text-gold-deep"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {product.rating !== undefined && (
            <Rating value={product.rating} count={product.reviews} size={compact ? 8 : 10} />
          )}
          {discount && (
            <span className="font-body text-[11px] font-bold text-lacquer">
              −{discount}%
            </span>
          )}
        </div>

        {/* The stitched price rule draws in on hover — a small reward for reaching */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className={`nums font-display font-semibold text-ink ${compact ? 'text-base' : 'text-lg'}`}>
            {formatVnd(product.price)}
          </span>
          {product.oldPrice && (
            <span className="nums font-body text-xs text-ink/40 line-through">
              {formatVnd(product.oldPrice)}
            </span>
          )}
        </div>
        <span
          aria-hidden
          className="stitch-rule mt-2.5 w-0 opacity-0 transition-all duration-500 ease-[var(--ease-brand)] group-hover:w-16 group-hover:opacity-100"
        />
      </div>
    </article>
  );
};

export default ProductCard;
