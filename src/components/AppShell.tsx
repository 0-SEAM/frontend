import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="bg-app-bg mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">
      <header className="border-app-line flex flex-col border-b bg-white/72 px-5 pt-[22px] pb-3">
        <span className="text-[17px] font-bold tracking-[0.02em]">{t("app.name")}</span>
        <span className="text-app-muted text-[13px]">{t("app.tagline")}</span>
      </header>

      <main className="flex-1 pb-[88px]">
        <div className="animate-page-enter" key={location.pathname}>
          <Outlet />
        </div>
      </main>

      {/* REQ-NF-31. 핵심 이동은 한 손으로 닿는 화면 하단에 둔다. */}
      <nav className="border-app-line fixed bottom-0 z-10 grid w-full max-w-[480px] grid-cols-4 border-t bg-white/[.94] shadow-[0_-8px_24px_rgba(23,32,42,0.06)]">
        <NavLink
          className="text-app-muted hover:bg-app-accent-soft hover:text-app-accent [&.active]:bg-app-accent-soft [&.active]:text-app-accent min-h-12 px-1 py-3.5 text-center text-[13px] transition-colors duration-150 [&.active]:font-semibold"
          to="/timeline"
        >
          {t("nav.timeline")}
        </NavLink>
        <NavLink
          className="text-app-muted hover:bg-app-accent-soft hover:text-app-accent [&.active]:bg-app-accent-soft [&.active]:text-app-accent min-h-12 px-1 py-3.5 text-center text-[13px] transition-colors duration-150 [&.active]:font-semibold"
          to="/offline"
        >
          {t("nav.offline")}
        </NavLink>
        <NavLink
          className="text-app-muted hover:bg-app-accent-soft hover:text-app-accent [&.active]:bg-app-accent-soft [&.active]:text-app-accent min-h-12 px-1 py-3.5 text-center text-[13px] transition-colors duration-150 [&.active]:font-semibold"
          to="/conditions"
        >
          {t("nav.conditions")}
        </NavLink>
        <NavLink
          className="text-app-muted hover:bg-app-accent-soft hover:text-app-accent [&.active]:bg-app-accent-soft [&.active]:text-app-accent min-h-12 px-1 py-3.5 text-center text-[13px] transition-colors duration-150 [&.active]:font-semibold"
          to="/settings"
        >
          {t("nav.settings")}
        </NavLink>
      </nav>
    </div>
  );
}
