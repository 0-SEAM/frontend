import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faGear, faListCheck, faSliders } from "@fortawesome/free-solid-svg-icons";

export function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="bg-app-bg md:border-app-line mx-auto flex min-h-dvh w-full max-w-120 flex-col md:my-6 md:min-h-[calc(100dvh-3rem)] md:max-w-180 md:rounded-[28px] md:border md:shadow-[0_24px_70px_rgba(23,32,42,0.12)]">
      <header className="border-app-line flex flex-col border-b bg-white/72 px-5 pt-[calc(1.375rem+env(safe-area-inset-top))] pb-3 backdrop-blur-xl md:rounded-t-[28px]">
        <span className="text-[17px] font-bold tracking-[0.02em]">{t("app.name")}</span>
        <span className="text-app-muted text-[13px]">{t("app.tagline")}</span>
      </header>

      <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <div className="animate-page-enter" key={location.pathname}>
          <Outlet />
        </div>
      </main>

      {/* REQ-NF-31. 핵심 이동은 한 손으로 닿는 화면 하단에 둔다. */}
      <nav className="border-app-line fixed bottom-0 z-10 grid w-full max-w-120 grid-cols-4 border-t bg-white/88 px-1 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(23,32,42,0.06)] backdrop-blur-xl md:max-w-180 md:rounded-b-[28px]">
        <NavLink
          className="text-app-muted hover:bg-app-accent-soft hover:text-app-accent [&.active]:bg-app-accent-soft [&.active]:text-app-accent flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-xs transition-colors duration-150 [&.active]:font-semibold"
          to="/timeline"
        >
          <FontAwesomeIcon className="text-sm" icon={faListCheck} aria-hidden="true" />
          {t("nav.timeline")}
        </NavLink>
        <NavLink
          className="text-app-muted hover:bg-app-accent-soft hover:text-app-accent [&.active]:bg-app-accent-soft [&.active]:text-app-accent flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-xs transition-colors duration-150 [&.active]:font-semibold"
          to="/offline"
        >
          <FontAwesomeIcon className="text-sm" icon={faBookOpen} aria-hidden="true" />
          {t("nav.offline")}
        </NavLink>
        <NavLink
          className="text-app-muted hover:bg-app-accent-soft hover:text-app-accent [&.active]:bg-app-accent-soft [&.active]:text-app-accent flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-xs transition-colors duration-150 [&.active]:font-semibold"
          to="/conditions"
        >
          <FontAwesomeIcon className="text-sm" icon={faSliders} aria-hidden="true" />
          {t("nav.conditions")}
        </NavLink>
        <NavLink
          className="text-app-muted hover:bg-app-accent-soft hover:text-app-accent [&.active]:bg-app-accent-soft [&.active]:text-app-accent flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-xs transition-colors duration-150 [&.active]:font-semibold"
          to="/settings"
        >
          <FontAwesomeIcon className="text-sm" icon={faGear} aria-hidden="true" />
          {t("nav.settings")}
        </NavLink>
      </nav>
    </div>
  );
}
