import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import {
  cartTotals,
  useCartStore,
} from "../../../stores/cartStore";
import { useOrderStore } from "../../../stores/orderStore";
import Stepper from "./Stepper";

const RadioDot = ({ selected }: { selected: boolean }) => (
  <span
    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
      selected ? "border-gold-deep" : "border-ink/40 bg-white"
    }`}
    aria-hidden
  >
    {selected && <span className="h-2.5 w-2.5 rounded-full bg-gold-deep" />}
  </span>
);

interface Address {
  id: string;
  name: string;
  phone: string;
  detail: string;
  isDefault?: boolean;
}

const ADDRESSES: Address[] = [
  {
    id: "addr-1",
    name: "Nguyễn Thu Hà",
    phone: "0912 345 678",
    detail: "Số 24, ngõ 118 Nguyễn Khánh Toàn, Cầu Giấy, Hà Nội",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Nguyễn Thu Hà — Công ty",
    phone: "0912 345 678",
    detail: "Tầng 5, 20 Nguyễn Chí Thanh, Đống Đa, Hà Nội",
  },
];

interface ShipMethod {
  id: string;
  nameKey: string;
  descKey: string;
  fee: number;
}

const SHIP_METHODS: ShipMethod[] = [
  { id: "standard", nameKey: "checkout.shipStandard", descKey: "checkout.shipStandardDesc", fee: 30_000 },
  { id: "express", nameKey: "checkout.shipExpress", descKey: "checkout.shipExpressDesc", fee: 55_000 },
  { id: "pickup", nameKey: "checkout.shipPickup", descKey: "checkout.shipPickupDesc", fee: 0 },
];

interface PayMethod {
  id: string;
  badge: string;
  nameKey: string;
  descKey: string;
}

const PAY_METHODS: PayMethod[] = [
  { id: "cod", badge: "COD", nameKey: "checkout.payCod", descKey: "checkout.payCodDesc" },
  { id: "momo", badge: "MOMO", nameKey: "checkout.payMomo", descKey: "checkout.payMomoDesc" },
  { id: "visa", badge: "VISA", nameKey: "checkout.payVisa", descKey: "checkout.payVisaDesc" },
  { id: "bank", badge: "BANK", nameKey: "checkout.payBank", descKey: "checkout.payBankDesc" },
];

/** Numbered section heading like the mockup (① Địa chỉ giao hàng) */
const SectionTitle = ({ n, title }: { n: number; title: string }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
      {n}
    </span>
    <TextCustom variant="h3" as="h2">
      {title}
    </TextCustom>
  </div>
);

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const selectedIds = useCartStore((s) => s.selectedIds);
  const voucher = useCartStore((s) => s.voucher);
  const clearCart = useCartStore((s) => s.clear);
  const placeOrder = useOrderStore((s) => s.placeOrder);

  const [addrId, setAddrId] = useState(ADDRESSES[0].id);
  const [shipId, setShipId] = useState("standard");
  const [payId, setPayId] = useState("cod");
  const [note, setNote] = useState("");

  const selectedItems = useMemo(
    () => items.filter((i) => selectedIds.includes(i.id) && i.inStock),
    [items, selectedIds]
  );

  // Ship fee from the chosen method; free if subtotal passes the threshold and method is standard
  const baseTotals = useMemo(
    () => cartTotals(items, selectedIds, voucher),
    [items, selectedIds, voucher]
  );
  const method = SHIP_METHODS.find((m) => m.id === shipId) ?? SHIP_METHODS[0];
  const shipFee =
    method.id === "standard" ? baseTotals.shipFee : method.fee;
  const discount = baseTotals.discount;
  const total = Math.max(0, baseTotals.selectedSubtotal - discount + shipFee);
  const selectedCount = baseTotals.selectedCount;

  const handlePlaceOrder = () => {
    const address = ADDRESSES.find((a) => a.id === addrId) ?? ADDRESSES[0];
    const pay = PAY_METHODS.find((p) => p.id === payId) ?? PAY_METHODS[0];
    placeOrder({
      items: selectedItems,
      note: note.trim(),
      paymentLabel: `${t(pay.nameKey)} (${pay.badge})`,
      shipFee,
      discount,
      total,
    });
    clearCart();
    navigate("/checkout/success", { state: { email: "hanguyen@email.com", address } });
  };

  if (selectedItems.length === 0) {
    return (
      <div className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-10">
          <TextCustom variant="h1">{t("checkout.emptyTitle")}</TextCustom>
          <TextCustom as="p" variant="body" color="!text-ink/60" className="mt-4">
            {t("checkout.empty")}
          </TextCustom>
          <ButtonCustom variant="primary" size="lg" className="mt-8" onClick={() => navigate("/cart")}>
            {t("checkout.backToCart")}
          </ButtonCustom>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <Stepper current={1} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left: sections */}
          <div className="min-w-0 space-y-6">
            {/* 1 — Address */}
            <section className="border border-line bg-white p-6 sm:p-8">
              <SectionTitle n={1} title={t("checkout.addressTitle")} />
              <div className="mt-5 space-y-4">
                {ADDRESSES.map((addr) => {
                  const selected = addrId === addr.id;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setAddrId(addr.id)}
                      className={`flex w-full items-start gap-3 border p-4 text-left transition-colors sm:p-5 ${
                        selected
                          ? "border-ink bg-paper"
                          : "border-dashed border-ink/40 bg-white hover:border-ink"
                      }`}
                    >
                      <RadioDot selected={selected} />
                      <span>
                        <span className="flex flex-wrap items-center gap-2.5">
                          <TextCustom as="span" variant="body-sm" className="font-bold text-ink">
                            {addr.name}
                          </TextCustom>
                          {addr.isDefault && (
                            <span className="bg-teal px-2 py-0.5 text-xs font-semibold text-white">
                              {t("checkout.defaultAddress")}
                            </span>
                          )}
                        </span>
                        <TextCustom as="span" variant="body-sm" color="!text-ink/70" className="mt-1 block">
                          {addr.phone}
                        </TextCustom>
                        <TextCustom as="span" variant="body-sm" color="!text-ink/70" className="block">
                          {addr.detail}
                        </TextCustom>
                      </span>
                    </button>
                  );
                })}

                <ButtonCustom
                  variant="raw"
                  className="text-sm font-semibold text-gold-deep underline underline-offset-4 transition-colors hover:text-ink"
                >
                  + {t("checkout.addAddress")}
                </ButtonCustom>
              </div>
            </section>

            {/* 2 — Shipping */}
            <section className="border border-line bg-white p-6 sm:p-8">
              <SectionTitle n={2} title={t("checkout.shipTitle")} />
              <div className="mt-5 space-y-4">
                {SHIP_METHODS.map((m) => {
                  const selected = shipId === m.id;
                  const fee =
                    m.id === "standard" ? baseTotals.shipFee : m.fee;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setShipId(m.id)}
                      className={`flex w-full items-center gap-3 border p-4 text-left transition-colors sm:p-5 ${
                        selected ? "border-ink bg-paper" : "border-line bg-white hover:border-ink"
                      }`}
                    >
                      <RadioDot selected={selected} />
                      <span className="min-w-0 flex-1">
                        <TextCustom as="span" variant="body-sm" className="block font-bold text-ink">
                          {t(m.nameKey)}
                        </TextCustom>
                        <TextCustom as="span" variant="caption" className="mt-0.5 block text-sm">
                          {t(m.descKey)}
                        </TextCustom>
                      </span>
                      <TextCustom variant="price-sm" className="shrink-0 text-base">
                        {fee === 0 ? "0đ" : `${fee.toLocaleString("vi-VN").replace(/,/g, ".")}đ`}
                      </TextCustom>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 3 — Payment */}
            <section className="border border-line bg-white p-6 sm:p-8">
              <SectionTitle n={3} title={t("checkout.payTitle")} />
              <div className="mt-5 space-y-4">
                {PAY_METHODS.map((p) => {
                  const selected = payId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPayId(p.id)}
                      className={`flex w-full items-center gap-3.5 border p-4 text-left transition-colors sm:p-5 ${
                        selected ? "border-ink bg-paper" : "border-line bg-white hover:border-ink"
                      }`}
                    >
                      <RadioDot selected={selected} />
                      <span
                        className={`shrink-0 px-2 py-1 text-xs font-bold ${
                          selected ? "bg-paper-2 text-ink" : "border border-line bg-paper-2 text-ink/70"
                        }`}
                      >
                        {p.badge}
                      </span>
                      <span className="min-w-0 flex-1">
                        <TextCustom as="span" variant="body-sm" className="block font-bold text-ink">
                          {t(p.nameKey)}
                        </TextCustom>
                        <TextCustom as="span" variant="caption" className="mt-0.5 block text-sm">
                          {t(p.descKey)}
                        </TextCustom>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 4 — Note for the shipper */}
            <section className="border border-line bg-white p-6 sm:p-8">
              <SectionTitle n={4} title={t("checkout.noteTitle")} />
              <TextCustom as="p" variant="caption" className="mt-2 block">
                {t("checkout.noteHint")}
              </TextCustom>
              <textarea
                value={note}
                maxLength={300}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("checkout.notePlaceholder")}
                aria-label={t("checkout.noteTitle")}
                rows={3}
                className="mt-3 w-full resize-none border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-gold"
              />
              <TextCustom as="p" variant="caption" className="mt-1 block text-right">
                {note.length}/300
              </TextCustom>
            </section>
          </div>

          {/* Right: order summary */}
          <aside className="h-fit border border-line bg-white p-6 lg:sticky lg:top-6">
            <TextCustom variant="h3">{t("checkout.orderTitle")}</TextCustom>

            <ul className="mt-5 divide-y divide-line/70">
              {selectedItems.map((item, idx) => (
                <li key={item.id} className="flex gap-3 py-3.5">
                  <span className="relative block aspect-square w-14 shrink-0" style={{ backgroundColor: item.colorHex }}>
                    <span className="absolute inset-0 bg-white/45" />
                    <span className="placeholder-diagonal absolute inset-2 opacity-40" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <TextCustom as="span" variant="body-sm" className="block font-bold text-ink">
                      {item.name}
                    </TextCustom>
                    <TextCustom as="span" variant="caption" className="mt-0.5 block">
                      {t(item.colorKey)}
                      {item.size ? ` · ${item.size}` : ""}
                    </TextCustom>
                  </span>
                  <TextCustom as="span" variant="body-sm" className="shrink-0 font-bold text-ink">
                    {(item.price * item.qty).toLocaleString("vi-VN").replace(/,/g, ".")}đ
                  </TextCustom>
                </li>
              ))}
            </ul>

            <hr className="my-4 border-line" />

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/70">{t("cart.subtotal", { count: selectedCount })}</dt>
                <dd className="font-semibold text-ink">
                  {baseTotals.selectedSubtotal.toLocaleString("vi-VN").replace(/,/g, ".")}đ
                </dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[#8B3A2B]">{t("cart.discount", { code: voucher?.code ?? "" })}</dt>
                  <dd className="font-semibold text-[#8B3A2B]">
                    −{discount.toLocaleString("vi-VN").replace(/,/g, ".")}đ
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/70">{t("cart.shipFee")}</dt>
                <dd className="font-semibold text-ink">
                  {shipFee === 0 ? t("cart.freeShip") : `${shipFee.toLocaleString("vi-VN").replace(/,/g, ".")}đ`}
                </dd>
              </div>
            </dl>

            <hr className="my-4 border-line" />

            <div className="flex items-baseline justify-between">
              <div>
                <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                  {t("cart.total")}
                </TextCustom>
                <TextCustom as="p" variant="caption">
                  {t("cart.vatIncluded")}
                </TextCustom>
              </div>
              <TextCustom variant="price" className="text-3xl">
                {total.toLocaleString("vi-VN").replace(/,/g, ".")}đ
              </TextCustom>
            </div>

            <ButtonCustom variant="primary" fullWidth size="lg" className="mt-6" onClick={handlePlaceOrder}>
              {t("checkout.placeOrder")}
              <span aria-hidden>→</span>
            </ButtonCustom>

            <TextCustom as="p" variant="caption" className="mt-4 block text-center leading-relaxed">
              {t("checkout.terms")}
            </TextCustom>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
