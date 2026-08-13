import { addDays, formatISO, parseISO } from "date-fns";
import { PHONE_NUMBER_TASK_ID } from "./taskMaster";
import type { BaseDateRef, ComputedTask, TaskNode, TaskProgress, TimelineResult, UserConditions } from "./types";

export interface TimelineInput {
  tasks: TaskNode[];
  conditions: UserConditions;
  progress: Record<string, TaskProgress>;
}

/**
 * FN-1131~FN-1138 규칙 엔진.
 * REQ-NF-21: 같은 입력에는 항상 같은 출력을 반환한다. AI·난수·현재 시각에 의존하지 않는다.
 */
export function computeTimeline({ tasks, conditions, progress }: TimelineInput): TimelineResult {
  const warnings: string[] = [];

  // FN-1131 적용 체류 상태 기준 업무 선별
  const applicable = conditions.stayStatus ? tasks.filter((t) => t.appliesTo.includes(conditions.stayStatus!)) : tasks;
  const notApplicable = tasks.filter((t) => !applicable.includes(t));

  const byId = new Map(applicable.map((t) => [t.id, t]));

  // 존재하지 않는 선행 업무ID는 무시하되 경고로 남긴다(FN-1132).
  const prereqOf = (task: TaskNode): string[] =>
    task.prerequisites.filter((id) => {
      if (byId.has(id)) return true;
      if (tasks.some((t) => t.id === id)) return false; // 체류 상태로 제외된 선행은 경고 대상이 아니다.
      warnings.push(`${task.id}: 존재하지 않는 선행 업무 ${id}`);
      return false;
    });

  // FN-1138 순환 참조 방어 — 순환에 속한 업무만 대기로 고정하고 나머지는 정상 계산한다.
  const cyclic = detectCyclicTasks(applicable, prereqOf);
  if (cyclic.size > 0) {
    warnings.push(`순환 참조 감지: ${[...cyclic].join(", ")}`);
  }

  const progressOf = (id: string): TaskProgress => progress[id] ?? "NOT_STARTED";

  // FN-1136 크리티컬 패스 — 누적 리드타임이 가장 긴 경로.
  const onCriticalPath = computeCriticalPath(applicable, prereqOf, cyclic);

  const computed: ComputedTask[] = applicable.map((task) => {
    const state = progressOf(task.id);
    const blockedBy = prereqOf(task).filter((id) => progressOf(id) !== "DONE");
    const availability =
      state === "DONE" ? "DONE" : cyclic.has(task.id) || blockedBy.length > 0 ? "BLOCKED" : "ACTIONABLE";

    return {
      task,
      progress: state,
      availability,
      blockedBy,
      recommendedDate: computeRecommendedDate(task, conditions),
      onCriticalPath: onCriticalPath.has(task.id),
    };
  });

  const actionable = computed.filter((c) => c.availability === "ACTIONABLE").sort(compareActionable);
  const blocked = computed.filter((c) => c.availability === "BLOCKED").sort(compareByDeadline);
  const done = computed.filter((c) => c.availability === "DONE");

  // FN-1137 지금 할 일·다음 할 일. FN-2129: 이미 번호가 있는 사용자는 T01 을 후보에서 제외한다.
  const excludePhoneTask = conditions.stayStatus === "CHANGING_STATUS" || conditions.stayStatus === "REGISTERED";
  const candidates = excludePhoneTask ? actionable.filter((c) => c.task.id !== PHONE_NUMBER_TASK_ID) : actionable;

  return {
    actionable,
    blocked,
    done,
    notApplicable,
    now: candidates[0] ?? null,
    next: candidates[1] ?? null,
    warnings,
  };
}

/** FN-1133 리드타임 내림차순 → FN-1134 기한 임박 순 → 크리티컬 패스 포함 순. */
function compareActionable(a: ComputedTask, b: ComputedTask): number {
  if (a.task.leadTimeDays !== b.task.leadTimeDays) {
    return b.task.leadTimeDays - a.task.leadTimeDays;
  }
  const byDeadline = compareByDeadline(a, b);
  if (byDeadline !== 0) return byDeadline;
  return Number(b.onCriticalPath) - Number(a.onCriticalPath);
}

/** 기한 값이 없는 업무는 항상 뒤로 보낸다(FN-1134). */
function compareByDeadline(a: ComputedTask, b: ComputedTask): number {
  if (a.recommendedDate === b.recommendedDate) return 0;
  if (!a.recommendedDate) return 1;
  if (!b.recommendedDate) return -1;
  return a.recommendedDate < b.recommendedDate ? -1 : 1;
}

/** FN-1135. 기준일이 없으면 계산을 생략하고 순서만 제시한다. */
function computeRecommendedDate(task: TaskNode, conditions: UserConditions): string | null {
  if (task.deadlineType !== "RELATIVE" || task.baseDateRef === undefined) return null;
  const base = resolveBaseDate(task.baseDateRef, conditions);
  if (!base) return null;
  return formatISO(addDays(parseISO(base), task.deadlineOffsetDays ?? 0), {
    representation: "date",
  });
}

function resolveBaseDate(ref: BaseDateRef, conditions: UserConditions): string | null {
  switch (ref) {
    case "ENTRY_DATE":
      return conditions.entryDate;
    case "REGISTRATION_APPLIED_DATE":
      return conditions.registrationAppliedDate;
    case "CARD_EXPIRY_DATE":
      return conditions.residenceCardExpiryDate;
  }
}

type PrereqResolver = (task: TaskNode) => string[];

function detectCyclicTasks(tasks: TaskNode[], prereqOf: PrereqResolver): Set<string> {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const state = new Map<string, "VISITING" | "DONE">();
  const cyclic = new Set<string>();

  const visit = (id: string, stack: string[]): void => {
    const current = state.get(id);
    if (current === "DONE") return;
    if (current === "VISITING") {
      stack.slice(stack.indexOf(id)).forEach((n) => cyclic.add(n));
      return;
    }
    const task = byId.get(id);
    if (!task) return;
    state.set(id, "VISITING");
    prereqOf(task).forEach((p) => visit(p, [...stack, id]));
    state.set(id, "DONE");
  };

  tasks.forEach((t) => visit(t.id, []));
  return cyclic;
}

function computeCriticalPath(tasks: TaskNode[], prereqOf: PrereqResolver, cyclic: Set<string>): Set<string> {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const cost = new Map<string, number>();
  const parent = new Map<string, string | null>();

  const longest = (id: string): number => {
    if (cost.has(id)) return cost.get(id)!;
    const task = byId.get(id);
    if (!task || cyclic.has(id)) {
      cost.set(id, 0);
      return 0;
    }
    cost.set(id, 0); // 재진입 방어
    let best = 0;
    let bestParent: string | null = null;
    for (const p of prereqOf(task)) {
      const value = longest(p);
      if (value > best) {
        best = value;
        bestParent = p;
      }
    }
    parent.set(id, bestParent);
    const total = best + task.leadTimeDays;
    cost.set(id, total);
    return total;
  };

  tasks.forEach((t) => longest(t.id));

  let tail: string | null = null;
  let max = -1;
  for (const [id, value] of cost) {
    if (value > max) {
      max = value;
      tail = id;
    }
  }

  const path = new Set<string>();
  while (tail) {
    path.add(tail);
    tail = parent.get(tail) ?? null;
  }
  return path;
}
