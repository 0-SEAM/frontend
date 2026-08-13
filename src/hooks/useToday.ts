import { useSyncExternalStore } from "react";

const DAY_MS = 86_400_000;

// 렌더 중 시각을 직접 읽지 않도록 모듈 로드 시점의 "오늘"을 고정 스냅숏으로 제공한다.
const todayStart = Math.floor(Date.now() / DAY_MS) * DAY_MS;

const subscribe = () => () => {};
const getSnapshot = () => todayStart;

/** 최신성 판정처럼 일 단위 정밀도면 충분한 계산에 쓴다. */
export function useToday(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
