import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useOrderStore } from "../../../stores/orderStore";

interface SuccessLocationState {
  email?: string;
  address?: { name: string; phone: string; detail: string };
}
import Stepper from "./Stepper";

const CheckIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
    <rect x="9" y="9" width="11" height="11" rx="1.5" />
    <path d="M5 15V5a1 1 0 0 1 1-1h10" strokeLinecap="round" />
  </svg>
);

const TIMELINE_KEYS = ["success.tlPlaced", "success.tlConfirmed", "success.tlShipping", "success.tlDelivered"];

/** how many of the 4 dots are lit, per order status */
const LIT_DOTS: Record<string, number> = { pending: 2, shipping: 3, delivered: 4, canceled: 2 };

const SuccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const lastOrder = useOrderStore((s) => s.lastOrder);
  const [copied, setCopied] = useState(false);

  const email = (location.state as SuccessLocationState | null)?.email ?? "hanguyen@email.com";
  const address = (location.state as SuccessLocationState | null)?.address;

  // lastOrder is the object returned by placeOrder; find the live record in history
  const order = useMemo(() => {
    if (!lastOrder) return null;
    return useOrderStore.getState().history.find((o) => o.code === lastOrder.code) ?? null;
  }, [lastOrder]);

  const copyCode = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (!order) {
    return (
      <div className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-10">
          <TextCustom variant="h1">{t("success.noOrder")}</TextCustom>
          <ButtonCustom variant="primary" size="lg" className="mt-8" onClick={() => navigate("/")}>
            {t("cart.continueShopping")}
          </ButtonCustom>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        {/* current=3 → all three steps rendered as done, matching the mockup */}
        <Stepper current={3} />

        {/* Hero */}
        <div className="mt-12 text-center">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-teal text-white">
            <CheckIcon className="h-10 w-10" />
          </span>
          <TextCustom as="p" variant="body-sm" color="!text-gold-deep" className="mt-5 font-bold">
            {t("success.kicker")}
          </TextCustom>
          <TextCustom variant="h1" className="mt-3">
            {t("success.title")}
          </TextCustom>
          <TextCustom
            as="p"
            variant="body"
            color="!text-ink/70"
            className="mx-auto mt-4 max-w-xl"
          >
            {t("success.descBefore")}
            {" "}
            <strong className="font-bold text-ink">{email}</strong>
            {" "}
            {t("success.descAfter")}
          </TextCustom>
        </div>

        {/* Order card */}
        <div className="mt-10 border border-line bg-white">
          {/* Code row */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
            <TextCustom as="p" variant="body-sm" className="text-ink/60">
              {t("success.orderCode")}{" "}
              <span className="font-bold text-ink">{order.code}</span>
            </TextCustom>
            <ButtonCustom
              variant="raw"
              onClick={copyCode}
              className="flex items-center gap-2 text-sm font-semibold text-gold-deep underline underline-offset-4 transition-colors hover:text-ink"
            >
              <CopyIcon />
              {copied ? t("success.copied") : t("success.copyCode")}
            </ButtonCustom>
          </div>

          {/* Timeline */}
          <div className="px-5 pb-2 pt-8 sm:px-8">
            <div className="relative mx-auto max-w-2xl">
              {(() => {
                const lit = LIT_DOTS[order.status] ?? 2;
                return (
                  <>
                    <div className="absolute left-0 right-0 top-[7px] flex justify-between">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="relative flex flex-col items-center">
                          <span
                            className={`h-4 w-4 rounded-full ${i < lit ? "bg-teal" : "bg-line"} ${
                              i === 0 ? "ring-4 ring-teal/20" : ""
                            }`}
                          />
                        </span>
                      ))}
                    </div>
                    <div className="absolute left-2 right-2 top-[13px] h-0.5 bg-line" aria-hidden>
                      <div className="h-full bg-teal transition-all" style={{ width: `${((lit - 1) / 3) * 100}%` }} />
                    </div>
                  </>
                );
              })()}
              <div className="relative flex justify-between pt-8">
                {TIMELINE_KEYS.map((key, i) => (
                  <span
                    key={key}
                    className={`w-20 text-center text-xs sm:w-24 sm:text-sm ${
                      i < (LIT_DOTS[order.status] ?? 2) ? "font-semibold text-ink" : "text-ink/40"
                    }`}
                  >
                    {t(key)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Items */}
          <ul className="divide-y divide-line/70 px-5 pt-6 sm:px-8">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <span className="block aspect-square w-14 shrink-0" style={{ backgroundColor: item.colorHex }}>
                  <span className="placeholder-diagonal block h-full w-full opacity-40" />
                </span>
                <span className="min-w-0 flex-1">
                  <TextCustom as="span" variant="body-sm" className="block font-bold text-ink">
                    {item.name}
                  </TextCustom>
                  <TextCustom as="span" variant="caption" className="mt-0.5 block">
                    {t(item.colorKey)}
                    {item.size ? ` · ${item.size}` : ""}
                    {item.qty > 1 ? ` · ${t("success.qty", { count: item.qty })}` : ""} · {item.seller}
                  </TextCustom>
                </span>
                <TextCustom as="span" variant="body-sm" className="shrink-0 font-bold text-ink">
                  {(item.price * item.qty).toLocaleString("vi-VN").replace(/,/g, ".")}đ
                </TextCustom>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="border-t border-dashed border-line px-5 py-5 sm:px-8">
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/70">{t("success.subtotal")}</dt>
                <dd className="text-ink">
                  {order.items
                    .reduce((s, i) => s + i.price * i.qty, 0)
                    .toLocaleString("vi-VN")
                    .replace(/,/g, ".")}
                  đ
                </dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[#8B3A2B]">{t("success.discount")}</dt>
                  <dd className="text-[#8B3A2B]">
                    −{order.discount.toLocaleString("vi-VN").replace(/,/g, ".")}đ
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/70">{t("cart.shipFee")}</dt>
                <dd className="text-ink">
                  {order.shipFee.toLocaleString("vi-VN").replace(/,/g, ".")}đ
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                {t("success.total")}
              </TextCustom>
              <TextCustom variant="price">
                {order.total.toLocaleString("vi-VN").replace(/,/g, ".")}đ
              </TextCustom>
            </div>
          </div>

          {/* Ship-to + payment */}
          <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 sm:divide-x sm:divide-line">
            <div className="p-5 sm:p-8">
              <TextCustom as="p" variant="caption" className="text-xs font-bold uppercase tracking-wider text-ink/50">
                {t("success.shipTo")}
              </TextCustom>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                {address?.name ?? "Nguyễn Thu Hà"}
                <br />
                {address?.phone ?? "0912 345 678"}
                <br />
                {address?.detail ?? "Số 24, ngõ 118 Nguyễn Khánh Toàn, Cầu Giấy, Hà Nội"}
              </p>
              {order.note && (
                <p className="mt-3 border-l-2 border-gold bg-paper px-3 py-2 text-sm italic leading-relaxed text-ink/70">
                  “{order.note}”
                </p>
              )}
            </div>
            <div className="border-t border-line p-5 sm:border-t-0 sm:p-8">
              <TextCustom as="p" variant="caption" className="text-xs font-bold uppercase tracking-wider text-ink/50">
                {t("success.payment")}
              </TextCustom>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                {order.paymentLabel}
                <br />
                {t("success.eta", { date: `24–26 tháng 9, ${new Date().getFullYear()}` })}
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <ButtonCustom
            variant="primary"
            size="lg"
            className="min-w-52 px-10"
            onClick={() => navigate(`/account/orders/${encodeURIComponent(order.code)}`)}
          >
            {t("success.trackOrder")}
          </ButtonCustom>
          <ButtonCustom variant="outline" size="lg" className="min-w-52 px-10" onClick={() => navigate("/")}>
            {t("success.continueShopping")}
          </ButtonCustom>
        </div>

        <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-10 text-center">
          {t("success.needHelp")}{" "}
          <button
            type="button"
            className="font-semibold text-gold-deep underline underline-offset-4 transition-colors hover:text-ink"
          >
            {t("success.contactSupport")}
          </button>
        </TextCustom>
      </div>
    </div>
  );
};

export default SuccessPage;
