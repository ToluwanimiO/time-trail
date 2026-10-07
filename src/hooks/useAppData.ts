import { useEffect, useState } from "react";
import type { Activity, AppData, Session } from "../types";
import {
  getElapsedSeconds,
  getLocalDateKey,
  getSessionTotal,
} from "../lib/utils";

const STORAGE_KEY = "make-time:v1";

const initialData: AppData = {
  activities: [],
  sessions: [],
  activeTimer: null,
};

function readData(): AppData {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return initialData;

  try {
    return JSON.parse(saved) as AppData;
  } catch {
    return initialData;
  }
}

export function useAppData() {
  const [data, setData] = useState<AppData>(readData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function addActivity(name: string, targetMinutes: number) {
    const activity: Activity = {
      id: crypto.randomUUID(),
      name: name.trim(),
      targetMinutes,
      createdAt: new Date().toISOString(),
    };

    setData((current) => ({
      ...current,
      activities: [...current.activities, activity],
    }));
  }

  function updateActivity(
    id: string,
    changes: Pick<Activity, "name" | "targetMinutes">
  ) {
    setData((current) => ({
      ...current,
      activities: current.activities.map((activity) =>
        activity.id === id ? { ...activity, ...changes } : activity
      ),
    }));
  }

  function deleteActivity(id: string) {
    setData((current) => ({
      activities: current.activities.filter((activity) => activity.id !== id),
      sessions: current.sessions.filter((session) => session.activityId !== id),
      activeTimer:
        current.activeTimer?.activityId === id ? null : current.activeTimer,
    }));
  }

  function startTimer(activityId: string) {
    setData((current) => ({
      ...current,
      activeTimer: {
        activityId,
        startedAt: new Date().toISOString(),
      },
    }));
  }

  function pauseTimer() {
    setData((current) => {
      if (!current.activeTimer) return current;

      const endedAt = new Date().toISOString();
      const durationSeconds = getElapsedSeconds(current.activeTimer.startedAt);

      if (durationSeconds === 0) {
        return {
          ...current,
          activeTimer: null,
        };
      }

      const session: Session = {
        id: crypto.randomUUID(),
        activityId: current.activeTimer.activityId,
        dateKey: getLocalDateKey(new Date(current.activeTimer.startedAt)),
        startedAt: current.activeTimer.startedAt,
        endedAt,
        durationSeconds,
      };

      return {
        ...current,
        sessions: [...current.sessions, session],
        activeTimer: null,
      };
    });
  }

  function getTodayTotal(activityId: string) {
    const dateKey = getLocalDateKey();
    const completed = getSessionTotal(data.sessions, activityId, dateKey);

    if (data.activeTimer?.activityId !== activityId) {
      return completed;
    }

    return completed + getElapsedSeconds(data.activeTimer.startedAt);
  }

  return {
    ...data,
    addActivity,
    updateActivity,
    deleteActivity,
    startTimer,
    pauseTimer,
    getTodayTotal,
  };
}