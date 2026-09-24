import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAdminStore, type AdminNotification, type NotificationTarget } from "../../../stores/adminStore";
import { EmptyState, Field, Modal, Pill, inputCls, vnd } from "./AdminUi";

const TARGETS: NotificationTarget[] = ["all", "vip", "frequent", "rare", "new"];

const TARGET_TONE: Record<NotificationTarget, "ink" | "gold" | "teal" | "red" | "neutral"> = {
  all: "ink",
  vip: "gold",
  frequent: "teal",
  rare: "red",
  new: "neutral",
};

const STATUS_TONE = { draft: "neutral", scheduled: "amber", sent: "green" } as const;

interface FormState {
  title: string;
  body: string;
  target: NotificationTarget;
  status: AdminNotification["status"];
}

const EMPTY: FormState = { title: "", body: "", target: "all", status: "draft" };

const AdminNotificationsPage = () => {
  const { t } = useTranslation();
  const { notifications, users, addNotification, updateNotification, deleteNotification } = useAdminStore();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [targetFilter, setTargetFilter] = useState<"" | NotificationTarget>("");

  const audience = useMemo(() => {
    const customers = users.filter((u) => u.role === "customer");
    return {
      all: users.length,
      vip: customers.filter((u) => u.badge === "vip").length,
      frequent: customers.filter((u) => u.orders >= 8 || u.badge === "loyal").length,
      rare: customers.filter((u) => u.badge === "inactive" || u.orders <= 3).length,
      new: customers.filter((u) => u.badge === "new").length,
    } as Record<NotificationTarget, number>;
  }, [users]);

  const filtered = useMemo(
    () => notifications.filter((n) => !targetFilter || n.target === targetFilter),
    [notifications, targetFilter]
  );

  const openCreate = () => {
    setForm(EMPTY);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (n: AdminNotification) => {
    setForm({ title: n.title, body: n.body, target: n.target, status: n.status });
    setEditing(n.id);
    setShowForm(true);
  };

  const submit = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    if (editing !== null) {
      updateNotification(editing, { ...form });
    } else {
      addNotification({ ...form, recipients: form.status === "sent" ? audience[form.target] : 0 });
    }
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.notifications.title")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.notifications.subtitle")}
          </TextCustom>
        </div>
        <ButtonCustom variant="primary" onClick={openCreate}>
          + {t("admin.notifications.create")}
        </ButtonCustom>
      </div>

      {/* Audience groups */}
      <section className="border border-line bg-white p-6">
        <TextCustom variant="h4">{t("admin.notifications.audience")}</TextCustom>
        <TextCustom as="p" variant="caption" className="mt-1">
          {t("admin.notifications.audienceDesc")}
        </TextCustom>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TARGETS.map((tg) => (
            <div key={tg} className="border border-line bg-paper-2/40 p-4">
              <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                {t(`admin.notifications.target.${tg}`)}
              </TextCustom>
              <TextCustom as="p" className="mt-1 font-serif text-2xl text-gold-deep">
                {audience[tg]}
              </TextCustom>
              <TextCustom as="p" variant="caption">
                {t("admin.notifications.people")}
              </TextCustom>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <TextCustom as="span" variant="caption" className="font-bold uppercase tracking-wide">
          {t("admin.notifications.filterTarget")}
        </TextCustom>
        <select
          value={targetFilter}
          onChange={(e) => setTargetFilter(e.target.value as "" | NotificationTarget)}
          className={`${inputCls} !w-56`}
        >
          <option value="">{t("admin.notifications.allTargets")}</option>
          {TARGETS.map((tg) => (
            <option key={tg} value={tg}>
              {t(`admin.notifications.target.${tg}`)}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <section key={n.id} className="border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <TextCustom variant="h4" className="!text-base">
                    {n.title}
                  </TextCustom>
                  <Pill tone={STATUS_TONE[n.status]}>{t(`admin.notifications.status.${n.status}`)}</Pill>
                  <Pill tone={TARGET_TONE[n.target]}>{t(`admin.notifications.target.${n.target}`)}</Pill>
                </div>
                <TextCustom as="p" variant="body-sm" color="!text-ink/70" className="mt-2">
                  {n.body}
                </TextCustom>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <TextCustom as="span" variant="caption">
                    {t("admin.notifications.recipients")}: <strong className="!text-ink">{n.recipients.toLocaleString("vi-VN")}</strong>
                  </TextCustom>
                  <TextCustom as="span" variant="caption">
                    {t("admin.notifications.createdAt")}: {n.createdAt}
                  </TextCustom>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {n.status !== "sent" && (
                  <ButtonCustom
                    variant="raw"
                    onClick={() => updateNotification(n.id, { status: "sent", recipients: audience[n.target] })}
                    className="border border-teal-light bg-teal-light/20 px-3 py-1.5 text-xs font-bold text-teal transition-colors hover:bg-teal-light/40"
                  >
                    {t("admin.notifications.sendNow")}
                  </ButtonCustom>
                )}
                <ButtonCustom
                  variant="raw"
                  onClick={() => openEdit(n)}
                  className="border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-ink"
                >
                  {t("admin.edit")}
                </ButtonCustom>
                <ButtonCustom
                  variant="raw"
                  onClick={() => setConfirmId(n.id)}
                  className="border border-[#8B3A2B]/40 bg-[#8B3A2B]/5 px-3 py-1.5 text-xs font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
                >
                  {t("admin.delete")}
                </ButtonCustom>
              </div>
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <section className="border border-line bg-white">
            <EmptyState text={t("admin.notifications.empty")} />
          </section>
        )}
      </div>

      {/* Create / edit modal */}
      {showForm && (
        <Modal
          title={editing !== null ? t("admin.notifications.editTitle") : t("admin.notifications.createTitle")}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          wide
        >
          <div className="space-y-4">
            <Field label={t("admin.notifications.fieldTitle")}>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t("admin.notifications.titlePlaceholder")}
                className={inputCls}
              />
            </Field>
            <Field label={t("admin.notifications.fieldBody")}>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={4}
                maxLength={500}
                placeholder={t("admin.notifications.bodyPlaceholder")}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("admin.notifications.fieldTarget")}>
                <select
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value as NotificationTarget })}
                  className={inputCls}
                >
                  {TARGETS.map((tg) => (
                    <option key={tg} value={tg}>
                      {t(`admin.notifications.target.${tg}`)} ({audience[tg]})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("admin.notifications.fieldStatus")}>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as AdminNotification["status"] })}
                  className={inputCls}
                >
                  <option value="draft">{t("admin.notifications.status.draft")}</option>
                  <option value="scheduled">{t("admin.notifications.status.scheduled")}</option>
                  <option value="sent">{t("admin.notifications.status.sent")}</option>
                </select>
              </Field>
            </div>
            <TextCustom as="p" variant="caption">
              {t("admin.notifications.reachHint", { count: audience[form.target], amount: vnd(audience[form.target]) })}
            </TextCustom>
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
              <ButtonCustom variant="primary" onClick={submit} disabled={!form.title.trim() || !form.body.trim()}>
                {editing !== null ? t("admin.save") : t("admin.notifications.create")}
              </ButtonCustom>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {confirmId !== null && (
        <Modal title={t("admin.notifications.deleteTitle")} onClose={() => setConfirmId(null)}>
          <TextCustom as="p" variant="body-sm" color="!text-ink/70">
            {t("admin.notifications.deleteConfirm", {
              title: notifications.find((n) => n.id === confirmId)?.title ?? "",
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
                deleteNotification(confirmId);
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

export default AdminNotificationsPage;
