import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import InputCustom from "../../../components/InputComponent/InputCustom";
import { useAuthStore } from "../../../stores/authStore";

export type AuthMode = "login" | "signup" | "forgot" | "reset";

/** Mock token the "email" would point to — any token works in the demo. */
const SENT_TOKEN = "vdr-reset-demo";

const AuthPage = ({ mode }: { mode: AuthMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null); // forgot: email đã "gửi"
  const [resetDone, setResetDone] = useState(false); // reset: đã đổi xong

  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const token = searchParams.get("token");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "forgot") {
      if (!email.includes("@")) {
        setError(t("auth.invalid"));
        return;
      }
      setSentTo(email.trim()); // TODO: call real API to send reset email
      return;
    }

    if (mode === "reset") {
      if (password.length < 4) {
        setError(t("auth.reset.invalid"));
        return;
      }
      if (password !== confirm) {
        setError(t("auth.reset.mismatch"));
        return;
      }
      setResetDone(true); // TODO: call real API with token
      return;
    }

    if (!email.includes("@") || password.length < 4) {
      setError(t("auth.invalid"));
      return;
    }
    if (mode === "login") {
      login(email);
    } else {
      if (name.trim().length < 2) {
        setError(t("auth.invalidName"));
        return;
      }
      signup(name, email);
    }
    navigate(from, { replace: true });
  };

  const headerTitle =
    mode === "login"
      ? t("auth.loginTitle")
      : mode === "signup"
        ? t("auth.signupTitle")
        : mode === "forgot"
          ? t("auth.forgot.title")
          : t("auth.reset.title");

  const headerSubtitle =
    mode === "login"
      ? t("auth.loginSubtitle")
      : mode === "signup"
        ? t("auth.signupSubtitle")
        : mode === "forgot"
          ? t("auth.forgot.subtitle")
          : t("auth.reset.subtitle");

  return (
    <div className="bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-14 sm:px-6 lg:px-10">
        <Link to="/" className="mb-8">
          <TextCustom as="p" variant="h3" className="italic">
            Vendor<span className="text-gold">a</span>
          </TextCustom>
        </Link>

        <div className="w-full max-w-md border border-line bg-white p-7 sm:p-9">
          {/* ---------- Forgot: email sent confirmation ---------- */}
          {mode === "forgot" && sentTo ? (
            <div className="text-center">
              <span
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-2xl text-teal"
                aria-hidden
              >
                ✉
              </span>
              <TextCustom variant="h3" as="h2" className="mt-4">
                {t("auth.forgot.sentTitle")}
              </TextCustom>
              <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-2">
                {t("auth.forgot.sentDesc")} <span className="font-semibold text-ink">{sentTo}</span>
              </TextCustom>
              <TextCustom as="p" variant="caption" color="!text-ink/45" className="mt-2">
                {t("auth.forgot.sentMockNote")}
              </TextCustom>
              <div className="mt-6 space-y-2.5">
                <ButtonCustom
                  variant="primary"
                  fullWidth
                  className="py-3.5"
                  onClick={() => navigate(`/reset-password?token=${SENT_TOKEN}`)}
                >
                  {t("auth.forgot.openReset")}
                </ButtonCustom>
                <ButtonCustom variant="ghost" fullWidth onClick={() => setSentTo(null)}>
                  {t("auth.forgot.back")}
                </ButtonCustom>
              </div>
            </div>
          ) : (
            <>
              <TextCustom variant="h2" as="h1" className="text-center">
                {headerTitle}
              </TextCustom>
              <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-2 text-center">
                {headerSubtitle}
              </TextCustom>

              {/* ---------- Reset: invalid token ---------- */}
              {mode === "reset" && !token ? (
                <div className="mt-7 text-center">
                  <TextCustom as="p" variant="body-sm" color="!text-[#8B3A2B]">
                    {t("auth.reset.invalidToken")}
                  </TextCustom>
                  <ButtonCustom
                    variant="primary"
                    fullWidth
                    className="mt-5 py-3.5"
                    onClick={() => navigate("/forgot-password")}
                  >
                    {t("auth.forgot.title")}
                  </ButtonCustom>
                </div>
              ) : mode === "reset" && resetDone ? (
                /* ---------- Reset: success ---------- */
                <div className="mt-7 text-center">
                  <span
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal text-2xl text-white"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <TextCustom variant="h3" as="h2" className="mt-4">
                    {t("auth.reset.successTitle")}
                  </TextCustom>
                  <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-2">
                    {t("auth.reset.successDesc")}
                  </TextCustom>
                  <ButtonCustom
                    variant="primary"
                    fullWidth
                    className="mt-6 py-3.5"
                    onClick={() => navigate("/login", { replace: true })}
                  >
                    {t("auth.reset.toLogin")}
                  </ButtonCustom>
                </div>
              ) : (
                /* ---------- Forms ---------- */
                <form onSubmit={submit} className="mt-7 space-y-4">
                  {mode === "signup" && (
                    <label className="block">
                      <TextCustom as="span" variant="label" className="text-sm">
                        {t("auth.name")}
                      </TextCustom>
                      <InputCustom
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("auth.namePlaceholder")}
                        className="mt-1.5 w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold"
                      />
                    </label>
                  )}

                  {mode !== "reset" && (
                    <label className="block">
                      <TextCustom as="span" variant="label" className="text-sm">
                        {t("auth.email")}
                      </TextCustom>
                      <InputCustom
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("auth.emailPlaceholder")}
                        className="mt-1.5 w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold"
                      />
                    </label>
                  )}

                  {mode === "reset" && (
                    <>
                      <label className="block">
                        <TextCustom as="span" variant="label" className="text-sm">
                          {t("auth.reset.newPass")}
                        </TextCustom>
                        <InputCustom
                          type="password"
                          name="newPassword"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t("auth.passwordPlaceholder")}
                          className="mt-1.5 w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold"
                        />
                      </label>
                      <label className="block">
                        <TextCustom as="span" variant="label" className="text-sm">
                          {t("auth.reset.confirm")}
                        </TextCustom>
                        <InputCustom
                          type="password"
                          name="confirmPassword"
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          placeholder={t("auth.reset.confirmPlaceholder")}
                          className="mt-1.5 w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold"
                        />
                      </label>
                    </>
                  )}

                  {mode === "login" && (
                    <div className="flex justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-gold-deep underline underline-offset-4 hover:text-ink"
                      >
                        {t("auth.forgotLink")}
                      </Link>
                    </div>
                  )}

                  {error && (
                    <TextCustom as="p" variant="body-sm" color="!text-[#8B3A2B]" className="text-sm font-medium">
                      {error}
                    </TextCustom>
                  )}

                  <ButtonCustom type="submit" variant="primary" fullWidth className="py-3.5">
                    {mode === "login"
                      ? t("auth.loginSubmit")
                      : mode === "signup"
                        ? t("auth.signupSubmit")
                        : mode === "forgot"
                          ? t("auth.forgot.submit")
                          : t("auth.reset.submit")}
                  </ButtonCustom>
                </form>
              )}

              <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-6 text-center">
                {mode === "login" && (
                  <>
                    {t("auth.noAccount")}{" "}
                    <Link to="/signup" state={{ from }} className="font-semibold text-gold-deep underline underline-offset-4 hover:text-ink">
                      {t("auth.toSignup")}
                    </Link>
                  </>
                )}
                {mode === "signup" && (
                  <>
                    {t("auth.hasAccount")}{" "}
                    <Link to="/login" state={{ from }} className="font-semibold text-gold-deep underline underline-offset-4 hover:text-ink">
                      {t("auth.toLogin")}
                    </Link>
                  </>
                )}
                {(mode === "forgot" || mode === "reset") && (
                  <Link to="/login" className="font-semibold text-gold-deep underline underline-offset-4 hover:text-ink">
                    {t("auth.forgot.backToLogin")}
                  </Link>
                )}
              </TextCustom>
            </>
          )}
        </div>

        <TextCustom as="p" variant="caption" color="!text-ink/45" className="mt-6 max-w-sm text-center">
          {t("auth.terms")}
        </TextCustom>
      </div>
    </div>
  );
};

export default AuthPage;
