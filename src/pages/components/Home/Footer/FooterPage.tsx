import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../../components/TextComponent/TextCustom";

interface FooterColumn {
  titleKey: string;
  linkKeys: string[];
}

const COLUMNS: FooterColumn[] = [
  {
    titleKey: "footer.buyer.title",
    linkKeys: [
      "footer.buyer.howToOrder",
      "footer.buyer.trackOrder",
      "footer.buyer.returnsRefunds",
      "footer.buyer.paymentMethods",
    ],
  },
  {
    titleKey: "footer.seller.title",
    linkKeys: [
      "footer.seller.openStall",
      "footer.seller.feesCommission",
      "footer.seller.sellerTools",
      "footer.seller.successStories",
    ],
  },
  {
    titleKey: "footer.about.title",
    linkKeys: [
      "footer.about.introduction",
      "footer.about.careers",
      "footer.about.press",
      "footer.about.terms",
    ],
  },
  {
    titleKey: "footer.support.title",
    linkKeys: [
      "footer.support.helpCenter",
      "footer.support.contact",
      "footer.support.privacy",
      "footer.support.transactionSafety",
    ],
  },
];

const SOCIALS = [
  {
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.3-1.4 1.5-1.4h1.4V5.5c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2.3H8.5V14H11v7h2.5z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M21 6.3c-.6.3-1.3.5-2 .6.7-.4 1.2-1.1 1.5-1.9-.7.4-1.4.7-2.2.9A3.4 3.4 0 0 0 12.4 9c0 .3 0 .5.1.8-2.8-.1-5.4-1.5-7-3.6-.3.5-.5 1.1-.5 1.7 0 1.2.6 2.2 1.5 2.8-.5 0-1.1-.1-1.5-.4v.1c0 1.6 1.2 3 2.7 3.3-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.4 1.7 2.4 3.2 2.4A6.9 6.9 0 0 1 4 17.6a9.7 9.7 0 0 0 5.3 1.5c6.3 0 9.8-5.2 9.8-9.8v-.4c.7-.5 1.3-1.1 1.9-1.8z" />
      </svg>
    ),
  },
];

const PAYMENTS = ["VISA", "MOMO", "ZaloPay", "COD"];

const FooterPage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    if (i18n.language !== lng) i18n.changeLanguage(lng);
  };

  return (
    <footer className="border-t-4 border-gold bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        {/* Row 1 — brand */}
        <div>
          <TextCustom as="p" variant="h3" color="!text-white" className="font-semibold">
            Vendor<span className="text-teal-light">a</span>
          </TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-white/70" className="mt-4 max-w-md">
            {t("footer.description")}
          </TextCustom>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <ButtonCustom
                key={s.name}
                variant="raw"
                ariaLabel={s.name}
                className="flex h-9 w-9 items-center justify-center border border-white/25 text-white/80 transition-colors hover:border-gold hover:text-gold"
              >
                {s.icon}
              </ButtonCustom>
            ))}
          </div>
        </div>

        {/* Row 2 — link groups: vertical stack on phones, 2 across on sm,
            all 4 lying horizontally on lg+ */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {COLUMNS.map((col) => (
            <div key={col.titleKey}>
              <TextCustom variant="label" color="!text-white" className="text-sm">
                {t(col.titleKey)}
              </TextCustom>
              <ul className="mt-5 space-y-3.5">
                {col.linkKeys.map((key) => (
                  <li key={key}>
                    <ButtonCustom
                      variant="raw"
                      className="text-sm font-normal text-white/70 transition-colors hover:text-gold"
                    >
                      {t(key)}
                    </ButtonCustom>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-5 border-t border-white/15 pt-6 lg:mt-14 lg:flex-row lg:justify-between">
          <TextCustom as="p" variant="body-sm" color="!text-white/70">
            {t("footer.copyright")}
          </TextCustom>

          <div className="flex gap-2.5">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/80"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-sm">
              <ButtonCustom
                variant="raw"
                onClick={() => changeLanguage("vi")}
                className={`font-normal transition-colors ${
                  i18n.language === "vi" ? "font-bold text-gold" : "text-white/70 hover:text-gold"
                }`}
              >
                {t("footer.langVi")}
              </ButtonCustom>
              <ButtonCustom
                variant="raw"
                onClick={() => changeLanguage("en")}
                className={`font-normal transition-colors ${
                  i18n.language === "en" ? "font-bold text-gold" : "text-white/70 hover:text-gold"
                }`}
              >
                {t("footer.langEn")}
              </ButtonCustom>
            </div>
            <ButtonCustom
              variant="raw"
              className="flex items-center gap-1 font-normal text-white/70 transition-colors hover:text-gold"
            >
              {t("footer.currency")}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonCustom>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;
