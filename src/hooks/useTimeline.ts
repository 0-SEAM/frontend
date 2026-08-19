import { useEffect, useMemo, useRef } from "react";
import { TASK_MASTER } from "../domain/taskMaster";
import { computeTimeline } from "../domain/timelineEngine";
import { EMPTY_CONDITIONS, type TaskProgress, type TimelineResult } from "../domain/types";
import { syncTimelineTasks, updateTimelineTaskStatus } from "../services/seamApi";
import { useConditionsStore } from "../store/conditionsStore";
import { useTaskProgressStore } from "../store/taskProgressStore";

/** 저장된 조건 + 진행 상태로 타임라인을 계산한다(FN-1161: 조건이 바뀌면 즉시 재계산). */
export function useTimeline(): TimelineResult & {
  syncTaskStatus: (taskId: string, progress: TaskProgress) => Promise<void>;
} {
  const conditions = useConditionsStore((s) => s.saved);
  const progress = useTaskProgressStore((s) => s.progress);
  const hydrateProgress = useTaskProgressStore((s) => s.hydrateProgress);
  const lastSyncedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!conditions?.stayStatus) return;
    const syncKey = `${conditions.stayStatus}:${conditions.savedAt ?? ""}`;
    if (lastSyncedKey.current === syncKey) return;
    lastSyncedKey.current = syncKey;

    const applicableTasks = TASK_MASTER.filter((task) => task.appliesTo.includes(conditions.stayStatus!));
    void syncTimelineTasks(applicableTasks)
      .then(hydrateProgress)
      .catch(() => undefined);
  }, [conditions?.stayStatus, conditions?.savedAt, hydrateProgress]);

  const result = useMemo(
    () =>
      computeTimeline({
        tasks: TASK_MASTER,
        conditions: conditions ?? EMPTY_CONDITIONS,
        progress,
      }),
    [conditions, progress],
  );

  return { ...result, syncTaskStatus: updateTimelineTaskStatus };
}
