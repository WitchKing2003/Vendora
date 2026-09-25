import { PRODUCTS_BY_CATEGORY, SELLERS, type ListingProduct } from './categoryData';

/**
 * A flat view of the whole catalogue, built once.
 *
 * Search, collections and the "you may also like" rail all read from here so
 * discovery behaves consistently no matter where the shopper starts.
 */
export const ALL_PRODUCTS: ListingProduct[] = Object.values(PRODUCTS_BY_CATEGORY).flat();

/**
 * Vietnamese search has to ignore diacritics: typing "gom" must find "Gốm".
 * Folding accents first is what makes the search feel smart rather than strict.
 */
export const fold = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();

const SEARCH_INDEX = ALL_PRODUCTS.map((p) => ({
  product: p,
  haystack: fold(`${p.name} ${p.seller}`),
}));

export interface SearchHit {
  product: ListingProduct;
  /** Higher is better — 0 means "matched, but only by seller". */
  score: number;
}

/** Ranked, diacritic-insensitive product search. */
export const searchProducts = (term: string, limit = 8): SearchHit[] => {
  const q = fold(term);
  if (!q) return [];

  const words = q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];

  for (const entry of SEARCH_INDEX) {
    if (!words.every((w) => entry.haystack.includes(w))) continue;

    const name = fold(entry.product.name);
    let score = 10;
    if (name.startsWith(q)) score = 100;
    else if (name.split(/\s+/).some((w) => w.startsWith(q))) score = 70;
    else if (name.includes(q)) score = 50;
    if (fold(entry.product.seller).includes(q)) score += 8;
    if (entry.product.badge === 'sale') score += 3;

    hits.push({ product: entry.product, score });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
};

/** Products from a collection, newest/best first. */
export const NEW_ARRIVALS = ALL_PRODUCTS.filter((p) => p.badge === 'new');
export const ON_SALE = ALL_PRODUCTS.filter((p) => p.oldPrice !== undefined);

export const sellerSuggestions = (limit = 4) => SELLERS.slice(0, limit);

/**
 * The "you may also like" rail: neighbours of what the shopper has already
 * looked at, from the same category and price neighbourhood — and never a
 * product they have just seen.
 */
export const recommendFrom = (
  seeds: { id: string; categorySlug?: string; price?: number }[],
  limit = 8
): ListingProduct[] => {
  const seenIds = new Set(seeds.map((s) => s.id));
  const slugCounts = new Map<string, number>();
  for (const s of seeds) {
    if (!s.categorySlug) continue;
    slugCounts.set(s.categorySlug, (slugCounts.get(s.categorySlug) ?? 0) + 1);
  }

  const ranked: { product: ListingProduct; score: number }[] = [];

  for (const slug of slugCounts.keys()) {
    const pool = PRODUCTS_BY_CATEGORY[slug] ?? [];
    for (const product of pool) {
      if (seenIds.has(product.id)) continue;
      let score = slugCounts.get(slug) ?? 0;
      // Bias toward the same price neighbourhood as the shopper's last seeds.
      const nearest = seeds
        .filter((s) => s.categorySlug === slug && s.price)
        .map((s) => Math.abs((s.price ?? 0) - product.price))
        .sort((a, b) => a - b)[0];
      if (nearest !== undefined) score += Math.max(0, 4 - nearest / 300_000);
      if (product.rating >= 4.5) score += 2;
      if (product.badge === 'sale') score += 1;
      ranked.push({ product, score });
    }
  }

  if (ranked.length === 0) {
    return ALL_PRODUCTS.filter((p) => p.rating >= 4.5 && !seenIds.has(p.id)).slice(0, limit);
  }

  return ranked.sort((a, b) => b.score - a.score).slice(0, limit).map((r) => r.product);
};
