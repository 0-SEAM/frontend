import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { ConditionsPage } from "../pages/ConditionsPage";
import { ExperienceModerationPage } from "../pages/ExperienceModerationPage";
import { GuideSyncPage } from "../pages/GuideSyncPage";
import { OfflineGuidePage } from "../pages/OfflineGuidePage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { SettingsPage } from "../pages/SettingsPage";
import { TimelinePage } from "../pages/TimelinePage";
import {
  AlertFailurePage,
  AlertRequestPage,
  AlertResultPage,
  BankOfficialPage,
  BankRecommendationsPage,
  BankSharePage,
  BranchExperiencePage,
  ExpiryWarningPage,
  LandingPage,
  LoginPage,
  OfficialGuidePage,
  PrivacyWarningPage,
  SaveFailurePage,
  SignupPage,
  SimGuidePage,
  SimOfficialPage,
  SubmissionCompletePage,
} from "../pages/FlowPages";

/**
 * FN-4124. 비로그인·오프라인에서도 접근 가능한 구간(/offline)과
 * 개인화 구간(/timeline, /conditions)을 라우트 수준에서 분리해 둔다.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "save-failure", element: <SaveFailurePage /> },
      { path: "timeline", element: <TimelinePage /> },
      { path: "expiry-warning", element: <ExpiryWarningPage /> },
      { path: "official-guide", element: <OfficialGuidePage /> },
      { path: "alert-request", element: <AlertRequestPage /> },
      { path: "alert-result", element: <AlertResultPage /> },
      { path: "alert-failure", element: <AlertFailurePage /> },
      { path: "sim-guide", element: <SimGuidePage /> },
      { path: "sim-official", element: <SimOfficialPage /> },
      { path: "banks", element: <BankRecommendationsPage /> },
      { path: "branch-experience", element: <BranchExperiencePage /> },
      { path: "bank-official", element: <BankOfficialPage /> },
      { path: "bank-share", element: <BankSharePage /> },
      { path: "privacy-warning", element: <PrivacyWarningPage /> },
      { path: "submission-complete", element: <SubmissionCompletePage /> },
      { path: "offline", element: <OfflineGuidePage /> },
      { path: "guides", element: <GuideSyncPage /> },
      { path: "conditions", element: <ConditionsPage /> },
      { path: "experiences/moderation", element: <ExperienceModerationPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
