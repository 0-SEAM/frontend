import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faGear, faListCheck, faSliders } from "@fortawesome/free-solid-svg-icons";

export function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="app-frame">
      <header className="app-header">
        <span className="app-header-title">{t("app.name")}</span>
      </header>

      <main className="app-content">
        <div className="animate-page-enter" key={location.pathname}>
          <Outlet />
        </div>
      </main>

      {/* REQ-NF-31. 핵심 이동은 한 손으로 닿는 화면 하단에 둔다. */}
      <nav className="bottom-nav">
        <NavLink className="bottom-nav-link" to="/timeline">
          <FontAwesomeIcon className="text-sm" icon={faListCheck} aria-hidden="true" />
          {t("nav.timeline")}
        </NavLink>
        <NavLink className="bottom-nav-link" to="/offline">
          <FontAwesomeIcon className="text-sm" icon={faBookOpen} aria-hidden="true" />
          {t("nav.offline")}
        </NavLink>
        <NavLink className="bottom-nav-link" to="/conditions">
          <FontAwesomeIcon className="text-sm" icon={faSliders} aria-hidden="true" />
          {t("nav.conditions")}
        </NavLink>
        <NavLink className="bottom-nav-link" to="/settings">
          <FontAwesomeIcon className="text-sm" icon={faGear} aria-hidden="true" />
          {t("nav.settings")}
        </NavLink>
      </nav>
    </div>
  );
}
