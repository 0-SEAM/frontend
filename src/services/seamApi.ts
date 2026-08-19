import type { TaskNode, TaskProgress, UserConditions } from "../domain/types";

const USER_ID_STORAGE_KEY = "seam.userId";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

function apiUrl(path: string): string {
  if (!API_BASE_URL) throw new Error("VITE_API_BASE_URL must be configured.");
  return `${API_BASE_URL}${path}`;
}

export function getUserId(): string {
  const existing = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (existing) return existing;

  const userId = crypto.randomUUID();
  localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  return userId;
}

export interface ApiUserCondition {
  userId: string;
  visaStatus: string;
  entryDate: string;
  workplaceLocation: string | null;
  residenceLocation: string | null;
  arcExpiryDate: string | null;
  updatedAt?: string | null;
}

function toApiCondition(conditions: UserConditions): ApiUserCondition {
  if (!conditions.stayStatus || !conditions.entryDate) {
    throw new Error("A stay status and entry date are required.");
  }

  return {
    userId: getUserId(),
    visaStatus: conditions.stayStatus,
    entryDate: conditions.entryDate,
    workplaceLocation: conditions.workplaceSigungu,
    residenceLocation: conditions.residenceSigungu,
    arcExpiryDate: conditions.residenceCardExpiryDate,
  };
}

export async function saveConditions(conditions: UserConditions): Promise<ApiUserCondition> {
  const payload = toApiCondition(conditions);
  const existing = await fetch(apiUrl(`/api/conditions/${payload.userId}`), {
    headers: { "X-User-Id": payload.userId },
  });
  const response = await fetch(apiUrl(existing.ok ? `/api/conditions/${payload.userId}` : "/api/conditions"), {
    method: existing.ok ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": payload.userId,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Condition save failed (${response.status}).`);
  }

  return response.json() as Promise<ApiUserCondition>;
}

export interface FieldExperienceInput {
  branchId: string;
  visitDate: string;
  requiredDocs: string;
  visitResult: string;
  durationMinutes: number | null;
}

export async function submitFieldExperience(input: FieldExperienceInput): Promise<void> {
  const response = await fetch(apiUrl("/api/experiences"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, authorId: getUserId() }),
  });

  if (!response.ok) {
    throw new Error(`Experience submission failed (${response.status}).`);
  }
}

export interface ApiFieldExperience {
  experienceId: number;
  branchId: string;
  visitDate: string;
  requiredDocs: string | null;
  visitResult: string | null;
  durationMinutes: number | null;
  createdAt: string | null;
}

export async function getApprovedExperiences(branchId: string): Promise<ApiFieldExperience[]> {
  const response = await fetch(apiUrl(`/api/experiences?branchId=${encodeURIComponent(branchId)}`));
  if (!response.ok) throw new Error(`Experience lookup failed (${response.status}).`);
  return response.json() as Promise<ApiFieldExperience[]>;
}

export async function getPendingExperiences(): Promise<ApiFieldExperience[]> {
  const response = await fetch(apiUrl("/api/experiences/pending"));
  if (!response.ok) throw new Error(`Pending experience lookup failed (${response.status}).`);
  return response.json() as Promise<ApiFieldExperience[]>;
}

export async function moderateExperience(experienceId: number, moderation: "APPROVED" | "REJECTED"): Promise<void> {
  const response = await fetch(apiUrl(`/api/experiences/${experienceId}/moderate?moderation=${moderation}`), {
    method: "POST",
  });
  if (!response.ok) throw new Error(`Experience moderation failed (${response.status}).`);
}

export interface ApiGuideContent {
  contentId: number;
  contentType: string;
  version: string;
  offlineAvailable: boolean;
  lastUpdatedAt: string | null;
}

export async function getGuideContents(): Promise<ApiGuideContent[]> {
  const response = await fetch(apiUrl("/api/guides/sync"));
  if (!response.ok) throw new Error(`Guide sync failed (${response.status}).`);
  return response.json() as Promise<ApiGuideContent[]>;
}

interface ApiTimelineTask {
  taskId: number;
  taskType: string;
  priority: number | null;
  recommendedDate: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

async function getTimelineTasks(): Promise<ApiTimelineTask[]> {
  const userId = getUserId();
  const response = await fetch(apiUrl(`/api/timelines/${userId}`), { headers: { "X-User-Id": userId } });
  if (!response.ok) throw new Error(`Timeline lookup failed (${response.status}).`);
  return response.json() as Promise<ApiTimelineTask[]>;
}

async function createTimelineTask(task: TaskNode, priority: number): Promise<void> {
  const userId = getUserId();
  const response = await fetch(apiUrl(`/api/timelines/${userId}/tasks`), {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-User-Id": userId },
    body: JSON.stringify({ taskType: task.id, priority, prerequisiteTaskIds: [] }),
  });
  if (!response.ok) throw new Error(`Timeline task creation failed (${response.status}).`);
}

function fromApiStatus(status: ApiTimelineTask["status"]): TaskProgress {
  return status === "TODO" ? "NOT_STARTED" : status;
}

export async function syncTimelineTasks(tasks: TaskNode[]): Promise<Record<string, TaskProgress>> {
  const existing = await getTimelineTasks();
  const existingTypes = new Set(existing.map((task) => task.taskType));
  const missingTasks = tasks.filter((task) => !existingTypes.has(task.id));
  if (missingTasks.length === 0) {
    return Object.fromEntries(existing.map((task) => [task.taskType, fromApiStatus(task.status)]));
  }

  await Promise.all(missingTasks.map((task, index) => createTimelineTask(task, index + 1)));
  const synced = await getTimelineTasks();
  return Object.fromEntries(synced.map((task) => [task.taskType, fromApiStatus(task.status)]));
}

export async function updateTimelineTaskStatus(taskType: string, progress: TaskProgress): Promise<void> {
  const task = (await getTimelineTasks()).find((item) => item.taskType === taskType);
  if (!task) throw new Error(`Timeline task ${taskType} does not exist.`);

  const status = progress === "NOT_STARTED" ? "TODO" : progress;
  const userId = getUserId();
  const response = await fetch(apiUrl(`/api/timelines/${userId}/tasks/${task.taskId}/status?status=${status}`), {
    method: "POST",
    headers: { "X-User-Id": userId },
  });
  if (!response.ok) throw new Error(`Timeline status update failed (${response.status}).`);
}
