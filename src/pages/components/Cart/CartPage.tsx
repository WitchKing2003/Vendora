import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { PRODUCTS_BY_CATEGORY } from "../../../data/categoryData";
import { formatVnd } from "../../../utils/format";
import {
  cartTotals,
  remainingForFreeShip,
  useCartStore,
  type CartItem,
} from "../../../stores/cartStore";

const CheckIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className={className}>
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v5M14 11v5" strokeLinecap="round" />
  </svg>
);

const HeartSmallIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
    <path
      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
    <path d="M4 9l1.5-5h13L20 9M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M4 9h16M9 13h6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldSmallIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 shrink-0 mt-0.5">
    <path d="M12 2l8 3.5v5.2c0 5.1-3.4 9.6-8 11.3-4.6-1.7-8-6.2-8-11.3V5.5L12 2z" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Checkbox in the mockup style: gold square with white check */
const GoldCheckbox = ({
  checked,
  disabled = false,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
  label: string;
  className?: string;
}) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={onChange}
    className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
      checked
        ? "border-gold bg-gold text-white"
        : "border-ink/40 bg-white text-transparent hover:border-ink"
    } ${disabled ? "cursor-not-allowed opacity-40" : ""} ${className}`}
  >
    <CheckIcon />
  </button>
);

/** Items of one seller, sharing the group checkbox row */
const SellerGroup = ({ seller }: { seller: string }) => {
  const { t } = useTranslation();
  // select the stable array reference, then derive — filtering inside the
  // selector would return a new array each time and loop useSyncExternalStore
  const items = useCartStore((s) => s.items).filter((i) => i.seller === seller);
  const selectedIds = useCartStore((s) => s.selectedIds);
  const toggleItem = useCartStore((s) => s.toggleItem);
  const selectAll = useCartStore((s) => s.selectAll);

  const selectable = items.filter((i) => i.inStock);
  const allSelected = selectable.length > 0 && selectable.every((i) => selectedIds.includes(i.id));
  const groupSubtotal = selectable
    .filter((i) => selectedIds.includes(i.id))
    .reduce((sum, i) => sum + i.price * i.qty, 0);
  const remaining = remainingForFreeShip(groupSubtotal);

  return (
    <div>
      {/* Seller row */}
      <div className="flex items-center gap-3 bg-paper-2 px-4 py-3 sm:px-5">
        <GoldCheckbox
          checked={allSelected}
          disabled={selectable.length === 0}
          onChange={() => selectAll(!allSelected)}
          label={t("cart.selectAllSeller", { seller })}
        />
        <TextCustom as="p" variant="body-sm" className="flex items-center gap-2 font-bold text-ink">
          <StoreIcon />
          {seller}
        </TextCustom>
        <TextCustom
          as="p"
          variant="caption"
          color="!text-teal"
          className="ml-auto text-xs font-medium"
        >
          {remaining > 0
            ? t("cart.remainingForFreeShip", { amount: formatVnd(remaining) })
            : t("cart.freeShipUnlocked")}
        </TextCustom>
      </div>

      {items.map((item) => (
        <CartRow key={item.id} item={item} selected={selectedIds.includes(item.id)} onToggle={() => toggleItem(item.id)} />
      ))}
    </div>
  );
};

const CartRow = ({
  item,
  selected,
  onToggle,
}: {
  item: CartItem;
  selected: boolean;
  onToggle: () => void;
}) => {
  const { t } = useTranslation();
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-6 sm:gap-4 sm:px-5 ${
        item.inStock ? "" : "bg-white/50"
      }`}
    >
      <div className="pt-1">
        <GoldCheckbox
          checked={selected}
          disabled={!item.inStock}
          onChange={onToggle}
          label={t("cart.selectItem", { name: item.name })}
        />
      </div>

      {/* Thumbnail */}
      <Link
        to={`/product/${item.productId}`}
        className="relative block aspect-square w-20 shrink-0 sm:w-24"
        style={{ backgroundColor: item.colorHex }}
      >
        <span className="absolute inset-0 bg-white/45" />
        <span className="placeholder-diagonal absolute inset-3 opacity-40" />
        {!item.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-xs font-bold text-white">
            {t("cart.outOfStock")}
          </span>
        )}
      </Link>

      {/* Name + variant + save */}
      <div className="min-w-0 flex-1">
        <Link to={`/product/${item.productId}`} className="group block">
          <TextCustom variant="card-title" as="h3" className="text-base sm:text-lg">
            {item.name}
          </TextCustom>
        </Link>
        <TextCustom as="p" variant="caption" className="mt-1 text-xs sm:text-sm">
          {item.size
            ? `${t("cart.variantColor")} ${t(item.colorKey)} · ${t("cart.variantSize")}: ${item.size}`
            : `${t("cart.variantColor")} ${t(item.colorKey)}`}
        </TextCustom>
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1.5 border border-line bg-white px-2 py-1 text-xs text-ink/70 transition-colors hover:border-gold hover:text-gold-deep"
        >
          <HeartSmallIcon />
          {t("cart.saveForLater")}
        </button>
      </div>

      {/* Qty stepper */}
      <div className="flex items-center border border-line divide-x divide-line bg-white">
        <ButtonCustom
          variant="raw"
          ariaLabel={t("detail.decrease")}
          disabled={!item.inStock}
          onClick={() => updateQty(item.id, item.qty - 1)}
          className="flex h-9 w-9 items-center justify-center text-base font-normal text-ink transition-colors hover:bg-paper-2 disabled:opacity-40"
        >
          −
        </ButtonCustom>
        <span className="flex h-9 w-10 items-center justify-center text-sm font-semibold text-ink">
          {item.qty}
        </span>
        <ButtonCustom
          variant="raw"
          ariaLabel={t("detail.increase")}
          disabled={!item.inStock}
          onClick={() => updateQty(item.id, item.qty + 1)}
          className="flex h-9 w-9 items-center justify-center text-base font-normal text-ink transition-colors hover:bg-paper-2 disabled:opacity-40"
        >
          +
        </ButtonCustom>
      </div>

      {/* Line total + remove */}
      <div className="flex w-24 shrink-0 flex-col items-end gap-1.5 sm:w-28">
        <TextCustom variant="price-sm" className="text-base sm:text-lg">
          {formatVnd(item.price * item.qty)}
        </TextCustom>
        {item.oldPrice && (
          <TextCustom variant="price-old-sm" className="text-xs">
            {formatVnd(item.oldPrice * item.qty)}
          </TextCustom>
        )}
        <ButtonCustom
          variant="raw"
          ariaLabel={t("cart.removeItem")}
          onClick={() => removeItem(item.id)}
          className="flex h-8 w-8 items-center justify-center border border-line bg-white font-normal text-ink/60 transition-colors hover:border-[#8B3A2B] hover:text-[#8B3A2B]"
        >
          <TrashIcon />
        </ButtonCustom>
      </div>
    </div>
  );
};

const PAYMENTS = ["VISA", "MOMO", "ZaloPay", "COD"];

const CartPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const selectedIds = useCartStore((s) => s.selectedIds);
  const voucher = useCartStore((s) => s.voucher);
  const selectAll = useCartStore((s) => s.selectAll);
  const removeVoucher = useCartStore((s) => s.removeVoucher);
  const removeItem = useCartStore((s) => s.removeItem);

  const [voucherInput, setVoucherInput] = useState("");
  const [voucherError, setVoucherError] = useState(false);

  const totals = useMemo(
    () => cartTotals(items, selectedIds, voucher),
    [items, selectedIds, voucher]
  );

  const inStockCount = items.filter((i) => i.inStock).reduce((sum, i) => sum + i.qty, 0);

  const sellers = useMemo(
    () => [...new Set(items.map((i) => i.seller))],
    [items]
  );

  // Suggestions: deterministic pick of 5 products not in the cart
  const suggestions = useMemo(() => {
    const inCart = new Set(items.map((i) => i.productId));
    const pool = Object.values(PRODUCTS_BY_CATEGORY)
      .flat()
      .filter((p) => !inCart.has(p.id));
    return pool.filter((_, i) => i % 97 === 3).slice(0, 5);
  }, [items]);

  const handleApplyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    if (code === "COMBO10") {
      const subtotal = totals.selectedSubtotal;
      useCartStore.getState().applyVoucher({ code, amount: Math.round(subtotal * 0.1 / 1000) * 1000 });
      setVoucherInput("");
      setVoucherError(false);
    } else {
      setVoucherError(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-10">
          <TextCustom variant="h1">{t("cart.title")}</TextCustom>
          <TextCustom as="p" variant="body" color="!text-ink/60" className="mt-4">
            {t("cart.empty")}
          </TextCustom>
          <ButtonCustom variant="primary" size="lg" className="mt-8" onClick={() => navigate("/")}>
            {t("cart.continueShopping")}
          </ButtonCustom>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <TextCustom variant="h1">{t("cart.title")}</TextCustom>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-3 sm:gap-4">
          {["cart.step1", "cart.step2", "cart.step3"].map((key, i) => (
            <div key={key} className="flex items-center gap-3 sm:gap-4">
              {i > 0 && <span className="hidden h-px w-10 bg-line sm:block lg:w-16" aria-hidden />}
              <span className="flex items-center gap-2.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                    i === 0 ? "bg-ink text-white" : "bg-white text-ink/40 border border-line"
                  }`}
                >
                  {i + 1}
                </span>
                <TextCustom
                  as="span"
                  variant="body-sm"
                  className={i === 0 ? "font-bold text-ink" : "font-medium text-ink/40"}
                >
                  {t(key)}
                </TextCustom>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="min-w-0">
            {/* Select all bar */}
            <div className="flex flex-wrap items-center gap-3 border border-line bg-white px-4 py-3.5 sm:px-5">
              <GoldCheckbox
                checked={totals.allSelected}
                onChange={() => selectAll(!totals.allSelected)}
                label={t("cart.selectAll")}
              />
              <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                {t("cart.selectAllWithCount", { count: inStockCount })}
              </TextCustom>
              {selectedIds.length > 0 && (
                <ButtonCustom
                  variant="raw"
                  onClick={() => selectedIds.forEach((id) => removeItem(id))}
                  className="ml-auto text-sm font-normal text-ink/50 underline underline-offset-4 transition-colors hover:text-[#8B3A2B]"
                >
                  {t("cart.deleteSelected")}
                </ButtonCustom>
              )}
            </div>

            {/* Seller groups */}
            <div className="mt-4 border border-line bg-white">
              {sellers.map((seller) => (
                <SellerGroup key={seller} seller={seller} />
              ))}
            </div>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-gold-deep"
            >
              <span aria-hidden>‹</span>
              {t("cart.continueShopping")}
            </Link>
          </div>

          {/* Right column — order summary (sticky on desktop) */}
          <aside className="lg:sticky lg:top-6 h-fit border border-line bg-white p-6">
            <TextCustom variant="h3">{t("cart.summaryTitle")}</TextCustom>

            {/* Applied voucher */}
            {voucher && (
              <div className="mt-5 flex items-center gap-2 border border-dashed border-gold bg-paper px-3 py-2.5">
                <TextCustom as="p" variant="body-sm" className="font-bold text-gold-deep">
                  {voucher.code}
                </TextCustom>
                <TextCustom as="p" variant="caption" className="text-ink/70">
                  {t("cart.voucherApplied")}
                </TextCustom>
                <ButtonCustom
                  variant="raw"
                  onClick={removeVoucher}
                  className="ml-auto border border-line bg-white px-2 py-0.5 text-xs font-normal text-ink/60 transition-colors hover:border-[#8B3A2B] hover:text-[#8B3A2B]"
                >
                  {t("cart.removeVoucher")}
                </ButtonCustom>
              </div>
            )}

            {/* Voucher input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => {
                  setVoucherInput(e.target.value);
                  setVoucherError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyVoucher()}
                placeholder={t("cart.voucherPlaceholder")}
                aria-label={t("cart.voucherPlaceholder")}
                className={`min-w-0 flex-1 border bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40 ${
                  voucherError ? "border-[#8B3A2B]" : "border-line focus:border-gold"
                }`}
              />
              <ButtonCustom variant="primary" onClick={handleApplyVoucher}>
                {t("cart.applyVoucher")}
              </ButtonCustom>
            </div>
            {voucherError && (
              <TextCustom as="p" variant="caption" color="!text-[#8B3A2B]" className="mt-1.5 block">
                {t("cart.voucherInvalid")}
              </TextCustom>
            )}
            <TextCustom as="p" variant="caption" className="mt-2 block">
              {t("cart.voucherHint")}
            </TextCustom>

            <hr className="my-5 border-line" />

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/70">{t("cart.subtotal", { count: totals.selectedCount })}</dt>
                <dd className="font-semibold text-ink">{formatVnd(totals.selectedSubtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[#8B3A2B]">
                    {t("cart.discount", { code: voucher?.code ?? "" })}
                  </dt>
                  <dd className="font-semibold text-[#8B3A2B]">−{formatVnd(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/70">{t("cart.shipFee")}</dt>
                <dd className="font-semibold text-ink">
                  {totals.shipFee === 0 ? t("cart.freeShip") : formatVnd(totals.shipFee)}
                </dd>
              </div>
            </dl>

            <hr className="my-5 border-line" />

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
                {formatVnd(totals.total)}
              </TextCustom>
            </div>

            <ButtonCustom
              variant="primary"
              fullWidth
              size="lg"
              disabled={totals.selectedCount === 0}
              className="mt-6"
              onClick={() => navigate("/checkout")}
            >
              {t("cart.checkout")}
              <span aria-hidden>→</span>
            </ButtonCustom>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {PAYMENTS.map((p) => (
                <span
                  key={p}
                  className="border border-line px-2.5 py-1 text-xs font-semibold text-ink/70"
                >
                  {p}
                </span>
              ))}
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink/60">
              <ShieldSmallIcon />
              {t("cart.protection")}
            </p>
          </aside>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <TextCustom variant="h2">{t("cart.suggestions")}</TextCustom>
              <Link
                to="/"
                className="shrink-0 text-sm font-semibold text-ink underline underline-offset-8 transition-colors hover:text-gold-deep"
              >
                {t("cart.viewMore")}
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {suggestions.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group block">
                  <div
                    className="relative aspect-square w-full overflow-hidden"
                    style={{ backgroundColor: p.color }}
                  >
                    <div className="placeholder-diagonal absolute inset-6 opacity-40" />
                  </div>
                  <TextCustom as="p" variant="caption" className="mt-3 text-sm">
                    {p.seller}
                  </TextCustom>
                  <TextCustom variant="card-title" className="mt-0.5">
                    {p.name}
                  </TextCustom>
                  <TextCustom variant="price-sm" className="mt-1 block">
                    {formatVnd(p.price)}
                  </TextCustom>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CartPage;
