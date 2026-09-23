import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import {
  useAdminStore,
  type ApplicationStatus,
  type SellerApplication,
} from "../../../stores/adminStore";

const inputCls =
  "w-full border border-line bg-paper-2/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:bg-white";

const STATUS_BADGE: Record<ApplicationStatus, string> = {
  pending: "bg-gold/15 text-gold-deep",
  approved: "bg-teal-light/40 text-teal",
  rejected: "bg-[#8B3A2B]/10 text-[#8B3A2B]",
};

const TABS: ("all" | ApplicationStatus)[] = ["all", "pending", "approved", "rejected"];

const AdminSellerApplicationsPage = () => {
  const { t } = useTranslation();
  const { applications, categories, approveApplication, rejectApplication, deleteApplication } =
    useAdminStore();

  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [query, setQuery] = useState("");
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const pendingCount = applications.filter((a) => a.status === "pending").length;

  const catName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      if (tab !== "all" && a.status !== tab) return false;
      if (!q) return true;
      return (
        a.shopName.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    });
  }, [applications, tab, query]);

  const submitReject = () => {
    if (rejectId == null) return;
    rejectApplication(rejectId, rejectNote.trim() || undefined);
    setRejectId(null);
    setRejectNote("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TextCustom variant="h2">{t("admin.seller.title")}</TextCustom>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-1">
            {t("admin.seller.count", { count: filtered.length, pending: pendingCount })}
          </TextCustom>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((key) => {
          const n =
            key === "all"
              ? applications.length
              : applications.filter((a) => a.status === key).length;
          return (
            <ButtonCustom
              key={key}
              variant="raw"
              onClick={() => setTab(key)}
              className={`border px-4 py-2 text-xs font-bold transition-colors ${
                tab === key
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink/70 hover:border-gold hover:text-gold-deep"
              }`}
            >
              {t(`admin.seller.tab.${key}`)}
              <span className={tab === key ? "ml-1.5 text-gold" : "ml-1.5 text-ink/40"}>{n}</span>
            </ButtonCustom>
          );
        })}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("admin.seller.search")}
          className={`${inputCls} !w-64`}
        />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            catName={catName(app.category)}
            rejecting={rejectId === app.id}
            confirmDelete={confirmDeleteId === app.id}
            rejectNote={rejectNote}
            onRejectNote={setRejectNote}
            onApprove={() => approveApplication(app.id)}
            onStartReject={() => {
              setRejectId(app.id);
              setRejectNote("");
            }}
            onCancelReject={() => setRejectId(null)}
            onSubmitReject={submitReject}
            onStartDelete={() => setConfirmDeleteId(app.id)}
            onCancelDelete={() => setConfirmDeleteId(null)}
            onConfirmDelete={() => {
              deleteApplication(app.id);
              setConfirmDeleteId(null);
            }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="border border-dashed border-line bg-white p-10 text-center">
          <TextCustom variant="body" color="!text-ink/50">
            {t("admin.noResults")}
          </TextCustom>
        </div>
      )}
    </div>
  );
};

interface CardProps {
  app: SellerApplication;
  catName: string;
  rejecting: boolean;
  confirmDelete: boolean;
  rejectNote: string;
  onRejectNote: (v: string) => void;
  onApprove: () => void;
  onStartReject: () => void;
  onCancelReject: () => void;
  onSubmitReject: () => void;
  onStartDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

const ApplicationCard = ({
  app,
  catName,
  rejecting,
  confirmDelete,
  rejectNote,
  onRejectNote,
  onApprove,
  onStartReject,
  onCancelReject,
  onSubmitReject,
  onStartDelete,
  onCancelDelete,
  onConfirmDelete,
}: CardProps) => {
  const { t } = useTranslation();
  const initials = app.shopName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="border border-line bg-white p-5 transition-colors hover:border-gold/50">
      <div className="flex flex-wrap items-start gap-4">
        {/* Avatar */}
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold-deep">
          {initials}
        </span>

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <TextCustom as="h3" variant="body" className="font-bold text-ink">
              {app.shopName}
            </TextCustom>
            <span
              className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STATUS_BADGE[app.status]}`}
            >
              {t(`admin.seller.status.${app.status}`)}
            </span>
          </div>
          <TextCustom as="p" variant="body-sm" color="!text-ink/60" className="mt-0.5">
            {app.owner} · {app.email} · {app.phone}
          </TextCustom>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <TextCustom as="span" variant="caption" color="!text-ink/70">
              {t("admin.seller.category", { name: catName })}
            </TextCustom>
            <TextCustom as="span" variant="caption" color="!text-ink/70">
              {t("admin.seller.productCount", { count: app.productCount })}
            </TextCustom>
            <TextCustom as="span" variant="caption" color="!text-ink/50">
              {t("admin.seller.submittedAt", { date: app.submittedAt })}
            </TextCustom>
          </div>

          <TextCustom as="p" variant="body-sm" color="!text-ink/70" className="mt-2.5 leading-relaxed">
            {app.description}
          </TextCustom>

          {app.status === "rejected" && app.note && (
            <p className="mt-2 border-l-2 border-[#8B3A2B]/50 bg-[#8B3A2B]/5 px-3 py-2 text-sm italic text-[#8B3A2B]">
              {t("admin.seller.rejectReason", { note: app.note })}
            </p>
          )}

          {rejecting && (
            <div className="mt-3 border border-[#8B3A2B]/30 bg-[#8B3A2B]/5 p-3">
              <TextCustom as="p" variant="label" className="mb-2">
                {t("admin.seller.rejectNoteLabel")}
              </TextCustom>
              <textarea
                value={rejectNote}
                onChange={(e) => onRejectNote(e.target.value)}
                rows={2}
                placeholder={t("admin.seller.rejectNotePlaceholder")}
                className={`${inputCls} resize-none`}
              />
              <div className="mt-2 flex gap-2">
                <ButtonCustom variant="raw" onClick={onSubmitReject} className="bg-[#8B3A2B] px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90">
                  {t("admin.seller.confirmReject")}
                </ButtonCustom>
                <ButtonCustom
                  variant="raw"
                  onClick={onCancelReject}
                  className="border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-ink"
                >
                  {t("admin.cancel")}
                </ButtonCustom>
              </div>
            </div>
          )}

          {confirmDelete && (
            <div className="mt-3 border border-[#8B3A2B]/30 bg-[#8B3A2B]/5 p-3">
              <TextCustom as="p" variant="body-sm" className="font-bold text-ink">
                {t("admin.seller.deleteConfirm", { shop: app.shopName })}
              </TextCustom>
              <div className="mt-2 flex gap-2">
                <ButtonCustom variant="raw" onClick={onConfirmDelete} className="bg-[#8B3A2B] px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90">
                  {t("admin.deleteConfirm")}
                </ButtonCustom>
                <ButtonCustom
                  variant="raw"
                  onClick={onCancelDelete}
                  className="border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-ink"
                >
                  {t("admin.cancel")}
                </ButtonCustom>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!rejecting && !confirmDelete && (
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {app.status === "pending" && (
              <>
                <ButtonCustom variant="primary" onClick={onApprove} className="!px-4 !py-2 !text-xs">
                  ✓ {t("admin.seller.approve")}
                </ButtonCustom>
                <ButtonCustom
                  variant="raw"
                  onClick={onStartReject}
                  className="border border-line bg-white px-4 py-2 text-xs font-bold text-ink transition-colors hover:border-[#8B3A2B] hover:text-[#8B3A2B]"
                >
                  {t("admin.seller.reject")}
                </ButtonCustom>
              </>
            )}
            <ButtonCustom
              variant="raw"
              onClick={onStartDelete}
              className="border border-[#8B3A2B]/30 bg-white px-4 py-2 text-xs font-bold text-[#8B3A2B] transition-colors hover:bg-[#8B3A2B]/10"
            >
              {t("admin.delete")}
            </ButtonCustom>
          </div>
        )}
      </div>
    </article>
  );
};

export default AdminSellerApplicationsPage;
