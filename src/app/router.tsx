import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { AdminRoute, ProtectedRoute } from "../components/ProtectedRoute";
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
      { path: "signup", element: <SignupPage /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "banks",
        element: (
          <ProtectedRoute>
            <BankRecommendationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "branch-experience",
        element: (
          <ProtectedRoute>
            <BranchExperiencePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "bank-official",
        element: (
          <ProtectedRoute>
            <BankOfficialPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "bank-share",
        element: (
          <ProtectedRoute>
            <BankSharePage />
          </ProtectedRoute>
        ),
      },
      { path: "offline", element: <OfflineGuidePage /> },
      { path: "guides", element: <GuideSyncPage /> },
      {
        path: "onboarding",
        element: (
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "save-failure",
        element: (
          <ProtectedRoute>
            <SaveFailurePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "timeline",
        element: (
          <ProtectedRoute>
            <TimelinePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "expiry-warning",
        element: (
          <ProtectedRoute>
            <ExpiryWarningPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "official-guide",
        element: (
          <ProtectedRoute>
            <OfficialGuidePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "alert-request",
        element: (
          <ProtectedRoute>
            <AlertRequestPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "alert-result",
        element: (
          <ProtectedRoute>
            <AlertResultPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "alert-failure",
        element: (
          <ProtectedRoute>
            <AlertFailurePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "sim-guide",
        element: (
          <ProtectedRoute>
            <SimGuidePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "sim-official",
        element: (
          <ProtectedRoute>
            <SimOfficialPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "privacy-warning",
        element: (
          <ProtectedRoute>
            <PrivacyWarningPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "submission-complete",
        element: (
          <ProtectedRoute>
            <SubmissionCompletePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "conditions",
        element: (
          <ProtectedRoute>
            <ConditionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "experiences/moderation",
        element: (
          <AdminRoute>
            <ExperienceModerationPage />
          </AdminRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
