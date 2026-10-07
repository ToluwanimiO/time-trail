export interface Activity {
  id: string;
  name: string;
  targetMinutes: number;
  createdAt: string;
}

export interface Session {
  id: string;
  activityId: string;
  dateKey: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
}

export interface ActiveTimer {
  activityId: string;
  startedAt: string;
}

export interface AppData {
  activities: Activity[];
  sessions: Session[];
  activeTimer: ActiveTimer | null;
}