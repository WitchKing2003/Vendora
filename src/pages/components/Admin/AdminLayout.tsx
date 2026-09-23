import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../components/TextComponent/TextCustom";
import { useAdminStore } from "../../../stores/adminStore";

const NAV = [
  {
    to: "/admin/categories",
    labelKey: "admin.nav.categories",
    icon: "M4 6h16M4 12h16M4 18h10",
  },
  {
    to: "/admin/products",
    labelKey: "admin.nav.products",
    icon: "M20 7l-8-4-8 4v10l8 4 8-4V7zM4 7l8 4 8-4M12 21V11",
  },
  {
    to: "/admin/users",
    labelKey: "admin.nav.users",
    icon: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  {
    to: "/admin/applications",
    labelKey: "admin.nav.applications",
    icon: "M9 12l2 2 4-4M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z",
  },
];

const AdminLayout = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pendingCount = useAdminStore(
    (s) => s.applications.filter((a) => a.status === "pending").length
  );

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
                  {item.labelKey === "admin.nav.applications" && pendingCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-ink">
                      {pendingCount}
                      <span className="sr-only">{t("admin.seller.pendingBadge")}</span>
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
