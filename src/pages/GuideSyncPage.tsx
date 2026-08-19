import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getGuideContents, type ApiGuideContent } from "../services/seamApi";

/** Backend guide API currently exposes sync metadata, not the guide body itself. */
export function GuideSyncPage() {
  const { t } = useTranslation();
  const [guides, setGuides] = useState<ApiGuideContent[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    void getGuideContents()
      .then((contents) => {
        setGuides(contents);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <section className="page-content">
      <Link className="text-app-muted mb-6 inline-block text-sm" to="/offline">
        {t("flow.back")}
      </Link>
      <h1 className="page-title">{t("guides.title")}</h1>
      <p className="page-lede">{t("guides.intro")}</p>

      {state === "loading" && <p className="text-app-muted text-sm">{t("guides.loading")}</p>}
      {state === "error" && <p className="text-sm text-red-700">{t("guides.error")}</p>}
      {state === "ready" && guides.length === 0 && <p className="text-app-muted text-sm">{t("guides.empty")}</p>}

      {guides.map((guide) => (
        <article className="surface-card mb-4" key={guide.contentId}>
          <h2 className="card-title">{guide.contentType}</h2>
          <p className="text-app-muted mb-1 text-sm">{t("guides.version", { version: guide.version })}</p>
          <p className="text-app-muted mb-0 text-sm">
            {guide.offlineAvailable ? t("guides.availableOffline") : t("guides.onlineOnly")}
          </p>
          {guide.lastUpdatedAt && (
            <p className="text-app-muted mb-0 text-sm">{t("guides.updated", { date: guide.lastUpdatedAt })}</p>
          )}
        </article>
      ))}
    </section>
  );
}
