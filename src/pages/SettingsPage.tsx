import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SUPPORTED_LANGUAGES, setLanguage, type SupportedLanguage } from "../i18n";
import { useConditionsStore } from "../store/conditionsStore";
import { useTaskProgressStore } from "../store/taskProgressStore";

/** FN-4122 언어 변경, FN-4106 로컬 개인 데이터 삭제. */
export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const clearConditions = useConditionsStore((s) => s.clearAll);
  const clearProgress = useTaskProgressStore((s) => s.clearAll);
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language).split("-")[0] as SupportedLanguage;

  return (
    <section className="page-content">
      <h1 className="page-title">{t("nav.settings")}</h1>

      <div className="surface-card mt-6 grid gap-3">
        <label className="text-[17px] font-semibold" htmlFor="language">
          {t("settings.language")}
        </label>
        <select
          id="language"
          className="field-control cursor-pointer"
          value={currentLanguage}
          onChange={(event) => void setLanguage(event.target.value as SupportedLanguage)}
        >
          {SUPPORTED_LANGUAGES.map((language) => (
            <option key={language} value={language}>
              {t(`settings.languages.${language}`)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="secondary-action mt-6 w-full"
        onClick={() => {
          clearConditions();
          clearProgress();
        }}
      >
        {t("settings.clearData")}
      </button>

      <Link className="secondary-action mt-3 w-full no-underline" to="/experiences/moderation">
        {t("settings.reviewExperiences")}
      </Link>
    </section>
  );
}
