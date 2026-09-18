// TODO: replace with API order placement later
import { create } from "zustand";
import type { CartItem } from "./cartStore";

export type OrderStatus = "pending" | "shipping" | "delivered" | "canceled";

export interface OrderAddress {
  name: string;
  phone: string;
  detail: string;
}

export interface OrderEvent {
  /** translation key, e.g. "tracking.step.placed" */
  key: string;
  /** preformatted time label, e.g. "18/09, 14:32" — "" for ETA-only rows */
  time: string;
}

export interface Order {
  code: string;
  items: CartItem[];
  note: string;
  paymentLabel: string;
  shipFee: number;
  discount: number;
  total: number;
  /** ISO datetime */
  placedAt: string;
  /** preformatted date, e.g. "18/09/2026" */
  placedDate: string;
  status: OrderStatus;
  carrier: string;
  trackingCode: string;
  /** preformatted ETA, e.g. "24–26/09/2026" */
  eta: string;
  address: OrderAddress;
  /** ordered oldest → newest; the last event is the current one while pending/shipping */
  events: OrderEvent[];
}

/** "18/09, 14:32" */
export const fmtDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}, ${String(
    d.getHours()
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** "18/09/2026" */
export const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

/** "#VDR-28491" style code */
const makeOrderCode = () => `#VDR-${Math.floor(10000 + Math.random() * 90000)}`;
const makeTrackingCode = () => `GHN${Math.floor(10000000 + Math.random() * 89999999)}`;

const DEFAULT_ADDRESS: OrderAddress = {
  name: "Nguyễn Thu Hà",
  phone: "0912 345 678",
  detail: "Số 24, ngõ 118 Nguyễn Khánh Toàn, Cầu Giấy, Hà Nội",
};

const ci = (
  id: string,
  productId: string,
  name: string,
  seller: string,
  price: number,
  colorHex: string,
  colorKey: string,
  qty: number,
  size?: string
): CartItem => ({
  id,
  productId,
  name,
  seller,
  price,
  colorHex,
  colorKey,
  size,
  qty,
  stock: 99,
  inStock: true,
});

/** Seed history so the "Đơn hàng của tôi" page matches the mockup. */
const SEED_ORDERS: Order[] = [
  {
    code: "#VDR-284917",
    items: [
      ci("o1-1", "fashion-1", "Sơ mi lụa tay bồng cổ V", "Lụa & Chi", 420_000, "#5B4636", "detail.colors.brown", 1, "M"),
      ci("o1-2", "fashion-5", "Áo yếm lụa phối ren", "Lụa & Chi", 465_000, "#1A1B1E", "detail.colors.black", 2, "S"),
      ci("o1-3", "homeLiving-3", "Cà phê rang mộc 250g", "Vỏi Coffee", 89_000, "#5B4636", "detail.colors.brown", 3),
    ],
    note: "",
    paymentLabel: "COD",
    shipFee: 30_000,
    discount: 105_000,
    total: 1_542_000,
    placedAt: "2026-09-18T14:32:00",
    placedDate: "18/09/2026",
    status: "shipping",
    carrier: "Giao Hàng Nhanh",
    trackingCode: "GHN29304857",
    eta: "24–26/09/2026",
    address: DEFAULT_ADDRESS,
    events: [
      { key: "tracking.step.placed", time: "18/09, 14:32" },
      { key: "tracking.step.confirmed", time: "18/09, 16:05" },
      { key: "tracking.step.handed", time: "19/09, 09:20" },
      { key: "tracking.step.outForDelivery", time: "" },
    ],
  },
  {
    code: "#VDR-283990",
    items: [ci("o2-1", "handmade-2", "Nến thơm đúc tay hũ thủy tinh", "Nhà Nến", 160_000, "#C68A2E", "detail.colors.gold", 1)],
    note: "",
    paymentLabel: "MOMO",
    shipFee: 30_000,
    discount: 0,
    total: 190_000,
    placedAt: "2026-09-15T10:12:00",
    placedDate: "15/09/2026",
    status: "pending",
    carrier: "Giao Hàng Nhanh",
    trackingCode: "GHN29311204",
    eta: "19–21/09/2026",
    address: DEFAULT_ADDRESS,
    events: [{ key: "tracking.step.placed", time: "15/09, 10:12" }],
  },
  {
    code: "#VDR-281204",
    items: [ci("o3-1", "homeLiving-4", "Thớt gỗ nghiền nguyên khối", "Rừng Xanh", 245_000, "#EAE4D4", "detail.colors.brown", 1)],
    note: "",
    paymentLabel: "COD",
    shipFee: 0,
    discount: 0,
    total: 245_000,
    placedAt: "2026-09-09T09:05:00",
    placedDate: "09/09/2026",
    status: "delivered",
    carrier: "Giao Hàng Nhanh",
    trackingCode: "GHN29155321",
    eta: "11–13/09/2026",
    address: DEFAULT_ADDRESS,
    events: [
      { key: "tracking.step.placed", time: "09/09, 09:05" },
      { key: "tracking.step.confirmed", time: "09/09, 11:40" },
      { key: "tracking.step.handed", time: "10/09, 08:15" },
      { key: "tracking.step.outForDelivery", time: "11/09, 08:30" },
      { key: "tracking.step.delivered", time: "11/09, 15:22" },
    ],
  },
  {
    code: "#VDR-279881",
    items: [
      ci("o4-1", "beauty-1", "Serum vitamin C 10%", "An Nhiên Studio", 295_000, "#FFFFFF", "detail.colors.white", 1),
    ],
    note: "",
    paymentLabel: "VISA",
    shipFee: 0,
    discount: 0,
    total: 295_000,
    placedAt: "2026-09-02T18:47:00",
    placedDate: "02/09/2026",
    status: "delivered",
    carrier: "Giao Hàng Nhanh",
    trackingCode: "GHN29009117",
    eta: "04–06/09/2026",
    address: DEFAULT_ADDRESS,
    events: [
      { key: "tracking.step.placed", time: "02/09, 18:47" },
      { key: "tracking.step.confirmed", time: "03/09, 08:10" },
      { key: "tracking.step.handed", time: "03/09, 16:55" },
      { key: "tracking.step.outForDelivery", time: "04/09, 08:00" },
      { key: "tracking.step.delivered", time: "04/09, 12:41" },
    ],
  },
  {
    code: "#VDR-277653",
    items: [
      ci("o5-1", "homeLiving-2", "Đèn bàn gỗ óc chó", "Mộc Thĩ", 320_000, "#5B4636", "detail.colors.brown", 1),
      ci("o5-2", "handmade-4", "Tranh thêu tay 20x30", "Mộc Thĩ", 223_000, "#EAE4D4", "detail.colors.gold", 1),
    ],
    note: "",
    paymentLabel: "BANK",
    shipFee: 0,
    discount: 0,
    total: 543_000,
    placedAt: "2026-08-28T11:20:00",
    placedDate: "28/08/2026",
    status: "canceled",
    carrier: "Giao Hàng Nhanh",
    trackingCode: "GHN28871142",
    eta: "30/08–01/09/2026",
    address: DEFAULT_ADDRESS,
    events: [
      { key: "tracking.step.placed", time: "28/08, 11:20" },
      { key: "tracking.step.canceled", time: "29/08, 09:03" },
    ],
  },
  {
    code: "#VDR-275118",
    items: [ci("o6-1", "sports-2", "Thảm yoga cao su tự nhiên 6mm", "Rừng Xanh", 385_000, "#2C4A43", "detail.colors.green", 1)],
    note: "",
    paymentLabel: "COD",
    shipFee: 0,
    discount: 0,
    total: 385_000,
    placedAt: "2026-08-19T20:15:00",
    placedDate: "19/08/2026",
    status: "delivered",
    carrier: "Giao Hàng Nhanh",
    trackingCode: "GHN28750093",
    eta: "21–23/08/2026",
    address: DEFAULT_ADDRESS,
    events: [
      { key: "tracking.step.placed", time: "19/08, 20:15" },
      { key: "tracking.step.confirmed", time: "20/08, 07:50" },
      { key: "tracking.step.handed", time: "20/08, 14:30" },
      { key: "tracking.step.outForDelivery", time: "21/08, 08:10" },
      { key: "tracking.step.delivered", time: "21/08, 17:36" },
    ],
  },
];

interface OrderState {
  /** newest first */
  history: Order[];
  /** the order just placed in this session (for the success page) */
  lastOrder: Order | null;
  placeOrder: (input: {
    items: CartItem[];
    note: string;
    paymentLabel: string;
    shipFee: number;
    discount: number;
    total: number;
    address?: OrderAddress;
  }) => Order;
}

export const useOrderStore = create<OrderState>((set) => ({
  history: SEED_ORDERS,
  lastOrder: null,

  placeOrder: (input) => {
    const now = new Date().toISOString();
    const order: Order = {
      code: makeOrderCode(),
      items: input.items,
      note: input.note,
      paymentLabel: input.paymentLabel,
      shipFee: input.shipFee,
      discount: input.discount,
      total: input.total,
      placedAt: now,
      placedDate: fmtDate(now),
      status: "pending",
      carrier: "Giao Hàng Nhanh",
      trackingCode: makeTrackingCode(),
      eta: fmtDate(new Date(Date.now() + 3 * 86_400_000).toISOString()),
      address: input.address ?? DEFAULT_ADDRESS,
      events: [{ key: "tracking.step.placed", time: fmtDateTime(now) }],
    };
    set((s) => ({ history: [order, ...s.history], lastOrder: order }));
    return order;
  },
}));

export const ORDER_STATUS_TABS: { key: OrderStatus | "all"; labelKey: string }[] = [
  { key: "all", labelKey: "tracking.tabAll" },
  { key: "pending", labelKey: "tracking.tabPending" },
  { key: "shipping", labelKey: "tracking.tabShipping" },
  { key: "delivered", labelKey: "tracking.tabDelivered" },
  { key: "canceled", labelKey: "tracking.tabCanceled" },
];
