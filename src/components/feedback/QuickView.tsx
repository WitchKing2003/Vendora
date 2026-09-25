import { useRef, useState, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ButtonCustom from '../ButtonComponent/ButtonCustom';
import Icon from '../brand/Icon';
import { Seal, WovenSwatch } from '../brand/Stitch';
import Rating from '../product/Rating';
import QtyStepper from '../ui/QtyStepper';
import { getProductDetail, type ProductDetail } from '../../data/categoryData';
import { useUiStore } from '../../stores/uiStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import useAddToCart from '../../hooks/useAddToCart';
import { useBodyScrollLock, useEscapeKey, useFocusTrap, usePresence } from '../../hooks/useOverlay';
import { formatVnd } from '../../utils/format';
import { swatchLabel } from '../../types/product';

/**
 * The body of a quick view. Remounted (via `key`) for every product, so each
 * one starts with a clean variant/size/quantity selection — no reset effects.
 */
const QuickViewBody = ({
  detail,
  isOpen,
  panelRef,
  onClose,
}: {
  detail: ProductDetail;
  isOpen: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const addToCart = useAddToCart();
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.items.some((i) => i.id === detail.id));

  const [colorIdx, setColorIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const galleryRef = useRef<HTMLDivElement>(null);

  const discount = detail.oldPrice
    ? Math.round((1 - detail.price / detail.oldPrice) * 100)
    : null;

  const effectiveSizeIdx =
    sizeIdx !== null
      ? sizeIdx
      : detail.sizes.length > 0
        ? Math.max(
            0,
            detail.sizes.findIndex((s) => s.label === 'M' && !s.disabled) >= 0
              ? detail.sizes.findIndex((s) => s.label === 'M' && !s.disabled)
              : detail.sizes.findIndex((s) => !s.disabled)
          )
        : null;

  const selectedColor = detail.variantColors[colorIdx] ?? detail.variantColors[0];

  const handleAdd = () => {
    addToCart({
      productId: detail.id,
      name: detail.name,
      seller: detail.seller,
      price: detail.price,
      oldPrice: detail.oldPrice,
      colorHex: selectedColor.hex,
      colorKey: selectedColor.nameKey,
      size: effectiveSizeIdx !== null ? detail.sizes[effectiveSizeIdx]?.label : undefined,
      qty,
      stock: detail.stock,
      inStock: true,
      origin: galleryRef.current,
      swatch: detail.color,
    });
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-[88] bg-ink/55 backdrop-blur-[3px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div className="fixed inset-0 z-[89] flex items-end justify-center p-0 sm:items-center sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={detail.name}
          tabIndex={-1}
          className={`relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-line bg-paper shadow-float transition-all duration-300 ease-[var(--ease-brand)] sm:max-h-[88vh] ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <ButtonCustom
            variant="raw"
            ariaLabel={t('quickView.close', 'Đóng xem nhanh')}
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center border border-line bg-surface/90 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-white"
          >
            <Icon name="close" className="h-4.5 w-4.5" />
          </ButtonCustom>

          <div className="grid gap-0 sm:grid-cols-2">
            {/* Gallery */}
            <div className="bg-paper-2 p-4 sm:p-6">
              <div
                ref={galleryRef}
                data-fly-origin
                className="brand-frame relative aspect-square overflow-hidden border border-line"
              >
                <WovenSwatch
                  color={selectedColor.hex}
                  label={swatchLabel(detail.name)}
                  className="h-full w-full"
                  seedIndex={colorIdx}
                />
                <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-2">
                  {detail.badge === 'new' && (
                    <Seal tone="ink" rotate={-6}>
                      {t('product.badgeNew', 'Mới')}
                    </Seal>
                  )}
                  {discount && (
                    <Seal tone="lacquer" rotate={-4}>
                      −{discount}%
                    </Seal>
                  )}
                </div>
              </div>

              {detail.variantColors.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {detail.variantColors.map((v, i) => (
                    <ButtonCustom
                      key={v.hex}
                      variant="raw"
                      ariaLabel={t(v.nameKey)}
                      aria-pressed={i === colorIdx}
                      onClick={() => setColorIdx(i)}
                      className={`relative h-14 w-14 overflow-hidden border transition-all duration-200 ${
                        i === colorIdx
                          ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper-2'
                          : 'border-line hover:border-ink/50'
                      }`}
                      style={{ backgroundColor: v.hex }}
                    >
                      <span aria-hidden className="loom absolute inset-0" />
                    </ButtonCustom>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col p-5 sm:p-7">
              <Link
                to={`/shop/${encodeURIComponent(detail.seller)}`}
                onClick={onClose}
                className="w-fit font-body text-[11px] font-bold uppercase tracking-[0.18em] text-gold-deep transition-colors hover:text-ink"
              >
                {detail.seller}
              </Link>

              <h2 className="mt-2 font-display text-2xl leading-snug text-ink">{detail.name}</h2>

              <div className="mt-2.5">
                <Rating value={detail.rating} count={detail.reviews} showValue />
              </div>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="nums font-display text-3xl font-semibold text-ink">
                  {formatVnd(detail.price)}
                </span>
                {detail.oldPrice && (
                  <span className="nums font-body text-sm text-ink/40 line-through">
                    {formatVnd(detail.oldPrice)}
                  </span>
                )}
                {discount && (
                  <span className="font-body text-xs font-bold text-lacquer">
                    {t('quickView.save', {
                      percent: discount,
                      defaultValue: 'Tiết kiệm {{percent}}%',
                    })}
                  </span>
                )}
              </div>

              <p className="mt-3 flex items-center gap-1.5 font-body text-xs">
                {detail.stock > 0 ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-success">
                      {t('quickView.inStock', {
                        count: detail.stock,
                        defaultValue: 'Còn {{count}} sản phẩm',
                      })}
                    </span>
                  </>
                ) : (
                  <span className="text-lacquer">{t('cart.tempOutOfStock', 'Tạm hết hàng')}</span>
                )}
              </p>

              {detail.variantColors.length > 1 && (
                <div className="mt-5">
                  <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
                    {t('detail.colorLabel', 'Màu:')}{' '}
                    <span className="font-normal normal-case tracking-normal text-ink/80">
                      {t(selectedColor.nameKey)}
                    </span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detail.variantColors.map((v, i) => (
                      <ButtonCustom
                        key={v.hex}
                        variant="raw"
                        ariaLabel={t(v.nameKey)}
                        aria-pressed={i === colorIdx}
                        onClick={() => setColorIdx(i)}
                        className={`h-9 w-9 border transition-all ${
                          i === colorIdx
                            ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper'
                            : 'border-line hover:border-ink/50'
                        }`}
                        style={{ backgroundColor: v.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {detail.sizes.length > 0 && (
                <div className="mt-5">
                  <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
                    {t('detail.sizeLabel', 'Size:')}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detail.sizes.map((s, i) => (
                      <ButtonCustom
                        key={s.label}
                        variant="raw"
                        disabled={s.disabled}
                        aria-pressed={i === effectiveSizeIdx}
                        onClick={() => setSizeIdx(i)}
                        className={`h-10 min-w-12 border px-3 font-body text-sm transition-all ${
                          s.disabled
                            ? 'cursor-not-allowed border-line text-ink/25 line-through'
                            : i === effectiveSizeIdx
                              ? 'border-ink bg-ink text-white'
                              : 'border-line bg-surface text-ink hover:border-ink'
                        }`}
                      >
                        {s.label}
                      </ButtonCustom>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <QtyStepper value={qty} max={Math.max(detail.stock, 1)} onChange={setQty} size="sm" />
                <ButtonCustom
                  variant="raw"
                  ariaLabel={t('detail.wishlist', 'Yêu thích')}
                  aria-pressed={wishlisted}
                  onClick={() =>
                    toggleWishlist({
                      id: detail.id,
                      name: detail.name,
                      seller: detail.seller,
                      price: detail.price,
                      oldPrice: detail.oldPrice,
                      color: detail.color,
                      colorHex: detail.colorHex,
                      rating: detail.rating,
                      reviews: detail.reviews,
                      badge: detail.badge,
                      categorySlug: detail.slug,
                      subSlug: detail.subSlug,
                    })
                  }
                  className={`flex h-10 w-10 items-center justify-center border transition-colors ${
                    wishlisted
                      ? 'border-lacquer text-lacquer'
                      : 'border-line text-ink/60 hover:border-ink hover:text-ink'
                  }`}
                >
                  <Icon name="heart" className="h-4 w-4" filled={wishlisted} />
                </ButtonCustom>
              </div>

              <div className="mt-auto pt-6">
                <ButtonCustom
                  variant="primary"
                  fullWidth
                  size="lg"
                  className="rounded-none"
                  disabled={detail.stock <= 0}
                  onClick={handleAdd}
                  icon={<Icon name="cart" className="h-4 w-4" />}
                >
                  {t('detail.addToCart', 'Thêm vào giỏ')}
                </ButtonCustom>
                <Link
                  to={`/product/${detail.id}`}
                  onClick={onClose}
                  className="mt-3 flex items-center justify-center gap-1.5 font-body text-xs font-semibold uppercase tracking-[0.14em] text-ink/55 transition-colors hover:text-gold-deep"
                >
                  {t('quickView.viewDetails', 'Xem chi tiết sản phẩm')}
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Quick view — the "compare naturally" affordance.
 *
 * Peeking at a product should never cost the shopper their place in the grid,
 * so the essential decision (variant, size, quantity, price, stock) is
 * available here and the full page stays one click away for the deep read.
 */
const QuickView = () => {
  const productId = useUiStore((s) => s.quickViewId);
  const closeQuickView = useUiStore((s) => s.closeQuickView);

  const detail = productId ? getProductDetail(productId) : null;
  const open = Boolean(productId && detail);

  const { mounted, open: isOpen } = usePresence(open, 320);
  useBodyScrollLock(open);
  useEscapeKey(open, closeQuickView);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  if (!mounted || !detail) return null;

  return (
    <QuickViewBody
      key={detail.id}
      detail={detail}
      isOpen={isOpen}
      panelRef={panelRef}
      onClose={closeQuickView}
    />
  );
};

export default QuickView;
