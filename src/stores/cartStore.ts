// TODO: replace with API-backed cart later — client-side cart via zustand
import { create } from "zustand";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  seller: string;
  /** unit price (already discounted) */
  price: number;
  oldPrice?: number;
  colorHex: string;
  colorKey: string;
  size?: string;
  qty: number;
  stock: number;
  inStock: boolean;
}

export interface AppliedVoucher {
  code: string;
  /** fixed discount amount in VND */
  amount: number;
}

export const FREE_SHIP_THRESHOLD = 300_000;
export const SHIP_FEE = 30_000;

interface CartState {
  items: CartItem[];
  /** ids of items the user ticked; out-of-stock items can't be selected */
  selectedIds: string[];
  voucher: AppliedVoucher | null;
  toggleItem: (id: string) => void;
  selectAll: (all: boolean) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  applyVoucher: (v: AppliedVoucher) => void;
  removeVoucher: () => void;
  clear: () => void;
  /** Add a product with chosen color/size; merges with an identical line */
  addItem: (item: Omit<CartItem, "id">) => void;
}

/** Deterministic seed so the cart looks like the mockup on first visit. */
const SEED_ITEMS: CartItem[] = [
  {
    id: "cart-1",
    productId: "fashion-1",
    name: "Sơ mi lụa tay bồng cổ V",
    seller: "Lụa & Chi",
    price: 420_000,
    oldPrice: 525_000,
    colorHex: "#5B4636",
    colorKey: "detail.colors.brown",
    size: "M",
    qty: 1,
    stock: 6,
    inStock: true,
  },
  {
    id: "cart-2",
    productId: "fashion-5",
    name: "Áo yếm lụa phối ren",
    seller: "Lụa & Chi",
    price: 465_000,
    colorHex: "#1A1B1E",
    colorKey: "detail.colors.black",
    size: "S",
    qty: 2,
    stock: 9,
    inStock: true,
  },
  {
    id: "cart-3",
    productId: "homeLiving-1",
    name: "Cà phê rang mộc 250g",
    seller: "Vỏi Coffee",
    price: 89_000,
    colorHex: "#5B4636",
    colorKey: "detail.colors.brown",
    qty: 3,
    stock: 24,
    inStock: true,
  },
  {
    id: "cart-4",
    productId: "handmade-2",
    name: "Bình pha cà phê thủ công",
    seller: "Vỏi Coffee",
    price: 185_000,
    colorHex: "#5B4636",
    colorKey: "detail.colors.brown",
    qty: 1,
    stock: 0,
    inStock: false,
  },
];

export const useCartStore = create<CartState>((set) => ({
  items: SEED_ITEMS,
  selectedIds: SEED_ITEMS.filter((i) => i.inStock).map((i) => i.id),
  voucher: { code: "COMBO10", amount: 105_000 },

  toggleItem: (id) =>
    set((s) => {
      const item = s.items.find((i) => i.id === id);
      if (!item?.inStock) return s;
      return {
        selectedIds: s.selectedIds.includes(id)
          ? s.selectedIds.filter((v) => v !== id)
          : [...s.selectedIds, id],
      };
    }),

  selectAll: (all) =>
    set((s) => ({
      selectedIds: all ? s.items.filter((i) => i.inStock).map((i) => i.id) : [],
    })),

  updateQty: (id, qty) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.id === id ? { ...i, qty: Math.min(Math.max(1, qty), Math.max(i.stock, 1)) } : i
      ),
    })),

  removeItem: (id) =>
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
      selectedIds: s.selectedIds.filter((v) => v !== id),
    })),

  applyVoucher: (v) => set({ voucher: v }),
  removeVoucher: () => set({ voucher: null }),
  clear: () => set({ items: [], selectedIds: [], voucher: null }),

  addItem: (item) =>
    set((s) => {
      const line = s.items.find(
        (i) =>
          i.productId === item.productId &&
          i.colorHex === item.colorHex &&
          i.size === item.size
      );
      if (line) {
        return {
          items: s.items.map((i) =>
            i.id === line.id
              ? { ...i, qty: Math.min(i.qty + item.qty, Math.max(i.stock, 1)) }
              : i
          ),
          selectedIds:
            line.inStock && !s.selectedIds.includes(line.id)
              ? [...s.selectedIds, line.id]
              : s.selectedIds,
        };
      }
      const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      return {
        items: [...s.items, { ...item, id }],
        selectedIds: item.inStock ? [...s.selectedIds, id] : s.selectedIds,
      };
    }),
}));

/* ------------------------------ selectors ------------------------------ */

export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.qty, 0);

export interface CartTotals {
  /** number of distinct selected units */
  selectedCount: number;
  selectedSubtotal: number;
  discount: number;
  shipFee: number;
  total: number;
  allSelected: boolean;
}

export const cartTotals = (items: CartItem[], selectedIds: string[], voucher: AppliedVoucher | null): CartTotals => {
  const selected = items.filter((i) => selectedIds.includes(i.id) && i.inStock);
  const selectedCount = selected.reduce((sum, i) => sum + i.qty, 0);
  const selectedSubtotal = selected.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = voucher && selectedCount > 0 ? Math.min(voucher.amount, selectedSubtotal) : 0;
  const afterDiscount = selectedSubtotal - discount;
  const shipFee = selectedCount === 0 || afterDiscount >= FREE_SHIP_THRESHOLD ? 0 : SHIP_FEE;
  const inStockIds = items.filter((i) => i.inStock).map((i) => i.id);
  return {
    selectedCount,
    selectedSubtotal,
    discount,
    shipFee,
    total: Math.max(0, afterDiscount + shipFee),
    allSelected: inStockIds.length > 0 && selectedIds.length >= inStockIds.length,
  };
};

/** How much more the buyer needs to add for free shipping (0 when already free). */
export const remainingForFreeShip = (subtotal: number) =>
  Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
