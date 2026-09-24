import { useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAdminStore } from "../../../stores/adminStore";
import { Field, Toggle, inputCls } from "./AdminUi";

type Tab = "general" | "homepage" | "notifications" | "store";

const TABS: Tab[] = ["general", "homepage", "notifications", "store"];

const AdminSettingsPage = () => {
  const { t } = useTranslation();
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);
  const [tab, setTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.settings.title")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.settings.subtitle")}
          </TextCustom>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <TextCustom as="span" variant="body-sm" className="font-bold !text-[#2C4A43]">
              ✓ {t("admin.settings.saved")}
            </TextCustom>
          )}
          <ButtonCustom variant="primary" onClick={save}>
            {t("admin.settings.save")}
          </ButtonCustom>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tb) => (
          <ButtonCustom
            key={tb}
            variant="raw"
            onClick={() => setTab(tb)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
              tab === tb ? "bg-ink text-white" : "border border-line bg-white text-ink hover:border-ink"
            }`}
          >
            {t(`admin.settings.tab.${tb}`)}
          </ButtonCustom>
        ))}
      </div>

      <section className="border border-line bg-white p-6">
        <TextCustom variant="h4">{t(`admin.settings.tab.${tab}`)}</TextCustom>
        <TextCustom as="p" variant="caption" className="mt-1">
          {t(`admin.settings.desc.${tab}`)}
        </TextCustom>

        {tab === "general" && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label={t("admin.settings.storeName")}>
              <input
                value={settings.storeName}
                onChange={(e) => updateSettings({ storeName: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label={t("admin.settings.supportEmail")}>
              <input
                value={settings.supportEmail}
                onChange={(e) => updateSettings({ supportEmail: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label={t("admin.settings.hotline")}>
              <input value={settings.hotline} onChange={(e) => updateSettings({ hotline: e.target.value })} className={inputCls} />
            </Field>
            <Field label={t("admin.settings.language")}>
              <select value={settings.language} onChange={(e) => updateSettings({ language: e.target.value })} className={inputCls}>
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </Field>
          </div>
        )}

        {tab === "homepage" && (
          <div className="mt-6 space-y-5">
            <Field label={t("admin.settings.homepageTitle")}>
              <input
                value={settings.homepageTitle}
                onChange={(e) => updateSettings({ homepageTitle: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label={t("admin.settings.homepageSubtitle")}>
              <textarea
                value={settings.homepageSubtitle}
                onChange={(e) => updateSettings({ homepageSubtitle: e.target.value })}
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <div className="flex flex-wrap gap-8">
              <Toggle
                checked={settings.showSlider}
                onChange={(v) => updateSettings({ showSlider: v })}
                label={t("admin.settings.showSlider")}
              />
              <Toggle checked={settings.showPromo} onChange={(v) => updateSettings({ showPromo: v })} label={t("admin.settings.showPromo")} />
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap gap-8">
              <Toggle
                checked={settings.notifyNewOrder}
                onChange={(v) => updateSettings({ notifyNewOrder: v })}
                label={t("admin.settings.notifyNewOrder")}
              />
              <Toggle
                checked={settings.notifyLowStock}
                onChange={(v) => updateSettings({ notifyLowStock: v })}
                label={t("admin.settings.notifyLowStock")}
              />
              <Toggle
                checked={settings.notifyNewUser}
                onChange={(v) => updateSettings({ notifyNewUser: v })}
                label={t("admin.settings.notifyNewUser")}
              />
            </div>
            <div className="max-w-xs">
              <Field label={t("admin.settings.lowStockThreshold")}>
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => updateSettings({ lowStockThreshold: Number(e.target.value) || 0 })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        )}

        {tab === "store" && (
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={t("admin.settings.currency")}>
                <select value={settings.currency} onChange={(e) => updateSettings({ currency: e.target.value })} className={inputCls}>
                  <option value="VND">VND — Việt Nam đồng</option>
                  <option value="USD">USD — US Dollar</option>
                </select>
              </Field>
              <Field label={t("admin.settings.freeShippingFrom")}>
                <input
                  type="number"
                  value={settings.freeShippingFrom}
                  onChange={(e) => updateSettings({ freeShippingFrom: Number(e.target.value) || 0 })}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="flex flex-wrap gap-8">
              <Toggle checked={settings.codEnabled} onChange={(v) => updateSettings({ codEnabled: v })} label={t("admin.settings.cod")} />
              <Toggle checked={settings.momoEnabled} onChange={(v) => updateSettings({ momoEnabled: v })} label={t("admin.settings.momo")} />
              <Toggle checked={settings.cardEnabled} onChange={(v) => updateSettings({ cardEnabled: v })} label={t("admin.settings.card")} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminSettingsPage;
