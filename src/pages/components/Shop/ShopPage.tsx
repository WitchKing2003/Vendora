import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { getSellerProducts, getSellerProfile, getSellerRatingSummary } from "../../../data/sellerData";
import ListingCard from "../Listing/ListingCard";
import { useAuthStore } from "../../../stores/authStore";
import { useReviewStore } from "../../../stores/reviewStore";
import { useNavigate } from "react-router-dom";

const StarRow = ({ value }: { value: number }) => (
  <span className="text-sm text-gold" aria-hidden>
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={value >= i + 1 ? "" : "text-gold/40"}>
        ★
      </span>
    ))}
  </span>
);

const CheckBadge = () => (
  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal" aria-hidden>
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="h-3 w-3">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const TABS = ["products", "reviews", "about"] as const;
type TabKey = (typeof TABS)[number];

const ShopPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { seller } = useParams();
  const decoded = seller ? decodeURIComponent(seller) : "";

  const profile = useMemo(() => getSellerProfile(decoded), [decoded]);
  const products = useMemo(() => getSellerProducts(decoded), [decoded]);
  const reviewList = useReviewStore((s) => s.reviews);
  const addReview = useReviewStore((s) => s.addReview);
  const user = useAuthStore((s) => s.user);

  const [tab, setTab] = useState<TabKey>("products");
  const [collection, setCollection] = useState("all");
  const [sort, setSort] = useState<"newest" | "priceAsc" | "priceDesc">("newest");
  const [draftRating, setDraftRating] = useState(5);
  const [draftText, setDraftText] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const avgReviews = useMemo(() => {
    if (reviewList.length === 0) return 0;
    return (
      Math.round(
        (reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length) * 10
      ) / 10
    );
  }, [reviewList]);

  const shown = useMemo(() => {
    let list = products;
    if (collection !== "all") {
      list = list.filter(
        (p) => p.name.includes(collection) || p.subSlug === collection
      );
    }
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    else
      list = [...list].sort(
        (a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0)
      );
    return list;
  }, [products, collection, sort]);

  const ratingSummary = useMemo(
    () => getSellerRatingSummary(decoded, Math.max(128, reviewList.length)),
    [decoded, reviewList.length]
  );

  if (!profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-10">
        <TextCustom variant="h2">{t("shop.notFound")}</TextCustom>
        <Link to="/" className="mt-4 inline-block text-sm text-gold-deep underline underline-offset-4">
          {t("listing.backHome")}
        </Link>
      </div>
    );
  }

  const submitReview = () => {
    if (!user) {
      setNotice(t("shop.reviews.loginRequired"));
      return;
    }
    if (draftText.trim().length < 3) {
      setNotice(t("shop.reviews.tooShort"));
      return;
    }
    addReview({ rating: draftRating, comment: draftText, user });
    setDraftText("");
    setDraftRating(5);
    setNotice(null);
  };

  const stats = [
    { value: profile.rating.toFixed(1), labelKey: "shop.stats.rating", icon: "★" },
    { value: profile.followers.toLocaleString("vi-VN"), labelKey: "shop.stats.followers" },
    { value: String(profile.productCount), labelKey: "shop.stats.products" },
    { value: `${profile.responseRate}%`, labelKey: "shop.stats.response" },
    { value: `${profile.joinedYears} ${t("shop.stats.years")}`, labelKey: "shop.stats.joined" },
  ];

  return (
    <div className="bg-paper">
      {/* ---------- Hero banner ---------- */}
      <div className="shop-banner-gradient relative h-40 w-full sm:h-52" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* ---------- Profile card ---------- */}
        <div className="relative -mt-24 border border-line bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-5 sm:gap-7">
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gold font-serif text-5xl text-white shadow-sm sm:h-28 sm:w-28"
              aria-hidden
            >
              {profile.initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <TextCustom variant="h3" as="h1">
                  {profile.name}
                </TextCustom>
                {profile.verified && <CheckBadge />}
              </div>
              <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
                {profile.desc} · {profile.location}
              </TextCustom>
            </div>
            <div className="flex shrink-0 gap-3">
              <ButtonCustom variant="outline" className="px-5 py-2.5">
                {t("shop.followBtn.follow")}
              </ButtonCustom>
              <ButtonCustom variant="primary" className="px-5 py-2.5">
                + {t("shop.followBtn.track")}
              </ButtonCustom>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-7 grid grid-cols-2 gap-y-6 border-t border-line pt-6 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((s, i) => (
              <div
                key={s.labelKey}
                className={`px-2 text-center ${i !== 0 ? "sm:border-l sm:border-line" : ""}`}
              >
                <TextCustom variant="h3" className="font-serif text-3xl">
                  {s.icon === "★" ? (
                    <span>
                      <span className="text-gold" aria-hidden>★ </span>
                      {s.value}
                    </span>
                  ) : (
                    s.value
                  )}
                </TextCustom>
                <TextCustom as="p" variant="caption" color="!text-ink/55" className="mt-1">
                  {t(s.labelKey)}
                </TextCustom>
              </div>
            ))}
          </div>

          {/* ---------- Tabs ---------- */}
          <div className="-mx-6 mt-6 flex gap-1 overflow-x-auto border-t border-line no-scrollbar sm:-mx-8">
            {TABS.map((key) => (
              <ButtonCustom
                key={key}
                variant="raw"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`whitespace-nowrap border-b-2 px-5 py-3.5 text-sm font-semibold transition-colors ${
                  tab === key ? "border-gold text-ink" : "border-transparent text-ink/50 hover:text-ink"
                }`}
              >
                {key === "reviews"
                  ? t("shop.tabs.reviews", { count: Math.max(128, reviewList.length) })
                  : t(`shop.tabs.${key}`)}
              </ButtonCustom>
            ))}
          </div>
        </div>

        {tab === "products" && (
          <>
            {/* ---------- Promo bar ---------- */}
            <div className="mt-6 flex items-center gap-3 bg-teal px-5 py-4 text-sm text-white">
              <span className="text-gold" aria-hidden>◈</span>
              <span>
                {t(profile.promoText.key, {
                  percent: profile.promoText.values?.percent ?? "10%",
                  code: profile.promoText.values?.code ?? "COMBO10",
                  threshold: profile.promoText.values?.threshold ?? "300.000đ",
                })}
              </span>
            </div>

            {/* ---------- Collection chips ---------- */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {profile.collections.map((c) => (
                <ButtonCustom
                  key={c.key}
                  variant="raw"
                  aria-pressed={collection === c.key}
                  onClick={() => setCollection(c.key)}
                  className={`border px-4 py-2.5 text-sm font-normal transition-colors ${
                    collection === c.key
                      ? "border-ink bg-ink font-semibold text-white"
                      : "border-line bg-white text-ink hover:border-ink"
                  }`}
                >
                  {c.labelKey ? t(c.labelKey) : c.key} ({products.filter((p) => c.key === "all" || p.name.includes(c.key)).length})
                </ButtonCustom>
              ))}
            </div>

            {/* ---------- Toolbar ---------- */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <TextCustom as="p" variant="body-sm" color="!text-ink/60">
                {t("shop.showing", {
                  from: 1,
                  to: shown.length,
                  total: products.length,
                })}
              </TextCustom>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                aria-label={t("listing.sortLabel")}
                className="border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink outline-none"
              >
                <option value="newest">{t("shop.sort.newest")}</option>
                <option value="priceAsc">{t("shop.sort.priceAsc")}</option>
                <option value="priceDesc">{t("shop.sort.priceDesc")}</option>
              </select>
            </div>

            {/* ---------- Product grid ---------- */}
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 xl:grid-cols-4">
              {shown.map((p) => (
                <ListingCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}

        {tab === "reviews" && (
          <>
            {/* ---------- Rating summary ---------- */}
            <div className="mt-6 border border-line bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
                <div className="text-center md:border-r md:border-line">
                  <TextCustom variant="h1" className="font-serif text-6xl">
                    {avgReviews || ratingSummary.average.toFixed(1)}
                  </TextCustom>
                  <div className="mt-2 flex justify-center">
                    <StarRow value={avgReviews || ratingSummary.average} />
                  </div>
                  <TextCustom as="p" variant="caption" color="!text-ink/55" className="mt-2">
                    {t("shop.reviews.count", { count: reviewList.length })}
                  </TextCustom>
                </div>
                <div className="space-y-2">
                  {ratingSummary.stars.map((row) => (
                    <div key={row.star} className="flex items-center gap-3 text-sm">
                      <span className="w-6 shrink-0 text-ink/70">{row.star}★</span>
                      <div className="h-2 flex-1 bg-paper-2">
                        <div className="h-full bg-gold-deep" style={{ width: `${row.percent}%` }} />
                      </div>
                      <span className="w-10 shrink-0 text-right text-ink/60">{row.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---------- Login-gated comment form ---------- */}
            {user ? (
              <div className="mt-4 border border-line bg-white p-6">
                <TextCustom variant="label" className="text-base">
                  {t("shop.reviews.writeTitle")}
                </TextCustom>
                <div className="mt-3 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <ButtonCustom
                      key={n}
                      variant="raw"
                      ariaLabel={`${n} ★`}
                      aria-pressed={draftRating === n}
                      onClick={() => setDraftRating(n)}
                      className={`text-2xl transition-colors ${
                        draftRating >= n ? "text-gold" : "text-gold/30 hover:text-gold/60"
                      }`}
                    >
                      ★
                    </ButtonCustom>
                  ))}
                </div>
                <textarea
                  value={draftText}
                  maxLength={500}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder={t("shop.reviews.placeholder")}
                  rows={3}
                  className="mt-3 w-full resize-none border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-ink/45">{draftText.length}/500</span>
                  <ButtonCustom variant="primary" onClick={submitReview} disabled={draftText.trim().length < 3}>
                    {t("shop.reviews.submit")}
                  </ButtonCustom>
                </div>
                {notice && <p className="mt-2 text-xs text-clay">{notice}</p>}
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-line bg-white p-6">
                <TextCustom as="p" variant="body-sm" color="!text-ink/65">
                  {t("shop.reviews.loginRequired")}
                </TextCustom>
                <ButtonCustom variant="primary" onClick={() => navigate("/login")}>
                  {t("shop.reviews.loginCta")}
                </ButtonCustom>
              </div>
            )}

            {/* ---------- Review list ---------- */}
            <div className="mt-4 space-y-4 pb-14">
              {reviewList.map((r) => (
                <div key={r.id} className="border border-line bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-2 text-sm font-bold text-ink" aria-hidden>
                        {r.author.trim().charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <TextCustom as="p" variant="body-sm" className="font-bold">
                          {r.author}
                        </TextCustom>
                        <StarRow value={r.rating} />
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-ink/45">
                      {new Date(r.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">{r.comment}</p>
                  {r.productName && (
                    <span className="mt-3 inline-block bg-paper-2 px-2.5 py-1 text-xs text-ink/60">
                      {r.productName}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "about" && (
          <div className="mb-14 mt-6 border border-line bg-white p-6 sm:p-8">
            <TextCustom variant="h3">{profile.name}</TextCustom>
            <TextCustom as="p" variant="body-sm" color="!text-ink/70" className="mt-3 max-w-3xl leading-relaxed">
              {t("shop.about.text", { name: profile.name, location: profile.location })}
            </TextCustom>
            <dl className="mt-6 max-w-xl">
              <div className="flex border-b border-line/70 py-3 text-sm">
                <dt className="w-44 shrink-0 text-ink/50">{t("shop.about.location")}</dt>
                <dd className="font-medium text-ink">{profile.location}</dd>
              </div>
              <div className="flex border-b border-line/70 py-3 text-sm">
                <dt className="w-44 shrink-0 text-ink/50">{t("shop.about.joined")}</dt>
                <dd className="font-medium text-ink">
                  {t("shop.about.joinedValue", { years: profile.joinedYears })}
                </dd>
              </div>
              <div className="flex border-b border-line/70 py-3 text-sm">
                <dt className="w-44 shrink-0 text-ink/50">{t("shop.about.response")}</dt>
                <dd className="font-medium text-ink">{profile.responseRate}%</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
