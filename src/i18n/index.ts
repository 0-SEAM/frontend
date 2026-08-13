import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ko from "./locales/ko.json";

export const SUPPORTED_LANGUAGES = ["en", "ko"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = "seam.language";

/** FN-4121. 기기 언어를 기본값으로 쓰고 미지원 언어는 영어로 대체한다. */
function resolveInitialLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
    return stored as SupportedLanguage;
  }
  const device = navigator.language.split("-")[0];
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(device) ? (device as SupportedLanguage) : "en";
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  lng: resolveInitialLanguage(),
  // FN-4123. 리소스가 누락되면 영어로 대체해 화면이 비지 않게 한다.
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function setLanguage(language: SupportedLanguage): void {
  localStorage.setItem(STORAGE_KEY, language);
  void i18n.changeLanguage(language);
}

export default i18n;
