import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { StatusBar } from "../components/StatusBar";
import { TaskCard } from "../components/TaskCard";
import type { ComputedTask } from "../domain/types";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useTimeline } from "../hooks/useTimeline";
import { useConditionsStore } from "../store/conditionsStore";
import { useTaskProgressStore } from "../store/taskProgressStore";

/** FN-1141~FN-1147. 전체 경로를 함께 보여주고 지금 할 일을 상단에 고정한다. */
export function TimelinePage() {
  const { t } = useTranslation();
  const { online } = useNetworkStatus();
  const conditions = useConditionsStore((s) => s.saved);
  const setProgress = useTaskProgressStore((s) => s.setProgress);
  const timeline = useTimeline();

  const toggleDone = (item: ComputedTask) => {
    // FN-1155. 오프라인 변경은 로컬 큐에 쌓고 연결 복구 시 전송한다.
    setProgress(item.task.id, item.progress === "DONE" ? "NOT_STARTED" : "DONE", {
      offline: !online,
    });
  };

  return (
    <section className="px-5 pt-2 pb-6">
      <StatusBar lastUpdated={conditions?.savedAt} />
      <h1 className="my-1 text-[22px] font-semibold">{t("timeline.title")}</h1>

      {!conditions && (
        // FN-1112. 조건을 건너뛴 사용자에게는 유도 배너를 고정 노출한다.
        <Link
          to="/onboarding"
          className="bg-app-accent-soft text-app-accent my-3 block rounded-xl px-4 py-3.5 font-semibold no-underline transition hover:bg-blue-100"
        >
          {t("onboarding.stepStatus")} <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </Link>
      )}

      {timeline.now ? (
        <div className="bg-app-bg sticky top-0 z-[2] pt-2">
          <TaskCard item={timeline.now} emphasis="now" onToggleDone={toggleDone} />
        </div>
      ) : (
        <p className="text-app-muted text-sm">{t("timeline.empty")}</p>
      )}

      {timeline.next && <TaskCard item={timeline.next} emphasis="next" onToggleDone={toggleDone} />}

      <TaskGroup
        title={t("timeline.actionable")}
        items={timeline.actionable.filter((i) => i !== timeline.now && i !== timeline.next)}
        onToggleDone={toggleDone}
      />
      <TaskGroup title={t("timeline.blocked")} items={timeline.blocked} onToggleDone={toggleDone} />
      <TaskGroup title={t("timeline.done")} items={timeline.done} onToggleDone={toggleDone} />

      {timeline.notApplicable.length > 0 && (
        // FN-1163. 숨기되 몇 건인지 알려 오류로 오해하지 않게 한다.
        <details className="text-app-muted mt-6 text-sm">
          <summary>{t("timeline.notApplicable", { count: timeline.notApplicable.length })}</summary>
          <ul>
            {timeline.notApplicable.map((task) => (
              <li key={task.id}>{t(task.nameKey)}</li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function TaskGroup({
  title,
  items,
  onToggleDone,
}: {
  title: string;
  items: ComputedTask[];
  onToggleDone: (item: ComputedTask) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="text-app-muted mt-6 mb-2 text-[15px] font-semibold">{title}</h2>
      {items.map((item) => (
        <TaskCard key={item.task.id} item={item} onToggleDone={onToggleDone} />
      ))}
    </div>
  );
}
