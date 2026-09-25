import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { flyToCart } from '../stores/flightStore';
import { useCartStore } from '../stores/cartStore';
import { useToastStore } from '../stores/toastStore';
import { useUiStore } from '../stores/uiStore';
import { swatchLabel } from '../types/product';
import useReducedMotion from './useReducedMotion';

export interface AddToCartPayload {
  productId: string;
  name: string;
  seller: string;
  price: number;
  oldPrice?: number;
  colorHex: string;
  colorKey: string;
  size?: string;
  qty?: number;
  stock?: number;
  inStock?: boolean;
  /** Element the swatch flies out of — usually the product visual. */
  origin?: HTMLElement | null;
  /** Colour shown in the toast thumbnail; falls back to `colorHex`. */
  swatch?: string;
  /** Suppress the toast (bulk actions like "buy again"). */
  silent?: boolean;
  /** Open the cart drawer as well as the toast. */
  openDrawer?: boolean;
}

const LAND_DELAY_MS = 560;

/**
 * The one way anything gets added to the cart.
 *
 * Keeping the sequence in a single hook guarantees that every add-to-cart in
 * the app feels identical and complete:
 *
 *   1. the swatch lifts out of the product and arcs to the cart
 *   2. the cart icon reacts exactly when the swatch lands
 *   3. a toast confirms, with a direct route into the cart
 *
 * With reduced motion enabled, steps 1–2 collapse into instant feedback.
 */
export default function useAddToCart() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const addItem = useCartStore((s) => s.addItem);
  const pushToast = useToastStore((s) => s.push);
  const bumpCart = useUiStore((s) => s.bumpCart);
  const openCart = useUiStore((s) => s.openCart);

  return useCallback(
    (payload: AddToCartPayload) => {
      const {
        origin,
        swatch,
        silent = false,
        openDrawer = false,
        qty = 1,
        stock = 99,
        inStock = true,
        ...line
      } = payload;

      addItem({ ...line, qty, stock, inStock });

      const flew = reducedMotion
        ? false
        : flyToCart({
            origin,
            color: line.colorHex,
            label: swatchLabel(line.name),
          });

      // The icon reacts the moment the swatch lands, not before.
      window.setTimeout(() => bumpCart(), flew ? LAND_DELAY_MS : 0);

      if (!silent) {
        pushToast({
          tone: 'success',
          title: t('feedback.addedTitle', 'Đã thêm vào giỏ'),
          message: line.name,
          swatch: swatch ?? line.colorHex,
          swatchLabel: swatchLabel(line.name),
          action: {
            label: t('feedback.viewCart', 'Xem giỏ hàng'),
            onClick: () => openCart(),
          },
        });
      }

      if (openDrawer) openCart();
    },
    [addItem, bumpCart, openCart, pushToast, reducedMotion, t]
  );
}
