import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ButtonCustom from '../ButtonComponent/ButtonCustom';
import Icon from '../brand/Icon';
import { Kicker } from '../brand/Stitch';
import { EmptyState } from './States';
import QtyStepper from '../ui/QtyStepper';
import {
  FREE_SHIP_THRESHOLD,
  cartTotals,
  remainingForFreeShip,
  useCartStore,
  type CartItem,
} from '../../stores/cartStore';
import { useToastStore } from '../../stores/toastStore';
import { useUiStore } from '../../stores/uiStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import {
  useBodyScrollLock,
  useEscapeKey,
  useFocusTrap,
  usePresence,
} from '../../hooks/useOverlay';
import { formatVnd } from '../../utils/format';
import { swatchLabel } from '../../types/product';

/**
 * SIGNATURE INTERACTION #4 — the cart drawer.
 *
 * Slides in from the right edge, never steals the page. Keeps the shopper in
 * context: they can adjust quantities, drop a line, or move it to the wishlist
 * without leaving where they were. Closing is animated too, so it feels like
 * the drawer was physically slid shut rather than deleted.
 */
const CartDrawer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const open = useUiStore((s) => s.cartOpen);
  const closeCart = useUiStore((s) => s.closeCart);

  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const addItem = useCartStore((s) => s.addItem);
  const voucher = useCartStore((s) => s.voucher);

  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const pushToast = useToastStore((s) => s.push);

  const { mounted, open: isOpen } = usePresence(open, 420);
  useBodyScrollLock(open);
  useEscapeKey(open, closeCart);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  const inStockIds = useMemo(() => items.filter((i) => i.inStock).map((i) => i.id), [items]);
  const totals = useMemo(
    () => cartTotals(items, inStockIds, voucher),
    [items, inStockIds, voucher]
  );

  const progress = Math.min(100, Math.round((totals.selectedSubtotal / FREE_SHIP_THRESHOLD) * 100));
  const remaining = remainingForFreeShip(totals.selectedSubtotal);

  if (!mounted) return null;

  const handleRemove = (item: CartItem) => {
    removeItem(item.id);
    pushToast({
      tone: 'info',
      title: t('drawer.removed', 'Đã xoá khỏi giỏ'),
      message: item.name,
      swatch: item.colorHex,
      swatchLabel: swatchLabel(item.name),
      action: {
        label: t('drawer.undo', 'Hoàn tác'),
        onClick: () =>
          addItem({
            productId: item.productId,
            name: item.name,
            seller: item.seller,
            price: item.price,
            oldPrice: item.oldPrice,
            colorHex: item.colorHex,
            colorKey: item.colorKey,
            size: item.size,
            qty: item.qty,
            stock: item.stock,
            inStock: item.inStock,
          }),
      },
    });
  };

  const handleSaveForLater = (item: CartItem) => {
    toggleWishlist({
      id: item.productId,
      name: item.name,
      seller: item.seller,
      price: item.price,
      oldPrice: item.oldPrice,
      color: item.colorHex,
    });
    removeItem(item.id);
    pushToast({
      tone: 'success',
      title: t('drawer.savedForLater', 'Đã lưu để mua sau'),
      message: item.name,
      swatch: item.colorHex,
      swatchLabel: swatchLabel(item.name),
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeCart}
        className={`fixed inset-0 z-[85] bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300 ease-[var(--ease-brand)] ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title', 'Giỏ hàng')}
        tabIndex={-1}
        className={`fixed right-0 top-0 z-[86] flex h-full w-full max-w-[26.5rem] flex-col border-l border-line bg-paper shadow-float transition-transform duration-[420ms] ease-[var(--ease-brand)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-line bg-surface px-5 py-4">
          <div>
            <Kicker>{t('cart.title', 'Giỏ hàng')}</Kicker>
            <p className="mt-1.5 font-display text-2xl text-ink">
              <span className="nums">{totals.selectedCount}</span>{' '}
              <span className="font-body text-sm text-ink/55">
                {t('drawer.items', 'sản phẩm')}
              </span>
            </p>
          </div>
          <ButtonCustom
            variant="raw"
            ariaLabel={t('drawer.close', 'Đóng giỏ hàng')}
            onClick={closeCart}
            className="-mr-1 flex h-11 w-11 items-center justify-center text-ink/50 transition-colors hover:text-ink"
          >
            <Icon name="close" className="h-5 w-5" />
          </ButtonCustom>
        </div>

        {/* Free-shipping thread — the drawer's signature element */}
        {items.length > 0 && (
          <div className="border-b border-line bg-gold-mist/50 px-5 py-3">
            <div className="relative h-1.5 bg-paper-3">
              <div
                aria-hidden
                className="h-full bg-gradient-to-r from-gold to-gold-deep transition-[width] duration-700 ease-[var(--ease-brand)]"
                style={{ width: `${progress}%` }}
              />
              {/* needle marker */}
              <span
                aria-hidden
                className="absolute -top-1 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border border-gold-deep bg-paper transition-[left] duration-700 ease-[var(--ease-brand)]"
                style={{ left: `${progress}%` }}
              />
            </div>
            <p className="mt-2 font-body text-xs text-ink/70">
              {remaining > 0 ? (
                <>
                  {t('cart.remainingForFreeShip', {
                    amount: formatVnd(remaining),
                    defaultValue: 'Còn {{amount}} để được miễn phí vận chuyển',
                  })}
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-semibold text-gold-deep">
                  <Icon name="sparkles" className="h-3.5 w-3.5" />
                  {t('cart.freeShipUnlocked', 'Miễn phí vận chuyển từ 300.000đ')}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Lines */}
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon="cart"
              title={t('drawer.emptyTitle', 'Giỏ hàng đang trống')}
              message={t(
                'drawer.emptyMessage',
                'Bắt đầu dệt nên đơn hàng của bạn — ghé thăm các gian hàng trong phiên chợ nhé.'
              )}
              action={
                <ButtonCustom
                  variant="primary"
                  onClick={() => {
                    closeCart();
                    navigate('/category/handmade');
                  }}
                  className="rounded-none"
                  icon={<Icon name="stall" className="h-4 w-4" />}
                >
                  {t('drawer.browse', 'Khám phá gian hàng')}
                </ButtonCustom>
              }
            />
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3.5 px-5 py-4">
                  <span
                    className="relative h-[4.6rem] w-[4.6rem] shrink-0 overflow-hidden border border-line"
                    style={{ backgroundColor: item.colorHex }}
                  >
                    <span aria-hidden className="loom loom-strong absolute inset-0" />
                    <span className="absolute bottom-1 right-1.5 font-display text-xl text-ink/35">
                      {swatchLabel(item.name)}
                    </span>
                    {!item.inStock && (
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/60 font-body text-[10px] font-bold uppercase tracking-wider text-white">
                        {t('cart.outOfStock', 'Hết hàng')}
                      </span>
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-[11px] uppercase tracking-[0.14em] text-ink/45">
                      {item.seller}
                    </p>
                    <p className="mt-0.5 line-clamp-2 font-body text-sm font-semibold leading-snug text-ink">
                      {item.name}
                    </p>
                    <p className="mt-1 font-body text-xs text-ink/55">
                      {t('cart.variantColor', 'Màu:')}{' '}
                      <span className="font-medium text-ink/70">{t(item.colorKey)}</span>
                      {item.size && (
                        <>
                          {' · '}
                          {t('cart.variantSize', 'Size')}{' '}
                          <span className="font-medium text-ink/70">{item.size}</span>
                        </>
                      )}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <QtyStepper
                        size="sm"
                        value={item.qty}
                        max={Math.max(item.stock, 1)}
                        onChange={(next) => updateQty(item.id, next)}
                      />
                      <span className="nums font-body text-sm font-bold text-ink">
                        {formatVnd(item.price * item.qty)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-3.5">
                      <ButtonCustom
                        variant="raw"
                        onClick={() => handleSaveForLater(item)}
                        className="inline-flex items-center gap-1 font-body text-[11px] font-semibold text-ink/45 transition-colors hover:text-gold-deep"
                      >
                        <Icon name="heart" className="h-3.5 w-3.5" />
                        {t('cart.saveForLater', 'Lưu mua sau')}
                      </ButtonCustom>
                      <ButtonCustom
                        variant="raw"
                        onClick={() => handleRemove(item)}
                        className="inline-flex items-center gap-1 font-body text-[11px] font-semibold text-ink/45 transition-colors hover:text-lacquer"
                      >
                        <Icon name="trash" className="h-3.5 w-3.5" />
                        {t('cart.removeItem', 'Xoá')}
                      </ButtonCustom>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <div className="border-t border-line bg-surface px-5 py-4">
              <dl className="space-y-1.5 font-body text-sm">
                <div className="flex justify-between text-ink/70">
                  <dt>{t('cart.subtotal', { count: totals.selectedCount, defaultValue: 'Tạm tính' })}</dt>
                  <dd className="nums font-medium text-ink">{formatVnd(totals.selectedSubtotal)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-gold-deep">
                    <dt>{t('cart.discount', { code: voucher?.code ?? '', defaultValue: 'Giảm giá' })}</dt>
                    <dd className="nums font-medium">−{formatVnd(totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-ink/70">
                  <dt>{t('cart.shipFee', 'Phí vận chuyển')}</dt>
                  <dd className="nums font-medium text-ink">
                    {totals.shipFee === 0 ? t('cart.freeShip', 'Miễn phí') : formatVnd(totals.shipFee)}
                  </dd>
                </div>
                <div className="stitch-rule my-2" />
                <div className="flex items-baseline justify-between">
                  <dt className="font-body text-sm font-bold uppercase tracking-[0.12em] text-ink">
                    {t('cart.total', 'Tổng cộng')}
                  </dt>
                  <dd className="nums font-display text-2xl font-semibold text-ink">
                    {formatVnd(totals.total)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 space-y-2">
                <ButtonCustom
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="rounded-none"
                  icon={<Icon name="arrowRight" className="h-4 w-4" />}
                >
                  {t('drawer.viewFullCart', 'Xem giỏ & thanh toán')}
                </ButtonCustom>
                <ButtonCustom
                  variant="raw"
                  fullWidth
                  onClick={closeCart}
                  className="py-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-ink/55 transition-colors hover:text-ink"
                >
                  {t('cart.continueShopping', 'Tiếp tục mua sắm')}
                </ButtonCustom>
                <p className="flex items-center justify-center gap-1.5 pt-1 font-body text-[11px] text-ink/45">
                  <Icon name="lock" className="h-3.5 w-3.5" />
                  {t('cart.vatIncluded', 'Đã bao gồm VAT')}
                </p>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
