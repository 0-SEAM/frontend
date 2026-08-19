import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TaskProgress } from "../domain/types";

export interface ProgressChange {
  taskId: string;
  progress: TaskProgress;
  changedAt: string;
}

interface TaskProgressState {
  progress: Record<string, TaskProgress>;
  /** FN-1151·FN-1153. 완료 해제도 삭제가 아니라 이력으로 남긴다. */
  history: ProgressChange[];
  /** FN-1155. 오프라인에서 누른 변경은 큐에 쌓아 두고 연결 복구 시 순서대로 전송한다. */
  pendingSync: ProgressChange[];
  setProgress: (taskId: string, progress: TaskProgress, options?: { offline?: boolean }) => void;
  hydrateProgress: (progress: Record<string, TaskProgress>) => void;
  markSynced: (count: number) => void;
  clearAll: () => void;
}

export const useTaskProgressStore = create<TaskProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      history: [],
      pendingSync: [],
      setProgress: (taskId, progress, options) => {
        const change: ProgressChange = {
          taskId,
          progress,
          changedAt: new Date().toISOString(),
        };
        set({
          progress: { ...get().progress, [taskId]: progress },
          history: [...get().history, change],
          pendingSync: options?.offline ? [...get().pendingSync, change] : get().pendingSync,
        });
      },
      hydrateProgress: (progress) => set({ progress: { ...get().progress, ...progress } }),
      markSynced: (count) => set({ pendingSync: get().pendingSync.slice(count) }),
      clearAll: () => set({ progress: {}, history: [], pendingSync: [] }),
    }),
    { name: "seam.taskProgress" },
  ),
);
