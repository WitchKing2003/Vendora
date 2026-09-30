import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import Dialog, { ConfirmDialog } from "../../../components/ui/Dialog";
import { useAdminStore, type AdminCategory } from "../../../stores/adminStore";
import { Field, inputCls } from "./AdminUi";

type EditTarget = { kind: "category"; slug: string } | { kind: "sub"; catSlug: string; subSlug: string } | null;

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
    toggleCategory,
  } = useAdminStore();

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditTarget>(null);
  const [editName, setEditName] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [subTarget, setSubTarget] = useState<string | null>(null);
  const [subName, setSubName] = useState("");
  const [subNameEn, setSubNameEn] = useState("");
  const [subError, setSubError] = useState<string | null>(null);
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
    setFormError(null);
    setShowForm(false);
  };

  const openEdit = (target: NonNullable<EditTarget>) => {
    setEditing(target);
    setEditError(null);
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
    if (!editing || !editName.trim()) {
      setEditError(t("admin.dialog.errCategoryName"));
      return;
    }
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
          <ButtonCustom variant="primary" onClick={() => setShowForm(true)}>
            + {t("admin.addCategory")}
          </ButtonCustom>
        </div>
      </div>

      {/* Category list */}
      <div className="space-y-4">
        {filtered.map((cat) => (
          <section key={cat.slug} className="rounded-lg border border-line bg-white">
            {/* Category row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-paper-2/50 px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                    {cat.name} <span className="font-normal text-ink/40">· {cat.slug}</span>
                  </TextCustom>
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                      cat.enabled ? "bg-teal-light/40 text-teal" : "bg-paper-2 text-ink/50"
                    }`}
                  >
                    {cat.enabled ? t("admin.active") : t("admin.categoryDisabled")}
                  </span>
                </div>
                <TextCustom as="p" variant="caption" className="mt-0.5">
                  {cat.nameEn} · {t("admin.subCount", { count: cat.subs.length })} · {t("admin.productCount", { count: productCount(cat) })}
                </TextCustom>
              </div>
              <div className="ml-auto flex gap-2">
                <ButtonCustom
variant="raw"
                  type="button"
                  onClick={() => toggleCategory(cat.slug)}
                  className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-bold text-ink transition-colors hover:border-gold hover:text-gold-deep"
                >
                  {cat.enabled ? t("admin.disable") : t("admin.enable")}
                </ButtonCustom>
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
                  onClick={() => setConfirmSlug(cat.slug)}
                  className="border border-[#8B3A2B]/40 bg-[#8B3A2B]/5 px-2.5 py-1 text-xs font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
                >
                  {t("admin.delete")}
                </ButtonCustom>
              </div>
            </div>

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
                  onClick={() => {
                    setSubTarget(cat.slug);
                    setSubName("");
                    setSubNameEn("");
                    setSubError(null);
                  }}
                  className="border border-dashed border-line px-3 py-1.5 text-xs font-bold text-ink/60 transition-colors hover:border-gold hover:text-gold-deep"
                >
                  + {t("admin.addSub")}
                </ButtonCustom>
              </div>
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

      {/* Create dialog */}
      {showForm && (
        <Dialog
          title={t("admin.newCategory")}
          onClose={resetForm}
          actions={[
            { label: t("admin.cancel"), onClick: resetForm, cancel: true },
            {
              label: t("admin.create"),
              onClick: () => {
                if (!name.trim()) {
                  setFormError(t("admin.dialog.errCategoryName"));
                  return;
                }
                addCategory(name.trim(), nameEn.trim() || name.trim());
                resetForm();
              },
            },
          ]}
        >
          <div className="space-y-4">
            <Field label={t("admin.nameVi")}>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormError(null);
                }}
                placeholder={t("admin.nameVi")}
                className={inputCls}
                autoFocus
              />
              {formError && <p className="mt-1.5 text-xs font-semibold text-[#8B3A2B]">{formError}</p>}
            </Field>
            <Field label={t("admin.nameEn")}>
              <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={t("admin.nameEn")} className={inputCls} />
            </Field>
          </div>
        </Dialog>
      )}

      {/* Edit dialog (category or sub) */}
      {editing && (
        <Dialog
          title={t("admin.editTitle")}
          onClose={() => setEditing(null)}
          actions={[
            { label: t("admin.cancel"), onClick: () => setEditing(null), cancel: true },
            { label: t("admin.save"), onClick: submitEdit },
          ]}
        >
          <div className="space-y-4">
            <Field label={t("admin.nameVi")}>
              <input
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setEditError(null);
                }}
                className={inputCls}
                autoFocus
              />
              {editError && <p className="mt-1.5 text-xs font-semibold text-[#8B3A2B]">{editError}</p>}
            </Field>
            <Field label={t("admin.nameEn")}>
              <input value={editNameEn} onChange={(e) => setEditNameEn(e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Dialog>
      )}

      {/* Add sub dialog */}
      {subTarget && (
        <Dialog
          title={t("admin.addSub")}
          onClose={() => setSubTarget(null)}
          actions={[
            { label: t("admin.cancel"), onClick: () => setSubTarget(null), cancel: true },
            {
              label: t("admin.create"),
              onClick: () => {
                if (!subName.trim()) {
                  setSubError(t("admin.dialog.errCategoryName"));
                  return;
                }
                addSub(subTarget, subName.trim(), subNameEn.trim() || subName.trim());
                setSubTarget(null);
              },
            },
          ]}
        >
          <div className="space-y-4">
            <Field label={t("admin.nameVi")}>
              <input
                value={subName}
                onChange={(e) => {
                  setSubName(e.target.value);
                  setSubError(null);
                }}
                placeholder={t("admin.nameVi")}
                className={inputCls}
                autoFocus
              />
              {subError && <p className="mt-1.5 text-xs font-semibold text-[#8B3A2B]">{subError}</p>}
            </Field>
            <Field label={t("admin.nameEn")}>
              <input value={subNameEn} onChange={(e) => setSubNameEn(e.target.value)} placeholder={t("admin.nameEn")} className={inputCls} />
            </Field>
          </div>
        </Dialog>
      )}

      {/* Delete category confirm */}
      <ConfirmDialog
        open={confirmSlug !== null}
        title={t("admin.deleteCategoryTitle")}
        message={t("admin.deleteCategoryConfirm", {
          count: confirmSlug ? products.filter((p) => p.category === confirmSlug).length : 0,
        })}
        confirmLabel={t("admin.deleteConfirm")}
        cancelLabel={t("admin.cancel")}
        onCancel={() => setConfirmSlug(null)}
        onConfirm={() => {
          if (confirmSlug) deleteCategory(confirmSlug);
          setConfirmSlug(null);
        }}
      />
    </div>
  );
};

export default AdminCategoriesPage;
