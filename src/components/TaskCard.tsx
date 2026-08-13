import { useTranslation } from "react-i18next";
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

  const icon = availability === "DONE" ? "✓" : availability === "ACTIONABLE" ? "▶" : "⏳";

  return (
    <article className={`task-card task-card--${availability.toLowerCase()}`}>
      {emphasis && <p className="task-card__emphasis">{t(`timeline.${emphasis}`)}</p>}
      <h3 className="task-card__title">
        <span aria-hidden="true">{icon}</span> {t(`${task.nameKey}`)}
      </h3>
      <p className="task-card__desc">{t(`${task.descriptionKey}`)}</p>

      <p className="task-card__date">{recommendedDate ? t("timeline.recommendedBy", { date: recommendedDate }) : t("timeline.noDate")}</p>

      {availability === "BLOCKED" && blockedBy.length > 0 && (
        <p className="task-card__blocked">
          {t("timeline.blockedBy", { names: blockedBy.map(taskName(t)).join(", ") })}
          {onGoToPrerequisite && (
            <button type="button" className="link" onClick={() => onGoToPrerequisite(blockedBy[0])}>
              →
            </button>
          )}
        </p>
      )}

      {onCriticalPath && <p className="task-card__critical">★ {t("timeline.criticalPath")}</p>}

      <button type="button" className="task-card__action" onClick={() => onToggleDone(item)}>
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
