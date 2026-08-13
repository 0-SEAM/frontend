import { useMemo } from "react";
import { TASK_MASTER } from "../domain/taskMaster";
import { computeTimeline } from "../domain/timelineEngine";
import { EMPTY_CONDITIONS, type TimelineResult } from "../domain/types";
import { useConditionsStore } from "../store/conditionsStore";
import { useTaskProgressStore } from "../store/taskProgressStore";

/** 저장된 조건 + 진행 상태로 타임라인을 계산한다(FN-1161: 조건이 바뀌면 즉시 재계산). */
export function useTimeline(): TimelineResult {
  const conditions = useConditionsStore((s) => s.saved);
  const progress = useTaskProgressStore((s) => s.progress);

  return useMemo(
    () =>
      computeTimeline({
        tasks: TASK_MASTER,
        conditions: conditions ?? EMPTY_CONDITIONS,
        progress,
      }),
    [conditions, progress],
  );
}
