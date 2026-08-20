import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getPendingExperiences, moderateExperience, type ApiFieldExperience } from "../services/seamApi";

export function ExperienceModerationPage() {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<ApiFieldExperience[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    void getPendingExperiences()
      .then((items) => {
        setExperiences(items);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const moderate = async (experienceId: number, moderation: "APPROVED" | "REJECTED") => {
    setUpdatingId(experienceId);
    try {
      await moderateExperience(experienceId, moderation);
      setExperiences((items) => items.filter((item) => item.experienceId !== experienceId));
    } catch {
      setState("error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="page-content">
      <Link className="text-app-muted mb-6 inline-block text-sm" to="/settings">
        {t("flow.back")}
      </Link>
      <h1 className="page-title">{t("moderation.title")}</h1>
      <p className="page-lede">{t("moderation.intro")}</p>
      {state === "loading" && <p className="text-app-muted text-sm">{t("moderation.loading")}</p>}
      {state === "error" && <p className="text-sm text-red-700">{t("moderation.error")}</p>}
      {state === "ready" && experiences.length === 0 && (
        <p className="text-app-muted text-sm">{t("moderation.empty")}</p>
      )}
      {experiences.map((experience) => (
        <article className="surface-card mb-4" key={experience.experienceId}>
          <p className="page-note">
            {experience.branchId} · {experience.visitDate}
          </p>
          {experience.visitResult && <p>{experience.visitResult}</p>}
          {experience.requiredDocs && <p className="text-app-muted text-sm">{experience.requiredDocs}</p>}
          <div className="mt-4 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
            <button
              className="primary-action"
              type="button"
              disabled={updatingId === experience.experienceId}
              onClick={() => void moderate(experience.experienceId, "APPROVED")}
            >
              {t("moderation.approve")}
            </button>
            <button
              className="secondary-action"
              type="button"
              disabled={updatingId === experience.experienceId}
              onClick={() => void moderate(experience.experienceId, "REJECTED")}
            >
              {t("moderation.reject")}
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
