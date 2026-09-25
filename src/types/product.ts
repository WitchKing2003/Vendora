/**
 * A lightweight, serialisable view of a product.
 *
 * Wishlist, recently-viewed and personalised rails all keep snapshots instead
 * of ids so they can render instantly (and survive when the mock catalogue
 * changes shape under them). Replace with API-shaped records later.
 */
export interface ProductSnapshot {
  id: string;
  name: string;
  seller: string;
  price: number;
  oldPrice?: number;
  /** Swatch colour used by <WovenSwatch /> */
  color: string;
  /** Variant colour used for the cart line and the fly-to-cart swatch. */
  colorHex?: string;
  rating?: number;
  reviews?: number;
  badge?: 'new' | 'sale';
  subSlug?: string;
  categorySlug?: string;
}

/** Anything shaped enough to become a snapshot (listing rows, API rows…). */
export interface SnapshotSource extends ProductSnapshot {
  inStock?: boolean;
}

/** Listing row → snapshot, so cards can render from any source. */
export const toSnapshot = (p: SnapshotSource): ProductSnapshot & { inStock?: boolean } => ({
  id: p.id,
  name: p.name,
  seller: p.seller,
  price: p.price,
  oldPrice: p.oldPrice,
  color: p.color,
  colorHex: p.colorHex,
  rating: p.rating,
  reviews: p.reviews,
  badge: p.badge,
  subSlug: p.subSlug,
  categorySlug: p.categorySlug,
  inStock: p.inStock,
});

/** The initial we print on a woven swatch when there is no photography. */
export const swatchLabel = (name: string) => name.trim().charAt(0).toUpperCase();

/** Percentage off, or null when the product is not discounted. */
export const discountPercent = (price: number, oldPrice?: number) =>
  oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : null;
