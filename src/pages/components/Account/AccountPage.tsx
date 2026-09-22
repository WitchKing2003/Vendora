import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAuthStore } from "../../../stores/authStore";
import { AccountSidebar } from "./MyOrdersPage";

interface Address {
  id: number;
  label: string;
  name: string;
  phone: string;
  detail: string;
  isDefault?: boolean;
}

const SEED_ADDRESSES: Address[] = [
  { id: 1, label: "Nguyễn Thu Hà", name: "Nguyễn Thu Hà", phone: "0912 345 678", detail: "Số 24, ngõ 118 Nguyễn Khánh Toàn, Cầu Giấy, Hà Nội", isDefault: true },
  { id: 2, label: "Nguyễn Thu Hà — Công ty", name: "Nguyễn Thu Hà — Công ty", phone: "0912 345 678", detail: "Tầng 5, 20 Nguyễn Chí Thanh, Đống Đa, Hà Nội" },
];

const SOCIAL_ITEMS: { key: string; provider: string; connected: boolean }[] = [
  { key: "facebook", provider: "Facebook", connected: false },
  { key: "google", provider: "Google", connected: true },
  { key: "zalo", provider: "Zalo", connected: false },
];

// TODO: thay mock bằng dữ liệu user thật từ API
const PROFILE = {
  name: "Nguyễn Thu Hà",
  phone: "0912 345 678",
  email: "hanguyen@email.com",
  birthday: "14/06/1996",
  joined: "03/2024",
  gender: "female" as "male" | "female" | "other",
};

const AccountPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState(PROFILE.name);
  const [phone, setPhone] = useState(PROFILE.phone);
  const [gender, setGender] = useState(PROFILE.gender);
  const [saved, setSaved] = useState(false);

  const displayName = user?.name ?? PROFILE.name;
  const initial = displayName.trim().charAt(0).toUpperCase();

  const handleSave = () => {
    setSaved(true);
    // TODO: call real API để lưu thông tin
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink/50">
          <span className="cursor-pointer transition-colors hover:text-gold-deep" onClick={() => navigate("/")}>
            {t("listing.breadcrumbHome")}
          </span>
          <span aria-hidden>/</span>
          <span>{t("account.profile")}</span>
        </nav>

        <TextCustom variant="h1" className="mt-4">
          {t("account.profileTitle")}
        </TextCustom>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <AccountSidebar activeLabelKey="account.profile" />

          <div className="min-w-0 space-y-6">
            {/* Profile card */}
            <section className="flex flex-wrap items-center gap-5 border border-line bg-white p-6">
              <div className="relative">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold font-serif text-3xl text-white">
                  {initial}
                </span>
                <ButtonCustom
                  variant="raw"
                  ariaLabel={t("account.changeAvatar")}
                  className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-ink text-white transition-colors hover:bg-teal"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4 w-4">
                    <path d="M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2 20c1.5-3.5 5.5-5.5 10-5.5s8.5 2 10 5.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </ButtonCustom>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <TextCustom variant="h3">{displayName}</TextCustom>
                  <span className="inline-flex items-center gap-1 border border-gold-deep/40 bg-gold/10 px-2 py-0.5 text-xs font-bold text-gold-deep">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                      <path d="M12 17.3l-6.2 3.7 1.7-7L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.5 4.8 1.7 7z" />
                    </svg>
                    {t("account.goldMember")}
                  </span>
                </div>
                <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
                  {t("account.joinedAt", { date: PROFILE.joined })} · {PROFILE.email}
                </TextCustom>
              </div>
            </section>

            {/* Personal info form */}
            <section className="border border-line bg-white p-6 sm:p-8">
              <TextCustom variant="h3">{t("account.personalInfo")}</TextCustom>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <label className="block">
                  <TextCustom as="span" variant="label" className="mb-1.5 block">
                    {t("account.fullName")}
                  </TextCustom>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-line bg-paper-2/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:bg-white"
                  />
                </label>
                <label className="block">
                  <TextCustom as="span" variant="label" className="mb-1.5 block">
                    {t("account.phoneNumber")}
                  </TextCustom>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-line bg-paper-2/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:bg-white"
                  />
                </label>
                <div>
                  <TextCustom as="span" variant="label" className="mb-1.5 block">
                    {t("account.email")}
                  </TextCustom>
                  <input
                    value={PROFILE.email}
                    readOnly
                    className="w-full cursor-not-allowed border border-line bg-paper-2/60 px-3.5 py-2.5 text-sm text-ink/50 outline-none"
                  />
                  <TextCustom as="p" variant="caption" className="mt-1.5">
                    {t("account.emailHint")}
                  </TextCustom>
                </div>
                <div>
                  <TextCustom as="span" variant="label" className="mb-1.5 block">
                    {t("account.birthday")}
                  </TextCustom>
                  <input
                    value={PROFILE.birthday}
                    readOnly
                    className="w-full cursor-not-allowed border border-line bg-paper-2/60 px-3.5 py-2.5 text-sm text-ink/50 outline-none"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="mt-6">
                <TextCustom as="span" variant="label" className="mb-2.5 block">
                  {t("account.gender")}
                </TextCustom>
                <div className="flex flex-wrap gap-6">
                  {(["male", "female", "other"] as const).map((g) => (
                    <label key={g} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === g}
                        onChange={() => setGender(g)}
                        className="h-4 w-4 accent-gold-deep"
                      />
                      {t(`account.gender_${g}`)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
                <ButtonCustom variant="primary" onClick={handleSave}>
                  {saved ? t("account.saved") : t("account.saveChanges")}
                </ButtonCustom>
                <ButtonCustom
                  variant="raw"
                  onClick={() => {
                    setName(PROFILE.name);
                    setPhone(PROFILE.phone);
                    setGender(PROFILE.gender);
                  }}
                  className="border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink"
                >
                  {t("account.cancel")}
                </ButtonCustom>
              </div>
            </section>

            {/* Address book */}
            <section className="border border-line bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <TextCustom variant="h3">{t("account.addressBook")}</TextCustom>
                <span className="cursor-pointer text-sm font-bold text-gold-deep underline decoration-gold/50 underline-offset-4 transition-colors hover:text-ink">
                  {t("account.seeAll")}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {SEED_ADDRESSES.map((a) => (
                  <div
                    key={a.id}
                    className={`border p-4 sm:px-5 ${a.isDefault ? "border-ink" : "border-line bg-white"}`}
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                        {a.label}
                      </TextCustom>
                      {a.isDefault && (
                        <span className="bg-teal px-2 py-0.5 text-xs font-bold text-white">
                          {t("account.defaultAddress")}
                        </span>
                      )}
                      <span className="ml-auto flex gap-2">
                        <button
                          type="button"
                          onClick={() => {/* TODO: sửa địa chỉ qua API */}}
                          className="border border-gold-deep/40 bg-gold/10 px-2 py-0.5 text-xs font-bold text-gold-deep transition-colors hover:bg-gold/20"
                        >
                          {t("account.editAddress")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {/* TODO: xoá địa chỉ qua API */}}
                          className="border border-[#8B3A2B]/40 bg-[#8B3A2B]/5 px-2 py-0.5 text-xs font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
                        >
                          {t("account.deleteAddress")}
                        </button>
                      </span>
                    </div>
                    <TextCustom as="p" variant="body-sm" color="!text-ink/70" className="mt-2">
                      {a.phone}
                      <br />
                      {a.detail}
                    </TextCustom>
                  </div>
                ))}

                <ButtonCustom
                  variant="raw"
                  fullWidth
                  className="border border-dashed border-line bg-paper-2/50 px-4 py-3.5 text-sm font-bold text-ink/70 transition-colors hover:border-gold hover:text-gold-deep"
                >
                  + {t("account.addAddress")}
                </ButtonCustom>
              </div>
            </section>

            {/* Security */}
            <section className="border border-line bg-white p-6 sm:p-8">
              <TextCustom variant="h3">{t("account.security")}</TextCustom>

              <div className="mt-2 divide-y divide-line">
                <div className="flex flex-wrap items-center justify-between gap-3 py-5">
                  <div>
                    <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                      {t("account.password")}
                    </TextCustom>
                    <TextCustom as="p" variant="caption" className="mt-0.5">
                      {t("account.passwordLastChange")}
                    </TextCustom>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="border border-gold-deep/40 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-deep underline decoration-gold/50 underline-offset-2 transition-colors hover:bg-gold/20"
                  >
                    {t("account.changePassword")}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 py-5">
                  <div>
                    <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                      {t("account.twoFactor")}
                    </TextCustom>
                    <TextCustom as="p" variant="caption" className="mt-0.5">
                      {t("account.twoFactorDesc")}
                    </TextCustom>
                  </div>
                  <button
                    type="button"
                    onClick={() => {/* TODO: bật/tắt 2FA qua API */}}
                    className="border border-gold-deep/40 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-deep underline decoration-gold/50 underline-offset-2 transition-colors hover:bg-gold/20"
                  >
                    {t("account.enable2fa")}
                  </button>
                </div>

                {/* Social links — theo yêu cầu: sau 'Xác thực 2 lớp' */}
                <div className="flex flex-wrap items-center justify-between gap-3 py-5">
                  <div>
                    <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                      {t("account.socialLinks")}
                    </TextCustom>
                    <TextCustom as="p" variant="caption" className="mt-0.5">
                      {t("account.socialLinksDesc")}
                    </TextCustom>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SOCIAL_ITEMS.map((s) => (
                      <button
                        type="button"
                        key={s.key}
                        onClick={() => {/* TODO: liên kết mạng xã hội qua API */}}
                        className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                          s.connected
                            ? "bg-teal text-white hover:bg-teal-dark"
                            : "border border-line bg-white text-ink/70 hover:border-ink hover:text-ink"
                        }`}
                      >
                        {s.connected ? t("account.connected", { provider: s.provider }) : t("account.connect", { provider: s.provider })}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
