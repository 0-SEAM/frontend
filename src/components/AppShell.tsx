import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faGear, faListCheck, faRightFromBracket, faSliders } from "@fortawesome/free-solid-svg-icons";
import { getConditions, logout as logoutRequest } from "../services/seamApi";
import type { UserConditions } from "../domain/types";
import { useAuthStore } from "../store/authStore";
import { useConditionsStore } from "../store/conditionsStore";
import { useTaskProgressStore } from "../store/taskProgressStore";

export function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const name = useAuthStore((state) => state.name);
  const email = useAuthStore((state) => state.email);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const hydrateSaved = useConditionsStore((state) => state.hydrateSaved);
  const clearConditions = useConditionsStore((state) => state.clearAll);
  const clearProgress = useTaskProgressStore((state) => state.clearAll);

  useEffect(() => {
    if (!isAuthenticated) return;
    void getConditions()
      .then((condition) => {
        if (!condition) return;
        hydrateSaved({
          stayStatus: condition.visaStatus as UserConditions["stayStatus"],
          visaType: condition.visaType,
          entryDate: condition.entryDate,
          registrationAppliedDate: condition.registrationAppliedDate,
          residenceCardExpiryDate: condition.arcExpiryDate,
          residenceSigungu: condition.residenceLocation,
          workplaceSigungu: condition.workplaceLocation,
          savedAt: condition.updatedAt ?? new Date().toISOString(),
        });
      })
      .catch(() => undefined);
  }, [hydrateSaved, isAuthenticated]);

  const handleLogout = async () => {
    await logoutRequest();
    clearConditions();
    clearProgress();
    navigate("/login");
  };

  return (
    <div className="app-frame">
      <header className="app-header">
        <span className="app-header-title">{t("app.name")}</span>
        {isAuthenticated && (
          <div className="app-header-user">
            <span className="app-header-avatar" aria-hidden="true">
              {(name ?? email ?? "?").slice(0, 1).toUpperCase()}
            </span>
            <span className="app-header-user-name" title={name ?? email ?? undefined}>
              {name ?? email}
            </span>
            <button
              type="button"
              className="app-header-logout"
              onClick={() => void handleLogout()}
              aria-label={t("auth.logout")}
            >
              <FontAwesomeIcon icon={faRightFromBracket} aria-hidden="true" />
            </button>
          </div>
        )}
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
