import { Plus, Play, Pause, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReturnTypeUseAppData } from "./pageTypes";
import { formatShortDuration } from "../lib/utils";
import type { Activity } from "../types";

type Props = {
  app: ReturnTypeUseAppData;
};

export function TodayPage({ app }: Props) {
  const navigate = useNavigate();


  const dateLabel = new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (app.activities.length === 0) {
    return (
        
      <section className="flex min-h-[80vh] flex-col justify-center px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          TIME TRAIL
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          What do you want to make time for?
        </h1>
        <p className="mt-4 max-w-md text-lg leading-8 text-stone-600">
          You do not have to do it all at once. Every small session counts.
        </p>
        <button
          onClick={() => navigate("/activities")}
          className="mt-8 flex w-fit items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-4 font-semibold text-white"
        >
          <Plus size={20} />
          Add your first activity
        </button>
      </section>
    );
  }

  return (
    <section className="px-5 py-7">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        Today
      </p>
      <h1 className="mt-1 text-3xl font-bold">{dateLabel}</h1>
      <p className="mt-2 text-stone-600">You can come back later. Your progress is still here.</p>
        {app.activeTimer && (
  <button
    onClick={() => navigate("/timer")}
    className="mt-5 flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-4 font-semibold text-white"
  >
    Return to running timer
  </button>
)}
<button
        onClick={() => navigate("/activities?showForm=true")}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 px-4 py-4 font-semibold text-stone-700"
      >
        <Plus size={20} />
        Add activity
      </button>
      <div className="mt-7 space-y-4">
        {app.activities.map((activity: Activity) => {
          const totalSeconds = app.getTodayTotal(activity.id);
          const targetSeconds = activity.targetMinutes * 60;
          const remainingSeconds = Math.max(0, targetSeconds - totalSeconds);
          const percent = Math.min(100, (totalSeconds / targetSeconds) * 100);
          const isActive = app.activeTimer?.activityId === activity.id;
          const complete = totalSeconds >= targetSeconds;

          return (
            <article
              key={activity.id}
className={`rounded-3xl border bg-white p-5 shadow-sm ${
    isActive
      ? "border-emerald-500 ring-2 ring-emerald-100"
      : "border-stone-200"
  }`}            >
             <button
  onClick={() => {
    const activityIsRunning =
      app.activeTimer?.activityId === activity.id;

    if (activityIsRunning) {
      navigate("/timer");
    } else {
      navigate(`/activities/${activity.id}`);
    }
  }}
  className="w-full text-left"
>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold">{activity.name}</h2>
                  {complete && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <Check size={14} />
                      Complete
                    </span>
                  )}
                </div>

                <p className="mt-3 text-stone-700">
                  <span className="font-semibold">
                    {formatShortDuration(totalSeconds)}
                  </span>
                  {" / "}
                  {activity.targetMinutes >= 60
                    ? `${Math.floor(activity.targetMinutes / 60)}h ${
                        activity.targetMinutes % 60
                          ? `${activity.targetMinutes % 60}m`
                          : ""
                      }`
                    : `${activity.targetMinutes}m`}
                </p>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-stone-500">
                  {complete
                    ? "Goal complete"
                    : `${formatShortDuration(remainingSeconds)} remaining`}
                </p>
              </button>

              <button
                onClick={() => {
                  if (isActive) {
                    app.pauseTimer();
                  } else {
                    app.startTimer(activity.id);
                    navigate("/timer");
                  }
                }}
                disabled={
                  Boolean(app.activeTimer) && !isActive
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isActive ? <Pause size={19} /> : <Play size={19} />}
                {isActive ? "Pause" : totalSeconds > 0 ? "Resume" : "Start"}
              </button>
            </article>
          );
        })}
      </div>

      
    </section>
  );
}