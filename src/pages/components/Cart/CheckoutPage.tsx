import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import Icon from "../../../components/brand/Icon";
import { PaymentMarkChip } from "../../../components/ui/PaymentMarks";
import { PAYMENT_MARK_BY_ID } from "../../../data/paymentMarks";
import {
  FREE_SHIP_THRESHOLD,
  SHIP_FEE,
  cartTotals,
  useCartStore,
  useCheckoutDraftStore,
  type CartItem,
} from "../../../stores/cartStore";
import { useOrderStore } from "../../../stores/orderStore";
import Stepper from "./Stepper";

/* ------------------------------ primitives ------------------------------ */

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

/** "Bước 1/3" tag above each panel's heading */
const StepTag = ({ label }: { label: string }) => (
  <p className="text-xs font-bold uppercase tracking-wider text-gold-deep">{label}</p>
);

const fmt = (n: number) => `${n.toLocaleString("vi-VN").replace(/,/g, ".")}đ`;

/* ------------------------------ mock data ------------------------------- */

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

const BANK_INFO = {
  name: "Vietcombank",
  beneficiary: "CÔNG TY TNHH VENDORA",
  accountNo: "0071 0009 8888",
};

/* ------------------------------ mock QR ----------------------------------
 * Presentation-only placeholder QR for the "scan to pay" step. The dot
 * pattern is generated once at module load (deterministic xorshift) so the
 * component render stays pure — no mutation while rendering. The project has
 * no QR library and adding one for a mock step is not warranted; when the
 * real payment gateway lands, swap <MockQr /> for the gateway's <img />.
 * ---------------------------------------------------------------------- */
const QR_CELLS = 25;

const QR_DOT_PATH = (() => {
  let seed = 0x9e3779b9;
  const next = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 0xffffffff;
  };
  const inFinder = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= QR_CELLS - 8) || (r >= QR_CELLS - 8 && c < 8);
  let path = "";
  for (let r = 0; r < QR_CELLS; r++) {
    for (let c = 0; c < QR_CELLS; c++) {
      if (inFinder(r, c)) continue;
      if (next() > 0.52) path += `M${c} ${r}h1v1h-1z`;
    }
  }
  return path;
})();

const MockQr = ({ size = 208 }: { size?: number }) => {
  const cell = size / QR_CELLS;

  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
      <rect width={cell * 7} height={cell * 7} fill="none" stroke="#1A1B1E" strokeWidth={cell} />
      <rect x={cell * 2} y={cell * 2} width={cell * 3} height={cell * 3} fill="#1A1B1E" />
    </g>
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="QR">
      <rect width={size} height={size} fill="#fff" />
      <path d={QR_DOT_PATH} fill="#1A1B1E" transform={`scale(${cell})`} />
      {finder(0, 0)}
      {finder((QR_CELLS - 7) * cell, 0)}
      {finder(0, (QR_CELLS - 7) * cell)}
      {/* centrepiece mark, like bank-issued VietQR */}
      <rect x={size / 2 - 20} y={size / 2 - 20} width={40} height={40} fill="#fff" />
      <circle cx={size / 2} cy={size / 2} r={11} fill="#C6A15B" />
      <circle cx={size / 2} cy={size / 2} r={4.5} fill="#1A1B1E" />
    </svg>
  );
};

/* ------------------------------ page ------------------------------ */

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const selectedIds = useCartStore((s) => s.selectedIds);
  const voucher = useCartStore((s) => s.voucher);
  const clearCart = useCartStore((s) => s.clear);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const draft = useCheckoutDraftStore((s) => s.draft);
  const clearBuyNow = useCheckoutDraftStore((s) => s.clearBuyNow);

  const [step, setStep] = useState(1);
  const [addrId, setAddrId] = useState(ADDRESSES[0].id);
  const [shipId, setShipId] = useState("standard");
  const [payId, setPayId] = useState("bank"); // bank QR is the primary demo path
  const [note, setNote] = useState("");
  const [verifying, setVerifying] = useState(false);

  /* Clear a pending verification timer if the buyer leaves mid-checkout. */
  const verifyTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (verifyTimer.current !== null) window.clearTimeout(verifyTimer.current);
    },
    []
  );

  /* Mock payment verification: hold the overlay for a beat, then place the
     order and move to the confirmation page. */

  const isBuyNow = draft.mode === "buyNow";
  const buyNowItem = isBuyNow ? draft.item : null;

  const checkoutItems: CartItem[] = useMemo(
    () =>
      isBuyNow && buyNowItem
        ? [buyNowItem]
        : items.filter((i) => selectedIds.includes(i.id) && i.inStock),
    [isBuyNow, buyNowItem, items, selectedIds]
  );

  /* Vouchers are a cart-only concept: buy-now orders start from the product's
     own discounted price. */
  const baseTotals = useMemo(
    () => (isBuyNow ? null : cartTotals(items, selectedIds, voucher)),
    [isBuyNow, items, selectedIds, voucher]
  );

  const method = SHIP_METHODS.find((m) => m.id === shipId) ?? SHIP_METHODS[0];

  const subtotal = isBuyNow
    ? checkoutItems.reduce((sum, i) => sum + i.price * i.qty, 0)
    : (baseTotals?.selectedSubtotal ?? 0);
  const discount = isBuyNow ? 0 : (baseTotals?.discount ?? 0);
  // Standard follows the cart's free-ship threshold; express/pickup use their own fee.
  const shipFee = isBuyNow
    ? method.id === "standard"
      ? subtotal - discount >= FREE_SHIP_THRESHOLD
        ? 0
        : SHIP_FEE
      : method.fee
    : method.id === "standard"
      ? (baseTotals?.shipFee ?? 0)
      : method.fee;
  const total = Math.max(0, subtotal - discount + shipFee);
  const selectedCount = checkoutItems.reduce((sum, i) => sum + i.qty, 0);

  const address = ADDRESSES.find((a) => a.id === addrId) ?? ADDRESSES[0];
  const pay = PAY_METHODS.find((p) => p.id === payId) ?? PAY_METHODS[0];

  const goBack = () => {
    if (step === 1) {
      navigate("/cart");
      return;
    }
    setStep((s) => s - 1);
  };

  /* Step guards: step 1+ needs items; step 2+ needs an address (always set
     here, so only the item guard matters in practice). */
  const empty = checkoutItems.length === 0;

  const confirmPayment = () => {
    if (verifying) return;
    setVerifying(true);
    // The exact totals/address at the moment of Confirm are captured in the
    // closure — editing fields afterwards can't corrupt this payment.
    verifyTimer.current = window.setTimeout(() => handleVerify(), 2200);
  };

  const handleVerify = () => {
    const placed = placeOrder({
      items: checkoutItems,
      note: note.trim(),
      paymentLabel: `${t(pay.nameKey)} (${pay.badge})`,
      shipFee,
      discount,
      total,
      address,
    });
    if (!isBuyNow) clearCart();
    clearBuyNow();
    navigate("/checkout/success", {
      state: { email: "hanguyen@email.com", address, placedCode: placed.code },
    });
  };

  /* ------------------------------ empty state ------------------------------ */

  if (empty) {
    return (
      <div className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-10">
          <TextCustom variant="h1">{t("checkout.emptyTitle")}</TextCustom>
          <TextCustom as="p" variant="body" color="!text-ink/60" className="mt-4">
            {t("checkout.empty")}
          </TextCustom>
          <ButtonCustom
            variant="primary"
            size="lg"
            className="mt-8"
            onClick={() => {
              if (isBuyNow) navigate(-1);
              else navigate("/cart");
            }}
            icon={<Icon name="arrowLeft" className="h-4 w-4" />}
          >
            {isBuyNow ? t("checkout.back") : t("checkout.backToCart")}
          </ButtonCustom>
        </div>
      </div>
    );
  }

  const stepLabel = t("checkout.stepOf", { n: step, total: 3 });

  /* ------------------------------ panels ------------------------------ */

  const addressPanel = (
    <section className="border border-line bg-white p-6 sm:p-8" data-qa-step="address">
      <StepTag label={stepLabel} />
      <TextCustom variant="h3" as="h2" className="mt-1">
        {t("checkout.addressTitle")}
      </TextCustom>

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
                selected ? "border-ink bg-paper" : "border-dashed border-ink/40 bg-white hover:border-ink"
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
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
        <ButtonCustom variant="primary" size="lg" className="sm:min-w-44" onClick={() => setStep(2)} icon={<Icon name="arrowRight" className="h-4 w-4" />}>
          {t("checkout.next")}
        </ButtonCustom>
        <ButtonCustom variant="outline" size="lg" onClick={goBack} icon={<Icon name="arrowLeft" className="h-4 w-4" />}>
          {t("checkout.back")}
        </ButtonCustom>
      </div>
    </section>
  );

  const shipPayPanel = (
    <section className="border border-line bg-white p-6 sm:p-8" data-qa-step="shippay">
      <StepTag label={stepLabel} />
      <TextCustom variant="h3" as="h2" className="mt-1">
        {t("checkout.shipTitle")}
      </TextCustom>

      <div className="mt-5 space-y-3">
        {SHIP_METHODS.map((m) => {
          const selected = shipId === m.id;
          const fee = m.id === "standard" ? shipFee : m.fee;
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
                {fee === 0 ? t("cart.freeShip") : fmt(fee)}
              </TextCustom>
            </button>
          );
        })}
      </div>

      <hr className="my-6 border-line" />

      <TextCustom variant="h3" as="h2">
        {t("checkout.payTitle")}
      </TextCustom>

      <div className="mt-5 space-y-3">
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
              <PaymentMarkChip mark={PAYMENT_MARK_BY_ID[p.id]} />
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
        <ButtonCustom variant="primary" size="lg" className="sm:min-w-44" onClick={() => setStep(3)} icon={<Icon name="arrowRight" className="h-4 w-4" />}>
          {t("checkout.next")}
        </ButtonCustom>
        <ButtonCustom variant="outline" size="lg" onClick={goBack} icon={<Icon name="arrowLeft" className="h-4 w-4" />}>
          {t("checkout.back")}
        </ButtonCustom>
      </div>
    </section>
  );

  const payPanel = (
    <section className="border border-line bg-white p-6 sm:p-8" data-qa-step="pay">
      <StepTag label={stepLabel} />
      <TextCustom variant="h3" as="h2" className="mt-1">
        {t("checkout.reviewTitle")}
      </TextCustom>
      <TextCustom as="p" variant="caption" className="mt-1.5 block">
        {t("checkout.reviewHint")}
      </TextCustom>

      <dl className="mt-5 space-y-2.5 border border-line bg-paper-2 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-ink/60">{t("checkout.reviewShipTo")}</dt>
          <dd className="text-right font-medium text-ink">
            {address.name} · {address.phone}
            <br />
            <span className="text-ink/70">{address.detail}</span>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-ink/60">{t("checkout.reviewShip")}</dt>
          <dd className="text-right font-medium text-ink">{t(method.nameKey)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-ink/60">{t("checkout.reviewPay")}</dt>
          <dd className="text-right font-medium text-ink">{t(pay.nameKey)}</dd>
        </div>
        {note.trim() && (
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-ink/60">{t("checkout.noteTitle")}</dt>
            <dd className="text-right italic text-ink/80">{note.trim()}</dd>
          </div>
        )}
      </dl>

      {payId === "bank" && (
        <div className="mt-6 rounded-xl border border-line bg-white p-5" data-qa="qr-section">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="border border-line bg-white p-2">
              <MockQr size={176} />
            </div>
            <div className="min-w-0 flex-1">
              <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                {t("checkout.qrTitle")}
              </TextCustom>
              <TextCustom as="p" variant="caption" className="mt-1 block">
                {t("checkout.qrHint")}
              </TextCustom>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/60">{t("checkout.qrBank")}</dt>
                  <dd className="font-semibold text-ink">{BANK_INFO.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/60">{t("checkout.qrAccount")}</dt>
                  <dd className="font-semibold text-ink">{BANK_INFO.accountNo}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/60">{t("checkout.qrBeneficiary")}</dt>
                  <dd className="font-semibold text-ink">{BANK_INFO.beneficiary}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-dashed border-line pt-1.5">
                  <dt className="text-ink/60">{t("checkout.qrAmount")}</dt>
                  <dd className="font-bold text-gold-deep">{fmt(total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {payId !== "bank" && (
        <div className="mt-6 flex items-center gap-3 border border-dashed border-gold/70 bg-paper p-4">
          <Icon name="shield" className="h-5 w-5 shrink-0 text-gold-deep" />
          <TextCustom as="p" variant="body-sm" color="!text-ink/70">
            {t("checkout.payNoQr")}
          </TextCustom>
        </div>
      )}

      {/* Note */}
      <div className="mt-6">
        <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
          {t("checkout.noteTitle")}
        </TextCustom>
        <textarea
          value={note}
          maxLength={300}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("checkout.notePlaceholder")}
          aria-label={t("checkout.noteTitle")}
          rows={2}
          className="mt-2 w-full resize-none border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-gold"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
        <ButtonCustom variant="primary" size="lg" className="sm:min-w-52" onClick={confirmPayment} icon={<Icon name="lock" className="h-4 w-4" />}>
          {t("checkout.confirmPayment")}
        </ButtonCustom>
        <ButtonCustom variant="outline" size="lg" onClick={goBack} icon={<Icon name="arrowLeft" className="h-4 w-4" />}>
          {t("checkout.back")}
        </ButtonCustom>
      </div>
    </section>
  );

  /* ------------------------------ review aside ------------------------------ */

  const review = (
    <aside className="h-fit border border-line bg-white p-6 lg:sticky lg:top-6" data-qa="review">
      <TextCustom variant="h3">{isBuyNow ? t("checkout.buyNowTitle") : t("checkout.orderTitle")}</TextCustom>

      <ul className="mt-5 divide-y divide-line/70">
        {checkoutItems.map((item) => (
          <li key={item.id} className="flex gap-3 py-3.5" data-qa-item={item.id}>
            <span className="relative block aspect-square w-14 shrink-0" style={{ backgroundColor: item.colorHex }}>
              <span className="absolute inset-0 bg-white/45" />
              <span className="placeholder-diagonal absolute inset-2 opacity-40" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                {item.qty}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <TextCustom as="span" variant="body-sm" className="block font-bold text-ink">
                {item.name}
              </TextCustom>
              <TextCustom as="span" variant="caption" className="mt-0.5 block">
                {t(item.colorKey)}
                {item.size ? ` · ${item.size}` : ""} · {t("success.qty", { count: item.qty })}
              </TextCustom>
            </span>
            <TextCustom as="span" variant="body-sm" className="shrink-0 font-bold text-ink">
              {fmt(item.price * item.qty)}
            </TextCustom>
          </li>
        ))}
      </ul>

      {isBuyNow && (
        <ButtonCustom
          variant="raw"
          className="mt-3 text-sm font-normal text-ink/50 underline underline-offset-4 transition-colors hover:text-gold-deep"
          onClick={() => navigate("/cart")}
        >
          {t("checkout.moveCart")}
        </ButtonCustom>
      )}

      <hr className="my-4 border-line" />

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink/70">{t("cart.subtotal", { count: selectedCount })}</dt>
          <dd className="font-semibold text-ink">{fmt(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-[#8B3A2B]">{t("cart.discount", { code: voucher?.code ?? "" })}</dt>
            <dd className="font-semibold text-[#8B3A2B]">−{fmt(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ink/70">{t("cart.shipFee")}</dt>
          <dd className="font-semibold text-ink">
            {shipFee === 0 ? t("cart.freeShip") : fmt(shipFee)}
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
          {fmt(total)}
        </TextCustom>
      </div>

      <TextCustom as="p" variant="caption" className="mt-4 flex items-start gap-2 leading-relaxed">
        <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t("checkout.termsShort")}
      </TextCustom>
    </aside>
  );

  /* ------------------------------ layout ------------------------------ */

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <Stepper current={1} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left: step panel */}
          <div className="min-w-0" data-qa="checkout-steps">
            <div key={step} className="animate-[page-enter_360ms_var(--ease-brand)_both]">
              {step === 1 && addressPanel}
              {step === 2 && shipPayPanel}
              {step === 3 && payPanel}
            </div>

            {/* Collapsed-step recap so earlier answers stay visible */}
            <div className="mt-4 space-y-2.5">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 border border-dashed border-line bg-white p-4 text-left text-sm transition-colors hover:border-ink"
                >
                  <span className="font-bold text-ink">{t("checkout.addressTitle")}</span>
                  <span className="text-ink/60">
                    {address.name} · {address.phone}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-gold-deep">
                    {t("checkout.edit")}
                    <Icon name="chevronRight" className="h-3.5 w-3.5" />
                  </span>
                </button>
              )}
              {step > 2 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 border border-dashed border-line bg-white p-4 text-left text-sm transition-colors hover:border-ink"
                >
                  <span className="font-bold text-ink">
                    {t(method.nameKey)} · {t(pay.nameKey)}
                  </span>
                  <span className="text-ink/60">
                    {shipFee === 0 ? t("cart.freeShip") : fmt(shipFee)}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-gold-deep">
                    {t("checkout.edit")}
                    <Icon name="chevronRight" className="h-3.5 w-3.5" />
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Right: sticky order review — visible on every step */}
          {review}
        </div>
      </div>

      {/* Verification overlay — briefly simulates the bank confirming the transfer */}
      {verifying && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 px-4"
          role="alertdialog"
          aria-busy="true"
          aria-label={t("checkout.verifyingTitle")}
          data-qa="verify"
        >
          <div className="w-full max-w-sm rounded-xl border border-line bg-white p-8 text-center shadow-xl animate-toast-in">
            <span className="mx-auto flex h-16 w-16 animate-spin items-center justify-center rounded-full border-2 border-line border-t-gold">
              <span className="sr-only">{t("checkout.verifyingTitle")}</span>
            </span>
            <TextCustom as="p" variant="body-sm" className="mt-5 font-bold text-ink">
              {t("checkout.verifyingTitle")}
            </TextCustom>
            <TextCustom as="p" variant="caption" className="mt-1.5 block">
              {t("checkout.verifyingHint", { amount: fmt(total) })}
            </TextCustom>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
