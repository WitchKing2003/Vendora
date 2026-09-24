import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import {
  useAdminStore,
  COLOR_SWATCHES,
  SELLERS,
  slugify,
  type AdminProduct,
} from "../../../stores/adminStore";

const PAGE_SIZE = 10;

const inputCls =
  "w-full border border-line bg-paper-2/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:bg-white";

interface FormState {
  name: string;
  price: string;
  oldPrice: string;
  category: string;
  subSlug: string;
  seller: string;
  colorHex: string;
  inStock: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  price: "",
  oldPrice: "",
  category: "",
  subSlug: "",
  seller: SELLERS[0],
  colorHex: COLOR_SWATCHES[0].hex,
  inStock: true,
};

const AdminProductsPage = () => {
  const { t } = useTranslation();
  const { categories, products, addProduct, updateProduct, deleteProduct, toggleProductStock } =
    useAdminStore();

  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (catFilter && p.category !== catFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      );
    });
  }, [products, query, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, category: categories[0]?.slug ?? "", subSlug: categories[0]?.subs[0]?.slug ?? "" });
    setShowForm(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      category: p.category,
      subSlug: p.subSlug,
      seller: p.seller,
      colorHex: p.colorHex,
      inStock: p.inStock,
    });
    setShowForm(true);
  };

  const submit = () => {
    const price = Number(form.price.replace(/\D/g, ""));
    if (!form.name.trim() || !price) return;
    const payload = {
      name: form.name.trim(),
      price,
      oldPrice: form.oldPrice ? Number(form.oldPrice.replace(/\D/g, "")) || undefined : undefined,
      category: form.category,
      subSlug: form.subSlug || slugify(form.category),
      seller: form.seller,
      colorHex: form.colorHex,
      inStock: form.inStock,
    };
    if (editId) updateProduct(editId, payload);
    else addProduct(payload);
    setShowForm(false);
  };

  const resetFilters = () => {
    setQuery("");
    setCatFilter("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.productsTitle")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.productsCount", { count: filtered.length })}
          </TextCustom>
        </div>
        <ButtonCustom variant="primary" onClick={openAdd}>
          + {t("admin.addProduct")}
        </ButtonCustom>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={t("admin.searchProducts")}
          className={`${inputCls} !w-64`}
        />
        <select
          value={catFilter}
          onChange={(e) => {
            setCatFilter(e.target.value);
            setPage(1);
          }}
          className={`${inputCls} !w-52`}
        >
          <option value="">{t("admin.allCategories")}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {(query || catFilter) && (
          <ButtonCustom
variant="raw"
            type="button"
            onClick={resetFilters}
            className="text-sm font-bold text-gold-deep underline decoration-gold/50 underline-offset-4 transition-colors hover:text-ink"
          >
            {t("admin.clearFilters")}
          </ButtonCustom>
        )}
      </div>

      {/* Table */}
      <section className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-2/60 text-xs uppercase tracking-wide text-ink/60">
              <th className="px-5 py-3.5 font-bold">{t("admin.colProduct")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colCategory")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colSeller")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colPrice")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colStock")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colStatus")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colPublish")}</th>
              <th className="px-5 py-3.5 text-right font-bold">{t("admin.colActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-paper-2/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className="relative block h-11 w-11 shrink-0 overflow-hidden"
                      style={{ backgroundColor: p.colorHex }}
                    >
                      <span className="placeholder-diagonal absolute inset-1.5 opacity-40" />
                    </span>
                    <div className="min-w-0">
                      <TextCustom as="p" variant="body-sm" className="max-w-[260px] truncate font-bold text-ink">
                        {p.name}
                      </TextCustom>
                      <TextCustom as="p" variant="caption" className="mt-0.5">
                        {p.id}
                      </TextCustom>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <TextCustom as="p" variant="body-sm" className="text-ink/80">
                    {categories.find((c) => c.slug === p.category)?.name ?? p.category}
                  </TextCustom>
                  <TextCustom as="p" variant="caption" className="mt-0.5">
                    {p.subSlug}
                  </TextCustom>
                </td>
                <td className="px-4 py-3.5">
                  <TextCustom as="p" variant="body-sm" className="text-ink/80">
                    {p.seller}
                  </TextCustom>
                </td>
                <td className="px-4 py-3.5">
                  <TextCustom variant="price-sm">{p.price.toLocaleString("vi-VN").replace(/,/g, ".")}đ</TextCustom>
                  {p.oldPrice && (
                    <TextCustom as="p" variant="price-old-sm" className="mt-0.5">
                      {p.oldPrice.toLocaleString("vi-VN").replace(/,/g, ".")}đ
                    </TextCustom>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <TextCustom as="span" variant="body-sm" className={`font-bold ${p.stock <= 10 ? "text-[#8B3A2B]" : "text-ink/70"}`}>
                    {p.stock}
                  </TextCustom>
                  {p.stock <= 10 && (
                    <TextCustom as="p" variant="caption" className="mt-0.5 !text-[#8B3A2B]">
                      {t("admin.lowStock")}
                    </TextCustom>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <ButtonCustom
variant="raw"
                    type="button"
                    onClick={() => toggleProductStock(p.id)}
                    className={`px-2.5 py-1 text-xs font-bold transition-opacity hover:opacity-80 ${
                      p.inStock ? "bg-teal-light/40 text-teal" : "bg-[#8B3A2B]/10 text-[#8B3A2B]"
                    }`}
                  >
                    {p.inStock ? t("admin.inStock") : t("admin.outOfStock")}
                  </ButtonCustom>
                </td>
                <td className="px-4 py-3.5">
                  <select
                    value={p.status}
                    onChange={(e) => updateProduct(p.id, { status: e.target.value as AdminProduct["status"] })}
                    className={`cursor-pointer border-0 px-2.5 py-1 text-xs font-bold outline-none ${
                      p.status === "active"
                        ? "bg-teal-light/40 text-teal"
                        : p.status === "draft"
                          ? "bg-gold/15 text-gold-deep"
                          : "bg-paper-2 text-ink/60"
                    }`}
                  >
                    <option value="active" className="bg-white text-ink">
                      {t("admin.publish.active")}
                    </option>
                    <option value="draft" className="bg-white text-ink">
                      {t("admin.publish.draft")}
                    </option>
                    <option value="hidden" className="bg-white text-ink">
                      {t("admin.publish.hidden")}
                    </option>
                  </select>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <ButtonCustom
variant="raw"
                      type="button"
                      onClick={() => openEdit(p)}
                      className="border border-gold-deep/40 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-deep transition-colors hover:bg-gold/20"
                    >
                      {t("admin.edit")}
                    </ButtonCustom>
                    <ButtonCustom
variant="raw"
                      type="button"
                      onClick={() => setConfirmId(p.id)}
                      className="border border-[#8B3A2B]/40 bg-[#8B3A2B]/5 px-2.5 py-1 text-xs font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
                    >
                      {t("admin.delete")}
                    </ButtonCustom>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="p-10 text-center">
            <TextCustom as="p" variant="body" color="!text-ink/50">
              {t("admin.noResults")}
            </TextCustom>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <ButtonCustom
            variant="raw"
            aria-label={t("admin.prevPage")}
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-9 w-9 items-center justify-center border border-line bg-white text-ink transition-colors hover:border-ink disabled:opacity-40"
          >
            ‹
          </ButtonCustom>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <ButtonCustom
              key={n}
              variant="raw"
              onClick={() => setPage(n)}
              className={`h-9 w-9 text-sm font-bold transition-colors ${
                n === safePage ? "bg-ink text-white" : "border border-line bg-white text-ink hover:border-ink"
              }`}
            >
              {n}
            </ButtonCustom>
          ))}
          <ButtonCustom
            variant="raw"
            aria-label={t("admin.nextPage")}
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-9 w-9 items-center justify-center border border-line bg-white text-ink transition-colors hover:border-ink disabled:opacity-40"
          >
            ›
          </ButtonCustom>
        </div>
      )}

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setShowForm(false)}>
          <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-line bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <TextCustom variant="h4">{editId ? t("admin.editProduct") : t("admin.newProduct")}</TextCustom>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <TextCustom as="span" variant="label" className="mb-1.5 block">
                  {t("admin.fieldName")}
                </TextCustom>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </label>
              <label className="block">
                <TextCustom as="span" variant="label" className="mb-1.5 block">
                  {t("admin.fieldPrice")}
                </TextCustom>
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="420000"
                  inputMode="numeric"
                  className={inputCls}
                />
              </label>
              <label className="block">
                <TextCustom as="span" variant="label" className="mb-1.5 block">
                  {t("admin.fieldOldPrice")}
                </TextCustom>
                <input
                  value={form.oldPrice}
                  onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                  placeholder={t("admin.fieldOldPriceHint")}
                  inputMode="numeric"
                  className={inputCls}
                />
              </label>
              <label className="block">
                <TextCustom as="span" variant="label" className="mb-1.5 block">
                  {t("admin.fieldCategory")}
                </TextCustom>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, subSlug: "" })}
                  className={inputCls}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <TextCustom as="span" variant="label" className="mb-1.5 block">
                  {t("admin.fieldSub")}
                </TextCustom>
                <select
                  value={form.subSlug}
                  onChange={(e) => setForm({ ...form, subSlug: e.target.value })}
                  className={inputCls}
                >
                  <option value="">{t("admin.fieldSubNone")}</option>
                  {categories
                    .find((c) => c.slug === form.category)
                    ?.subs.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="block">
                <TextCustom as="span" variant="label" className="mb-1.5 block">
                  {t("admin.fieldSeller")}
                </TextCustom>
                <select value={form.seller} onChange={(e) => setForm({ ...form, seller: e.target.value })} className={inputCls}>
                  {SELLERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <TextCustom as="span" variant="label" className="mb-1.5 block">
                  {t("admin.fieldColor")}
                </TextCustom>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map((s) => (
                    <ButtonCustom
                      key={s.hex}
                      variant="raw"
                      type="button"
                      aria-label={s.key}
                      onClick={() => setForm({ ...form, colorHex: s.hex })}
                      className={`h-7 w-7 rounded-full border-2 transition-transform ${
                        form.colorHex === s.hex ? "scale-110 border-gold-deep" : "border-line"
                      }`}
                      style={{ backgroundColor: s.hex }}
                    />
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2.5 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="h-4 w-4 accent-gold-deep"
                />
                <TextCustom as="span" variant="body-sm" className="font-medium">
                  {t("admin.fieldInStock")}
                </TextCustom>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <ButtonCustom
                variant="raw"
                onClick={() => setShowForm(false)}
                className="border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink"
              >
                {t("admin.cancel")}
              </ButtonCustom>
              <ButtonCustom variant="primary" onClick={submit}>
                {editId ? t("admin.save") : t("admin.create")}
              </ButtonCustom>
            </div>
          </section>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setConfirmId(null)}>
          <section className="w-full max-w-sm border border-line bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <TextCustom variant="h4">{t("admin.deleteProductTitle")}</TextCustom>
            <TextCustom as="p" variant="body-sm" color="!text-ink/70" className="mt-2">
              {t("admin.deleteProductConfirm", { name: products.find((p) => p.id === confirmId)?.name ?? "" })}
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
variant="raw"
                type="button"
                onClick={() => {
                  deleteProduct(confirmId);
                  setConfirmId(null);
                }}
                className="bg-[#8B3A2B] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                {t("admin.deleteConfirm")}
              </ButtonCustom>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
