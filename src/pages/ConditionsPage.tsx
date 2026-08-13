import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { StatusBar } from "../components/StatusBar";
import { useConditionsStore } from "../store/conditionsStore";

/** FN-1121. 저장값·저장 시각·관할 기관을 함께 보여준다. */
export function ConditionsPage() {
  const { t } = useTranslation();
  const saved = useConditionsStore((s) => s.saved);

  if (!saved) {
    return (
      <section className="page">
        <h1>{t("nav.conditions")}</h1>
        <Link to="/onboarding" className="banner">
          {t("onboarding.stepStatus")} →
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <StatusBar lastUpdated={saved.savedAt} />
      <h1>{t("nav.conditions")}</h1>
      <dl className="summary">
        <Row label={t("onboarding.stepStatus")} value={t(`status.${saved.stayStatus}`)} />
        <Row label={t("onboarding.visaType")} value={saved.visaType} />
        <Row label={t("onboarding.entryDate")} value={saved.entryDate} />
        <Row label={t("onboarding.registrationAppliedDate")} value={saved.registrationAppliedDate} />
        <Row label={t("onboarding.residenceCardExpiryDate")} value={saved.residenceCardExpiryDate} />
        <Row label={t("onboarding.residenceSigungu")} value={saved.residenceSigungu} />
        <Row label={t("onboarding.workplaceSigungu")} value={saved.workplaceSigungu} />
      </dl>
      <p className="page__help">{t("onboarding.minimalCollection")}</p>
      <Link to="/onboarding" className="primary primary--link">
        {t("common.save")}
      </Link>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
