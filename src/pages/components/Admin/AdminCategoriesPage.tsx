import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAdminStore, type AdminCategory } from "../../../stores/adminStore";

type EditTarget = { kind: "category"; slug: string } | { kind: "sub"; catSlug: string; subSlug: string } | null;

const inputCls =
  "w-full border border-line bg-paper-2/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:bg-white";

const AdminCategoriesPage = () => {
  const { t } = useTranslation();
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    addSub,
    updateSub,
    deleteSub,
  } = useAdminStore();

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [editing, setEditing] = useState<EditTarget>(null);
  const [editName, setEditName] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [subTarget, setSubTarget] = useState<string | null>(null);
  const [subName, setSubName] = useState("");
  const [subNameEn, setSubNameEn] = useState("");
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.slug.includes(q) ||
        c.subs.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [categories, query]);

  const productCount = (cat: AdminCategory) =>
    products.filter((p) => p.category === cat.slug).length;

  const resetForm = () => {
    setName("");
    setNameEn("");
    setShowForm(false);
  };

  const openEdit = (target: NonNullable<EditTarget>) => {
    setEditing(target);
    if (target.kind === "category") {
      const c = categories.find((x) => x.slug === target.slug);
      setEditName(c?.name ?? "");
      setEditNameEn(c?.nameEn ?? "");
    } else {
      const c = categories.find((x) => x.slug === target.catSlug);
      const s = c?.subs.find((x) => x.slug === target.subSlug);
      setEditName(s?.name ?? "");
      setEditNameEn(s?.nameEn ?? "");
    }
  };

  const submitEdit = () => {
    if (!editing || !editName.trim()) return;
    if (editing.kind === "category") {
      updateCategory(editing.slug, { name: editName.trim(), nameEn: editNameEn.trim() || editName.trim() });
    } else {
      updateSub(editing.catSlug, editing.subSlug, {
        name: editName.trim(),
        nameEn: editNameEn.trim() || editName.trim(),
      });
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.categoriesTitle")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.categoriesCount", { count: categories.length })}
          </TextCustom>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("admin.searchCategories")}
            className={`${inputCls} !w-56`}
          />
          <ButtonCustom variant="primary" onClick={() => setShowForm((s) => !s)}>
            {showForm ? t("admin.closeForm") : `+ ${t("admin.addCategory")}`}
          </ButtonCustom>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <section className="border border-gold/40 bg-gold/5 p-5">
          <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
            {t("admin.newCategory")}
          </TextCustom>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("admin.nameVi")} className={inputCls} />
            <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={t("admin.nameEn")} className={inputCls} />
          </div>
          <div className="mt-4 flex gap-3">
            <ButtonCustom
              variant="primary"
              onClick={() => {
                if (!name.trim()) return;
                addCategory(name.trim(), nameEn.trim() || name.trim());
                resetForm();
              }}
            >
              {t("admin.create")}
            </ButtonCustom>
            <ButtonCustom
              variant="raw"
              onClick={resetForm}
              className="border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink"
            >
              {t("admin.cancel")}
            </ButtonCustom>
          </div>
        </section>
      )}

      {/* Category list */}
      <div className="space-y-4">
        {filtered.map((cat) => (
          <section key={cat.slug} className="border border-line bg-white">
            {/* Category row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-paper-2/50 px-5 py-4">
              <div className="min-w-0">
                <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                  {cat.name} <span className="font-normal text-ink/40">· {cat.slug}</span>
                </TextCustom>
                <TextCustom as="p" variant="caption" className="mt-0.5">
                  {cat.nameEn} · {t("admin.subCount", { count: cat.subs.length })} · {t("admin.productCount", { count: productCount(cat) })}
                </TextCustom>
              </div>
              <div className="ml-auto flex gap-2">
                <ButtonCustom
variant="raw"
                  type="button"
                  onClick={() => openEdit({ kind: "category", slug: cat.slug })}
                  className="border border-gold-deep/40 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-deep transition-colors hover:bg-gold/20"
                >
                  {t("admin.edit")}
                </ButtonCustom>
                <ButtonCustom
variant="raw"
                  type="button"
                  onClick={() => setConfirmSlug(confirmSlug === cat.slug ? null : cat.slug)}
                  className="border border-[#8B3A2B]/40 bg-[#8B3A2B]/5 px-2.5 py-1 text-xs font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
                >
                  {t("admin.delete")}
                </ButtonCustom>
              </div>
            </div>

            {/* Delete confirm inline */}
            {confirmSlug === cat.slug && (
              <div className="flex flex-wrap items-center gap-3 border-b border-line bg-[#8B3A2B]/5 px-5 py-3">
                <TextCustom as="p" variant="body-sm" className="text-[#8B3A2B]">
                  {t("admin.deleteCategoryConfirm", { count: productCount(cat) })}
                </TextCustom>
                <div className="ml-auto flex gap-2">
                  <ButtonCustom
variant="raw"
                    type="button"
                    onClick={() => {
                      deleteCategory(cat.slug);
                      setConfirmSlug(null);
                    }}
                    className="bg-[#8B3A2B] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:opacity-90"
                  >
                    {t("admin.deleteConfirm")}
                  </ButtonCustom>
                  <ButtonCustom
variant="raw"
                    type="button"
                    onClick={() => setConfirmSlug(null)}
                    className="border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-ink"
                  >
                    {t("admin.cancel")}
                  </ButtonCustom>
                </div>
              </div>
            )}

            {/* Subs */}
            <div className="px-5 py-4">
              <div className="flex flex-wrap gap-2">
                {cat.subs.map((sub) => (
                  <span
                    key={sub.slug}
                    className="group flex items-center gap-2 border border-line bg-paper-2/60 px-3 py-1.5 text-xs font-medium text-ink"
                  >
                    {sub.name}
                    <span className="text-ink/40">({sub.slug})</span>
                    <ButtonCustom
variant="raw"
                      type="button"
                      onClick={() => openEdit({ kind: "sub", catSlug: cat.slug, subSlug: sub.slug })}
                      className="text-gold-deep underline decoration-gold/50 underline-offset-2 transition-colors hover:text-ink"
                    >
                      {t("admin.edit")}
                    </ButtonCustom>
                    <ButtonCustom
variant="raw"
                      type="button"
                      onClick={() => deleteSub(cat.slug, sub.slug)}
                      className="text-[#8B3A2B] underline decoration-[#8B3A2B]/40 underline-offset-2 transition-colors hover:opacity-70"
                    >
                      {t("admin.delete")}
                    </ButtonCustom>
                  </span>
                ))}
                <ButtonCustom
variant="raw"
                  type="button"
                  onClick={() => setSubTarget(subTarget === cat.slug ? null : cat.slug)}
                  className="border border-dashed border-line px-3 py-1.5 text-xs font-bold text-ink/60 transition-colors hover:border-gold hover:text-gold-deep"
                >
                  + {t("admin.addSub")}
                </ButtonCustom>
              </div>

              {subTarget === cat.slug && (
                <div className="mt-3 flex flex-wrap items-center gap-3 border border-dashed border-gold/50 bg-gold/5 p-3">
                  <input value={subName} onChange={(e) => setSubName(e.target.value)} placeholder={t("admin.nameVi")} className={`${inputCls} !w-44`} />
                  <input value={subNameEn} onChange={(e) => setSubNameEn(e.target.value)} placeholder={t("admin.nameEn")} className={`${inputCls} !w-44`} />
                  <ButtonCustom
variant="raw"
                    type="button"
                    onClick={() => {
                      if (!subName.trim()) return;
                      addSub(cat.slug, subName.trim(), subNameEn.trim() || subName.trim());
                      setSubName("");
                      setSubNameEn("");
                      setSubTarget(null);
                    }}
                    className="bg-ink px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-teal"
                  >
                    {t("admin.create")}
                  </ButtonCustom>
                  <ButtonCustom
variant="raw"
                    type="button"
                    onClick={() => setSubTarget(null)}
                    className="border border-line bg-white px-3.5 py-2 text-xs font-bold text-ink transition-colors hover:border-ink"
                  >
                    {t("admin.cancel")}
                  </ButtonCustom>
                </div>
              )}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <div className="border border-dashed border-line bg-white p-10 text-center">
            <TextCustom as="p" variant="body" color="!text-ink/50">
              {t("admin.noResults")}
            </TextCustom>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setEditing(null)}>
          <section className="w-full max-w-md border border-line bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <TextCustom variant="h4">{t("admin.editTitle")}</TextCustom>
            <div className="mt-4 space-y-3">
              <label className="block">
                <TextCustom as="span" variant="label" className="mb-1.5 block">
                  {t("admin.nameVi")}
                </TextCustom>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className={inputCls} />
              </label>
              <label className="block">
                <TextCustom as="span" variant="label" className="mb-1.5 block">
                  {t("admin.nameEn")}
                </TextCustom>
                <input value={editNameEn} onChange={(e) => setEditNameEn(e.target.value)} className={inputCls} />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <ButtonCustom
                variant="raw"
                onClick={() => setEditing(null)}
                className="border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink"
              >
                {t("admin.cancel")}
              </ButtonCustom>
              <ButtonCustom variant="primary" onClick={submitEdit}>
                {t("admin.save")}
              </ButtonCustom>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
