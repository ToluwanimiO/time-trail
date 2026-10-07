import type { ReturnTypeUseAppData } from "./pageTypes";
import { formatShortDuration } from "../lib/utils";

type Props = {
  app: ReturnTypeUseAppData;
};

export function HistoryPage({ app }: Props) {
  const grouped = app.sessions.reduce<Record<string, typeof app.sessions>>(
    (groups, session) => {
      groups[session.dateKey] ??= [];
      groups[session.dateKey].push(session);
      return groups;
    },
    {}
  );

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <section className="px-5 py-7">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        Look back
      </p>
      <h1 className="mt-1 text-3xl font-bold">History</h1>

      {dates.length === 0 ? (
        <p className="mt-8 text-stone-600">
          Your completed sessions will appear here.
        </p>
      ) : (
        <div className="mt-7 space-y-7">
          {dates.map((dateKey) => {
            const sessions = grouped[dateKey];

            const totals = sessions.reduce<Record<string, number>>(
              (result, session) => {
                result[session.activityId] =
                  (result[session.activityId] ?? 0) + session.durationSeconds;
                return result;
              },
              {}
            );

            return (
              <section key={dateKey}>
                <h2 className="font-bold">
                  {new Date(`${dateKey}T12:00:00`).toLocaleDateString([], {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>

                <div className="mt-3 space-y-3">
                  {Object.entries(totals).map(([activityId, seconds]) => {
  const activity = app.activities.find(
    (item) => item.id === activityId
  );

  const goalSeconds = activity
    ? activity.targetMinutes * 60
    : 0;

  const progress =
    goalSeconds > 0
      ? Math.min(100, (seconds / goalSeconds) * 100)
      : 0;

  const goalReached = seconds >= goalSeconds;

  return (
    <article
      key={activityId}
      className="rounded-2xl bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">
            {activity?.name ?? "Deleted activity"}
          </p>

          <p className="mt-1 text-sm text-stone-500">
            Daily goal:{" "}
            {activity
              ? formatShortDuration(goalSeconds)
              : "Unavailable"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-stone-500">
            Total completed
          </p>

          <p className="font-bold text-emerald-700">
            {formatShortDuration(seconds)}
          </p>
        </div>
      </div>

      {activity && (
        <>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-stone-500">
              {formatShortDuration(seconds)} /{" "}
              {formatShortDuration(goalSeconds)}
            </span>

            <span
              className={
                goalReached
                  ? "font-semibold text-emerald-700"
                  : "text-stone-500"
              }
            >
              {goalReached
                ? "Goal complete"
                : `${Math.round(progress)}%`}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </article>
  );
})}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}