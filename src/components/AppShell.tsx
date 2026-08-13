import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AppShell() {
  const { t } = useTranslation();

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <span className="app-shell__brand">{t("app.name")}</span>
        <span className="app-shell__tagline">{t("app.tagline")}</span>
      </header>

      <main className="app-shell__main">
        <Outlet />
      </main>

      {/* REQ-NF-31. 핵심 이동은 한 손으로 닿는 화면 하단에 둔다. */}
      <nav className="app-shell__nav">
        <NavLink to="/timeline">{t("nav.timeline")}</NavLink>
        <NavLink to="/offline">{t("nav.offline")}</NavLink>
        <NavLink to="/conditions">{t("nav.conditions")}</NavLink>
        <NavLink to="/settings">{t("nav.settings")}</NavLink>
      </nav>
    </div>
  );
}
