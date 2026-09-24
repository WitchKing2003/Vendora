import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAdminStore } from "../../../stores/adminStore";

interface NavItem {
  to: string;
  labelKey: string;
  icon: string;
  end?: boolean;
  badge?: "applications" | "notifications";
}

const NAV: NavItem[] = [
  {
    to: "/admin",
    labelKey: "admin.nav.dashboard",
    icon: "M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8V3h-8zM3 21h8v-6H3v6z",
    end: true,
  },
  {
    to: "/admin/products",
    labelKey: "admin.nav.products",
    icon: "M20 7l-8-4-8 4v10l8 4 8-4V7zM4 7l8 4 8-4M12 21V11",
  },
  {
    to: "/admin/categories",
    labelKey: "admin.nav.categories",
    icon: "M4 6h16M4 12h16M4 18h10",
  },
  {
    to: "/admin/users",
    labelKey: "admin.nav.users",
    icon: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  {
    to: "/admin/notifications",
    labelKey: "admin.nav.notifications",
    icon: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
    badge: "notifications",
  },
  {
    to: "/admin/sliders",
    labelKey: "admin.nav.sliders",
    icon: "M4 5h16v14H4zM9 12l3 3 5-6",
  },
  {
    to: "/admin/sections",
    labelKey: "admin.nav.sections",
    icon: "M4 4h16v6H4zM4 14h16v6H4z",
  },
  {
    to: "/admin/analytics",
    labelKey: "admin.nav.analytics",
    icon: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  },
  {
    to: "/admin/applications",
    labelKey: "admin.nav.applications",
    icon: "M9 12l2 2 4-4M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z",
    badge: "applications",
  },
  {
    to: "/admin/settings",
    labelKey: "admin.nav.settings",
    icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.09A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.09A1.65 1.65 0 0 0 21 10h.09a2 2 0 1 1 0 4H21a1.65 1.65 0 0 0-1.6 1z",
  },
];

const AdminLayout = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pendingCount = useAdminStore(
    (s) => s.applications.filter((a) => a.status === "pending").length
  );
  const draftNotifications = useAdminStore(
    (s) => s.notifications.filter((n) => n.status !== "sent").length
  );
  const badgeCount = (kind: NavItem["badge"]) =>
    kind === "applications" ? pendingCount : kind === "notifications" ? draftNotifications : 0;

  return (
    <div className="min-h-screen bg-paper-2/60">
      {/* Top bar */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <ButtonCustom
            variant="raw"
            aria-label={t("admin.menu")}
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center border border-line text-ink lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </ButtonCustom>
          <TextCustom variant="h3" className="!text-xl sm:!text-2xl">
            Vendora <span className="text-gold">Admin</span>
          </TextCustom>
          <span className="ml-auto flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
              A
            </span>
            <TextCustom as="span" variant="body-sm" className="hidden font-semibold sm:block">
              {t("admin.administrator")}
            </TextCustom>
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside
            className={`${mobileOpen ? "block" : "hidden"} h-fit border border-line bg-white p-3 lg:sticky lg:top-6 lg:block`}
          >
            <nav className="space-y-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 text-sm transition-colors ${
                      isActive
                        ? "bg-ink font-bold text-white"
                        : "font-medium text-ink/80 hover:bg-paper-2 hover:text-gold-deep"
                    }`
                  }
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5 shrink-0">
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t(item.labelKey)}
                  {item.badge && badgeCount(item.badge) > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-ink">
                      {badgeCount(item.badge)}
                      <span className="sr-only">{t("admin.pendingBadge")}</span>
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
