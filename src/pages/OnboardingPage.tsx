import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { isFieldVisible, needsRenewalNotice, validateConditions, type FieldError } from "../domain/conditionValidation";
import { STAY_STATUSES, type StayStatus, type UserConditions } from "../domain/types";
import { saveConditions } from "../services/seamApi";
import { useConditionsStore } from "../store/conditionsStore";

/** FN-1101·FN-1102. 체류 상태를 먼저 묻고, 이후 항목을 상태에 따라 다르게 구성한다. */
export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { draft, updateDraft, commitDraft, skipOnboarding } = useConditionsStore();
  const [step, setStep] = useState<"status" | "conditions">("status");
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const errorFor = (field: keyof UserConditions) => errors.find((e) => e.field === field);

  const handleSave = async () => {
    const found = validateConditions(draft, new Date());
    setErrors(found);
    if (found.length > 0) {
      document.querySelector(`[data-field="${found[0].field}"]`)?.scrollIntoView({ block: "center" });
      return;
    }

    setSaveError(null);
    setIsSaving(true);
    try {
      const saved = await saveConditions(draft);
      commitDraft(saved.updatedAt ?? new Date().toISOString());
      navigate("/timeline");
    } catch {
      setSaveError(t("flow.conditionsSaveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  if (step === "status") {
    return (
      <section className="page-content">
        <h1 className="page-title">{t("onboarding.stepStatus")}</h1>
        <p className="page-lede">{t("onboarding.stepStatusHelp")}</p>
        <ul className="grid list-none gap-3 p-0">
          {STAY_STATUSES.map((status) => (
            <li key={status}>
              <button
                type="button"
                className={`surface-card grid min-h-14 w-full gap-1 text-left transition duration-150 hover:bg-[#f5f5f5] ${draft.stayStatus === status ? "border-[#303030] shadow-[inset_0_0_0_1px_#303030]" : ""}`}
                onClick={() => updateDraft(nextDraftForStatus(status))}
              >
                <strong>{t(`status.${status}`)}</strong>
                <span className="text-app-muted text-[13px]">{t(`status.${status}.desc`)}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            className="primary-action flex-1"
            disabled={!draft.stayStatus}
            onClick={() => setStep("conditions")}
          >
            {t("common.next")}
          </button>
          <button
            type="button"
            className="secondary-action"
            onClick={() => {
              skipOnboarding();
              navigate("/timeline");
            }}
          >
            {t("common.skip")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-content">
      <h1 className="page-title">{t("onboarding.stepConditions")}</h1>
      <p className="page-lede">{t("onboarding.minimalCollection")}</p>

      <Field
        label={t("onboarding.visaType")}
        field="visaType"
        value={draft.visaType ?? ""}
        error={errorFor("visaType")}
        onChange={(value) => updateDraft({ visaType: value || null })}
      />

      <Field
        label={draft.stayStatus === "BEFORE_ENTRY" ? t("onboarding.entryDatePlanned") : t("onboarding.entryDate")}
        field="entryDate"
        type="date"
        value={draft.entryDate ?? ""}
        error={errorFor("entryDate")}
        onChange={(value) => updateDraft({ entryDate: value || null })}
      />

      {isFieldVisible("registrationAppliedDate", draft) && (
        <Field
          label={t("onboarding.registrationAppliedDate")}
          field="registrationAppliedDate"
          type="date"
          value={draft.registrationAppliedDate ?? ""}
          error={errorFor("registrationAppliedDate")}
          onChange={(value) => updateDraft({ registrationAppliedDate: value || null })}
        />
      )}

      {isFieldVisible("residenceCardExpiryDate", draft) && (
        <>
          <Field
            label={t("onboarding.residenceCardExpiryDate")}
            field="residenceCardExpiryDate"
            type="date"
            value={draft.residenceCardExpiryDate ?? ""}
            error={errorFor("residenceCardExpiryDate")}
            onChange={(value) => updateDraft({ residenceCardExpiryDate: value || null })}
          />
          {needsRenewalNotice(draft, new Date()) && (
            <p className="bg-app-warn-bg text-app-warn rounded-[11px] px-4 py-3 text-[14px]">
              {t("onboarding.renewalNotice")}
            </p>
          )}
        </>
      )}

      <Field
        label={t("onboarding.residenceSigungu")}
        field="residenceSigungu"
        value={draft.residenceSigungu ?? ""}
        error={errorFor("residenceSigungu")}
        onChange={(value) => updateDraft({ residenceSigungu: value || null })}
      />

      <Field
        label={t("onboarding.workplaceSigungu")}
        field="workplaceSigungu"
        value={draft.workplaceSigungu ?? ""}
        error={errorFor("workplaceSigungu")}
        onChange={(value) => updateDraft({ workplaceSigungu: value || null })}
      />

      <div className="mt-5 flex gap-2">
        <button type="button" className="secondary-action flex-1" onClick={() => setStep("status")}>
          {t("common.back")}
        </button>
        <button type="button" className="primary-action flex-1" disabled={isSaving} onClick={handleSave}>
          {t("common.save")}
        </button>
      </div>
      {saveError && <p className="mt-3 text-sm text-red-700">{saveError}</p>}
    </section>
  );
}

/** FN-1102. 상태를 바꾸면 그 상태에서 존재하지 않는 값은 함께 비운다. */
function nextDraftForStatus(status: StayStatus): Partial<UserConditions> {
  const patch: Partial<UserConditions> = { stayStatus: status };
  if (status !== "CHANGING_STATUS") patch.registrationAppliedDate = null;
  if (status !== "REGISTERED") patch.residenceCardExpiryDate = null;
  return patch;
}

interface FieldProps {
  label: string;
  field: keyof UserConditions;
  value: string;
  type?: string;
  error?: FieldError;
  onChange: (value: string) => void;
}

function Field({ label, field, value, type = "text", error, onChange }: FieldProps) {
  const { t } = useTranslation();
  return (
    <label className="field-label mt-5" data-field={field}>
      <span>{label}</span>
      <input className="field-control" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {error && <span className="text-[13px] text-red-700">{t(error.reasonKey)}</span>}
    </label>
  );
}
