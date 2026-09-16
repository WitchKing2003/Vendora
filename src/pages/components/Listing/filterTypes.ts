import type { ListingProduct } from "../../../data/categoryData";

export interface FilterState {
  subSlug: string | null;
  price: [number, number];
  sellers: string[];
  colors: string[];
  minRating: number | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  isNewOnly: boolean;
}

export type SortKey = "relevant" | "newest" | "priceAsc" | "priceDesc";

export const makeDefaultFilters = (min: number, max: number, subSlug: string | null = null): FilterState => ({
  subSlug,
  price: [min, max],
  sellers: [],
  colors: [],
  minRating: null,
  inStockOnly: false,
  onSaleOnly: false,
  isNewOnly: false,
});

export const applyFilters = (products: ListingProduct[], f: FilterState): ListingProduct[] =>
  products.filter(
    (p) =>
      (!f.subSlug || p.subSlug === f.subSlug) &&
      p.price >= f.price[0] &&
      p.price <= f.price[1] &&
      (f.sellers.length === 0 || f.sellers.includes(p.seller)) &&
      (f.colors.length === 0 || f.colors.includes(p.colorHex)) &&
      (f.minRating === null || p.rating >= f.minRating) &&
      (!f.inStockOnly || p.inStock) &&
      (!f.onSaleOnly || p.oldPrice !== undefined) &&
      (!f.isNewOnly || p.badge === "new")
  );

export const sortProducts = (products: ListingProduct[], sort: SortKey): ListingProduct[] => {
  const arr = [...products];
  switch (sort) {
    case "priceAsc":
      return arr.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return arr.sort((a, b) => b.price - a.price);
    case "newest":
      return arr.sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
    default:
      return arr.sort(
        (a, b) => b.rating * Math.log10(b.reviews + 10) - a.rating * Math.log10(a.reviews + 10)
      );
  }
};
