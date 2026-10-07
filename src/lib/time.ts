import type { Session } from "../types";
export function getElapsedSeconds(startedAt: string) {
  const start = new Date(startedAt).getTime();
  const now = Date.now();

  return Math.max(0, Math.floor((now - start) / 1000));
}

export function getTodaySessionSeconds(
  sessions: Session[],
  activityId: string,
  dateKey: string
) {
  return sessions
    .filter(
      (session) =>
        session.activityId === activityId &&
        session.dateKey === dateKey
    )
    .reduce((total, session) => total + session.durationSeconds, 0);
}