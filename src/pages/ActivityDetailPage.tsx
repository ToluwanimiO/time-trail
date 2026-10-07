import { ArrowLeft, Play, Pause, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { ReturnTypeUseAppData } from "./pageTypes";
import {
  formatSessionTime,
  formatShortDuration,
  getLocalDateKey,
} from "../lib/utils";

type Props = {
  app: ReturnTypeUseAppData;
};

export function ActivityDetailPage({ app }: Props) {
  const navigate = useNavigate();
  const { activityId } = useParams();

  const activity = app.activities.find((item) => item.id === activityId);

  if (!activity) {
    return (
      <section className="px-5 py-8">
        <h1 className="text-3xl font-bold">Activity not found.</h1>
      </section>
    );
  }

  const total = app.getTodayTotal(activity.id);
  const target = activity.targetMinutes * 60;
  const progress = Math.min(100, (total / target) * 100);
  const isActive = app.activeTimer?.activityId === activity.id;

  const todaySessions = app.sessions.filter(
    (session) =>
      session.activityId === activity.id &&
      session.dateKey === getLocalDateKey()
  );

  return (
    <section className="px-5 py-7">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-stone-600"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="mt-7 text-3xl font-bold">{activity.name}</h1>
      <p className="mt-2 text-stone-600">Today’s intentional time.</p>

      <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-3xl font-bold">
          {formatShortDuration(total)}
          <span className="text-lg font-medium text-stone-400">
            {" / "}
            {formatShortDuration(target)}
          </span>
        </p>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-emerald-600"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={() => {
            if (isActive) {
              app.pauseTimer();
            } else {
              app.startTimer(activity.id);
              navigate("/timer");
            }
          }}
          disabled={Boolean(app.activeTimer) && !isActive}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 py-4 font-semibold text-white disabled:opacity-40"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          {isActive ? "Pause" : total > 0 ? "Resume" : "Start"}
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Today’s sessions</h2>

        {todaySessions.length === 0 ? (
          <p className="mt-3 text-stone-500">
            No completed sessions yet. Start whenever you are ready.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {[...todaySessions].reverse().map((session) => (
              <article
                key={session.id}
                className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm"
              >
                <p className="text-sm text-stone-600">
                  {formatSessionTime(session.startedAt)} to{" "}
                  {formatSessionTime(session.endedAt)}
                </p>
                <p className="font-bold">
                  {formatShortDuration(session.durationSeconds)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (
            window.confirm(
              `Delete ${activity.name} and all saved sessions for it?`
            )
          ) {
            app.deleteActivity(activity.id);
            navigate("/activities");
          }
        }}
        className="mt-10 flex items-center gap-2 text-sm font-semibold text-red-600"
      >
        <Trash2 size={18} />
        Delete activity
      </button>
    </section>
  );
}