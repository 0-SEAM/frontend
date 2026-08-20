import type { TaskNode, TaskProgress, UserConditions } from "../domain/types";
import { useAuthStore, type AuthSession } from "../store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");
const inFlightGets = new Map<string, Promise<Response>>();
const inFlightTimelineSyncs = new Map<string, Promise<Record<string, TaskProgress>>>();
let inFlightRefresh: Promise<boolean> | null = null;

function apiUrl(path: string): string {
  if (!API_BASE_URL) throw new Error("VITE_API_BASE_URL must be configured.");
  return `${API_BASE_URL}${path}`;
}

export type AuthResponse = AuthSession;

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

function authHeaders(): Record<string, string> {
  const { accessToken, userId } = useAuthStore.getState();
  if (!accessToken || !userId) throw new Error("You must be logged in.");
  return { Authorization: `Bearer ${accessToken}`, "X-User-Id": userId };
}

async function refreshAccessToken(): Promise<boolean> {
  if (inFlightRefresh) return inFlightRefresh;

  inFlightRefresh = refreshAccessTokenOnce();
  try {
    return await inFlightRefresh;
  } finally {
    inFlightRefresh = null;
  }
}

async function refreshAccessTokenOnce(): Promise<boolean> {
  const { refreshToken, updateTokens, clearSession } = useAuthStore.getState();
  if (!refreshToken) return false;

  const response = await fetch(apiUrl("/api/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    clearSession();
    return false;
  }

  const tokens = (await response.json()) as RefreshResponse;
  updateTokens(tokens);
  return true;
}

async function request(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  const requestKey = `${method}:${apiUrl(path)}:${headers.get("Authorization") ?? ""}`;
  let responsePromise: Promise<Response>;

  if (method === "GET") {
    const existingRequest = inFlightGets.get(requestKey);
    if (existingRequest) return (await existingRequest).clone();

    responsePromise = fetch(apiUrl(path), init);
    inFlightGets.set(requestKey, responsePromise);
    responsePromise.finally(() => inFlightGets.delete(requestKey)).catch(() => undefined);
  } else {
    responsePromise = fetch(apiUrl(path), init);
  }

  const response = await responsePromise;
  if (response.status === 403 && retry && useAuthStore.getState().refreshToken) {
    if (await refreshAccessToken()) {
      const { accessToken } = useAuthStore.getState();
      headers.set("Authorization", `Bearer ${accessToken}`);
      return request(path, { ...init, headers }, false);
    }
  }
  return response.clone();
}

export async function signup(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
  const response = await request(
    "/api/auth/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    false,
  );
  if (!response.ok) throw new Error(`Sign-up failed (${response.status}).`);
  return response.json() as Promise<AuthResponse>;
}

export async function login(input: { email: string; password: string }): Promise<AuthResponse> {
  const response = await request(
    "/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    false,
  );
  if (!response.ok) throw new Error(`Login failed (${response.status}).`);
  return response.json() as Promise<AuthResponse>;
}

export async function logout(): Promise<void> {
  const { refreshToken, clearSession } = useAuthStore.getState();
  try {
    if (refreshToken) {
      await request(
        "/api/auth/logout",
        {
          method: "POST",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        },
        false,
      );
    }
  } finally {
    clearSession();
  }
}

export function getUserId(): string {
  const userId = useAuthStore.getState().userId;
  if (!userId) throw new Error("You must be logged in.");
  return userId;
}

export interface ApiUserCondition {
  userId: string;
  visaStatus: string;
  visaType: string | null;
  entryDate: string;
  registrationAppliedDate: string | null;
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
    visaType: conditions.visaType,
    entryDate: conditions.entryDate,
    registrationAppliedDate: conditions.registrationAppliedDate,
    workplaceLocation: conditions.workplaceSigungu,
    residenceLocation: conditions.residenceSigungu,
    arcExpiryDate: conditions.residenceCardExpiryDate,
  };
}

export async function getConditions(): Promise<ApiUserCondition | null> {
  const userId = getUserId();
  const response = await request(`/api/conditions/${userId}`, { headers: authHeaders() });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Condition lookup failed (${response.status}).`);
  return response.json() as Promise<ApiUserCondition>;
}

export async function saveConditions(conditions: UserConditions): Promise<ApiUserCondition> {
  const payload = toApiCondition(conditions);
  const headers = authHeaders();
  const existing = await request(`/api/conditions/${payload.userId}`, { headers });
  const response = await request(existing.ok ? `/api/conditions/${payload.userId}` : "/api/conditions", {
    method: existing.ok ? "PUT" : "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Condition save failed (${response.status}).`);
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
  const response = await request("/api/experiences", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, authorId: getUserId() }),
  });
  if (!response.ok) throw new Error(`Experience submission failed (${response.status}).`);
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
  const response = await request(`/api/experiences?branchId=${encodeURIComponent(branchId)}`);
  if (!response.ok) throw new Error(`Experience lookup failed (${response.status}).`);
  return response.json() as Promise<ApiFieldExperience[]>;
}

export async function getPendingExperiences(): Promise<ApiFieldExperience[]> {
  const response = await request("/api/experiences/pending", { headers: authHeaders() });
  if (!response.ok) throw new Error(`Pending experience lookup failed (${response.status}).`);
  return response.json() as Promise<ApiFieldExperience[]>;
}

export async function moderateExperience(experienceId: number, moderation: "APPROVED" | "REJECTED"): Promise<void> {
  const response = await request(`/api/experiences/${experienceId}/moderate?moderation=${moderation}`, {
    method: "POST",
    headers: authHeaders(),
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
  const response = await request("/api/guides/sync");
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
  const response = await request(`/api/timelines/${userId}`, { headers: authHeaders() });
  if (!response.ok) throw new Error(`Timeline lookup failed (${response.status}).`);
  return response.json() as Promise<ApiTimelineTask[]>;
}

async function createTimelineTask(task: TaskNode, priority: number): Promise<ApiTimelineTask> {
  const userId = getUserId();
  const response = await request(`/api/timelines/${userId}/tasks`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ taskType: task.id, priority, prerequisiteTaskIds: [] }),
  });
  if (!response.ok) throw new Error(`Timeline task creation failed (${response.status}).`);
  return response.json() as Promise<ApiTimelineTask>;
}

function fromApiStatus(status: ApiTimelineTask["status"]): TaskProgress {
  return status === "TODO" ? "NOT_STARTED" : status;
}

export async function syncTimelineTasks(tasks: TaskNode[]): Promise<Record<string, TaskProgress>> {
  const syncKey = `${getUserId()}:${tasks.map((task) => task.id).join(",")}`;
  const existingSync = inFlightTimelineSyncs.get(syncKey);
  if (existingSync) return existingSync;

  const syncPromise = syncTimelineTasksOnce(tasks);
  inFlightTimelineSyncs.set(syncKey, syncPromise);
  syncPromise.finally(() => inFlightTimelineSyncs.delete(syncKey)).catch(() => undefined);
  return syncPromise;
}

async function syncTimelineTasksOnce(tasks: TaskNode[]): Promise<Record<string, TaskProgress>> {
  const existing = await getTimelineTasks();
  const existingTypes = new Set(existing.map((task) => task.taskType));
  const missingTasks = tasks.filter((task) => !existingTypes.has(task.id));
  const createdTasks = await Promise.all(missingTasks.map((task, index) => createTimelineTask(task, index + 1)));
  const synced = [...existing, ...createdTasks];
  return Object.fromEntries(synced.map((task) => [task.taskType, fromApiStatus(task.status)]));
}

export async function updateTimelineTaskStatus(taskType: string, progress: TaskProgress): Promise<void> {
  const task = (await getTimelineTasks()).find((item) => item.taskType === taskType);
  if (!task) throw new Error(`Timeline task ${taskType} does not exist.`);

  const status = progress === "NOT_STARTED" ? "TODO" : progress;
  const userId = getUserId();
  const response = await request(`/api/timelines/${userId}/tasks/${task.taskId}/status?status=${status}`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error(`Timeline status update failed (${response.status}).`);
}
