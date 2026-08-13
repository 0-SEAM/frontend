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
      <section className="px-5 pt-2 pb-6">
        <h1 className="my-1 text-[22px] font-semibold">{t("onboarding.stepStatus")}</h1>
        <p className="text-app-muted mt-0 text-sm">{t("onboarding.stepStatusHelp")}</p>
        <ul className="mt-4 grid list-none gap-2.5 p-0">
          {STAY_STATUSES.map((status) => (
            <li key={status}>
              <button
                type="button"
                className={`bg-app-surface grid min-h-12 w-full gap-1 rounded-xl border px-4 py-3.5 text-left transition duration-150 hover:border-slate-400 hover:bg-slate-50 ${draft.stayStatus === status ? "border-app-accent shadow-[inset_0_0_0_1px_#1769e0]" : "border-app-line"}`}
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
            className="bg-app-accent min-h-12 flex-1 rounded-[10px] px-4 font-semibold text-white shadow-[0_6px_14px_rgba(23,105,224,0.18)] transition duration-150 hover:bg-blue-700 active:translate-y-px disabled:bg-slate-300"
            disabled={!draft.stayStatus}
            onClick={() => setStep("conditions")}
          >
            {t("common.next")}
          </button>
          <button
            type="button"
            className="border-app-line bg-app-surface text-app-muted min-h-12 rounded-[10px] border px-4 transition duration-150 hover:border-slate-400 hover:bg-slate-50 active:translate-y-px"
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
    <section className="px-5 pt-2 pb-6">
      <h1 className="my-1 text-[22px] font-semibold">{t("onboarding.stepConditions")}</h1>
      <p className="text-app-muted mt-0 text-sm">{t("onboarding.minimalCollection")}</p>

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
            <p className="bg-app-warn-bg text-app-warn rounded-[10px] px-3 py-2.5 text-[13px]">
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
        <button
          type="button"
          className="border-app-line bg-app-surface text-app-muted min-h-12 flex-1 rounded-[10px] border px-4 transition duration-150 hover:border-slate-400 hover:bg-slate-50 active:translate-y-px"
          onClick={() => setStep("status")}
        >
          {t("common.back")}
        </button>
        <button
          type="button"
          className="bg-app-accent min-h-12 flex-1 rounded-[10px] px-4 font-semibold text-white shadow-[0_6px_14px_rgba(23,105,224,0.18)] transition duration-150 hover:bg-blue-700 active:translate-y-px"
          onClick={handleSave}
        >
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
    <label className="mt-4 grid gap-1.5" data-field={field}>
      <span className="text-[13px] font-semibold">{label}</span>
      <input
        className="border-app-line bg-app-surface focus:border-app-accent min-h-12 rounded-[10px] border px-3 py-2.5 transition outline-none focus:ring-2 focus:ring-blue-100"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="text-[13px] text-red-700">{t(error.reasonKey)}</span>}
    </label>
  );
}
