import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAdminStore, type HomeSection } from "../../../stores/adminStore";
import { EmptyState, Field, Modal, Pill, Toggle, inputCls } from "./AdminUi";

interface FormState {
  title: string;
  subtitle: string;
  categorySlug: string;
  visible: boolean;
}

const AdminHomepageSectionsPage = () => {
  const { t } = useTranslation();
  const { sections, categories, products, addSection, updateSection, deleteSection, moveSection } = useAdminStore();

  const ordered = useMemo(() => [...sections].sort((a, b) => a.order - b.order), [sections]);
  const productCount = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return m;
  }, [products]);

  const [form, setForm] = useState<FormState>({ title: "", subtitle: "", categorySlug: categories[0]?.slug ?? "", visible: true });
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const openCreate = () => {
    setForm({ title: "", subtitle: "", categorySlug: categories[0]?.slug ?? "", visible: true });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (s: HomeSection) => {
    setForm({ title: s.title, subtitle: s.subtitle, categorySlug: s.categorySlug, visible: s.visible });
    setEditing(s.id);
    setShowForm(true);
  };

  const submit = () => {
    if (!form.title.trim()) return;
    if (editing !== null) {
      updateSection(editing, { ...form });
    } else {
      addSection({ ...form, order: ordered.length + 1 });
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.sections.title")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.sections.subtitle")}
          </TextCustom>
        </div>
        <ButtonCustom variant="primary" onClick={openCreate}>
          + {t("admin.sections.add")}
        </ButtonCustom>
      </div>

      <section className="border border-line bg-white p-6">
        <TextCustom variant="h4">{t("admin.sections.homePreview")}</TextCustom>
        <TextCustom as="p" variant="caption" className="mt-1">
          {t("admin.sections.homePreviewDesc")}
        </TextCustom>
        <div className="mt-5 space-y-3">
          {ordered
            .filter((s) => s.visible)
            .map((s) => (
              <div key={s.id} className="border border-line bg-paper-2/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <TextCustom as="p" variant="h4" className="!text-base">
                    {s.title}
                  </TextCustom>
                  <Pill tone="gold">
                    {productCount.get(s.categorySlug) ?? 0} {t("admin.sections.products")}
                  </Pill>
                </div>
                <TextCustom as="p" variant="caption" className="mt-1">
                  {s.subtitle} · {t("admin.sections.category")}:{" "}
                  {categories.find((c) => c.slug === s.categorySlug)?.name ?? s.categorySlug}
                </TextCustom>
              </div>
            ))}
          {ordered.filter((s) => s.visible).length === 0 && (
            <TextCustom variant="body-sm" color="!text-ink/50">
              {t("admin.sections.noneVisible")}
            </TextCustom>
          )}
        </div>
      </section>

      <section className="border border-line bg-white">
        <div className="border-b border-line px-6 py-5">
          <TextCustom variant="h4">{t("admin.sections.listTitle", { count: ordered.length })}</TextCustom>
        </div>
        <ul className="divide-y divide-line">
          {ordered.map((s, i) => (
            <li key={s.id} className="flex flex-wrap items-center gap-4 p-5">
              <div className="flex flex-col gap-1">
                <ButtonCustom
                  variant="raw"
                  aria-label={t("admin.sliders.moveUp")}
                  disabled={i === 0}
                  onClick={() => moveSection(s.id, -1)}
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
                  onClick={() => moveSection(s.id, 1)}
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
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                    {s.title}
                  </TextCustom>
                  <Pill tone={s.visible ? "green" : "neutral"}>
                    {s.visible ? t("admin.sections.visible") : t("admin.sections.hidden")}
                  </Pill>
                </div>
                <TextCustom as="p" variant="caption" className="mt-1">
                  {s.subtitle}
                </TextCustom>
                <TextCustom as="p" variant="caption" className="mt-1">
                  {t("admin.sections.category")}:{" "}
                  <strong className="!text-teal">
                    {categories.find((c) => c.slug === s.categorySlug)?.name ?? s.categorySlug}
                  </strong>{" "}
                  · {productCount.get(s.categorySlug) ?? 0} {t("admin.sections.products")}
                </TextCustom>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Toggle checked={s.visible} onChange={(v) => updateSection(s.id, { visible: v })} />
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
        {ordered.length === 0 && <EmptyState text={t("admin.sections.empty")} />}
      </section>

      {showForm && (
        <Modal
          title={editing !== null ? t("admin.sections.editTitle") : t("admin.sections.createTitle")}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        >
          <div className="space-y-4">
            <Field label={t("admin.sections.fieldTitle")}>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t("admin.sections.titlePlaceholder")}
                className={inputCls}
              />
            </Field>
            <Field label={t("admin.sections.fieldSubtitle")}>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder={t("admin.sections.subtitlePlaceholder")}
                className={inputCls}
              />
            </Field>
            <Field label={t("admin.sections.fieldCategory")}>
              <select
                value={form.categorySlug}
                onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({productCount.get(c.slug) ?? 0})
                  </option>
                ))}
              </select>
            </Field>
            <Toggle
              checked={form.visible}
              onChange={(v) => setForm({ ...form, visible: v })}
              label={t("admin.sections.fieldVisible")}
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
                {editing !== null ? t("admin.save") : t("admin.sections.add")}
              </ButtonCustom>
            </div>
          </div>
        </Modal>
      )}

      {confirmId !== null && (
        <Modal title={t("admin.sections.deleteTitle")} onClose={() => setConfirmId(null)}>
          <TextCustom as="p" variant="body-sm" color="!text-ink/70">
            {t("admin.sections.deleteConfirm", {
              title: sections.find((s) => s.id === confirmId)?.title ?? "",
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
                deleteSection(confirmId);
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

export default AdminHomepageSectionsPage;
