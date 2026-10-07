import { ArrowLeft, Pause } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReturnTypeUseAppData } from "./pageTypes";
import { formatShortDuration, formatTimer } from "../lib/utils";

type Props = {
  app: ReturnTypeUseAppData;
};

export function TimerPage({ app }: Props) {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (!app.activeTimer) {
    return (
      <section className="px-5 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold text-stone-600"
        >
          <ArrowLeft size={18} />
          Back to Today
        </button>
        <h1 className="mt-10 text-3xl font-bold">No timer is running.</h1>
      </section>
    );
  }

  const activity = app.activities.find(
    (item) => item.id === app.activeTimer?.activityId
  );

  if (!activity) return null;

  const todayTotal = app.getTodayTotal(activity.id);
  const targetSeconds = activity.targetMinutes * 60;
  const percent = Math.min(100, (todayTotal / targetSeconds) * 100);
  const completedBeforeThisSession =
    todayTotal -
    Math.max(
      0,
      Math.floor(
        (tick - new Date(app.activeTimer.startedAt).getTime()) / 1000
      )
    );

  const currentSession = Math.max(0, todayTotal - completedBeforeThisSession);

  return (
    <section className="flex min-h-[80vh] flex-col px-5 py-7">
      <button
        onClick={() => navigate("/")}
        className="flex w-fit items-center gap-2 text-sm font-semibold text-stone-600"
      >
        <ArrowLeft size={18} />
        Today
      </button>

      <div className="my-auto text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Currently making time for
        </p>
        <h1 className="mt-3 text-4xl font-bold">{activity.name}</h1>

        <p className="mt-8 font-mono text-6xl font-bold tracking-tight">
          {formatTimer(currentSession)}
        </p>

        <div className="mt-10 rounded-3xl bg-white p-5 text-left shadow-sm">
          <p className="text-sm font-medium text-stone-500">Daily progress</p>
          <p className="mt-2 text-xl font-bold">
            {formatShortDuration(todayTotal)} / {activity.targetMinutes}m
          </p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          app.pauseTimer();
          navigate("/");
        }}
        className="flex w-full items-center justify-center gap-3 rounded-3xl bg-stone-900 py-5 text-lg font-bold text-white"
      >
        <Pause size={24} />
        Pause
      </button>
    </section>
  );
}