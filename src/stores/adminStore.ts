// TODO: replace with real admin API later — client-side mock via zustand
import { create } from "zustand";
import {
  CATEGORY_DEFS,
  COLOR_SWATCHES,
  PRODUCTS_BY_CATEGORY,
  SELLERS,
  type CategoryDef,
  type ListingProduct,
} from "../data/categoryData";

export interface AdminCategory {
  slug: string;
  name: string;
  nameEn: string;
  enabled: boolean;
  subs: { slug: string; name: string; nameEn: string }[];
}

export type ProductStatus = "active" | "draft" | "hidden";

export interface AdminProduct extends ListingProduct {
  category: string;
  /** Units on hand — powers the inventory column + low-stock warning. */
  stock: number;
  status: ProductStatus;
}

export type UserRole = "admin" | "seller" | "customer";

/** Customer segmentation badge — manually assigned by an admin. */
export type CustomerBadge = "vip" | "loyal" | "new" | "inactive";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "locked";
  joined: string;
  orders: number;
  /** Total amount spent in VNĐ — drives the suggested badge + analytics. */
  spent: number;
  /** ISO-ish last purchase date used for "inactive" detection. */
  lastPurchase: string;
  badge: CustomerBadge;
}

export type NotificationTarget =
  | "all"
  | "vip"
  | "frequent"
  | "rare"
  | "new";

export interface AdminNotification {
  id: number;
  title: string;
  body: string;
  target: NotificationTarget;
  status: "draft" | "scheduled" | "sent";
  createdAt: string;
  recipients: number;
}

export interface HomeSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonLabel: string;
  link: string;
  order: number;
  active: boolean;
}

export interface HomeSection {
  id: number;
  title: string;
  categorySlug: string;
  subtitle: string;
  order: number;
  visible: boolean;
}

export interface AdminSettings {
  storeName: string;
  supportEmail: string;
  hotline: string;
  currency: string;
  language: string;
  homepageTitle: string;
  homepageSubtitle: string;
  showSlider: boolean;
  showPromo: boolean;
  notifyNewOrder: boolean;
  notifyLowStock: boolean;
  notifyNewUser: boolean;
  lowStockThreshold: number;
  freeShippingFrom: number;
  codEnabled: boolean;
  momoEnabled: boolean;
  cardEnabled: boolean;
}

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface SellerApplication {
  id: number;
  shopName: string;
  owner: string;
  email: string;
  phone: string;
  category: string;
  productCount: number;
  description: string;
  submittedAt: string;
  status: ApplicationStatus;
  note?: string;
}

/** Vietnamese display names for the seed categories (mock — storefront still uses i18n keys). */
const CATEGORY_NAMES: Record<string, [string, string]> = {
  fashion: ["Thời trang", "Fashion"],
  electronics: ["Điện tử", "Electronics"],
  homeLiving: ["Nhà cửa & Đời sống", "Home & Living"],
  beauty: ["Làm đẹp", "Beauty"],
  motherBaby: ["Mẹ & Bé", "Mother & Baby"],
  sports: ["Thể thao", "Sports"],
  booksOffice: ["Sách & Văn phòng", "Books & Office"],
  handmade: ["Handmade", "Handmade"],
};

const SUB_NAMES: Record<string, [string, string]> = {
  women: ["Thời trang nữ", "Women"],
  men: ["Thời trang nam", "Men"],
  clothesShoes: ["Quần áo & Giày dép", "Clothes & Shoes"],
  hats: ["Mũ", "Hats"],
  accessories: ["Phụ kiện", "Accessories"],
  phones: ["Điện thoại", "Phones"],
  laptops: ["Laptop", "Laptops"],
  audio: ["Âm thanh", "Audio"],
  furniture: ["Nội thất", "Furniture"],
  kitchen: ["Nhà bếp", "Kitchen"],
  decor: ["Trang trí", "Decor"],
  bedding: ["Chăn ga gối", "Bedding"],
  skincare: ["Chăm sóc da", "Skincare"],
  makeup: ["Trang điểm", "Makeup"],
  fragrance: ["Nước hoa", "Fragrance"],
  diapers: ["Tã & Bỉm", "Diapers"],
  formula: ["Sữa công thức", "Formula"],
  toys: ["Đồ chơi", "Toys"],
  clothes: ["Quần áo bé", "Baby clothes"],
  gym: ["Gym", "Gym"],
  football: ["Bóng đá", "Football"],
  bicycle: ["Xe đạp", "Bicycle"],
  swimming: ["Bơi lội", "Swimming"],
  books: ["Sách", "Books"],
  stationery: ["Văn phòng phẩm", "Stationery"],
  schoolSupplies: ["Dụng cụ học tập", "School supplies"],
  jewelry: ["Trang sức", "Jewelry"],
  gifts: ["Quà tặng", "Gifts"],
};

const toAdminCategory = (def: CategoryDef): AdminCategory => ({
  slug: def.slug,
  name: CATEGORY_NAMES[def.slug]?.[0] ?? def.slug,
  nameEn: CATEGORY_NAMES[def.slug]?.[1] ?? def.slug,
  enabled: true,
  subs: def.subs.map((s) => ({
    slug: s.slug,
    name: SUB_NAMES[s.slug]?.[0] ?? s.slug,
    nameEn: SUB_NAMES[s.slug]?.[1] ?? s.slug,
  })),
});

const SEED_USERS: AdminUser[] = [
  { id: 1, name: "Vendora Admin", email: "admin@vendora.vn", role: "admin", status: "active", joined: "01/2024", orders: 0, spent: 0, lastPurchase: "—", badge: "vip" },
  { id: 2, name: "Lụa & Chi", email: "lua.chi@vendora.vn", role: "seller", status: "active", joined: "02/2024", orders: 214, spent: 0, lastPurchase: "—", badge: "loyal" },
  { id: 3, name: "Vỏi Coffee", email: "voi.coffee@vendora.vn", role: "seller", status: "active", joined: "03/2024", orders: 168, spent: 0, lastPurchase: "—", badge: "loyal" },
  { id: 4, name: "Nguyễn Thu Hà", email: "hanguyen@email.com", role: "customer", status: "active", joined: "03/2024", orders: 12, spent: 8_640_000, lastPurchase: "18/09/2026", badge: "vip" },
  { id: 5, name: "Trần Bảo Trân", email: "baotran@email.com", role: "customer", status: "active", joined: "05/2024", orders: 8, spent: 4_120_000, lastPurchase: "02/09/2026", badge: "loyal" },
  { id: 6, name: "Hoàng Minh Hạnh", email: "minhhanh@email.com", role: "customer", status: "active", joined: "06/2024", orders: 5, spent: 2_380_000, lastPurchase: "20/09/2026", badge: "new" },
  { id: 7, name: "Lê Quốc Bảo", email: "quocbao@email.com", role: "customer", status: "locked", joined: "08/2024", orders: 2, spent: 760_000, lastPurchase: "11/03/2025", badge: "inactive" },
  { id: 8, name: "Phạm Ngọc Linh", email: "ngoclinh@email.com", role: "customer", status: "active", joined: "09/2024", orders: 19, spent: 15_900_000, lastPurchase: "21/09/2026", badge: "vip" },
  { id: 9, name: "Đỗ Gia Hân", email: "giahan@email.com", role: "seller", status: "active", joined: "11/2024", orders: 96, spent: 0, lastPurchase: "—", badge: "loyal" },
  { id: 10, name: "Vũ Thành Đạt", email: "thanhdat@email.com", role: "customer", status: "active", joined: "01/2025", orders: 3, spent: 1_240_000, lastPurchase: "19/09/2026", badge: "new" },
];

const SEED_APPLICATIONS: SellerApplication[] = [
  {
    id: 1,
    shopName: "Gốm Hà Nhi",
    owner: "Trịnh Mai Linh",
    email: "gom.hanhi@email.com",
    phone: "0912 445 788",
    category: "handmade",
    productCount: 24,
    description:
      "Xưởng gốm gia truyền làng Bát Tràng, chuyên bình hoa, bộ trà và đồ gia dụng bằng gốm men nâu truyền thống.",
    submittedAt: "18/09/2026",
    status: "pending",
  },
  {
    id: 2,
    shopName: "Rau sạch Bản Xanh",
    owner: "Lò Văn Tú",
    email: "banxanh@email.com",
    phone: "0388 210 445",
    category: "homeLiving",
    productCount: 15,
    description:
      "Hợp tác xã rau củ hữu cơ từ Mộc Châu — rau theo mùa, trái cây vùng cao, giao làn trong ngày nội thành Hà Nội.",
    submittedAt: "20/09/2026",
    status: "pending",
  },
  {
    id: 3,
    shopName: "Đèn gốm An Lạc",
    owner: "Phan Thanh Tâm",
    email: "denanlac@email.com",
    phone: "0905 663 120",
    category: "handmade",
    productCount: 32,
    description:
      "Đèn thả trần và đèn bàn làm thủ công từ gốm và mây tre, phong cách hướng nhiên tối giản cho không gian sống.",
    submittedAt: "12/09/2026",
    status: "pending",
  },
  {
    id: 4,
    shopName: "Vải lụa Tân Châu",
    owner: "Huỳnh Ngọc Diệp",
    email: "tanchau.lua@email.com",
    phone: "0947 552 018",
    category: "fashion",
    productCount: 41,
    description:
      "Lụa tơ tằm Tân Châu dệt thủ công — vải mét, khăn fill và sa tanh nhuộm màu thiên nhiên.",
    submittedAt: "05/09/2026",
    status: "approved",
  },
  {
    id: 5,
    shopName: "Cà phê muối Nha Trang",
    owner: "Trương Hoàng Duy",
    email: "capsalt@email.com",
    phone: "0356 887 940",
    category: "homeLiving",
    productCount: 8,
    description: "Bột cà phê robusta rang mộc dùng cho công thức cà phê muối, bán sỉ cho quán.",
    submittedAt: "28/08/2026",
    status: "approved",
  },
    {
    id: 6,
    shopName: "Mỹ phẩm trôi nổi TVC",
    owner: "Không rõ nguồn gốc",
    email: "tvc.cosmetics@unknown.xyz",
    phone: "0000 000 000",
    category: "beauty",
    productCount: 120,
    description: "Hàng trôi nổi không nhãn mác, không giấy phép kinh doanh, giá rẻ hơn-market 70%.",
    submittedAt: "22/08/2026",
    status: "rejected",
    note: "Không đủ giấy phép kinh doanh mỹ phẩm; nguồn gốc hàng hoá không rõ ràng.",
  },
];

const SEED_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 1,
    title: "Vendora tung ưu đãi cuối tuần",
    body: "Giảm 20% toàn bộ ngành Thời trang trong 3 ngày cuối tuần này. Đừng bỏ lỡ!",
    target: "all",
    status: "sent",
    createdAt: "20/09/2026",
    recipients: 12480,
  },
  {
    id: 2,
    title: "Quà tri ân khách VIP tháng 9",
    body: "Bạn là khách hàng VIP của Vendora — nhận ngay voucher 200.000đ cho đơn từ 500.000đ.",
    target: "vip",
    status: "sent",
    createdAt: "18/09/2026",
    recipients: 342,
  },
  {
    id: 3,
    title: "Thư cảm ơn khách hàng mới",
    body: "Chào mừng bạn đến với Vendora! Giảm 15% cho đơn hàng đầu tiên với mã HELLO15.",
    target: "new",
    status: "scheduled",
    createdAt: "22/09/2026",
    recipients: 1284,
  },
  {
    id: 4,
    title: "Chúng tôi nhớ bạn rất nhiều!",
    body: "Đã lâu bạn chưa ghé Vendora. Quay lại ngay nhận freeship không giới hạn hạn trong 7 ngày.",
    target: "rare",
    status: "draft",
    createdAt: "23/09/2026",
    recipients: 2870,
  },
];

const SEED_SLIDES: HomeSlide[] = [
  {
    id: 1,
    title: "Bộ sưu tập Thu — Đông",
    description: "Chất liệu tự nhiên, bảng màu trầm ấm cho những ngày se lạnh.",
    image: "#EAE4D4",
    buttonLabel: "Khám phá ngay",
    link: "/category/fashion",
    order: 1,
    active: true,
  },
  {
    id: 2,
    title: "Góc sống tối giản",
    description: "Nội thất gỗ và gốm thủ công — mang thiên nhiên vào tổ ấm.",
    image: "#D9D0BC",
    buttonLabel: "Xem nhà cửa",
    link: "/category/homeLiving",
    order: 2,
    active: true,
  },
  {
    id: 3,
    title: "Công nghệ cho mọi ngày",
    description: "Thiết bị thông minh, âm thanh sống động — giá tốt nhất năm.",
    image: "#9DB8B2",
    buttonLabel: "Săn deal điện tử",
    link: "/category/electronics",
    order: 3,
    active: false,
  },
];

const SEED_SECTIONS: HomeSection[] = [
  { id: 1, title: "Sản phẩm nổi bật", categorySlug: "fashion", subtitle: "Được yêu thích nhất tuần này", order: 1, visible: true },
  { id: 2, title: "Giảm giá sốc cuối tuần", categorySlug: "electronics", subtitle: "Ưu đãi lên tới 40%", order: 2, visible: true },
  { id: 3, title: "Nhà cửa & Đời sống", categorySlug: "homeLiving", subtitle: "Không gian sống đẹp hơn mỗi ngày", order: 3, visible: true },
  { id: 4, title: "Làm đẹp", categorySlug: "beauty", subtitle: "Chăm sóc da và trang điểm", order: 4, visible: false },
];

const SEED_SETTINGS: AdminSettings = {
  storeName: "Vendora",
  supportEmail: "hotro@vendora.vn",
  hotline: "1900 6789",
  currency: "VND",
  language: "vi",
  homepageTitle: "Mua sắm tại Vendora",
  homepageSubtitle: "Thời trang, công nghệ và đồ gia dụng cho cuộc sống hiện đại.",
  showSlider: true,
  showPromo: true,
  notifyNewOrder: true,
  notifyLowStock: true,
  notifyNewUser: false,
  lowStockThreshold: 10,
  freeShippingFrom: 300_000,
  codEnabled: true,
  momoEnabled: true,
  cardEnabled: true,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface AdminState {
  categories: AdminCategory[];
  products: AdminProduct[];
  users: AdminUser[];
  applications: SellerApplication[];
  notifications: AdminNotification[];
  slides: HomeSlide[];
  sections: HomeSection[];
  settings: AdminSettings;
  addCategory: (name: string, nameEn: string) => void;
  updateCategory: (slug: string, patch: Partial<Pick<AdminCategory, "name" | "nameEn">>) => void;
  deleteCategory: (slug: string) => void;
  addSub: (catSlug: string, name: string, nameEn: string) => void;
  updateSub: (catSlug: string, subSlug: string, patch: Partial<AdminCategory["subs"][number]>) => void;
  deleteSub: (catSlug: string, subSlug: string) => void;
  addProduct: (p: {
    name: string;
    price: number;
    oldPrice?: number | null;
    category: string;
    subSlug: string;
    seller: string;
    colorHex: string;
    inStock: boolean;
  }) => void;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  addUser: (name: string, email: string, role: UserRole) => void;
  toggleUserStatus: (id: number) => void;
  setUserRole: (id: number, role: UserRole) => void;
  setUserBadge: (id: number, badge: CustomerBadge) => void;
  deleteUser: (id: number) => void;
  approveApplication: (id: number) => void;
  rejectApplication: (id: number, note?: string) => void;
  deleteApplication: (id: number) => void;

  addNotification: (n: Omit<AdminNotification, "id" | "createdAt" | "recipients"> & { recipients?: number }) => void;
  updateNotification: (id: number, patch: Partial<AdminNotification>) => void;
  deleteNotification: (id: number) => void;

  addSlide: (s: Omit<HomeSlide, "id">) => void;
  updateSlide: (id: number, patch: Partial<HomeSlide>) => void;
  deleteSlide: (id: number) => void;
  moveSlide: (id: number, dir: -1 | 1) => void;

  addSection: (s: Omit<HomeSection, "id">) => void;
  updateSection: (id: number, patch: Partial<HomeSection>) => void;
  deleteSection: (id: number) => void;
  moveSection: (id: number, dir: -1 | 1) => void;

  updateSettings: (patch: Partial<AdminSettings>) => void;
  toggleCategory: (slug: string) => void;
}

const ALL_PRODUCTS: AdminProduct[] = Object.entries(PRODUCTS_BY_CATEGORY).flatMap(([slug, list]) =>
  list.map((p, i) => ({
    ...p,
    category: slug,
    stock: ((i * 37 + slug.length * 13) % 180) + 2,
    status: i % 7 === 3 ? "draft" : i % 11 === 5 ? "hidden" : "active",
  }))
);

const useAdminStore = create<AdminState>()((set) => ({
  categories: CATEGORY_DEFS.map(toAdminCategory),
  products: ALL_PRODUCTS,
  users: SEED_USERS,
  applications: SEED_APPLICATIONS,
  notifications: SEED_NOTIFICATIONS,
  slides: SEED_SLIDES,
  sections: SEED_SECTIONS,
  settings: SEED_SETTINGS,

  addCategory: (name, nameEn) =>
    set((s) => {
      const slug = slugify(name) || `category-${s.categories.length + 1}`;
      if (s.categories.some((c) => c.slug === slug)) return s;
      return { categories: [...s.categories, { slug, name, nameEn: nameEn || name, enabled: true, subs: [] }] };
    }),
  updateCategory: (slug, patch) =>
    set((s) => ({
      categories: s.categories.map((c) => (c.slug === slug ? { ...c, ...patch } : c)),
    })),
  deleteCategory: (slug) =>
    set((s) => ({
      categories: s.categories.filter((c) => c.slug !== slug),
      products: s.products.filter((p) => p.category !== slug),
    })),
  addSub: (catSlug, name, nameEn) =>
    set((s) => ({
      categories: s.categories.map((c) => {
        if (c.slug !== catSlug) return c;
        const slug = slugify(name) || `sub-${c.subs.length + 1}`;
        if (c.subs.some((x) => x.slug === slug)) return c;
        return { ...c, subs: [...c.subs, { slug, name, nameEn: nameEn || name }] };
      }),
    })),
  updateSub: (catSlug, subSlug, patch) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.slug === catSlug
          ? { ...c, subs: c.subs.map((x) => (x.slug === subSlug ? { ...x, ...patch } : x)) }
          : c
      ),
    })),
  deleteSub: (catSlug, subSlug) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.slug === catSlug ? { ...c, subs: c.subs.filter((x) => x.slug !== subSlug) } : c
      ),
    })),

  addProduct: ({ name, price, oldPrice, category, subSlug, seller, colorHex, inStock }) =>
    set((s) => {
      const n = s.products.length + 1;
      const product: AdminProduct = {
        id: `adm-${category}-${n}`,
        name,
        price,
        oldPrice: oldPrice ?? undefined,
        badge: oldPrice ? "sale" : undefined,
        color: colorHex,
        seller,
        rating: 0,
        reviews: 0,
        colorHex,
        subSlug,
        inStock,
        category,
        stock: inStock ? 100 : 0,
        status: "active",
      };
      return { products: [product, ...s.products] };
    }),
  updateProduct: (id, patch) =>
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
  deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
  toggleProductStock: (id) =>
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)),
    })),

  addUser: (name, email, role) =>
    set((s) => {
      const id = Math.max(0, ...s.users.map((u) => u.id)) + 1;
      return {
        users: [
          {
            id,
            name,
            email,
            role,
            status: "active",
            joined: new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
            orders: 0,
            spent: 0,
            lastPurchase: "—",
            badge: "new" as const,
          },
          ...s.users,
        ],
      };
    }),
  toggleUserStatus: (id) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "locked" : "active" } : u
      ),
    })),
  setUserRole: (id, role) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, role } : u)) })),
  deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

  approveApplication: (id) =>
    set((s) => {
      const app = s.applications.find((a) => a.id === id);
      if (!app || app.status !== "pending") return s;
      const user: AdminUser = {
        id: Math.max(0, ...s.users.map((u) => u.id)) + 1,
        name: app.shopName,
        email: app.email,
        role: "seller",
        status: "active",
        joined: app.submittedAt.slice(3),
        orders: 0,
        spent: 0,
        lastPurchase: "—",
        badge: "loyal" as const,
      };
      return {
        users: [...s.users, user],
        applications: s.applications.map((a) => (a.id === id ? { ...a, status: "approved" as const } : a)),
      };
    }),
  rejectApplication: (id, note) =>
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === id ? { ...a, status: "rejected" as const, note: note || a.note } : a
      ),
    })),
  deleteApplication: (id) => set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),
  setUserBadge: (id, badge) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, badge } : u)) })),

  addNotification: (n) =>
    set((s) => ({
      notifications: [
        {
          ...n,
          id: Math.max(0, ...s.notifications.map((x) => x.id)) + 1,
          createdAt: new Date().toLocaleDateString("vi-VN"),
          recipients: n.recipients ?? 0,
        },
        ...s.notifications,
      ],
    })),
  updateNotification: (id, patch) =>
    set((s) => ({
      notifications: s.notifications.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),
  deleteNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((x) => x.id !== id) })),

  addSlide: (slide) =>
    set((s) => ({
      slides: [...s.slides, { ...slide, id: Math.max(0, ...s.slides.map((x) => x.id)) + 1 }],
    })),
  updateSlide: (id, patch) =>
    set((s) => ({ slides: s.slides.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
  deleteSlide: (id) => set((s) => ({ slides: s.slides.filter((x) => x.id !== id) })),
  moveSlide: (id, dir) =>
    set((s) => {
      const ordered = [...s.slides].sort((a, b) => a.order - b.order);
      const i = ordered.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= ordered.length) return s;
      [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
      return { slides: ordered.map((x, idx) => ({ ...x, order: idx + 1 })) };
    }),

  addSection: (section) =>
    set((s) => ({
      sections: [...s.sections, { ...section, id: Math.max(0, ...s.sections.map((x) => x.id)) + 1 }],
    })),
  updateSection: (id, patch) =>
    set((s) => ({ sections: s.sections.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
  deleteSection: (id) => set((s) => ({ sections: s.sections.filter((x) => x.id !== id) })),
  moveSection: (id, dir) =>
    set((s) => {
      const ordered = [...s.sections].sort((a, b) => a.order - b.order);
      const i = ordered.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= ordered.length) return s;
      [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
      return { sections: ordered.map((x, idx) => ({ ...x, order: idx + 1 })) };
    }),

  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
  toggleCategory: (slug) =>
    set((s) => ({
      categories: s.categories.map((c) => (c.slug === slug ? { ...c, enabled: !c.enabled } : c)),
    })),
}));

export { useAdminStore, slugify, SELLERS, COLOR_SWATCHES };
