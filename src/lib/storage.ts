import type { AppData } from "../types";
const STORAGE_KEY = "make-time:v1";

const emptyData: AppData = {
  activities: [],
  sessions: [],
  activeTimer: null,
};

export function loadAppData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return emptyData;

  try {
    return JSON.parse(raw) as AppData;
  } catch {
    return emptyData;
  }
}

export function saveAppData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}