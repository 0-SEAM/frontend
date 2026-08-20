import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KakaoMap } from "../components/KakaoMap";
import { BANK_BRANCHES } from "../domain/branches";
import {
  getApprovedExperiences,
  login,
  signup,
  submitFieldExperience,
  type ApiFieldExperience,
} from "../services/seamApi";
import { useAuthStore } from "../store/authStore";
import { useConditionsStore } from "../store/conditionsStore";
import { useTaskProgressStore } from "../store/taskProgressStore";

function Page({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <section className="page-content">
      <Link className="text-app-muted mb-6 inline-block text-sm" to="/timeline">
        {t("flow.back")}
      </Link>
      <h1 className="page-title">{title}</h1>
      {children}
    </section>
  );
}

function TextField({
  label,
  type = "text",
  value,
  onChange,
  required,
  readOnly,
  min,
}: {
  label: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  readOnly?: boolean;
  min?: string;
}) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <input
        className="field-control"
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
        readOnly={readOnly}
        min={min}
      />
    </label>
  );
}

function FormButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button className="primary-action mt-6 w-full" type="submit" disabled={disabled}>
      {children}
    </button>
  );
}

export function LandingPage() {
  const { t } = useTranslation();
  return (
    <section className="page-content text-center">
      <div className="surface-card mb-8 py-12">
        <strong className="text-3xl">0:SEAM</strong>
        <p className="page-lede mb-0">{t("flow.landingTagline")}</p>
      </div>
      <h1 className="page-title">{t("flow.landingTitle")}</h1>
      <p className="page-lede">{t("flow.landingDescription")}</p>
      <div className="mt-8 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
        <Link className="secondary-action no-underline" to="/signup">
          English
        </Link>
        <Link className="secondary-action no-underline" to="/signup">
          中文
        </Link>
        <Link className="secondary-action no-underline" to="/signup">
          Tiếng Việt
        </Link>
        <Link className="secondary-action no-underline" to="/signup">
          日本語
        </Link>
      </div>
      <Link className="primary-action mt-8 w-full no-underline" to="/signup">
        {t("flow.signUp")}
      </Link>
      <Link className="text-app-text mt-4 inline-block underline" to="/login">
        {t("flow.existingAccount")}
      </Link>
    </section>
  );
}

export function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const clearConditions = useConditionsStore((state) => state.clearAll);
  const clearProgress = useTaskProgressStore((state) => state.clearAll);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const session = await signup({ name, email, password });
      clearConditions();
      clearProgress();
      setSession(session);
      navigate("/onboarding");
    } catch {
      setError(t("auth.signupFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Page title={t("flow.signupTitle")}>
      <form onSubmit={submit}>
        <h2 className="section-title">{t("flow.createAccount")}</h2>
        <p className="page-lede">{t("flow.signupIntro")}</p>
        <TextField label={t("flow.name")} value={name} onChange={setName} required />
        <TextField label={t("flow.email")} type="email" value={email} onChange={setEmail} required />
        <TextField label={t("flow.password")} type="password" value={password} onChange={setPassword} required />
        <TextField
          label={t("flow.confirmPassword")}
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
        />
        <p className="page-note">{t("flow.passwordRule")}</p>
        <FormButton disabled={isSubmitting}>{t("flow.signupAction")}</FormButton>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      </form>
      <Link className="text-app-text mt-4 inline-block underline" to="/login">
        {t("flow.accountExists")}
      </Link>
      <div className="surface-card mt-8">
        <h2 className="card-title">{t("flow.privacyCollection")}</h2>
        <p className="page-note">{t("flow.privacyCollectionDescription")}</p>
      </div>
    </Page>
  );
}

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const clearConditions = useConditionsStore((state) => state.clearAll);
  const clearProgress = useTaskProgressStore((state) => state.clearAll);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const session = await login({ email, password });
      clearConditions();
      clearProgress();
      setSession(session);
      navigate("/timeline");
    } catch {
      setError(t("auth.loginFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Page title={t("flow.loginTitle")}>
      <form onSubmit={submit}>
        <h2 className="section-title">{t("flow.loginHeading")}</h2>
        <p className="page-lede">{t("flow.loginIntro")}</p>
        <TextField label={t("flow.email")} type="email" value={email} onChange={setEmail} required />
        <TextField label={t("flow.password")} type="password" value={password} onChange={setPassword} required />
        <FormButton disabled={isSubmitting}>{t("flow.loginAction")}</FormButton>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      </form>
      <p className="text-center">
        <span className="text-app-muted">{t("flow.noAccount")} </span>
        <Link className="underline" to="/signup">
          {t("flow.createAccountLink")}
        </Link>
      </p>
    </Page>
  );
}

export function SaveFailurePage() {
  const { t } = useTranslation();
  return (
    <Page title={t("flow.saveFailureTitle")}>
      <div className="result-panel">
        <div className="result-icon error">×</div>
        <h2>{t("flow.saveFailure")}</h2>
        <p>{t("flow.conditionsSaveFailed")}</p>
        <p>{t("flow.retryNetwork")}</p>
      </div>
      <h2 className="section-title">{t("flow.failureCases")}</h2>
      <ul className="page-lede">
        <li>{t("flow.unstableNetwork")}</li>
        <li>{t("flow.missingInput")}</li>
        <li>{t("flow.serverError")}</li>
      </ul>
      <Link className="primary-action mx-auto mt-6 block w-fit no-underline" to="/conditions">
        {t("flow.retry")}
      </Link>
    </Page>
  );
}

export function ExpiryWarningPage() {
  const { t } = useTranslation();
  return (
    <Page title={t("flow.expiryTitle")}>
      <h2 className="section-title">{t("flow.expiryHeading")}</h2>
      <div className="surface-card">
        <p className="page-note">{t("flow.riskLevel")}</p>
        <h2 className="text-2xl font-bold">{t("flow.expiryRisk")}</h2>
        <p className="page-lede">{t("flow.renewalStart")}</p>
      </div>
      <Link className="surface-card mt-4 block no-underline" to="/official-guide">
        <h3 className="card-title">{t("flow.expiryInfo")}</h3>
        <Info label={t("flow.expiryDate")} value={t("flow.expiryDateValue")} />
        <Info label={t("flow.remainingDays")} value={t("flow.remainingDaysValue")} />
        <Info label={t("flow.visaType")} value={t("flow.visaValue")} />
      </Link>
      <div className="surface-card mt-4">
        <h3 className="card-title">{t("flow.tasksNow")}</h3>
        <p>{t("flow.expiryTask1")}</p>
        <p>{t("flow.expiryTask2")}</p>
      </div>
      <Link className="primary-action mt-6 w-full no-underline" to="/alert-request">
        {t("flow.hrSupport")}
      </Link>
    </Page>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-4">
      <span className="text-app-muted">{label}</span>
      <strong>{value}</strong>
    </p>
  );
}

export function OfficialGuidePage() {
  const { t } = useTranslation();
  return (
    <Page title={t("flow.officialGuideTitle")}>
      <h2 className="section-title">{t("flow.expiryPreparation")}</h2>
      <p className="page-lede">{t("flow.extensionApplication")}</p>
      <h2 className="section-title">{t("flow.officialProcedure")}</h2>
      <p className="page-lede">{t("flow.extensionDescription")}</p>
      <div className="surface-card">
        <p className="card-title">{t("flow.immigrationOffice")}</p>
        <p>{t("flow.koreaOfficialGuide")}</p>
        <a className="font-semibold underline" href="https://www.hikorea.go.kr" target="_blank" rel="noreferrer">
          {t("flow.immigrationGuide")}
        </a>
      </div>
    </Page>
  );
}

export function AlertRequestPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate("/alert-result");
  };
  return (
    <Page title={t("flow.alertRequestTitle")}>
      <form onSubmit={submit}>
        <h2 className="section-title">{t("flow.alertRequest")}</h2>
        <p className="page-lede">{t("flow.alertIntro")}</p>
        <div className="surface-card">
          <h3 className="card-title">{t("flow.recipient")}</h3>
          <p>{t("flow.hrManager")}</p>
        </div>
        <div className="surface-card">
          <h3 className="card-title">{t("flow.alertSummary")}</h3>
          <Info label={t("flow.expiryPlanned")} value={t("flow.expiryDateValue")} />
          <Info label={t("flow.remainingDays")} value={t("flow.remainingDaysValue")} />
          <Info label={t("flow.registrationType")} value="E-7" />
        </div>
        <TextField label={t("flow.supportReason")} />
        <TextField label={t("flow.urgency")} />
        <div className="surface-card mt-4">
          <h3 className="card-title">{t("flow.beforeSend")}</h3>
          <p className="page-note">{t("flow.alertDisclaimer")}</p>
        </div>
        <FormButton>{t("flow.sendAlert")}</FormButton>
      </form>
    </Page>
  );
}
export function AlertResultPage() {
  const { t } = useTranslation();
  return (
    <Page title={t("flow.alertResultTitle")}>
      <div className="result-panel">
        <div className="result-icon">✓</div>
        <h2>{t("flow.alertSent")}</h2>
        <p>{t("flow.alertSentDescription")}</p>
      </div>
      <h2 className="section-title">{t("flow.nextStep")}</h2>
      <p className="page-lede">{t("flow.alertNextStep")}</p>
      <Link className="primary-action mx-auto mt-6 block w-fit no-underline" to="/timeline">
        {t("flow.home")}
      </Link>
      <Link className="secondary-action mx-auto mt-3 block w-fit no-underline" to="/alert-request">
        {t("flow.sendAgain")}
      </Link>
    </Page>
  );
}
export function AlertFailurePage() {
  const { t } = useTranslation();
  return (
    <Page title={t("flow.alertFailureTitle")}>
      <div className="result-panel">
        <h2>{t("flow.alertFailure")}</h2>
        <p>{t("flow.alertFailedDescription")}</p>
      </div>
      <h2 className="section-title">{t("flow.failureReason")}</h2>
      <p className="page-lede">{t("flow.retryNetwork")}</p>
      <Link className="primary-action mt-6 w-full no-underline" to="/alert-request">
        {t("flow.retry")}
      </Link>
      <Link className="secondary-action mt-3 w-full no-underline" to="/timeline">
        {t("flow.previousScreen")}
      </Link>
    </Page>
  );
}

export function SimGuidePage() {
  const { t } = useTranslation();
  const supplies = [t("flow.passportOriginal"), t("flow.registrationOrStamp"), t("flow.cashOrCard")];
  const steps = [
    t("flow.chooseSeller"),
    t("flow.buySim"),
    t("flow.activateSim"),
    t("flow.checkNumber"),
    t("flow.registerContact"),
  ];
  return (
    <Page title={t("flow.simGuideTitle")}>
      <h2 className="section-title">{t("flow.simGuide")}</h2>
      <p className="page-lede">{t("flow.simIntro")}</p>
      <p className="page-note">{t("flow.simDisclaimer")}</p>
      <h2 className="section-title">{t("flow.supplies")}</h2>
      {supplies.map((item) => (
        <div className="surface-card mb-3 flex items-center justify-between" key={item}>
          <span>{item}</span>
          <span className="text-app-muted">{t("flow.check")}</span>
        </div>
      ))}
      <h2 className="section-title">{t("flow.procedures")}</h2>
      {steps.map((item, index) => (
        <div className="surface-card mb-3" key={item}>
          <strong className="mr-3 text-xl">{index + 1}</strong>
          <span>{item}</span>
          <p className="page-note ml-9">{t("flow.sellerInstruction")}</p>
        </div>
      ))}
      <div className="surface-card mt-6">
        <h3 className="card-title">{t("flow.fieldTip")}</h3>
        <p className="page-note">{t("flow.simTip")}</p>
      </div>
      <Link className="primary-action mt-6 w-full no-underline" to="/sim-official">
        {t("flow.officialGuide")}
      </Link>
    </Page>
  );
}
export function SimOfficialPage() {
  const { t } = useTranslation();
  const supplies = [t("flow.passportOriginal"), t("flow.registrationOrStamp"), t("flow.cashOrCard")];
  const steps = [t("flow.simStep1"), t("flow.simStep2"), t("flow.simStep3"), t("flow.simStep4"), t("flow.simStep5")];
  return (
    <Page title={t("flow.simOfficialTitle")}>
      <h2 className="section-title">{t("flow.simGuide")}</h2>
      <p className="page-lede">{t("flow.simOfficialIntro")}</p>
      <h2 className="section-title">{t("flow.supplies")}</h2>
      {supplies.map((item) => (
        <div className="surface-card mb-3" key={item}>
          <strong>{item}</strong>
          <p className="page-note">{t("flow.originalDocument")}</p>
        </div>
      ))}
      <h2 className="section-title">{t("flow.procedures")}</h2>
      {steps.map((item, index) => (
        <div className="surface-card mb-3" key={item}>
          <strong>
            {index + 1} {item}
          </strong>
        </div>
      ))}
      <a
        className="primary-action mt-6 block w-full text-center no-underline"
        href="https://www.tworld.co.kr"
        target="_blank"
        rel="noreferrer"
      >
        {t("flow.carrierGuide")}
      </a>
    </Page>
  );
}

export function BankRecommendationsPage() {
  const { t } = useTranslation();
  const [selectedBranchId, setSelectedBranchId] = useState(BANK_BRANCHES[0].id);

  return (
    <Page title={t("flow.bankRecommendationsTitle")}>
      <h2 className="section-title">{t("flow.matchingBranch")}</h2>
      <div className="surface-card mb-4">
        <p className="page-note">{t("flow.conditionSummary")}</p>
        <span className="chip">E-7 {t("flow.visaType")}</span> <span className="chip">{t("flow.workInDaedeok")}</span>{" "}
        <span className="chip">{t("flow.hasEmploymentCertificate")}</span>
      </div>
      <div className="bg-app-surface sticky top-0 z-10 py-2">
        <KakaoMap
          branches={BANK_BRANCHES}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
          labels={{
            loading: t("banks.mapLoading"),
            unconfigured: t("banks.mapUnconfigured"),
            failed: t("banks.mapFailed"),
          }}
        />
      </div>
      <p className="page-note mt-3">{t("banks.mapHint")}</p>
      {BANK_BRANCHES.map((branch, index) => (
        <div
          className={`surface-card mb-4 ${selectedBranchId === branch.id ? "border-[#303030]" : ""}`}
          key={branch.id}
        >
          <p className="page-note">{t("flow.recommendation", { number: index + 1 })}</p>
          <div className="flex items-start justify-between gap-3">
            <h3 className="card-title">{branch.name}</h3>
            {branch.foreignSupport && <span className="chip shrink-0">{t("banks.foreignSupport")}</span>}
          </div>
          <p className="page-note">{branch.address}</p>
          <p className="page-note">{t("flow.recommendationReason")}</p>
          <p>
            {branch.distanceKm === null
              ? t("banks.distanceUnavailable")
              : t("banks.recommendationReason", { distance: branch.distanceKm, count: branch.successfulExperiences })}
          </p>
          <p className="page-note">{t("flow.documentReference")}</p>
          <button className="text-action mt-3" onClick={() => setSelectedBranchId(branch.id)} type="button">
            {t("banks.showOnMap")}
          </button>
          <Link
            className="primary-action mt-4 flex w-full items-center justify-center text-center no-underline"
            to={`/branch-experience?branch=${branch.id}`}
          >
            {t("flow.viewExperience")}
          </Link>
        </div>
      ))}
      <div className="surface-card">
        <p className="page-note">{t("flow.recommendationDisclaimer")}</p>
      </div>
    </Page>
  );
}
export function BranchExperiencePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const branch = BANK_BRANCHES.find((item) => item.id === searchParams.get("branch")) ?? BANK_BRANCHES[0];
  const [experiences, setExperiences] = useState<ApiFieldExperience[]>([]);
  const [experienceState, setExperienceState] = useState<"loading" | "ready" | "error">("loading");
  const loadedBranchId = useRef<string | null>(null);

  useEffect(() => {
    if (loadedBranchId.current === branch.id) return;
    loadedBranchId.current = branch.id;
    void getApprovedExperiences(branch.id)
      .then((items) => {
        setExperiences(items);
        setExperienceState("ready");
      })
      .catch(() => setExperienceState("error"));
  }, [branch.id]);

  const directionsUrl =
    branch.latitude === null || branch.longitude === null
      ? null
      : `https://map.kakao.com/link/to/${encodeURIComponent(branch.name)},${branch.latitude},${branch.longitude}`;
  return (
    <Page title={t("flow.branchExperienceTitle")}>
      <h2 className="section-title">{t("flow.branchExperience")}</h2>
      <p className="page-lede">{t("flow.experienceIntro")}</p>
      <div className="surface-card">
        <p className="page-note">{t("flow.officialInfo")}</p>
        <h3 className="card-title">{branch.name}</h3>
        <p>{t("flow.openingHours")}</p>
        <p>{branch.foreignSupport ? t("flow.foreignCustomerDesk") : t("banks.confirmLanguageSupport")}</p>
        <p>{branch.address}</p>
        <a className="font-semibold underline" href={branch.sourceUrl} target="_blank" rel="noreferrer">
          {t("flow.bankOfficialGuide")}
        </a>
        {directionsUrl && (
          <a className="text-action mt-3 block" href={directionsUrl} target="_blank" rel="noreferrer">
            {t("banks.openDirections")}
          </a>
        )}
      </div>
      <section className="mt-4">
        <h2 className="section-title">{t("flow.fieldExperience")}</h2>
        {experienceState === "loading" && <p className="text-app-muted text-sm">{t("experiences.loading")}</p>}
        {experienceState === "error" && <p className="text-sm text-red-700">{t("experiences.error")}</p>}
        {experienceState === "ready" && experiences.length === 0 && (
          <p className="surface-card text-app-muted text-sm">{t("experiences.empty")}</p>
        )}
        {experiences.map((experience) => (
          <article className="surface-card mb-3" key={experience.experienceId}>
            <p className="page-note">{experience.visitDate}</p>
            {experience.visitResult && <p>{experience.visitResult}</p>}
            {experience.requiredDocs && <p className="text-app-muted text-sm">{experience.requiredDocs}</p>}
            {experience.durationMinutes !== null && (
              <p className="text-app-muted text-sm">
                {t("experiences.duration", { minutes: experience.durationMinutes })}
              </p>
            )}
          </article>
        ))}
      </section>
      <Link className="primary-action mt-6 w-full no-underline" to={`/bank-share?branch=${branch.id}`}>
        {t("flow.shareExperience")}
      </Link>
    </Page>
  );
}
export function BankOfficialPage() {
  const { t } = useTranslation();
  const banks = [t("flow.kookminBank"), t("flow.wooriBank"), t("flow.shinhanBank")];
  return (
    <Page title={t("flow.bankOfficialTitle")}>
      <h2 className="section-title">{t("flow.accountOpeningGuide")}</h2>
      <p className="page-lede">{t("flow.bankOfficialIntro")}</p>
      {banks.map((bank) => (
        <div className="surface-card mb-4" key={bank}>
          <h3 className="card-title">{bank}</h3>
          <p className="page-note">{t("flow.officialSource")}</p>
          <a className="underline" href="https://www.kbstar.com" target="_blank" rel="noreferrer">
            {t("flow.bankOfficialGuide")}
          </a>
          <p className="page-note">{t("flow.bankDocumentExample")}</p>
        </div>
      ))}
    </Page>
  );
}
export function BankSharePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [visitDate, setVisitDate] = useState("");
  const [visitResult, setVisitResult] = useState("");
  const [requiredDocs, setRequiredDocs] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const branchId = searchParams.get("branch") ?? "";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!branchId) {
      navigate("/privacy-warning");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await submitFieldExperience({
        branchId,
        visitDate,
        requiredDocs,
        visitResult,
        durationMinutes: durationMinutes ? Number(durationMinutes) : null,
      });
      navigate("/submission-complete");
    } catch {
      setSubmitError(t("flow.submissionPaused"));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Page title={t("flow.bankShareTitle")}>
      <form onSubmit={submit}>
        <h2 className="section-title">{t("flow.shareBankExperience")}</h2>
        <p className="page-lede">{t("flow.shareExperienceIntro")}</p>
        <TextField label={t("flow.bankBranchName")} value={branchId} readOnly />
        <TextField label={t("flow.visitDate")} type="date" value={visitDate} onChange={setVisitDate} required />
        <TextField label={t("flow.visitResult")} value={visitResult} onChange={setVisitResult} required />
        <label className="field-label">
          <span>{t("flow.whatHappened")}</span>
          <textarea
            className="field-control min-h-32"
            placeholder={t("flow.whatHappenedPlaceholder")}
            value={visitResult}
            onChange={(event) => setVisitResult(event.target.value)}
            required
          />
        </label>
        <label className="field-label">
          <span>{t("flow.documentsReceived")}</span>
          <textarea
            className="field-control min-h-32"
            placeholder={t("flow.documentsPlaceholder")}
            value={requiredDocs}
            onChange={(event) => setRequiredDocs(event.target.value)}
          />
        </label>
        <TextField
          label={t("flow.durationMinutes")}
          type="number"
          value={durationMinutes}
          onChange={setDurationMinutes}
          min="0"
        />
        <label className="mt-6 flex gap-3">
          <input type="checkbox" required />
          <span>{t("flow.privacyCheckbox")}</span>
        </label>
        <FormButton disabled={isSubmitting}>{t("flow.submitExperience")}</FormButton>
        {submitError && <p className="mt-3 text-sm text-red-700">{submitError}</p>}
      </form>
    </Page>
  );
}
export function PrivacyWarningPage() {
  const { t } = useTranslation();
  return (
    <Page title={t("flow.privacyWarningTitle")}>
      <h2 className="section-title">{t("flow.submissionPaused")}</h2>
      <p className="page-lede">{t("flow.privacyWarningIntro")}</p>
      <div className="surface-card">
        <h2 className="card-title">{t("flow.detectedTypes")}</h2>
        <div className="surface-card">
          <strong>{t("flow.accountNumber")}</strong>
          <p className="page-note">{t("flow.accountNumberRisk")}</p>
        </div>
        <div className="surface-card">
          <strong>{t("flow.contact")}</strong>
          <p className="page-note">{t("flow.contactRisk")}</p>
        </div>
      </div>
      <div className="surface-card mt-4">
        <h2 className="card-title">{t("flow.howToEdit")}</h2>
        <p>{t("flow.editStep1")}</p>
        <p>{t("flow.editStep2")}</p>
        <p>{t("flow.editStep3")}</p>
      </div>
      <Link className="primary-action mt-6 w-full no-underline" to="/bank-share?clean=1">
        {t("flow.editAndResubmit")}
      </Link>
    </Page>
  );
}
export function SubmissionCompletePage() {
  const { t } = useTranslation();
  return (
    <Page title={t("flow.submissionCompleteTitle")}>
      <div className="result-panel">
        <div className="result-icon">✓</div>
        <h2>{t("flow.experienceSubmitted")}</h2>
        <p>{t("flow.thankYou")}</p>
      </div>
      <h2 className="section-title">{t("flow.nextStep")}</h2>
      <ul className="page-lede">
        <li>{t("flow.submittedExperienceUse")}</li>
        <li>{t("flow.sensitiveInfoNotShared")}</li>
      </ul>
      <Link className="primary-action mt-6 w-full no-underline" to="/timeline">
        {t("flow.home")}
      </Link>
    </Page>
  );
}
