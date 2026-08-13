/** REQ-F-001: 체류 상태는 온보딩 첫 문항이며 이후 입력 항목 구성을 결정한다. */
export type StayStatus =
  | "BEFORE_ENTRY" // ① 입국 전
  | "BEFORE_REGISTRATION" // ② 입국 후 등록 전
  | "CHANGING_STATUS" // ③ 체류 자격 변경 중
  | "REGISTERED"; // ④ 등록 완료

export const STAY_STATUSES: StayStatus[] = ["BEFORE_ENTRY", "BEFORE_REGISTRATION", "CHANGING_STATUS", "REGISTERED"];

/** FN-1103~FN-1107. 거주지·근무지는 시군구 단위까지만 수집한다(REQ-NF-09). */
export interface UserConditions {
  stayStatus: StayStatus | null;
  visaType: string | null;
  /** ISO date. 상태 ①이면 입국 예정일. */
  entryDate: string | null;
  /** 상태 ③에서만 사용. */
  registrationAppliedDate: string | null;
  /** 상태 ④에서만 사용. */
  residenceCardExpiryDate: string | null;
  residenceSigungu: string | null;
  workplaceSigungu: string | null;
  savedAt: string | null;
}

export const EMPTY_CONDITIONS: UserConditions = {
  stayStatus: null,
  visaType: null,
  entryDate: null,
  registrationAppliedDate: null,
  residenceCardExpiryDate: null,
  residenceSigungu: null,
  workplaceSigungu: null,
  savedAt: null,
};

/** FN-1135. 권장 시점 계산의 기준일 참조. */
export type BaseDateRef = "ENTRY_DATE" | "REGISTRATION_APPLIED_DATE" | "CARD_EXPIRY_DATE";

export type DeadlineType = "RELATIVE" | "FIXED" | "NONE";

/** FN-5101~FN-5104. 업무 마스터 노드. 12개 내외로 유지한다. */
export interface TaskNode {
  id: string;
  /** i18n 키. 화면 문구는 리소스에서 해석한다. */
  nameKey: string;
  descriptionKey: string;
  /** FN-1131. 이 업무가 적용되는 체류 상태. */
  appliesTo: StayStatus[];
  /** FN-1132. 선행 업무 ID. */
  prerequisites: string[];
  /** FN-1133. 정렬 근거가 되는 예상 리드타임(일). */
  leadTimeDays: number;
  deadlineType: DeadlineType;
  baseDateRef?: BaseDateRef;
  /** 기준일에서의 오프셋(일). */
  deadlineOffsetDays?: number;
  /** FN-1154·FN-3131. 완료 직후 현장 경험 3문항을 띄울 대상인지. */
  collectsExperience: boolean;
  /** FN-5104. 출처 없이 저장된 항목은 경고 상태로 표시한다. */
  sourceUrl: string | null;
  verifiedAt: string | null;
}

export type TaskProgress = "NOT_STARTED" | "IN_PROGRESS" | "DONE";

export type TaskAvailability = "ACTIONABLE" | "BLOCKED" | "DONE";

/** 규칙 엔진(FN-1131~FN-1138)이 산출하는 업무 단위 결과. */
export interface ComputedTask {
  task: TaskNode;
  progress: TaskProgress;
  availability: TaskAvailability;
  /** FN-1143. 기다리고 있는 선행 업무 ID 목록. */
  blockedBy: string[];
  /** FN-1135. 기준일이 없으면 null이고 순서만 제시한다. */
  recommendedDate: string | null;
  /** FN-1136. 크리티컬 패스 포함 여부. */
  onCriticalPath: boolean;
}

export interface TimelineResult {
  /** 정렬이 끝난 실행 가능 업무. */
  actionable: ComputedTask[];
  blocked: ComputedTask[];
  done: ComputedTask[];
  /** FN-1163. 체류 상태에 해당하지 않아 숨겨진 업무. */
  notApplicable: TaskNode[];
  /** FN-1137. */
  now: ComputedTask | null;
  next: ComputedTask | null;
  /** FN-1138·FN-1132. 운영자 확인용 경고(순환 참조, 없는 선행 ID 등). */
  warnings: string[];
}
