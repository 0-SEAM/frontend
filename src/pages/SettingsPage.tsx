import { useTranslation } from "react-i18next";
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
    <section className="px-5 pt-2 pb-6">
      <h1 className="my-1 text-[22px] font-semibold">{t("nav.settings")}</h1>

      <div className="mt-4 grid gap-1.5">
        <label className="text-[13px] font-semibold" htmlFor="language">
          {t("settings.language")}
        </label>
        <select
          id="language"
          className="border-app-line bg-app-surface text-app-text focus:border-app-accent min-h-12 w-full cursor-pointer rounded-[10px] border px-3 transition outline-none focus:ring-2 focus:ring-blue-100"
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
        className="border-app-line bg-app-surface text-app-muted mt-4 min-h-12 rounded-[10px] border px-4 transition duration-150 hover:border-slate-400 hover:bg-slate-50 active:translate-y-px"
        onClick={() => {
          clearConditions();
          clearProgress();
        }}
      >
        {t("settings.clearData")}
      </button>
    </section>
  );
}
