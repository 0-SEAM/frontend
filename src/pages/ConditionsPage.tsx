import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { StatusBar } from "../components/StatusBar";
import { useConditionsStore } from "../store/conditionsStore";

/** FN-1121. 저장값·저장 시각·관할 기관을 함께 보여준다. */
export function ConditionsPage() {
  const { t } = useTranslation();
  const saved = useConditionsStore((s) => s.saved);

  if (!saved) {
    return (
      <section className="page-content">
        <h1 className="page-title">{t("nav.conditions")}</h1>
        <Link
          to="/onboarding"
          className="surface-card text-app-text my-6 block font-semibold no-underline transition hover:bg-[#f5f5f5]"
        >
          {t("onboarding.stepStatus")} <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  return (
    <section className="page-content">
      <StatusBar lastUpdated={saved.savedAt} />
      <h1 className="page-title">{t("nav.conditions")}</h1>
      <dl className="surface-card [&_dt]:text-app-muted my-6 grid grid-cols-1 gap-x-5 gap-y-3 text-[16px] min-[380px]:grid-cols-[max-content_1fr] min-[380px]:gap-y-4 [&_dd]:m-0 [&_dd]:min-w-0 [&_dd]:break-words">
        <Row label={t("onboarding.stepStatus")} value={t(`status.${saved.stayStatus}`)} />
        <Row label={t("onboarding.visaType")} value={saved.visaType} />
        <Row label={t("onboarding.entryDate")} value={saved.entryDate} />
        <Row label={t("onboarding.registrationAppliedDate")} value={saved.registrationAppliedDate} />
        <Row label={t("onboarding.residenceCardExpiryDate")} value={saved.residenceCardExpiryDate} />
        <Row label={t("onboarding.residenceSigungu")} value={saved.residenceSigungu} />
        <Row label={t("onboarding.workplaceSigungu")} value={saved.workplaceSigungu} />
      </dl>
      <p className="text-app-muted mt-0 text-sm">{t("onboarding.minimalCollection")}</p>
      <Link to="/onboarding" className="primary-action mt-7 w-full no-underline">
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
