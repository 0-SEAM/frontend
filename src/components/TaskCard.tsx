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

  const isDone = availability === "DONE";
  const isActionable = availability === "ACTIONABLE";
  const icon = isDone ? faCheck : isActionable ? faPlay : faClock;

  return (
    <article
      className={`surface-card mb-4 transition-all duration-300 ease-out ${
        isActionable
          ? "border-[#303030] shadow-[0_2px_6px_rgba(48,48,48,0.08)]"
          : isDone
            ? "bg-[#f7f7f7]"
            : "opacity-75"
      }`}
    >
      {emphasis && (
        <p className="text-app-muted m-0 text-[13px] font-bold tracking-[0.04em] uppercase">
          {t(`timeline.${emphasis}`)}
        </p>
      )}
      <h3 className="my-1 text-[17px] font-semibold">
        <span
          className={`inline-grid w-5.5 place-items-center text-[13px] transition-colors duration-300 ${
            isDone ? "text-app-text" : availability === "BLOCKED" ? "text-app-muted" : "text-app-text"
          }`}
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
        className={`mt-4 min-h-12 w-full rounded-[10px] border px-4 text-[16px] font-semibold transition-all duration-300 ease-out active:translate-y-px ${
          isDone
            ? "border-app-text bg-app-text text-white hover:bg-[#1f1f1f]"
            : "border-app-line bg-app-surface text-app-text hover:bg-[#f5f5f5]"
        }`}
        onClick={() => onToggleDone(item)}
      >
        {isDone ? t("timeline.undoDone") : t("timeline.markDone")}
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
