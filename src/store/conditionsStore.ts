import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EMPTY_CONDITIONS, type UserConditions } from "../domain/types";

interface ConditionsState {
  /** 저장이 완료된 값. 수정 중에도 이 값은 유지된다(FN-1122). */
  saved: UserConditions | null;
  /** FN-1111. 입력 중 임시 저장본. */
  draft: UserConditions;
  onboardingSkipped: boolean;
  updateDraft: (patch: Partial<UserConditions>) => void;
  resetDraftFromSaved: () => void;
  commitDraft: (savedAt: string) => void;
  hydrateSaved: (saved: UserConditions) => void;
  skipOnboarding: () => void;
  /** FN-4106. 로그아웃 시 기기에 남은 개인 조건을 함께 지운다. */
  clearAll: () => void;
}

export const useConditionsStore = create<ConditionsState>()(
  persist(
    (set, get) => ({
      saved: null,
      draft: EMPTY_CONDITIONS,
      onboardingSkipped: false,
      updateDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
      resetDraftFromSaved: () => set({ draft: get().saved ?? EMPTY_CONDITIONS }),
      commitDraft: (savedAt) => {
        const saved = { ...get().draft, savedAt };
        set({ saved, draft: saved });
      },
      hydrateSaved: (saved) => set({ saved, draft: saved }),
      skipOnboarding: () => set({ onboardingSkipped: true }),
      clearAll: () => set({ saved: null, draft: EMPTY_CONDITIONS, onboardingSkipped: false }),
    }),
    { name: "seam.conditions" },
  ),
);
