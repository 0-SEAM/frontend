import type { UserConditions } from "./types";

export interface FieldError {
  field: keyof UserConditions;
  /** i18n 키. */
  reasonKey: string;
  /** FN-1109. 어떤 값과 충돌하는지 함께 보여주기 위한 참조 항목. */
  conflictsWith?: keyof UserConditions;
}

/** FN-1102. 체류 상태에 따라 노출·필수 여부가 달라진다. */
export function requiredFields(conditions: UserConditions): (keyof UserConditions)[] {
  const base: (keyof UserConditions)[] = ["stayStatus", "visaType", "entryDate", "residenceSigungu"];
  if (conditions.stayStatus === "REGISTERED") base.push("residenceCardExpiryDate");
  return base;
}

export function isFieldVisible(field: keyof UserConditions, conditions: UserConditions): boolean {
  if (field === "residenceCardExpiryDate") return conditions.stayStatus === "REGISTERED";
  if (field === "registrationAppliedDate") return conditions.stayStatus === "CHANGING_STATUS";
  return true;
}

/** FN-1108 형식·필수 검증 + FN-1109 체류 상태·날짜 정합성 검증. */
export function validateConditions(conditions: UserConditions, today: Date): FieldError[] {
  const errors: FieldError[] = [];

  for (const field of requiredFields(conditions)) {
    if (!conditions[field]) {
      errors.push({ field, reasonKey: "validation.required" });
    }
  }

  const entry = toDate(conditions.entryDate);
  if (conditions.entryDate && !entry) {
    errors.push({ field: "entryDate", reasonKey: "validation.invalidDate" });
  }

  // 상태 ①은 입국일이 미래여야 한다.
  if (conditions.stayStatus === "BEFORE_ENTRY" && entry && entry < startOfDay(today)) {
    errors.push({
      field: "entryDate",
      reasonKey: "validation.entryMustBeFuture",
      conflictsWith: "stayStatus",
    });
  }

  // 등록 신청일은 입국일 이후여야 한다.
  const applied = toDate(conditions.registrationAppliedDate);
  if (applied && entry && applied < entry) {
    errors.push({
      field: "registrationAppliedDate",
      reasonKey: "validation.appliedAfterEntry",
      conflictsWith: "entryDate",
    });
  }

  return errors;
}

/** FN-1107. 과거 만료일은 저장을 막지 않고 갱신 안내만 띄운다. */
export function needsRenewalNotice(conditions: UserConditions, today: Date): boolean {
  const expiry = toDate(conditions.residenceCardExpiryDate);
  return Boolean(expiry && expiry < startOfDay(today));
}

function toDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
