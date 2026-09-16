import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputCustom from "../../../../components/InputComponent/InputCustom";
import CategoryBar from "./CategoryBar";

const CART_ITEM_COUNT = 3;

const HeaderPage = () => {
  const { t } = useTranslation();
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 lg:gap-x-8 lg:px-6">
        {/* Logo */}
        <div className="order-1 shrink-0">
          <p className="text-3xl italic">
            Vendor<span className="text-gold">a</span>
          </p>
        </div>

        {/* Right actions: cart + account — same row as logo on mobile, right side from sm up */}
        <div className="order-2 ml-auto flex shrink-0 items-center gap-4 sm:gap-6">
          {/* Cart button */}
          <button
            type="button"
            aria-label={t("header.cart")}
            className="flex flex-col items-center gap-1 text-ink transition-colors hover:text-gold-deep"
          >
            <span className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-6 w-6"
              >
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17" cy="20" r="1.4" />
                <path
                  d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L20 8H6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {CART_ITEM_COUNT > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                  {CART_ITEM_COUNT}
                </span>
              )}
            </span>
            <span className="hidden text-xs sm:block">{t("header.cart")}</span>
          </button>

          {/* Account button with dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-label={t("header.account")}
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
              className="flex flex-col items-center gap-1 text-ink transition-colors hover:text-gold-deep"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-6 w-6"
              >
                <circle cx="12" cy="8" r="3.4" />
                <path d="M5 20c1.5-3.2 4-4.6 7-4.6s5.5 1.4 7 4.6" strokeLinecap="round" />
              </svg>
              <span className="hidden text-xs sm:block">{t("header.account")}</span>
            </button>

            {accountOpen && (
              <>
                {/* Mobile (<sm): full-screen dim + bottom sheet */}
                <div
                  className="fixed inset-0 z-40 bg-ink/40 sm:hidden"
                  onClick={() => setAccountOpen(false)}
                />
                <div className="fixed inset-x-3 bottom-3 z-50 rounded-lg border border-line bg-white py-1 shadow-2xl sm:hidden">
                  <button
                    type="button"
                    onClick={() => setAccountOpen(false)}
                    className="block w-full px-4 py-3.5 text-left text-base text-ink transition-colors hover:bg-paper-2 hover:text-gold-deep"
                  >
                    {t("header.signIn")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountOpen(false)}
                    className="block w-full px-4 py-3.5 text-left text-base text-ink transition-colors hover:bg-paper-2 hover:text-gold-deep"
                  >
                    {t("header.signUp")}
                  </button>
                </div>

                {/* Desktop (sm+): dropdown anchored to the button */}
                <div
                  className="fixed inset-0 z-10 hidden sm:block"
                  onClick={() => setAccountOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 hidden w-44 divide-y divide-line border border-line bg-white py-1 shadow-lg sm:block">
                  <button
                    type="button"
                    onClick={() => setAccountOpen(false)}
                    className="block w-full px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-paper-2 hover:text-gold-deep"
                  >
                    {t("header.signIn")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountOpen(false)}
                    className="block w-full px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-paper-2 hover:text-gold-deep"
                  >
                    {t("header.signUp")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Custom search bar — own full-width row on mobile, middle of the row from sm up */}
        <div className="order-3 flex w-full min-w-0 flex-1 basis-full sm:order-none sm:w-auto sm:basis-auto">
          <form
            className="flex min-w-0 w-full max-w-2xl items-stretch border border-line bg-white sm:mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Category select */}
            <select
              name="category"
              defaultValue=""
              className="w-36 shrink-0 border-r border-line bg-white px-2 text-sm text-ink outline-none sm:w-44 sm:px-3"
            >
              <option value="">{t("header.search.allCategories")}</option>
              <option value="fashion">{t("header.search.fashion")}</option>
              <option value="electronics">{t("header.search.electronics")}</option>
              <option value="home">{t("header.search.homeLiving")}</option>
              <option value="beauty">{t("header.search.beauty")}</option>
            </select>

            {/* Keyword input */}
            <InputCustom
              name="keyword"
              placeholder={t("header.search.placeholder")}
              className="min-w-0 flex-1 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-gray-400 outline-none"
            />

            {/* Submit button */}
            <button
              type="submit"
              className="shrink-0 bg-ink px-3 text-sm font-semibold text-white hover:bg-teal transition-colors sm:px-6"
            >
              {t("header.search.submit")}
            </button>
          </form>
        </div>
      </div>
      <CategoryBar />
    </header>
  );
};

export default HeaderPage;
