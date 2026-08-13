import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck, faClock, faPlay, faStar } from "@fortawesome/free-solid-svg-icons";
import { TASK_MASTER } from "../domain/taskMaster";
import type { ComputedTask } from "../domain/types";
import { SourceFooter } from "./SourceFooter";

interface TaskCardProps {
  item: ComputedTask;
  emphasis?: "now" | "next" | null;
  onToggleDone: (item: ComputedTask) => void;
  onGoToPrerequisite?: (taskId: string) => void;
}

/** FN-1142·FN-1143·FN-1145. 상태는 색뿐 아니라 아이콘·문구로도 구분한다(REQ-NF-32). */
export function TaskCard({ item, emphasis, onToggleDone, onGoToPrerequisite }: TaskCardProps) {
  const { t } = useTranslation();
  const { task, availability, blockedBy, recommendedDate, onCriticalPath } = item;

  const icon = availability === "DONE" ? faCheck : availability === "ACTIONABLE" ? faPlay : faClock;

  return (
    <article
      className={`border-app-line bg-app-surface mb-3 rounded-xl border border-l-4 px-4 py-3.5 ${availability === "ACTIONABLE" ? "border-l-app-accent" : availability === "DONE" ? "border-l-app-done" : "border-l-slate-300 opacity-75"}`}
    >
      {emphasis && (
        <p className="text-app-accent m-0 text-xs font-bold tracking-[0.06em] uppercase">{t(`timeline.${emphasis}`)}</p>
      )}
      <h3 className="my-1 text-[17px] font-semibold">
        <span
          className={`inline-grid w-5.5 place-items-center text-[13px] ${availability === "DONE" ? "text-app-done" : availability === "BLOCKED" ? "text-app-muted" : "text-app-accent"}`}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={icon} />
        </span>{" "}
        {t(`${task.nameKey}`)}
      </h3>
      <p className="text-app-muted my-1 text-[13px]">{t(`${task.descriptionKey}`)}</p>

      <p className="text-app-muted my-1 text-[13px]">
        {recommendedDate ? t("timeline.recommendedBy", { date: recommendedDate }) : t("timeline.noDate")}
      </p>

      {availability === "BLOCKED" && blockedBy.length > 0 && (
        <p className="text-app-muted my-1 text-[13px]">
          {t("timeline.blockedBy", { names: blockedBy.map(taskName(t)).join(", ") })}
          {onGoToPrerequisite && (
            <button
              type="button"
              className="text-app-accent hover:bg-app-accent-soft focus-visible:outline-app-accent ml-1 inline-flex min-h-8 min-w-8 items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={t("timeline.goToPrerequisite")}
              onClick={() => onGoToPrerequisite(blockedBy[0])}
            >
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </button>
          )}
        </p>
      )}

      {onCriticalPath && (
        <p className="text-app-warn mt-2 text-[13px]">
          <FontAwesomeIcon icon={faStar} aria-hidden="true" /> {t("timeline.criticalPath")}
        </p>
      )}

      <button
        type="button"
        className="border-app-line bg-app-surface mt-3 min-h-12 w-full rounded-[10px] border px-4 transition duration-150 hover:border-slate-400 hover:bg-slate-50 active:translate-y-px"
        onClick={() => onToggleDone(item)}
      >
        {availability === "DONE" ? t("timeline.undoDone") : t("timeline.markDone")}
      </button>

      <SourceFooter sourceUrl={task.sourceUrl} verifiedAt={task.verifiedAt} />
    </article>
  );
}

function taskName(t: (key: string) => string) {
  return (id: string) => {
    const node = TASK_MASTER.find((task) => task.id === id);
    return node ? t(node.nameKey) : id;
  };
}
