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
      <section className="px-5 pt-2 pb-6">
        <h1 className="my-1 text-[22px] font-semibold">{t("nav.conditions")}</h1>
        <Link
          to="/onboarding"
          className="bg-app-accent-soft text-app-accent my-3 block rounded-xl px-4 py-3.5 font-semibold no-underline transition hover:bg-blue-100"
        >
          {t("onboarding.stepStatus")} <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  return (
    <section className="px-5 pt-2 pb-6">
      <StatusBar lastUpdated={saved.savedAt} />
      <h1 className="my-1 text-[22px] font-semibold">{t("nav.conditions")}</h1>
      <dl className="[&_dt]:text-app-muted my-4 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 text-sm [&_dd]:m-0">
        <Row label={t("onboarding.stepStatus")} value={t(`status.${saved.stayStatus}`)} />
        <Row label={t("onboarding.visaType")} value={saved.visaType} />
        <Row label={t("onboarding.entryDate")} value={saved.entryDate} />
        <Row label={t("onboarding.registrationAppliedDate")} value={saved.registrationAppliedDate} />
        <Row label={t("onboarding.residenceCardExpiryDate")} value={saved.residenceCardExpiryDate} />
        <Row label={t("onboarding.residenceSigungu")} value={saved.residenceSigungu} />
        <Row label={t("onboarding.workplaceSigungu")} value={saved.workplaceSigungu} />
      </dl>
      <p className="text-app-muted mt-0 text-sm">{t("onboarding.minimalCollection")}</p>
      <Link
        to="/onboarding"
        className="bg-app-accent flex min-h-12 items-center justify-center rounded-[10px] px-4 font-semibold text-white no-underline shadow-[0_6px_14px_rgba(23,105,224,0.18)] transition duration-150 hover:bg-blue-700 active:translate-y-px"
      >
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
