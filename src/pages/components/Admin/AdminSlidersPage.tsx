import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAdminStore, type HomeSlide } from "../../../stores/adminStore";
import { EmptyState, Field, Modal, Pill, Toggle, inputCls } from "./AdminUi";

interface FormState {
  title: string;
  description: string;
  image: string;
  buttonLabel: string;
  link: string;
  active: boolean;
}

const PRESET_BG = ["#EAE4D4", "#D9D0BC", "#9DB8B2", "#F3EFE6", "#1A1B1E", "#C68A2E"];

const EMPTY: FormState = {
  title: "",
  description: "",
  image: PRESET_BG[0],
  buttonLabel: "",
  link: "/",
  active: true,
};

const AdminSlidersPage = () => {
  const { t } = useTranslation();
  const { slides, addSlide, updateSlide, deleteSlide, moveSlide } = useAdminStore();

  const ordered = useMemo(() => [...slides].sort((a, b) => a.order - b.order), [slides]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const openCreate = () => {
    setForm({ ...EMPTY, image: PRESET_BG[ordered.length % PRESET_BG.length] });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (s: HomeSlide) => {
    setForm({
      title: s.title,
      description: s.description,
      image: s.image,
      buttonLabel: s.buttonLabel,
      link: s.link,
      active: s.active,
    });
    setEditing(s.id);
    setShowForm(true);
  };

  const submit = () => {
    if (!form.title.trim()) return;
    if (editing !== null) {
      updateSlide(editing, { ...form });
    } else {
      addSlide({ ...form, order: ordered.length + 1 });
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.sliders.title")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.sliders.subtitle")}
          </TextCustom>
        </div>
        <ButtonCustom variant="primary" onClick={openCreate}>
          + {t("admin.sliders.add")}
        </ButtonCustom>
      </div>

      {/* Live-ish homepage preview */}
      <section className="border border-line bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <TextCustom variant="h4">{t("admin.sliders.homePreview")}</TextCustom>
          <Pill tone="teal">{t("admin.sliders.onlyActive")}</Pill>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {ordered
            .filter((s) => s.active)
            .map((s) => (
              <div key={s.id} className="border border-line">
                <div className="flex h-32 items-center justify-center p-4" style={{ background: s.image }}>
                  <TextCustom
                    variant="h4"
                    className="text-center"
                    color={s.image === "#1A1B1E" ? "!text-white" : "!text-ink"}
                  >
                    {s.title}
                  </TextCustom>
                </div>
                <div className="border-t border-line p-3">
                  <TextCustom as="p" variant="caption" className="line-clamp-2">
                    {s.description}
                  </TextCustom>
                  <TextCustom as="span" variant="caption" className="mt-2 inline-block font-bold !text-gold-deep">
                    {s.buttonLabel} →
                  </TextCustom>
                </div>
              </div>
            ))}
          {ordered.filter((s) => s.active).length === 0 && (
            <TextCustom variant="body-sm" color="!text-ink/50">
              {t("admin.sliders.noActive")}
            </TextCustom>
          )}
        </div>
      </section>

      {/* Slide list */}
      <section className="border border-line bg-white">
        <div className="border-b border-line px-6 py-5">
          <TextCustom variant="h4">{t("admin.sliders.listTitle", { count: ordered.length })}</TextCustom>
        </div>
        <ul className="divide-y divide-line">
          {ordered.map((s, i) => (
            <li key={s.id} className="flex flex-wrap items-center gap-4 p-5">
              <div className="flex flex-col gap-1">
                <ButtonCustom
                  variant="raw"
                  aria-label={t("admin.sliders.moveUp")}
                  disabled={i === 0}
                  onClick={() => moveSlide(s.id, -1)}
                  className="flex h-7 w-7 items-center justify-center border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </ButtonCustom>
                <ButtonCustom
                  variant="raw"
                  aria-label={t("admin.sliders.moveDown")}
                  disabled={i === ordered.length - 1}
                  onClick={() => moveSlide(s.id, 1)}
                  className="flex h-7 w-7 items-center justify-center border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </ButtonCustom>
              </div>

              <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-ink text-[11px] font-bold text-white">
                {s.order}
              </span>

              <span className="h-16 w-24 shrink-0 border border-line" style={{ background: s.image }} />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                    {s.title}
                  </TextCustom>
                  <Pill tone={s.active ? "green" : "neutral"}>
                    {s.active ? t("admin.sliders.active") : t("admin.sliders.inactive")}
                  </Pill>
                </div>
                <TextCustom as="p" variant="caption" className="mt-1 line-clamp-2">
                  {s.description}
                </TextCustom>
                <TextCustom as="p" variant="caption" className="mt-1">
                  {t("admin.sliders.linkLabel")}: <strong className="!text-teal">{s.link}</strong> ·{" "}
                  {t("admin.sliders.buttonLabel")}: {s.buttonLabel}
                </TextCustom>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Toggle checked={s.active} onChange={(v) => updateSlide(s.id, { active: v })} />
                <ButtonCustom
                  variant="raw"
                  onClick={() => openEdit(s)}
                  className="border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-ink"
                >
                  {t("admin.edit")}
                </ButtonCustom>
                <ButtonCustom
                  variant="raw"
                  onClick={() => setConfirmId(s.id)}
                  className="border border-[#8B3A2B]/40 bg-[#8B3A2B]/5 px-3 py-1.5 text-xs font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
                >
                  {t("admin.delete")}
                </ButtonCustom>
              </div>
            </li>
          ))}
        </ul>
        {ordered.length === 0 && <EmptyState text={t("admin.sliders.empty")} />}
      </section>

      {showForm && (
        <Modal
          title={editing !== null ? t("admin.sliders.editTitle") : t("admin.sliders.createTitle")}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          wide
        >
          <div className="space-y-4">
            <Field label={t("admin.sliders.fieldTitle")}>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t("admin.sliders.titlePlaceholder")}
                className={inputCls}
              />
            </Field>
            <Field label={t("admin.sliders.fieldDesc")}>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field label={t("admin.sliders.fieldImage")}>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="#EAE4D4 or https://…/banner.jpg"
                className={inputCls}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESET_BG.map((c) => (
                  <ButtonCustom
                    key={c}
                    variant="raw"
                    aria-label={c}
                    onClick={() => setForm({ ...form, image: c })}
                    className={`h-8 w-8 border-2 ${form.image === c ? "border-gold" : "border-line"}`}
                  >
                    <span className="block h-full w-full" style={{ background: c }} />
                  </ButtonCustom>
                ))}
              </div>
              <TextCustom as="p" variant="caption" className="mt-1">
                {t("admin.sliders.imageHint")}
              </TextCustom>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("admin.sliders.fieldButton")}>
                <input
                  value={form.buttonLabel}
                  onChange={(e) => setForm({ ...form, buttonLabel: e.target.value })}
                  placeholder={t("admin.sliders.buttonPlaceholder")}
                  className={inputCls}
                />
              </Field>
              <Field label={t("admin.sliders.fieldLink")}>
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/category/fashion"
                  className={inputCls}
                />
              </Field>
            </div>
            <Toggle
              checked={form.active}
              onChange={(v) => setForm({ ...form, active: v })}
              label={t("admin.sliders.fieldActive")}
            />
            <div className="flex justify-end gap-3 pt-2">
              <ButtonCustom
                variant="raw"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink"
              >
                {t("admin.cancel")}
              </ButtonCustom>
              <ButtonCustom variant="primary" onClick={submit} disabled={!form.title.trim()}>
                {editing !== null ? t("admin.save") : t("admin.sliders.add")}
              </ButtonCustom>
            </div>
          </div>
        </Modal>
      )}

      {confirmId !== null && (
        <Modal title={t("admin.sliders.deleteTitle")} onClose={() => setConfirmId(null)}>
          <TextCustom as="p" variant="body-sm" color="!text-ink/70">
            {t("admin.sliders.deleteConfirm", {
              title: slides.find((s) => s.id === confirmId)?.title ?? "",
            })}
          </TextCustom>
          <div className="mt-6 flex justify-end gap-3">
            <ButtonCustom
              variant="raw"
              onClick={() => setConfirmId(null)}
              className="border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink"
            >
              {t("admin.cancel")}
            </ButtonCustom>
            <ButtonCustom
              variant="danger"
              onClick={() => {
                deleteSlide(confirmId);
                setConfirmId(null);
              }}
            >
              {t("admin.deleteConfirm")}
            </ButtonCustom>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSlidersPage;
