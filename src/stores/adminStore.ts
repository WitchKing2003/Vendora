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
  subs: { slug: string; name: string; nameEn: string }[];
}

export interface AdminProduct extends ListingProduct {
  category: string;
}

export type UserRole = "admin" | "seller" | "customer";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "locked";
  joined: string;
  orders: number;
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
  subs: def.subs.map((s) => ({
    slug: s.slug,
    name: SUB_NAMES[s.slug]?.[0] ?? s.slug,
    nameEn: SUB_NAMES[s.slug]?.[1] ?? s.slug,
  })),
});

const SEED_USERS: AdminUser[] = [
  { id: 1, name: "Vendora Admin", email: "admin@vendora.vn", role: "admin", status: "active", joined: "01/2024", orders: 0 },
  { id: 2, name: "Lụa & Chi", email: "lua.chi@vendora.vn", role: "seller", status: "active", joined: "02/2024", orders: 214 },
  { id: 3, name: "Vỏi Coffee", email: "voi.coffee@vendora.vn", role: "seller", status: "active", joined: "03/2024", orders: 168 },
  { id: 4, name: "Nguyễn Thu Hà", email: "hanguyen@email.com", role: "customer", status: "active", joined: "03/2024", orders: 12 },
  { id: 5, name: "Trần Bảo Trân", email: "baotran@email.com", role: "customer", status: "active", joined: "05/2024", orders: 8 },
  { id: 6, name: "Hoàng Minh Hạnh", email: "minhhanh@email.com", role: "customer", status: "active", joined: "06/2024", orders: 5 },
  { id: 7, name: "Lê Quốc Bảo", email: "quocbao@email.com", role: "customer", status: "locked", joined: "08/2024", orders: 2 },
  { id: 8, name: "Phạm Ngọc Linh", email: "ngoclinh@email.com", role: "customer", status: "active", joined: "09/2024", orders: 19 },
  { id: 9, name: "Đỗ Gia Hân", email: "giahan@email.com", role: "seller", status: "active", joined: "11/2024", orders: 96 },
  { id: 10, name: "Vũ Thành Đạt", email: "thanhdat@email.com", role: "customer", status: "active", joined: "01/2025", orders: 3 },
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
  deleteUser: (id: number) => void;
  approveApplication: (id: number) => void;
  rejectApplication: (id: number, note?: string) => void;
  deleteApplication: (id: number) => void;
}

const ALL_PRODUCTS: AdminProduct[] = Object.entries(PRODUCTS_BY_CATEGORY).flatMap(([slug, list]) =>
  list.map((p) => ({ ...p, category: slug }))
);

const useAdminStore = create<AdminState>()((set) => ({
  categories: CATEGORY_DEFS.map(toAdminCategory),
  products: ALL_PRODUCTS,
  users: SEED_USERS,
  applications: SEED_APPLICATIONS,

  addCategory: (name, nameEn) =>
    set((s) => {
      const slug = slugify(name) || `category-${s.categories.length + 1}`;
      if (s.categories.some((c) => c.slug === slug)) return s;
      return { categories: [...s.categories, { slug, name, nameEn: nameEn || name, subs: [] }] };
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
}));

export { useAdminStore, slugify, SELLERS, COLOR_SWATCHES };
