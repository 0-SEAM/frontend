import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { ConditionsPage } from "../pages/ConditionsPage";
import { OfflineGuidePage } from "../pages/OfflineGuidePage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { SettingsPage } from "../pages/SettingsPage";
import { TimelinePage } from "../pages/TimelinePage";

/**
 * FN-4124. 비로그인·오프라인에서도 접근 가능한 구간(/offline)과
 * 개인화 구간(/timeline, /conditions)을 라우트 수준에서 분리해 둔다.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/timeline" replace /> },
      { path: "onboarding", element: <OnboardingPage /> },
      { path: "timeline", element: <TimelinePage /> },
      { path: "offline", element: <OfflineGuidePage /> },
      { path: "conditions", element: <ConditionsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
