// TODO: replace with API data later — everything here is deterministic mock data
import type { Product } from "../pages/components/Home/Products/ProductSection";

export interface SubDef {
  slug: string;
  labelKey: string;
}

export interface CategoryDef {
  slug: string;
  labelKey: string;
  subs: SubDef[];
}

export interface ListingProduct extends Product {
  rating: number;
  reviews: number;
  colorHex: string;
  subSlug: string;
  inStock: boolean;
}

export const CATEGORY_DEFS: CategoryDef[] = [
  {
    slug: "fashion",
    labelKey: "category.fashion.label",
    subs: [
      { slug: "women", labelKey: "category.fashion.items.women" },
      { slug: "men", labelKey: "category.fashion.items.men" },
      { slug: "clothesShoes", labelKey: "category.fashion.items.clothesShoes" },
      { slug: "hats", labelKey: "category.fashion.items.hats" },
      { slug: "accessories", labelKey: "category.fashion.items.accessories" },
    ],
  },
  {
    slug: "electronics",
    labelKey: "category.electronics.label",
    subs: [
      { slug: "phones", labelKey: "category.electronics.items.phones" },
      { slug: "laptops", labelKey: "category.electronics.items.laptops" },
      { slug: "audio", labelKey: "category.electronics.items.audio" },
      { slug: "accessories", labelKey: "category.electronics.items.accessories" },
    ],
  },
  {
    slug: "homeLiving",
    labelKey: "category.homeLiving.label",
    subs: [
      { slug: "furniture", labelKey: "category.homeLiving.items.furniture" },
      { slug: "kitchen", labelKey: "category.homeLiving.items.kitchen" },
      { slug: "decor", labelKey: "category.homeLiving.items.decor" },
      { slug: "bedding", labelKey: "category.homeLiving.items.bedding" },
    ],
  },
  {
    slug: "beauty",
    labelKey: "category.beauty.label",
    subs: [
      { slug: "skincare", labelKey: "category.beauty.items.skincare" },
      { slug: "makeup", labelKey: "category.beauty.items.makeup" },
      { slug: "fragrance", labelKey: "category.beauty.items.fragrance" },
    ],
  },
  {
    slug: "motherBaby",
    labelKey: "category.motherBaby.label",
    subs: [
      { slug: "diapers", labelKey: "category.motherBaby.items.diapers" },
      { slug: "formula", labelKey: "category.motherBaby.items.formula" },
      { slug: "toys", labelKey: "category.motherBaby.items.toys" },
      { slug: "clothes", labelKey: "category.motherBaby.items.clothes" },
    ],
  },
  {
    slug: "sports",
    labelKey: "category.sports.label",
    subs: [
      { slug: "gym", labelKey: "category.sports.items.gym" },
      { slug: "football", labelKey: "category.sports.items.football" },
      { slug: "bicycle", labelKey: "category.sports.items.bicycle" },
      { slug: "swimming", labelKey: "category.sports.items.swimming" },
    ],
  },
  {
    slug: "booksOffice",
    labelKey: "category.booksOffice.label",
    subs: [
      { slug: "books", labelKey: "category.booksOffice.items.books" },
      { slug: "stationery", labelKey: "category.booksOffice.items.stationery" },
      { slug: "schoolSupplies", labelKey: "category.booksOffice.items.schoolSupplies" },
    ],
  },
  {
    slug: "handmade",
    labelKey: "category.handmade.label",
    subs: [
      { slug: "decor", labelKey: "category.handmade.items.decor" },
      { slug: "jewelry", labelKey: "category.handmade.items.jewelry" },
      { slug: "gifts", labelKey: "category.handmade.items.gifts" },
    ],
  },
];

export const SELLERS = [
  "Lụa & Chi",
  "Mộc Thĩ",
  "Cổ May Atelier",
  "An Nhiên Studio",
  "Minh Studio",
  "Nhà Nến",
  "Gánh Hàng",
  "Rừng Xanh",
  "Gốm Nhà",
  "Vỏi Coffee",
];

export interface ColorSwatch {
  hex: string;
  key: string;
}

export const COLOR_SWATCHES: ColorSwatch[] = [
  { hex: "#1A1B1E", key: "black" },
  { hex: "#FFFFFF", key: "white" },
  { hex: "#8B3A2B", key: "red" },
  { hex: "#2C4A43", key: "green" },
  { hex: "#C68A2E", key: "gold" },
  { hex: "#5B4636", key: "brown" },
  { hex: "#3E5C76", key: "blue" },
];

const CARD_BG = ["#EAE4D4", "#E6DEC9", "#E4DCC7", "#EFEAD9"];

const NAME_PARTS: Record<string, string[]> = {
  fashion: [
    "Áo sơ mi lụa tay bồng cổ V",
    "Váy linen tay lỗ",
    "Áo cổ tim vải twill cotton",
    "Quần Âu vải wool phức hợp",
    "Áo dài cách tân tơ tằm",
    "Áo khoác dạ lệch vai",
    "Khăn choàng nhuộm chàm",
    "Mũ len đan tay",
  ],
  electronics: [
    "Tai nghe không dây Bluetooth",
    "Loa di động chống nước",
    "Sạc nhanh 65W GaN",
    "Bàn phím cơ hot-swap",
    "Chuột không dây siêu nhẹ",
    "Ốp lưng sợi aramid",
    "Pin dự phòng 20.000mAh",
    "Cáp sạc bện nylon",
  ],
  homeLiving: [
    "Bộ 4 chén gốm men xanh",
    "Đèn bàn gỗ óc chó",
    "Thảm dệt tay sợi bông",
    "Kệ treo tường góc sắt",
    "Hộp đựng gia vị gỗ tần bì",
    "Chăn bông ép vải",
    "Rèm linen cản sáng",
    "Bình hoa gốm men rạn",
  ],
  beauty: [
    "Serum vitamin C 10%",
    "Kem chống nắng hóa học SPF50",
    "Sữa rửa mặt dịu nhẹ pH 5.5",
    "Son môi thảo mộc",
    "Nước hoa tinh dầu lan hồ điệp",
    "Mặt nạ dưỡng ẩm keo ong",
    "Dầu dưỡng tóc argan",
    "Phấn má hồng kem",
  ],
  motherBaby: [
    "Tã dán siêu mềm gói lớn",
    "Sữa bột công thức số 1",
    "Đồ chơi xếp hình gỗ",
    "Bộ quần áo bé cotton",
    "Bình sữa cổ rộng",
    "Khăn ướt không mùi",
    "Ghế ăn dặm gập gọn",
    "Núm ti giả silicone",
  ],
  sports: [
    "Quả bóng đá size 5 may tay",
    "Thảm yoga cao su tự nhiên 6mm",
    "Tạ tay bọc nhựa 5kg",
    "Bình nước thể thao 1L",
    "Băng đô thể thao thấm mồ hôi",
    "Vợt cầu lông Graphite",
    "Mũ bảo hiểm xe đạp",
    "Kính bơi chống sương mù",
  ],
  booksOffice: [
    "Sổ tay bìa da khâu tay",
    "Bút máy đúc mạ vàng",
    "Vở thủ công giấy dó",
    "Bộ bút chì màu 36 màu",
    "Kẹp giấy đồng cổ",
    "Lịch để bàn in nghệ thuật",
    "Giấy gói quà họa tiết chàm",
    "Đèn đọc sách kẹp bàn",
  ],
  handmade: [
    "Hoa sáp thủ công cành đơn",
    "Nến thơm đúc tay hũ thủy tinh",
    "Vòng tay đá tự nhiên",
    "Tranh thêu tay 20x30",
    "Móc khóa da tay",
    "Hộp quà gấp thủ công",
    "Dây chuyền bạc học trò",
    "Lót ly dệt cotton",
  ],
};

const SUB_COUNTS: Record<string, number> = {
  fashion: 372,
  electronics: 264,
  homeLiving: 228,
  beauty: 168,
  motherBaby: 148,
  sports: 132,
  booksOffice: 118,
  handmade: 96,
};

// Deterministic PRNG (mulberry32) so counts and pages stay stable between renders
const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const generateCategory = (def: CategoryDef, index: number): ListingProduct[] => {
  const rand = mulberry32(1000 + index * 77);
  const names = NAME_PARTS[def.slug];
  const count = SUB_COUNTS[def.slug];

  return Array.from({ length: count }, (_, i) => {
    const price = Math.round((60 + rand() * 1240) / 10) * 10_000;
    const onSale = rand() < 0.24;
    const isNew = !onSale && rand() < 0.12;
    const oldPrice = onSale ? Math.round((price * (1.15 + rand() * 0.35)) / 10_000) * 10_000 : undefined;
    const swatch = COLOR_SWATCHES[Math.floor(rand() * COLOR_SWATCHES.length)];

    return {
      id: `${def.slug}-${i + 1}`,
      name: names[i % names.length],
      seller: SELLERS[Math.floor(rand() * SELLERS.length)],
      price,
      oldPrice,
      badge: isNew ? "new" : onSale ? "sale" : undefined,
      color: CARD_BG[Math.floor(rand() * CARD_BG.length)],
      rating: Math.round((3.5 + rand() * 1.5) * 2) / 2,
      reviews: 5 + Math.floor(rand() * 320),
      colorHex: swatch.hex,
      subSlug: def.subs[i % def.subs.length].slug,
      inStock: rand() > 0.04,
    } satisfies ListingProduct;
  });
};

export const PRODUCTS_BY_CATEGORY: Record<string, ListingProduct[]> =
  Object.fromEntries(CATEGORY_DEFS.map((def, i) => [def.slug, generateCategory(def, i)]));

export const getCategory = (slug: string | undefined) =>
  CATEGORY_DEFS.find((c) => c.slug === slug);

export const PRICE_BOUNDS: Record<string, { min: number; max: number }> = Object.fromEntries(
  CATEGORY_DEFS.map((def) => {
    const prices = PRODUCTS_BY_CATEGORY[def.slug].map((p) => p.price);
    return [
      def.slug,
      {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
    ];
  })
);

/** Seller list of a category ordered by product count, each with its count. */
export const getSellersWithCounts = (slug: string) => {
  const counts = new Map<string, number>();
  for (const p of PRODUCTS_BY_CATEGORY[slug] ?? []) {
    counts.set(p.seller, (counts.get(p.seller) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
};

/** Per-category facet counts for the sidebar (subcategory + seller + status). */
export const countBy = <K extends keyof ListingProduct>(
  slug: string,
  key: K,
  value: ListingProduct[K]
) => (PRODUCTS_BY_CATEGORY[slug] ?? []).filter((p) => p[key] === value).length;

export const countStatus = (slug: string) => {
  const products = PRODUCTS_BY_CATEGORY[slug] ?? [];
  return {
    inStock: products.filter((p) => p.inStock).length,
    onSale: products.filter((p) => p.oldPrice !== undefined).length,
    isNew: products.filter((p) => p.badge === "new").length,
  };
};

export const countByColor = (slug: string, hex: string) =>
  (PRODUCTS_BY_CATEGORY[slug] ?? []).filter((p) => p.colorHex === hex).length;
