import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, setLanguage, type SupportedLanguage } from "../i18n";
import { useConditionsStore } from "../store/conditionsStore";
import { useTaskProgressStore } from "../store/taskProgressStore";

/** FN-4122 언어 변경, FN-4106 로컬 개인 데이터 삭제. */
export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const clearConditions = useConditionsStore((s) => s.clearAll);
  const clearProgress = useTaskProgressStore((s) => s.clearAll);

  return (
    <section className="page">
      <h1>{t("nav.settings")}</h1>

      <div className="field">
        <span className="field__label">Language</span>
        <div className="segmented">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language}
              type="button"
              className={i18n.language === language ? "segmented__item--active" : ""}
              onClick={() => setLanguage(language as SupportedLanguage)}
            >
              {language.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="ghost"
        onClick={() => {
          clearConditions();
          clearProgress();
        }}
      >
        Clear local data on this device
      </button>
    </section>
  );
}
