import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import Icon from "../../../components/brand/Icon";
import { useHistoryStore } from "../../../stores/historyStore";
import { useWishlistStore } from "../../../stores/wishlistStore";
import { useToastStore } from "../../../stores/toastStore";
import useAddToCart from "../../../hooks/useAddToCart";
import {
  getCategory,
  getProductDetail,
  getRelatedProducts,
} from "../../../data/categoryData";
import { formatVnd } from "../../../utils/format";
import ListingCard from "./ListingCard";

/* ------------------------------ icons ------------------------------ */

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "#8B3A2B" : "none"}
    stroke={filled ? "#8B3A2B" : "currentColor"}
    strokeWidth={2}
    className="h-5 w-5"
  >
    <path
      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2" strokeLinecap="round" />
  </svg>
);

const CompareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
    <path d="M8 4v14M8 18l-3-3M8 18l3-3M16 20V6M16 6l-3 3M16 6l3 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
    <path
      d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 shrink-0">
    <path d="M1 6h13v10H1zM14 9h4l3 3v4h-7z" strokeLinejoin="round" />
    <circle cx="5.5" cy="17.5" r="1.8" />
    <circle cx="17.5" cy="17.5" r="1.8" />
  </svg>
);

const ReturnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 shrink-0">
    <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 shrink-0">
    <path d="M12 2l8 3.5v5.2c0 5.1-3.4 9.6-8 11.3-4.6-1.7-8-6.2-8-11.3V5.5L12 2z" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.5-4.5M11 8v6M8 11h6" strokeLinecap="round" />
  </svg>
);

const Stars = ({ value, size = "text-base" }: { value: number; size?: string }) => (
  <span className={`${size} text-gold`} aria-hidden>
    {Array.from({ length: 5 }, (_, i) => {
      const full = value >= i + 1;
      const half = !full && value >= i + 0.5;
      return (
        <span key={i} className={full || half ? "" : "text-gold/40"}>
          {full ? "★" : half ? "⯨" : "★"}
        </span>
      );
    })}
  </span>
);

/* ------------------------------ page ------------------------------- */

const TABS = ["desc", "specs", "reviews", "shipping"] as const;
type TabKey = (typeof TABS)[number];

const REVIEW_AUTHORS = ["Nguyễn Thu Hà", "Trần Minh Quân", "Lê Phương Thảo"];

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const detail = useMemo(() => getProductDetail(id), [id]);
  const related = useMemo(() => (detail ? getRelatedProducts(detail, 4) : []), [detail]);
  // The single branded add-to-cart path: swatch flies, cart reacts, toast confirms.
  const addToCart = useAddToCart();
  const pushViewed = useHistoryStore((s) => s.pushViewed);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) =>
    detail ? s.items.some((i) => i.id === detail.id) : false
  );
  const pushToast = useToastStore((s) => s.push);

  const galleryRef = useRef<HTMLDivElement>(null);
  const [comparing, setComparing] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>("desc");

  // Personalisation: remember the visit so the homepage can offer to continue.
  useEffect(() => {
    if (!detail) return;
    pushViewed({
      id: detail.id,
      name: detail.name,
      seller: detail.seller,
      price: detail.price,
      oldPrice: detail.oldPrice,
      color: detail.color,
      colorHex: detail.colorHex,
      rating: detail.rating,
      reviews: detail.reviews,
      badge: detail.badge,
      subSlug: detail.subSlug,
      categorySlug: detail.slug,
    });
  }, [detail, pushViewed]);

  if (!detail) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-10">
        <TextCustom variant="h2">{t("listing.notFound")}</TextCustom>
        <Link to="/" className="mt-4 inline-block text-sm text-gold-deep underline underline-offset-4">
          {t("listing.backHome")}
        </Link>
      </div>
    );
  }

  const cat = getCategory(detail.slug);
  const subDef = cat?.subs.find((s) => s.slug === detail.subSlug);
  const discountPercent = detail.oldPrice
    ? Math.round((1 - detail.price / detail.oldPrice) * 100)
    : null;
  const sold = detail.reviews * 6 + 40;

  // Default size: "M" when available, else first enabled
  const effectiveSizeIdx =
    sizeIdx !== null
      ? sizeIdx
      : detail.sizes.length > 0
        ? Math.max(
            0,
            detail.sizes.findIndex((s) => s.label === "M" && !s.disabled) >= 0
              ? detail.sizes.findIndex((s) => s.label === "M" && !s.disabled)
              : detail.sizes.findIndex((s) => !s.disabled)
          )
        : null;

  const selectedColor = detail.variantColors[colorIdx] ?? detail.variantColors[0];

  const handleAddToCart = (buyNow = false) => {
    if (!detail) return;
    addToCart({
      productId: detail.id,
      name: detail.name,
      seller: detail.seller,
      price: detail.price,
      oldPrice: detail.oldPrice,
      colorHex: selectedColor.hex,
      colorKey: selectedColor.nameKey,
      size: effectiveSizeIdx !== null ? detail.sizes[effectiveSizeIdx]?.label : undefined,
      qty,
      stock: detail.stock,
      inStock: true,
      origin: galleryRef.current,
      swatch: detail.color,
      // "Buy now" also slides the cart drawer open, so the next step is visible.
      openDrawer: buyNow,
    });
  };

  const handleWishlist = () => {
    const added = toggleWishlist({
      id: detail.id,
      name: detail.name,
      seller: detail.seller,
      price: detail.price,
      oldPrice: detail.oldPrice,
      color: detail.color,
      colorHex: detail.colorHex,
      rating: detail.rating,
      reviews: detail.reviews,
      badge: detail.badge,
      subSlug: detail.subSlug,
      categorySlug: detail.slug,
    });
    pushToast({
      tone: added ? "success" : "info",
      title: added
        ? t('feedback.wishlistAdded', 'Đã lưu vào yêu thích')
        : t('feedback.wishlistRemoved', 'Đã bỏ khỏi yêu thích'),
      message: detail.name,
      icon: "heart",
      duration: 2600,
    });
  };

  const thumbs = detail.variantColors;

  const tabLabel = (key: TabKey) =>
    key === "reviews" ? t("detail.tabs.reviews", { count: detail.reviews }) : t(`detail.tabs.${key}`);

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink/50">
          <Link to="/" className="transition-colors hover:text-gold-deep">
            {t("listing.breadcrumbHome")}
          </Link>
          <span aria-hidden>/</span>
          <Link to={`/category/${detail.slug}`} className="transition-colors hover:text-gold-deep">
            {cat ? t(cat.labelKey) : detail.slug}
          </Link>
          {subDef && (
            <>
              <span aria-hidden>/</span>
              <Link
                to={`/category/${detail.slug}/${detail.subSlug}`}
                className="transition-colors hover:text-gold-deep"
              >
                {t(subDef.labelKey)}
              </Link>
            </>
          )}
          <span aria-hidden>/</span>
          <span className="font-semibold text-ink">{detail.name}</span>
        </nav>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* ---------- Left: rail + gallery ---------- */}
          <div className="flex gap-3">
            {/* Action rail */}
            <div className="hidden flex-col gap-3 md:flex">
              <ButtonCustom
                variant="raw"
                aria-pressed={wishlisted}
                ariaLabel={t("detail.wishlist")}
                onClick={handleWishlist}
                className={`flex h-12 w-12 items-center justify-center border bg-white transition-colors hover:border-ink ${
                  wishlisted ? "border-lacquer text-lacquer" : "border-line text-ink"
                }`}
              >
                <HeartIcon filled={wishlisted} />
              </ButtonCustom>
              <ButtonCustom
                variant="raw"
                ariaLabel={t("detail.share")}
                onClick={() => {
                  try {
                    void navigator.clipboard?.writeText(window.location.href);
                  } catch {
                    /* clipboard unavailable — ignore */
                  }
                }}
                className="flex h-12 w-12 items-center justify-center border border-line bg-white text-ink transition-colors hover:border-ink"
              >
                <ShareIcon />
              </ButtonCustom>
              <ButtonCustom
                variant="raw"
                aria-pressed={comparing}
                ariaLabel={t("detail.compare")}
                onClick={() => setComparing((v) => !v)}
                className={`flex h-12 w-12 items-center justify-center border border-line bg-white transition-colors hover:border-ink ${
                  comparing ? "bg-ink text-white" : "text-ink"
                }`}
              >
                <CompareIcon />
              </ButtonCustom>
            </div>

            {/* Gallery */}
            <div className="min-w-0 flex-1">
              <div
                ref={galleryRef}
                data-fly-origin
                className="brand-frame relative aspect-square w-full overflow-hidden border border-line"
                style={{ backgroundColor: detail.color }}
              >
                <div className="placeholder-diagonal absolute inset-16 opacity-40" />
                {discountPercent !== null ? (
                  <span className="absolute left-0 top-6 bg-gold-deep px-3 py-1.5 text-sm font-bold text-white">
                    -{discountPercent}%
                  </span>
                ) : detail.badge === "new" ? (
                  <span className="absolute left-0 top-6 bg-gold px-3 py-1.5 text-sm font-bold text-white">
                    {t("product.badgeNew")}
                  </span>
                ) : null}

                {thumbs.length > 1 && (
                  <>
                    <ButtonCustom
                      variant="raw"
                      ariaLabel={t("detail.prevImage")}
                      onClick={() => setColorIdx((i) => (i - 1 + thumbs.length) % thumbs.length)}
                      className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line bg-white/90 text-ink transition-colors hover:bg-white"
                    >
                      <ChevronIcon dir="left" />
                    </ButtonCustom>
                    <ButtonCustom
                      variant="raw"
                      ariaLabel={t("detail.nextImage")}
                      onClick={() => setColorIdx((i) => (i + 1) % thumbs.length)}
                      className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line bg-white/90 text-ink transition-colors hover:bg-white"
                    >
                      <ChevronIcon dir="right" />
                    </ButtonCustom>
                  </>
                )}

                <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-ink/70 px-3 py-2 text-xs text-white">
                  <ZoomIcon />
                  {t("detail.zoomHint")}
                </span>
              </div>

              {/* Thumbs */}
              <div className="mt-4 flex flex-wrap gap-3">
                {thumbs.map((v, i) => (
                  <ButtonCustom
                    key={v.hex}
                    variant="raw"
                    ariaLabel={t(v.nameKey)}
                    aria-pressed={i === colorIdx}
                    onClick={() => setColorIdx(i)}
                    className={`relative h-24 w-24 overflow-hidden border-2 transition-colors ${
                      i === colorIdx ? "border-ink" : "border-line hover:border-ink/50"
                    }`}
                    style={{ backgroundColor: v.hex }}
                  >
                    <span className="absolute inset-0 bg-white/55" />
                    <span className="placeholder-diagonal absolute inset-4 opacity-50" />
                  </ButtonCustom>
                ))}
                <ButtonCustom
                  variant="raw"
                  className="flex h-24 w-24 items-center justify-center bg-ink/60 text-lg font-bold text-white transition-colors hover:bg-ink"
                >
                  +6
                </ButtonCustom>
              </div>
            </div>
          </div>

          {/* ---------- Right: info ---------- */}
          <div>
            <TextCustom as="p" variant="body-sm" className="flex items-center gap-2">
              <span className="text-ink/60">{t("detail.sellerLabel")}</span>
              <span className="h-1 w-1 rounded-full bg-gold" aria-hidden />
              <Link
                to={`/shop/${encodeURIComponent(detail.seller)}`}
                className="font-medium text-gold-deep transition-colors hover:underline"
              >
                {detail.seller}
              </Link>
            </TextCustom>

            <TextCustom variant="h2" as="h1" className="mt-2 sm:text-4xl">
              {detail.name}
            </TextCustom>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <Stars value={detail.rating} />
              <span className="font-semibold text-ink">{detail.rating.toFixed(1)}</span>
              <a href="#reviews" className="text-ink/60 underline-offset-4 hover:underline">
                ({t("detail.reviewsCount", { count: detail.reviews })})
              </a>
              <span className="text-line" aria-hidden>
                |
              </span>
              <span className="text-ink/60">{t("detail.sold", { count: sold.toLocaleString("vi-VN") })}</span>
            </div>

            <hr className="mt-5 border-line" />

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <TextCustom variant="price" className="text-4xl">{formatVnd(detail.price)}</TextCustom>
              {detail.oldPrice && (
                <TextCustom variant="price-old">{formatVnd(detail.oldPrice)}</TextCustom>
              )}
              {detail.oldPrice && (
                <span className="bg-gold-deep px-2.5 py-1 text-sm font-semibold text-white">
                  {t("detail.save", { amount: formatVnd(detail.oldPrice - detail.price) })}
                </span>
              )}
            </div>

            <hr className="mt-5 border-line" />

            {/* Vouchers */}
            <div className="mt-5 border border-dashed border-gold/70 bg-white p-5">
              <TextCustom as="p" variant="body-sm" className="flex items-center gap-2 font-bold text-ink">
                <span className="text-gold" aria-hidden>
                  ◈
                </span>
                {t("detail.promoTitle")}
              </TextCustom>
              <div className="mt-2 divide-y divide-line/60">
                {detail.vouchers.map((v) => (
                  <div key={v.label} className="flex items-center gap-3 py-2.5 text-sm text-ink/80">
                    <span>{t(v.label)}</span>
                    {v.code && (
                      <span className="bg-paper-2 px-2 py-0.5 text-xs font-bold tracking-wide text-ink">
                        {v.code}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mt-6">
              <TextCustom variant="label" as="p" className="text-sm">
                {t("detail.colorLabel")}{" "}
                <span className="font-normal text-ink/70">{t(selectedColor.nameKey)}</span>
              </TextCustom>
              <div className="mt-3 flex flex-wrap gap-3">
                {detail.variantColors.map((v, i) => (
                  <ButtonCustom
                    key={v.hex}
                    variant="raw"
                    ariaLabel={t(v.nameKey)}
                    aria-pressed={i === colorIdx}
                    onClick={() => setColorIdx(i)}
                    className={`h-10 w-10 rounded-full border transition-shadow ${
                      i === colorIdx
                        ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper"
                        : "border-line hover:ring-1 hover:ring-ink/40 hover:ring-offset-2 hover:ring-offset-paper"
                    }`}
                    style={{ backgroundColor: v.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            {detail.sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <TextCustom variant="label" as="p" className="text-sm">
                    {t("detail.sizeLabel")}{" "}
                    <span className="font-normal text-ink/70">
                      {effectiveSizeIdx !== null ? detail.sizes[effectiveSizeIdx]?.label : ""}
                    </span>
                  </TextCustom>
                  <ButtonCustom
                    variant="raw"
                    className="text-sm font-normal text-gold-deep underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    {t("detail.sizeGuide")}
                  </ButtonCustom>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {detail.sizes.map((s, i) => (
                    <ButtonCustom
                      key={s.label}
                      variant="raw"
                      disabled={s.disabled}
                      aria-pressed={i === effectiveSizeIdx}
                      onClick={() => setSizeIdx(i)}
                      className={`h-11 min-w-11 border px-3 text-sm font-semibold transition-colors ${
                        s.disabled
                          ? "cursor-not-allowed border-line text-ink/30 line-through"
                          : i === effectiveSizeIdx
                            ? "border-ink bg-ink text-white"
                            : "border-line bg-white text-ink hover:border-ink"
                      }`}
                    >
                      {s.label}
                    </ButtonCustom>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + stock */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-line divide-x divide-line bg-white">
                <ButtonCustom
                  variant="raw"
                  ariaLabel={t("detail.decrease")}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-lg font-normal text-ink transition-colors hover:bg-paper-2"
                >
                  −
                </ButtonCustom>
                <span className="flex h-11 w-12 items-center justify-center text-sm font-semibold text-ink">
                  {qty}
                </span>
                <ButtonCustom
                  variant="raw"
                  ariaLabel={t("detail.increase")}
                  onClick={() => setQty((q) => Math.min(detail.stock, q + 1))}
                  className="flex h-11 w-11 items-center justify-center text-lg font-normal text-ink transition-colors hover:bg-paper-2"
                >
                  +
                </ButtonCustom>
              </div>
              <TextCustom as="p" variant="body-sm" color="!text-gold-deep" className="font-semibold">
                {t("detail.lowStock", { count: detail.stock })}
              </TextCustom>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <ButtonCustom
                variant="outline"
                size="lg"
                onClick={() => handleAddToCart(false)}
                className="flex-1 rounded-none py-4"
                icon={<Icon name="cart" className="h-4 w-4" />}
              >
                {t("detail.addToCart")}
              </ButtonCustom>
              <ButtonCustom
                variant="primary"
                size="lg"
                className="flex-1 rounded-none py-4"
                onClick={() => handleAddToCart(true)}
                icon={<Icon name="arrowRight" className="h-4 w-4" />}
              >
                {t("detail.buyNow")}
              </ButtonCustom>
            </div>

            {/* Shipping / guarantee */}
            <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm text-ink/70">
              <TextCustom as="p" variant="body-sm" className="flex items-center gap-3">
                <TruckIcon />
                <span>
                  {t("detail.shipEta")} · {t("detail.freeShipThreshold")}
                </span>
              </TextCustom>
              <TextCustom as="p" variant="body-sm" className="flex items-center gap-3">
                <ReturnIcon />
                {t("detail.returnFree")}
              </TextCustom>
              <TextCustom as="p" variant="body-sm" className="flex items-center gap-3">
                <ShieldIcon />
                {t("detail.guarantee")}
              </TextCustom>
            </div>
          </div>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className="mt-14" id="reviews">
          <div className="flex gap-1 overflow-x-auto border-b border-line no-scrollbar" role="tablist">
            {TABS.map((key) => (
              <ButtonCustom
                key={key}
                variant="raw"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`whitespace-nowrap border-b-2 px-5 py-3.5 text-sm font-semibold transition-colors ${
                  tab === key
                    ? "border-gold text-ink"
                    : "border-transparent text-ink/50 hover:text-ink"
                }`}
              >
                {tabLabel(key)}
              </ButtonCustom>
            ))}
          </div>

          <div key={tab} className="tab-panel-enter min-h-40 py-8">
            {tab === "desc" && (
              <div className="max-w-3xl text-sm leading-relaxed text-ink/80">
                <p>{t("detail.desc.p1", { name: detail.name, seller: detail.seller })}</p>
                <ul className="mt-4 list-disc space-y-1.5 pl-5">
                  {detail.highlights.map((h) => (
                    <li key={h}>{t(h)}</li>
                  ))}
                </ul>

                {/* Spec table (as in the mockup's description tab) */}
                <dl className="mt-8 max-w-xl">
                  {detail.specs.map((s) => (
                    <div key={s.labelKey} className="flex border-b border-line/70 py-3">
                      <dt className="w-44 shrink-0 text-ink/50">{t(s.labelKey)}</dt>
                      <dd className="font-medium text-ink">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {tab === "specs" && (
              <dl className="max-w-xl text-sm">
                {detail.specs.map((s) => (
                  <div key={s.labelKey} className="flex border-b border-line/70 py-3">
                    <dt className="w-44 shrink-0 text-ink/50">{t(s.labelKey)}</dt>
                    <dd className="font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
                <div className="flex border-b border-line/70 py-3">
                  <dt className="w-44 shrink-0 text-ink/50">{t("detail.specs.dimensions")}</dt>
                  <dd className="font-medium text-ink">30 × 20 × 5 cm</dd>
                </div>
                <div className="flex border-b border-line/70 py-3">
                  <dt className="w-44 shrink-0 text-ink/50">{t("detail.specs.model")}</dt>
                  <dd className="font-medium text-ink">{detail.id.toUpperCase()}</dd>
                </div>
              </dl>
            )}

            {tab === "reviews" && (
              <div className="max-w-3xl">
                <div className="flex items-center gap-4">
                  <span className="font-serif text-5xl text-ink">{detail.rating.toFixed(1)}</span>
                  <div>
                    <Stars value={detail.rating} size="text-lg" />
                    <p className="mt-1 text-sm text-ink/60">
                      {t("detail.reviewsCount", { count: detail.reviews })}
                    </p>
                  </div>
                </div>
                <div className="mt-6 divide-y divide-line/70">
                  {REVIEW_AUTHORS.map((author, i) => (
                    <div key={author} className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-ink">{author}</span>
                        <span className="text-xs text-ink/40">0{i + 2}/09/2026</span>
                      </div>
                      <div className="mt-1">
                        <Stars value={Math.min(5, Math.max(3.5, detail.rating - i * 0.5))} size="text-sm" />
                      </div>
                      <p className="mt-1.5 text-sm text-ink/80">{t(`detail.reviews.r${i + 1}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "shipping" && (
              <ul className="max-w-3xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/80">
                <li>{t("detail.shipping.p1")}</li>
                <li>{t("detail.shipping.p2")}</li>
                <li>{t("detail.shipping.p3")}</li>
              </ul>
            )}
          </div>
        </div>

        {/* ---------- Related products ---------- */}
        {related.length > 0 && (
          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <TextCustom variant="h2">{t("detail.related")}</TextCustom>
              <Link
                to={
                  subDef ? `/category/${detail.slug}/${detail.subSlug}` : `/category/${detail.slug}`
                }
                className="text-sm font-semibold text-ink underline underline-offset-4 transition-colors hover:text-gold-deep"
              >
                {t("detail.viewAll", { sub: subDef ? t(subDef.labelKey) : cat ? t(cat.labelKey) : "" })}
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 xl:grid-cols-4">
              {related.map((p) => (
                <ListingCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
