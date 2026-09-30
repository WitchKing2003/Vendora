import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import Dialog, { ConfirmDialog } from "../../../components/ui/Dialog";
import Pagination from "../Listing/Pagination";
import {
  useAdminStore,
  type AdminRole,
  type AdminUser,
  type CustomerBadge,
} from "../../../stores/adminStore";
import { useOrderStore } from "../../../stores/orderStore";
import { EmptyState, Field, Pill, inputCls, vnd } from "./AdminUi";

const PAGE_SIZE = 8;

const BADGES: CustomerBadge[] = ["vip", "loyal", "new", "inactive"];

const BADGE_TONE: Record<CustomerBadge, "gold" | "teal" | "neutral" | "red"> = {
  vip: "gold",
  loyal: "teal",
  new: "neutral",
  inactive: "red",
};

const ROLE_TONE: Record<string, "ink" | "gold" | "teal" | "neutral"> = {
  admin: "ink",
  seller: "gold",
  customer: "teal",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const errText = "mt-1.5 text-xs font-semibold text-[#8B3A2B]";

/* ------------------------------------------------------------------ */
/* User create/update dialog — the only place name/email/role/badge    */
/* are edited. The table itself stays read-only.                       */
/* ------------------------------------------------------------------ */
const UserDialog = ({
  user,
  roles,
  onClose,
  onSubmit,
}: {
  user: AdminUser | null;
  roles: AdminRole[];
  onClose: () => void;
  onSubmit: (values: { name: string; email: string; role: string; badge: CustomerBadge }) => void;
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState(user?.role ?? "customer");
  const [badge, setBadge] = useState<CustomerBadge>(user?.badge ?? "new");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const submit = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = t("admin.dialog.errName");
    if (!email.trim()) next.email = t("admin.dialog.errEmail");
    else if (!EMAIL_RE.test(email.trim())) next.email = t("admin.dialog.errEmail");
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({ name: name.trim(), email: email.trim(), role, badge });
  };

  return (
    <Dialog
      title={user ? t("admin.dialog.userEditTitle") : t("admin.dialog.userCreateTitle")}
      onClose={onClose}
      actions={[
        { label: t("admin.cancel"), onClick: onClose, cancel: true },
        {
          label: user ? t("admin.save") : t("admin.create"),
          onClick: submit,
        },
      ]}
    >
      <div className="space-y-4">
        <Field label={t("admin.fieldName")}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("admin.fieldName")}
            className={inputCls}
            autoFocus
          />
          {errors.name && <p className={errText}>{errors.name}</p>}
        </Field>
        <Field label={t("admin.dialog.fieldEmail")}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            type="email"
            className={inputCls}
          />
          {errors.email && <p className={errText}>{errors.email}</p>}
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("admin.colRole")}>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputCls}>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("admin.colBadge")}>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value as CustomerBadge)}
              className={inputCls}
            >
              {BADGES.map((b) => (
                <option key={b} value={b}>
                  {t(`admin.badge.${b}`)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    </Dialog>
  );
};

/* ------------------------------------------------------------------ */
/* Role create/update dialog                                           */
/* ------------------------------------------------------------------ */
const RoleDialog = ({
  role,
  onClose,
  onSubmit,
}: {
  role: AdminRole | null;
  onClose: () => void;
  onSubmit: (values: { name: string; description: string }) => void;
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const lockName = role?.system ?? false;

  const submit = () => {
    if (!name.trim()) {
      setError(t("admin.dialog.errRoleName"));
      return;
    }
    onSubmit({ name: name.trim().toLowerCase(), description: description.trim() });
  };

  return (
    <Dialog
      title={role ? t("admin.dialog.roleEditTitle") : t("admin.dialog.roleCreateTitle")}
      onClose={onClose}
      actions={[
        { label: t("admin.cancel"), onClick: onClose, cancel: true },
        { label: role ? t("admin.save") : t("admin.create"), onClick: submit },
      ]}
    >
      <div className="space-y-4">
        <Field label={t("admin.colRole")}>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            disabled={lockName}
            placeholder="moderator"
            className={`${inputCls} disabled:cursor-not-allowed disabled:opacity-60`}
          />
          {lockName && (
            <p className="mt-1.5 text-xs text-ink/50">{t("admin.dialog.roleNameLocked")}</p>
          )}
          {error && <p className={errText}>{error}</p>}
        </Field>
        <Field label={t("admin.dialog.fieldDesc")}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder={t("admin.dialog.roleDescPlaceholder")}
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>
    </Dialog>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const AdminUsersPage = () => {
  const { t } = useTranslation();
  const {
    users,
    roles,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
  } = useAdminStore();
  const orders = useOrderStore((s) => s.history);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [badgeFilter, setBadgeFilter] = useState<"" | CustomerBadge>("");
  const [page, setPage] = useState(1);

  const [editor, setEditor] = useState<{ mode: "create" } | { mode: "edit"; user: AdminUser } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [statusTarget, setStatusTarget] = useState<{ user: AdminUser; lock: boolean } | null>(null);
  const [historyId, setHistoryId] = useState<number | null>(null);

  const [rolesOpen, setRolesOpen] = useState(false);
  const [roleEditor, setRoleEditor] = useState<{ mode: "create" } | { mode: "edit"; role: AdminRole } | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);

  const historyUser = users.find((u) => u.id === historyId) ?? null;

  const purchases = useMemo(() => {
    if (!historyUser) return [];
    return orders.filter((o) => o.address.name === historyUser.name);
  }, [orders, historyUser]);

  const roleUsers = (roleName: string) => users.filter((u) => u.role === roleName).length;

  const roleLabel = (roleName: string) => {
    const known: Record<string, string> = {
      admin: t("admin.roleAdmin"),
      seller: t("admin.roleSeller"),
      customer: t("admin.roleCustomer"),
    };
    return known[roleName] ?? roleName.charAt(0).toUpperCase() + roleName.slice(1);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (badgeFilter && u.badge !== badgeFilter) return false;
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, query, roleFilter, badgeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const rows = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.usersTitle")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.usersCount", { count: filtered.length })}
          </TextCustom>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonCustom variant="outline" onClick={() => setRolesOpen(true)}>
            {t("admin.dialog.manageRoles")}
          </ButtonCustom>
          <ButtonCustom variant="primary" onClick={() => setEditor({ mode: "create" })}>
            + {t("admin.addUser")}
          </ButtonCustom>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 [&>*]:animate-fade-up">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={t("admin.searchUsers")}
          className={`${inputCls} h-10 !w-64 py-0`}
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className={`${inputCls} h-10 !w-44 py-0`}
        >
          <option value="">{t("admin.allRoles")}</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {roleLabel(r.name)}
            </option>
          ))}
        </select>
        <select
          value={badgeFilter}
          onChange={(e) => {
            setBadgeFilter(e.target.value as "" | CustomerBadge);
            setPage(1);
          }}
          className={`${inputCls} h-10 !w-44 py-0`}
        >
          <option value="">{t("admin.allBadges")}</option>
          {BADGES.map((b) => (
            <option key={b} value={b}>
              {t(`admin.badge.${b}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Table — read-only: every edit happens in a dialog */}
      <section className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-2/60 text-xs uppercase tracking-wide text-ink/60">
              <th className="px-5 py-3.5 font-bold">{t("admin.colUser")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colBadge")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colRole")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colSpent")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colOrders")}</th>
              <th className="px-4 py-3.5 font-bold">{t("admin.colStatus")}</th>
              <th className="px-5 py-3.5 text-right font-bold">{t("admin.colActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-paper-2/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                    <TextCustom as="p" variant="body-sm" className="min-w-0 truncate font-bold text-ink">
                      {u.name}
                    </TextCustom>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <Pill tone={BADGE_TONE[u.badge]}>{t(`admin.badge.${u.badge}`)}</Pill>
                </td>
                <td className="px-4 py-3.5">
                  <Pill tone={ROLE_TONE[u.role] ?? "neutral"}>{roleLabel(u.role)}</Pill>
                </td>
                <td className="px-4 py-3.5">
                  <TextCustom as="span" variant="body-sm" className="font-bold text-gold-deep">
                    {u.spent > 0 ? vnd(u.spent) : "—"}
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
                    onClick={() => setStatusTarget({ user: u, lock: u.status === "active" })}
                    className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-80 ${
                      u.status === "active" ? "bg-teal-light/40 text-teal" : "bg-[#8B3A2B]/10 text-[#8B3A2B]"
                    }`}
                  >
                    {u.status === "active" ? t("admin.active") : t("admin.locked")}
                  </ButtonCustom>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <ButtonCustom
                      variant="raw"
                      type="button"
                      onClick={() => setHistoryId(u.id)}
                      className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-bold text-ink transition-colors hover:border-gold hover:text-gold-deep"
                    >
                      {t("admin.history")}
                    </ButtonCustom>
                    <ButtonCustom
                      variant="raw"
                      type="button"
                      onClick={() => setEditor({ mode: "edit", user: u })}
                      className="rounded-lg border border-gold-deep/40 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-deep transition-colors hover:bg-gold/20"
                    >
                      {t("admin.dialog.update")}
                    </ButtonCustom>
                    {u.role !== "admin" && (
                      <ButtonCustom
                        variant="raw"
                        type="button"
                        onClick={() => setDeleteId(u.id)}
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

        {filtered.length === 0 && <EmptyState text={t("admin.noResults")} />}
      </section>

      <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />

      {/* User create/update dialog */}
      {editor && (
        <UserDialog
          key={editor.mode === "edit" ? `edit-${editor.user.id}` : "create"}
          user={editor.mode === "edit" ? editor.user : null}
          roles={roles}
          onClose={() => setEditor(null)}
          onSubmit={(values) => {
            if (editor.mode === "edit") {
              updateUser(editor.user.id, values);
            } else {
              addUser(values.name, values.email, "customer");
              const created = useAdminStore.getState().users[0];
              if (created && created.email === values.email) {
                updateUser(created.id, { role: values.role, badge: values.badge });
              }
            }
            setEditor(null);
          }}
        />
      )}

      {/* Delete user confirm */}
      <ConfirmDialog
        open={deleteId !== null}
        title={t("admin.deleteUserTitle")}
        message={t("admin.deleteUserConfirm", {
          name: users.find((u) => u.id === deleteId)?.name ?? "",
        })}
        confirmLabel={t("admin.deleteConfirm")}
        cancelLabel={t("admin.cancel")}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) deleteUser(deleteId);
          setDeleteId(null);
        }}
      />

      {/* Lock/unlock confirm */}
      <ConfirmDialog
        open={statusTarget !== null}
        title={statusTarget?.lock ? t("admin.dialog.lockTitle") : t("admin.dialog.unlockTitle")}
        message={
          statusTarget?.lock
            ? t("admin.dialog.lockConfirm", { name: statusTarget.user.name })
            : t("admin.dialog.unlockConfirm", { name: statusTarget?.user.name ?? "" })
        }
        confirmLabel={statusTarget?.lock ? t("admin.dialog.lock") : t("admin.dialog.unlock")}
        cancelLabel={t("admin.cancel")}
        onCancel={() => setStatusTarget(null)}
        onConfirm={() => {
          if (statusTarget) toggleUserStatus(statusTarget.user.id);
          setStatusTarget(null);
        }}
      />

      {/* Purchase history dialog */}
      {historyUser && (
        <Dialog
          size="lg"
          title={t("admin.purchaseHistoryFor", { name: historyUser.name })}
          onClose={() => setHistoryId(null)}
          actions={[{ label: t("admin.close"), onClick: () => setHistoryId(null), cancel: true }]}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-line bg-paper-2/40 p-3">
              <TextCustom as="p" variant="caption" className="font-bold uppercase">
                {t("admin.colOrders")}
              </TextCustom>
              <TextCustom as="p" className="mt-1 font-serif text-xl text-ink">
                {historyUser.orders}
              </TextCustom>
            </div>
            <div className="rounded-lg border border-line bg-paper-2/40 p-3">
              <TextCustom as="p" variant="caption" className="font-bold uppercase">
                {t("admin.lifetimeValue")}
              </TextCustom>
              <TextCustom as="p" className="mt-1 font-serif text-xl text-gold-deep">
                {vnd(historyUser.spent)}
              </TextCustom>
            </div>
            <div className="rounded-lg border border-line bg-paper-2/40 p-3">
              <TextCustom as="p" variant="caption" className="font-bold uppercase">
                {t("admin.lastPurchase")}
              </TextCustom>
              <TextCustom as="p" className="mt-1 font-serif text-xl text-ink">
                {historyUser.lastPurchase}
              </TextCustom>
            </div>
            <div className="rounded-lg border border-line bg-paper-2/40 p-3">
              <TextCustom as="p" variant="caption" className="font-bold uppercase">
                {t("admin.colBadge")}
              </TextCustom>
              <div className="mt-2">
                <Pill tone={BADGE_TONE[historyUser.badge]}>{t(`admin.badge.${historyUser.badge}`)}</Pill>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper-2/60 text-xs uppercase tracking-wide text-ink/60">
                  <th className="px-4 py-3 font-bold">{t("admin.orderCode")}</th>
                  <th className="px-4 py-3 font-bold">{t("admin.orderDate")}</th>
                  <th className="px-4 py-3 font-bold">{t("admin.colStatus")}</th>
                  <th className="px-4 py-3 text-right font-bold">{t("admin.orderTotal")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {purchases.map((o) => (
                  <tr key={o.code}>
                    <td className="px-4 py-3">
                      <TextCustom as="span" variant="body-sm" className="font-bold text-ink">
                        {o.code}
                      </TextCustom>
                    </td>
                    <td className="px-4 py-3">
                      <TextCustom as="span" variant="body-sm" className="text-ink/70">
                        {o.placedDate}
                      </TextCustom>
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={o.status === "canceled" ? "red" : o.status === "delivered" ? "green" : "amber"}>
                        {t(`tracking.status.${o.status}`)}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <TextCustom as="span" variant="body-sm" className="font-bold text-gold-deep">
                        {vnd(o.total)}
                      </TextCustom>
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center">
                      <TextCustom as="span" variant="body-sm" color="!text-ink/50">
                        {t("admin.noPurchases")}
                      </TextCustom>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Dialog>
      )}

      {/* Roles overview dialog */}
      {rolesOpen && !roleEditor && (
        <Dialog
          title={t("admin.dialog.rolesTitle")}
          onClose={() => setRolesOpen(false)}
          actions={[
            { label: t("admin.close"), onClick: () => setRolesOpen(false), cancel: true },
            { label: `+ ${t("admin.dialog.addRole")}`, onClick: () => setRoleEditor({ mode: "create" }) },
          ]}
        >
          <p className="mb-4 text-xs text-ink/50">{t("admin.dialog.rolesHint")}</p>
          <ul className="divide-y divide-line rounded-lg border border-line">
            {roles.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                      {roleLabel(r.name)}
                    </TextCustom>
                    <span className="text-xs text-ink/40">{r.name}</span>
                    {r.system && <Pill tone="neutral">{t("admin.dialog.roleSystem")}</Pill>}
                  </div>
                  <TextCustom as="p" variant="caption" className="mt-0.5 truncate">
                    {r.description || "—"} · {t("admin.dialog.roleUsers", { count: roleUsers(r.name) })}
                  </TextCustom>
                </div>
                <div className="flex gap-2">
                  <ButtonCustom
                    variant="raw"
                    type="button"
                    onClick={() => setRoleEditor({ mode: "edit", role: r })}
                    className="rounded-lg border border-gold-deep/40 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-deep transition-colors hover:bg-gold/20"
                  >
                    {t("admin.edit")}
                  </ButtonCustom>
                  {!r.system && (
                    <ButtonCustom
                      variant="raw"
                      type="button"
                      onClick={() => setDeleteRoleId(r.id)}
                      className="border border-[#8B3A2B]/40 bg-[#8B3A2B]/5 px-2.5 py-1 text-xs font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
                    >
                      {t("admin.delete")}
                    </ButtonCustom>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Dialog>
      )}

      {/* Role create/edit dialog (replaces the list while open) */}
      {roleEditor && (
        <RoleDialog
          key={roleEditor.mode === "edit" ? `role-${roleEditor.role.id}` : "role-create"}
          role={roleEditor.mode === "edit" ? roleEditor.role : null}
          onClose={() => setRoleEditor(null)}
          onSubmit={(values) => {
            if (roleEditor.mode === "edit") {
              updateRole(roleEditor.role.id, values);
            } else {
              addRole(values.name, values.description);
            }
            setRoleEditor(null);
          }}
        />
      )}

      {/* Delete role confirm */}
      <ConfirmDialog
        open={deleteRoleId !== null}
        title={t("admin.dialog.deleteRoleTitle")}
        message={t("admin.dialog.deleteRoleConfirm", {
          name: roles.find((r) => r.id === deleteRoleId)?.name ?? "",
        })}
        confirmLabel={t("admin.deleteConfirm")}
        cancelLabel={t("admin.cancel")}
        onCancel={() => setDeleteRoleId(null)}
        onConfirm={() => {
          if (deleteRoleId !== null) deleteRole(deleteRoleId);
          setDeleteRoleId(null);
        }}
      />
    </div>
  );
};

export default AdminUsersPage;
