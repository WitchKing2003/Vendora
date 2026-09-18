import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useCartStore } from "../../../stores/cartStore";
import { useOrderStore } from "../../../stores/orderStore";

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6 shrink-0">
    <path d="M1 6h13v10H1zM14 9h4l3 3v4h-7z" strokeLinejoin="round" />
    <circle cx="5.5" cy="17.5" r="1.8" />
    <circle cx="17.5" cy="17.5" r="1.8" />
  </svg>
);

/** progress step of the vertical timeline for a given status */
const PROGRESS: Record<string, number> = {
  pending: 1, // placed done, current=confirmed
  shipping: 4, // placed/confirmed/handed done, current=outForDelivery
  delivered: 6, // beyond the last row → all five done
  canceled: 1,
};

const TIMELINE_BASE = ["placed", "confirmed", "handed", "outForDelivery", "delivered"];

const OrderTrackingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { code } = useParams();
  const history = useOrderStore((s) => s.history);
  const addToCart = useCartStore((s) => s.addItem);

  const order = useMemo(
    () => history.find((o) => o.code === decodeURIComponent(code ?? "")),
    [history, code]
  );

  const buyAgain = (productId: string) => {
    const orderItem = order?.items.find((i) => i.productId === productId);
    if (!orderItem) return;
    addToCart({
      productId: orderItem.productId,
      name: orderItem.name,
      seller: orderItem.seller,
      price: orderItem.price,
      oldPrice: undefined,
      colorHex: orderItem.colorHex,
      colorKey: orderItem.colorKey,
      size: orderItem.size,
      qty: 1,
      stock: 99,
      inStock: true,
    });
    navigate("/cart");
  };

  if (!order) {
    return (
      <div className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-10">
          <TextCustom variant="h1">{t("tracking.notFound")}</TextCustom>
          <ButtonCustom variant="primary" size="lg" className="mt-8" onClick={() => navigate("/account/orders")}>
            {t("tracking.myOrdersTitle")}
          </ButtonCustom>
        </div>
      </div>
    );
  }

  const isCanceled = order.status === "canceled";
  const progress = PROGRESS[order.status];

  // Build timeline rows: base steps + canceled row when canceled
  const rows = isCanceled
    ? [
        { key: "tracking.step.placed", descKey: "tracking.descPlaced", time: order.events[0]?.time ?? "", state: "done" as const },
        {
          key: "tracking.step.canceled",
          descKey: "tracking.descCanceled",
          time: order.events[1]?.time ?? "",
          state: "canceled" as const,
        },
      ]
    : TIMELINE_BASE.map((step, i) => {
        const event = order.events.find((e) => e.key.endsWith(step));
        const state =
          i < progress - 1 ? ("done" as const) : i === progress - 1 ? ("current" as const) : ("upcoming" as const);
        return {
          key: `tracking.step.${step}`,
          descKey: `tracking.desc${step.charAt(0).toUpperCase()}${step.slice(1)}`,
          time: state === "current" && !event?.time ? order.eta : (event?.time ?? ""),
          state,
        };
      });

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Card header */}
        <div className="border border-line bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <TextCustom variant="h2">{t("tracking.orderTitle", { code: order.code })}</TextCustom>
              <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
                {t("tracking.placedAt", { time: order.events[0]?.time ?? "", date: order.placedDate })} ·{" "}
                {t("tracking.paymentCod", { method: order.paymentLabel })}
              </TextCustom>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonCustom variant="outline">{t("tracking.contactSeller")}</ButtonCustom>
              {!isCanceled && order.status === "pending" && (
                <ButtonCustom variant="outline">{t("tracking.requestCancel")}</ButtonCustom>
              )}
              <ButtonCustom variant="primary">{t("tracking.viewInvoice")}</ButtonCustom>
            </div>
          </div>
        </div>

        {/* Carrier strip */}
        <div className="border-x border-line bg-paper-2/70 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal text-white">
              <TruckIcon />
            </span>
            <div className="min-w-0 flex-1">
              <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                {order.carrier} — {t("tracking.expected", { eta: order.eta })}
              </TextCustom>
              <TextCustom as="p" variant="caption" className="mt-0.5 block">
                {t("tracking.carrierPartner")}
              </TextCustom>
            </div>
            <span className="border border-dashed border-gold-deep bg-white px-3 py-2 text-sm font-bold text-ink">
              {t("tracking.trackingCode", { code: order.trackingCode })}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="border-x border-line bg-white px-6 py-8 sm:px-8">
          <ol className="space-y-0">
            {rows.map((row, i) => {
              const last = i === rows.length - 1;
              return (
                <li key={row.key} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Connector line */}
                  {!last && (
                    <span
                      className={`absolute left-[13px] top-8 h-full w-0.5 ${
                        row.state === "done" || row.state === "current" ? "bg-teal" : "bg-line"
                      }`}
                      aria-hidden
                    />
                  )}
                  {/* Node */}
                  <span className="relative z-10 shrink-0">
                    {row.state === "done" && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal text-white">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3.5 w-3.5">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                    {row.state === "current" && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold">
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                    )}
                    {row.state === "upcoming" && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-line bg-white" />
                    )}
                    {row.state === "canceled" && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B3A2B] text-white">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
                          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                      </span>
                    )}
                  </span>
                  {/* Text */}
                  <span className="min-w-0 flex-1 pb-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <TextCustom
                        as="span"
                        variant="body-sm"
                        className={`font-bold ${
                          row.state === "current"
                            ? "text-gold-deep"
                            : row.state === "upcoming"
                              ? "text-ink/40"
                              : "text-ink"
                        }`}
                      >
                        {t(row.key)}
                      </TextCustom>
                      {row.time && (
                        <TextCustom as="span" variant="caption" className={row.state === "current" ? "text-gold-deep" : ""}>
                          {row.time}
                        </TextCustom>
                      )}
                    </span>
                    <TextCustom
                      as="span"
                      variant="caption"
                      className={`mt-1 block ${row.state === "upcoming" ? "text-ink/40" : "text-ink/60"}`}
                    >
                      {t(row.descKey)}
                    </TextCustom>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Products */}
        <div className="border-x border-line bg-white px-6 pb-6 sm:px-8">
          <TextCustom as="p" variant="caption" className="text-xs font-bold uppercase tracking-wider text-ink/50">
            {t("tracking.productsInOrder")}
          </TextCustom>
          <ul className="mt-4 divide-y divide-line/70">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <Link to={`/product/${item.productId}`} className="block shrink-0">
                  <span className="block aspect-square w-16" style={{ backgroundColor: item.colorHex }}>
                    <span className="placeholder-diagonal block h-full w-full opacity-40" />
                  </span>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.productId}`} className="group block">
                    <TextCustom variant="card-title" as="h3">
                      {item.name}
                    </TextCustom>
                  </Link>
                  <TextCustom as="p" variant="caption" className="mt-0.5 block">
                    {t(item.colorKey)}
                    {item.size ? ` · ${item.size}` : ""}
                    {item.qty > 1 ? ` · ${t("tracking.qtyShort", { count: item.qty })}` : ""} · {item.seller}
                  </TextCustom>
                </div>
                <TextCustom as="p" variant="body-sm" className="shrink-0 font-bold text-ink">
                  {(item.price * item.qty).toLocaleString("vi-VN").replace(/,/g, ".")}đ
                </TextCustom>
                <button
                  type="button"
                  onClick={() => buyAgain(item.productId)}
                  className="shrink-0 text-sm font-semibold text-gold-deep underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {t("tracking.buyAgain")}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Address + payment */}
        <div className="grid grid-cols-1 border border-line bg-white sm:grid-cols-2 sm:divide-x sm:divide-line">
          <div className="p-6 sm:p-8">
            <TextCustom as="p" variant="caption" className="text-xs font-bold uppercase tracking-wider text-ink/50">
              {t("tracking.shipTo")}
            </TextCustom>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              {order.address.name} · {order.address.phone}
              <br />
              {order.address.detail}
            </p>
            {order.note && (
              <p className="mt-3 border-l-2 border-gold bg-paper px-3 py-2 text-sm italic leading-relaxed text-ink/70">
                “{order.note}”
              </p>
            )}
          </div>
          <div className="border-t border-line p-6 sm:border-t-0 sm:p-8">
            <TextCustom as="p" variant="caption" className="text-xs font-bold uppercase tracking-wider text-ink/50">
              {t("tracking.paymentDetails")}
            </TextCustom>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/70">{t("success.subtotal")}</dt>
                <dd className="text-ink">
                  {order.items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString("vi-VN").replace(/,/g, ".")}đ
                </dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[#8B3A2B]">{t("success.discount")}</dt>
                  <dd className="text-[#8B3A2B]">−{order.discount.toLocaleString("vi-VN").replace(/,/g, ".")}đ</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/70">{t("cart.shipFee")}</dt>
                <dd className="text-ink">{order.shipFee.toLocaleString("vi-VN").replace(/,/g, ".")}đ</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-bold text-ink">{t("success.total")}</dt>
                <dd className="text-lg font-bold text-ink">
                  {order.total.toLocaleString("vi-VN").replace(/,/g, ".")}đ
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            to="/account/orders"
            className="text-sm font-semibold text-ink underline underline-offset-4 transition-colors hover:text-gold-deep"
          >
            ‹ {t("tracking.myOrdersTitle")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
