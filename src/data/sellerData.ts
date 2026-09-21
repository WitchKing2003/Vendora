// TODO: replace with API data later — deterministic mock per seller
import { PRODUCTS_BY_CATEGORY } from "./categoryData";
import type { ListingProduct } from "./categoryData";

export interface SellerProfile {
  name: string;
  /** First letter avatar */
  initial: string;
  desc: string;
  location: string;
  joinedYears: number;
  rating: number;
  followers: 2860;
  productCount: number;
  responseRate: 98;
  verified: boolean;
  /** Category the shop's products come from (for the grid). */
  categorySlug: string;
  /** Subcategories shown as collection chips. */
  collections: { key: string; labelKey: string }[];
  promoText: { key: string; values?: Record<string, string> };
}

const SELLER_NOTES: Record<string, { desc: string; location: string; years: number }> = {
  "Lụa & Chi": { desc: "Áo dài & trang phục lụa may đo thủ công", location: "Hà Đông, Hà Nội", years: 3 },
  "Vỏi Coffee": { desc: "Cà phê rang mộc & dụng cụ pha phin truyền thống", location: "Buôn Ma Thuột, Đắk Lắk", years: 2 },
  "Mộc Thĩ": { desc: "Đồ gỗ gia dụng chạm khắc thủ công", location: "Lăk Lake, Đắk Lắk", years: 4 },
  "Gốm Nhà": { desc: "Gốm men rạn nung thủ công", location: "Bát Tràng, Hà Nội", years: 5 },
  "Nhà Nến": { desc: "Nến thơm đúc tay sáp tự nhiên", location: "TP. Thủ Đức, TP.HCM", years: 2 },
};

const SELLER_CATEGORY: Record<string, string> = {
  "Lụa & Chi": "fashion",
  "Vỏi Coffee": "homeLiving",
  "Mộc Thĩ": "homeLiving",
  "Gốm Nhà": "homeLiving",
  "Nhà Nến": "handmade",
};

const COLLECTIONS: Record<string, { key: string; labelKey: string }[]> = {
  "Lụa & Chi": [
    { key: "all", labelKey: "shop.tabs.all" },
    { key: "Áo dài", labelKey: "shop.collections.aoDai" },
    { key: "Sơ mi lụa", labelKey: "shop.collections.shirt" },
    { key: "Váy lụa", labelKey: "shop.collections.dress" },
    { key: "Khăn & phụ kiện", labelKey: "shop.collections.scarf" },
  ],
  default: [{ key: "all", labelKey: "shop.tabs.all" }],
};

const PROMOS: Record<string, { key: string; values?: Record<string, string> }> = {
  "Lụa & Chi": {
    key: "shop.promo.text",
    values: { percent: "10%", code: "COMBO10", threshold: "300.000đ" },
  },
  default: {
    key: "shop.promo.default",
  },
};

export const getSellerProfile = (name: string | undefined): SellerProfile | null => {
  if (!name) return null;
  const note = SELLER_NOTES[name] ?? {
    desc: "Gian hàng thủ công độc lập trên Vendora",
    location: "Việt Nam",
    years: 2,
  };
  const categorySlug = SELLER_CATEGORY[name] ?? "handmade";
  const products = PRODUCTS_BY_CATEGORY[categorySlug] ?? [];
  const own = products.filter((p) => p.seller === name);
  const pool = own.length > 0 ? own : products;

  const ratings = pool.map((p) => p.rating);
  const rating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : 4.8;

  const collections = COLLECTIONS[name] ?? [
    { key: "all", labelKey: "shop.tabs.all" },
  ];
  const nameTokens = [...new Set(pool.map((p) => p.name.split(" ").slice(0, 2).join(" ")))].slice(0, 3);
  const dynamic = nameTokens.map((label) => ({ key: label, labelKey: "", label }));

  return {
    name,
    initial: name.trim().charAt(0).toUpperCase(),
    desc: note.desc,
    location: note.location,
    joinedYears: note.years,
    rating,
    followers: 2860,
    productCount: pool.length,
    responseRate: 98,
    verified: true,
    categorySlug,
    collections:
      collections.length > 1 ? collections : [{ key: "all", labelKey: "shop.tabs.all" }, ...dynamic],
    promoText: PROMOS[name] ?? PROMOS.default,
  };
};

/** Products of a seller (falls back to category pool when too few) — deterministic. */
export const getSellerProducts = (name: string): ListingProduct[] => {
  const profile = getSellerProfile(name);
  if (!profile) return [];
  const own = (PRODUCTS_BY_CATEGORY[profile.categorySlug] ?? []).filter((p) => p.seller === name);
  if (own.length >= 8) return own;
  const pool = (PRODUCTS_BY_CATEGORY[profile.categorySlug] ?? []).filter(
    (p) => p.seller !== name
  );
  const needed = Math.max(8 - own.length, 8 - pool.length);
  return [...own, ...pool.slice(0, Math.max(8, needed))];
};

/** Rating histogram + per-star percentages, seeded deterministically per seller. */
export const getSellerRatingSummary = (
  name: string,
  reviewCount: number
): { stars: { star: number; percent: number }[]; average: number; count: number } => {
  const profile = getSellerProfile(name);
  let seed = 5;
  for (const ch of name) seed += ch.charCodeAt(0) * 31;
  let h = Math.abs(seed) % 4294967296;
  const rand = () => {
    h = (h * 1664525 + 1013904223) % 4294967296;
    return h / 4294967296;
  };

  const p5 = Math.min(90, Math.max(70, Math.round(74 + rand() * 14)));
  const p4 = Math.min(14, Math.round(6 + rand() * 8));
  const p3 = Math.min(4, Math.round(1 + rand() * 3));
  const p2 = Math.min(2, Math.round(rand() * 2));
  const p1 = Math.max(0, 100 - p5 - p4 - p3 - p2);

  return {
    stars: [
      { star: 5, percent: p5 },
      { star: 4, percent: p4 },
      { star: 3, percent: p3 },
      { star: 2, percent: p2 },
      { star: 1, percent: p1 },
    ],
    average: profile?.rating ?? 4.9,
    count: reviewCount,
  };
};
