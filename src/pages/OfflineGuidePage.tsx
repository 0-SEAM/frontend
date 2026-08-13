import { useTranslation } from "react-i18next";
import { SourceFooter } from "../components/SourceFooter";
import { StatusBar } from "../components/StatusBar";

/**
 * FN-2103·FN-2112·FN-2113.
 * 앱에 내장된 최소 안내이므로 번들이 없거나 통신이 없어도 항상 표시된다.
 * 로그인 없이 조회할 수 있는 구간이다(FN-4124).
 */
export function OfflineGuidePage() {
  const { t } = useTranslation();

  return (
    <section className="page">
      <StatusBar />
      <h1>{t("offline.title")}</h1>
      <p className="page__help">{t("offline.intro")}</p>

      <article className="guide-card">
        <h2>{t("offline.wifi")}</h2>
        <ul>
          <li>공항 / Airport — 무료 Wi-Fi &quot;AirportWiFi&quot;</li>
          <li>지하철역 / Subway station — 통신사 개방 AP</li>
          <li>카페 / Cafe — 영수증에 적힌 비밀번호</li>
        </ul>
        <SourceFooter sourceUrl={null} verifiedAt={null} />
      </article>

      <article className="guide-card">
        <h2>{t("offline.sim")}</h2>
        <ul>
          <li>여권 / Passport</li>
          <li>결제 수단 / Payment method</li>
        </ul>
        <p className="phrase">
          {/* REQ-NF-29. 표시 언어와 무관하게 한국어 원문을 유지하고 번역을 병기한다. */}
          <strong lang="ko">선불 유심 개통하려고 합니다. 여권만 있어도 되나요?</strong>
          <span lang="en">I would like to activate a prepaid SIM. Is my passport enough?</span>
        </p>
        <SourceFooter sourceUrl="https://www.hikorea.go.kr" verifiedAt={null} />
      </article>
    </section>
  );
}
