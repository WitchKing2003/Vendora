import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAdminStore, type UserRole } from "../../../stores/adminStore";

const inputCls =
  "w-full border border-line bg-paper-2/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:bg-white";

const ROLE_BADGE: Record<UserRole, string> = {
  admin: "bg-ink text-white",
  seller: "bg-gold/15 text-gold-deep",
  customer: "bg-teal-light/40 text-teal",
};

const AdminUsersPage = () => {
  const { t } = useTranslation();
  const { users, addUser, toggleUserStatus, setUserRole, deleteUser } = useAdminStore();

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | UserRole>("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, query, roleFilter]);

  const submit = () => {
    if (!name.trim() || !email.trim()) return;
    addUser(name.trim(), email.trim(), role);
    setName("");
    setEmail("");
    setRole("customer");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.usersTitle")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.usersCount", { count: filtered.length })}
          </TextCustom>
        </div>
        <ButtonCustom variant="primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? t("admin.closeForm") : `+ ${t("admin.addUser")}`}
        </ButtonCustom>
      </div>

      {/* Add form */}
      {showForm && (
        <section className="border border-gold/40 bg-gold/5 p-5">
          <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
            {t("admin.newUser")}
          </TextCustom>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("admin.fieldName")} className={inputCls} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              type="email"
              className={inputCls}
            />
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={inputCls}>
              <option value="customer">{t("admin.roleCustomer")}</option>
              <option value="seller">{t("admin.roleSeller")}</option>
              <option value="admin">{t("admin.roleAdmin")}</option>
            </select>
          </div>
          <div className="mt-4 flex gap-3">
            <ButtonCustom variant="primary" onClick={submit}>
              {t("admin.create")}
            </ButtonCustom>
            <ButtonCustom
              variant="raw"
              onClick={() => setShowForm(false)}
              className="border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink"
            >
              {t("admin.cancel")}
            </ButtonCustom>
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("admin.searchUsers")}
          className={`${inputCls} !w-64`}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "" | UserRole)}
          className={`${inputCls} !w-44`}
        >
          <option value="">{t("admin.allRoles")}</option>
          <option value="admin">{t("admin.roleAdmin")}</option>
          <option value="seller">{t("admin.roleSeller")}</option>
          <option value="customer">{t("admin.roleCustomer")}</option>
        </select>
      </div>

      {/* Table */}
      <section className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-2/60 text-xs uppercase tracking-wide text-ink/60">
              <th className="px-5 py-3.5 font-bold">{t("admin.colUser")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colRole")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colJoined")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colOrders")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colStatus")}</th>
              <th className="px-5 py-3.5 text-right font-bold">{t("admin.colActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-paper-2/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                        {u.name}
                      </TextCustom>
                      <TextCustom as="p" variant="caption" className="mt-0.5">
                        {u.email}
                      </TextCustom>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <select
                    value={u.role}
                    onChange={(e) => setUserRole(u.id, e.target.value as UserRole)}
                    className={`cursor-pointer border-0 px-2.5 py-1 text-xs font-bold outline-none ${ROLE_BADGE[u.role]}`}
                  >
                    <option value="admin" className="bg-white text-ink">
                      {t("admin.roleAdmin")}
                    </option>
                    <option value="seller" className="bg-white text-ink">
                      {t("admin.roleSeller")}
                    </option>
                    <option value="customer" className="bg-white text-ink">
                      {t("admin.roleCustomer")}
                    </option>
                  </select>
                </td>
                <td className="px-4 py-3.5">
                  <TextCustom as="p" variant="body-sm" className="text-ink/70">
                    {u.joined}
                  </TextCustom>
                </td>
                <td className="px-4 py-3.5">
                  <TextCustom as="p" variant="body-sm" className="text-ink/70">
                    {u.orders}
                  </TextCustom>
                </td>
                <td className="px-4 py-3.5">
                  <ButtonCustom
variant="raw"
                    type="button"
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-2.5 py-1 text-xs font-bold transition-opacity hover:opacity-80 ${
                      u.status === "active" ? "bg-teal-light/40 text-teal" : "bg-[#8B3A2B]/10 text-[#8B3A2B]"
                    }`}
                  >
                    {u.status === "active" ? t("admin.active") : t("admin.locked")}
                  </ButtonCustom>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    {u.role !== "admin" && (
                      <ButtonCustom
variant="raw"
                        type="button"
                        onClick={() => setConfirmId(u.id)}
                        className="border border-[#8B3A2B]/40 bg-[#8B3A2B]/5 px-2.5 py-1 text-xs font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
                      >
                        {t("admin.delete")}
                      </ButtonCustom>
                    )}
                  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <TextCustom as="p" variant="body" color="!text-ink/50">
              {t("admin.noResults")}
            </TextCustom>
          </div>
        )}
      </section>

      {/* Delete confirm modal */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setConfirmId(null)}>
          <section className="w-full max-w-sm border border-line bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <TextCustom variant="h4">{t("admin.deleteUserTitle")}</TextCustom>
            <TextCustom as="p" variant="body-sm" color="!text-ink/70" className="mt-2">
              {t("admin.deleteUserConfirm", {
                name: users.find((u) => u.id === confirmId)?.name ?? "",
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
variant="raw"
                type="button"
                onClick={() => {
                  deleteUser(confirmId);
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

export default AdminUsersPage;
