import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import InputCustom from "../../../../components/InputComponent/InputCustom";
import ButtonCustom from "../../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../../components/TextComponent/TextCustom";
import { cartCount, useCartStore } from "../../../../stores/cartStore";
import CategoryBar from "./CategoryBar";

const HeaderPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const cartItems = useCartStore((s) => s.items);
  const cartBadge = cartCount(cartItems);

  return (
    <header>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 lg:gap-x-8 lg:px-6">
        {/* Logo */}
        <div className="order-1 shrink-0">
          <TextCustom as="p" variant="h3" className="italic">
            Vendor<span className="text-gold">a</span>
          </TextCustom>
        </div>

        {/* Right actions: cart + account — same row as logo on mobile, right side from sm up */}
        <div className="order-2 ml-auto flex shrink-0 items-center gap-4 sm:gap-6">
          {/* Cart button */}
          <ButtonCustom
            variant="raw"
            ariaLabel={t("header.cart")}
            onClick={() => navigate("/cart")}
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
              {cartBadge > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                  {cartBadge}
                </span>
              )}
            </span>
            <TextCustom variant="caption" className="hidden sm:block">
              {t("header.cart")}
            </TextCustom>
          </ButtonCustom>

          {/* Account button with dropdown */}
          <div className="relative">
            <ButtonCustom
              variant="raw"
              ariaLabel={t("header.account")}
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
              <TextCustom variant="caption" className="hidden sm:block">
                {t("header.account")}
              </TextCustom>
            </ButtonCustom>

            {accountOpen && (
              <>
                {/* Mobile (<sm): full-screen dim + bottom sheet */}
                <div
                  className="fixed inset-0 z-40 bg-ink/40 sm:hidden"
                  onClick={() => setAccountOpen(false)}
                />
                <div className="fixed inset-x-3 bottom-3 z-50 rounded-lg border border-line bg-white py-1 shadow-2xl sm:hidden">
                  <ButtonCustom
                    variant="raw"
                    fullWidth
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-3.5 text-left text-base font-normal text-ink transition-colors hover:bg-paper-2 hover:text-gold-deep"
                  >
                    {t("header.signIn")}
                  </ButtonCustom>
                  <ButtonCustom
                    variant="raw"
                    fullWidth
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-3.5 text-left text-base font-normal text-ink transition-colors hover:bg-paper-2 hover:text-gold-deep"
                  >
                    {t("header.signUp")}
                  </ButtonCustom>
                </div>

                {/* Desktop (sm+): dropdown anchored to the button */}
                <div
                  className="fixed inset-0 z-10 hidden sm:block"
                  onClick={() => setAccountOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 hidden w-44 divide-y divide-line border border-line bg-white py-1 shadow-lg sm:block">
                  <ButtonCustom
                    variant="raw"
                    fullWidth
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 text-left text-sm font-normal text-ink transition-colors hover:bg-paper-2 hover:text-gold-deep"
                  >
                    {t("header.signIn")}
                  </ButtonCustom>
                  <ButtonCustom
                    variant="raw"
                    fullWidth
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 text-left text-sm font-normal text-ink transition-colors hover:bg-paper-2 hover:text-gold-deep"
                  >
                    {t("header.signUp")}
                  </ButtonCustom>
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
            <ButtonCustom
              type="submit"
              size="sm"
              className="shrink-0 self-stretch border-teal bg-ink px-3 hover:bg-teal sm:px-6"
            >
              {t("header.search.submit")}
            </ButtonCustom>
          </form>
        </div>
      </div>
      <CategoryBar />
    </header>
  );
};

export default HeaderPage;
