import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { isFieldVisible, needsRenewalNotice, validateConditions, type FieldError } from "../domain/conditionValidation";
import { STAY_STATUSES, type StayStatus, type UserConditions } from "../domain/types";
import { useConditionsStore } from "../store/conditionsStore";

/** FN-1101·FN-1102. 체류 상태를 먼저 묻고, 이후 항목을 상태에 따라 다르게 구성한다. */
export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { draft, updateDraft, commitDraft, skipOnboarding } = useConditionsStore();
  const [step, setStep] = useState<"status" | "conditions">("status");
  const [errors, setErrors] = useState<FieldError[]>([]);

  const errorFor = (field: keyof UserConditions) => errors.find((e) => e.field === field);

  const handleSave = () => {
    const found = validateConditions(draft, new Date());
    setErrors(found);
    if (found.length > 0) {
      document.querySelector(`[data-field="${found[0].field}"]`)?.scrollIntoView({ block: "center" });
      return;
    }
    commitDraft(new Date().toISOString());
    navigate("/timeline");
  };

  if (step === "status") {
    return (
      <section className="page">
        <h1>{t("onboarding.stepStatus")}</h1>
        <p className="page__help">{t("onboarding.stepStatusHelp")}</p>
        <ul className="choice-list">
          {STAY_STATUSES.map((status) => (
            <li key={status}>
              <button
                type="button"
                className={`choice ${draft.stayStatus === status ? "choice--selected" : ""}`}
                onClick={() => updateDraft(nextDraftForStatus(status))}
              >
                <strong>{t(`status.${status}`)}</strong>
                <span>{t(`status.${status}.desc`)}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="page__actions">
          <button type="button" className="primary" disabled={!draft.stayStatus} onClick={() => setStep("conditions")}>
            {t("common.next")}
          </button>
          <button
            type="button"
            className="ghost"
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
    <section className="page">
      <h1>{t("onboarding.stepConditions")}</h1>
      <p className="page__help">{t("onboarding.minimalCollection")}</p>

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
          {needsRenewalNotice(draft, new Date()) && <p className="notice">{t("onboarding.renewalNotice")}</p>}
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

      <div className="page__actions">
        <button type="button" className="ghost" onClick={() => setStep("status")}>
          {t("common.back")}
        </button>
        <button type="button" className="primary" onClick={handleSave}>
          {t("common.save")}
        </button>
      </div>
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
    <label className="field" data-field={field}>
      <span className="field__label">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {error && <span className="field__error">{t(error.reasonKey)}</span>}
    </label>
  );
}
