import { Plus, Trash2 } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { useNavigate,useSearchParams  } from "react-router-dom";
import type { ReturnTypeUseAppData } from "./pageTypes";

type Props = {
  app: ReturnTypeUseAppData;
};

export function ActivitiesPage({ app }: Props) {
  const navigate = useNavigate();
    const [searchParams] = useSearchParams();
  const shouldShowForm = searchParams.get("showForm") === "true";

const [showForm, setShowForm] = useState(app.activities.length === 0 || shouldShowForm);
  const [name, setName] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("30");

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const targetMinutes = Number(hours) * 60 + Number(minutes);

    if (!name.trim() || targetMinutes <= 0) return;

    app.addActivity(name, targetMinutes);
    setName("");
    setHours("0");
    setMinutes("30");
    setShowForm(false);
  }

  return (
    <section className="px-5 py-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Your focus
          </p>
          <h1 className="mt-1 text-3xl font-bold">Activities</h1>
        </div>

        <button
          onClick={() => setShowForm((value) => !value)}
          className="rounded-2xl bg-emerald-700 p-3 text-white"
          aria-label="Add activity"
        >
          <Plus size={23} />
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="mt-6 rounded-3xl bg-white p-5 shadow-sm"
        >
          <h2 className="text-xl font-bold">Add activity</h2>

          <label className="mt-5 block text-sm font-semibold">Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Coding"
            className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600"
          />

          <p className="mt-5 text-sm font-semibold">Daily target</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label>
              <span className="text-sm text-stone-500">Hours</span>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(event) => setHours(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600"
              />
            </label>

            <label>
              <span className="text-sm text-stone-500">Minutes</span>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600"
              />
            </label>
          </div>

          <button className="mt-6 w-full rounded-2xl bg-stone-900 py-3 font-semibold text-white">
            Save activity
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {app.activities.map((activity) => (
          <article
            key={activity.id}
            className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-sm"
          >
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
  className="text-left"
>
              <h2 className="text-lg font-bold">{activity.name}</h2>
              <p className="mt-1 text-sm text-stone-500">
                {activity.targetMinutes >= 60
                  ? `${Math.floor(activity.targetMinutes / 60)}h ${
                      activity.targetMinutes % 60
                        ? `${activity.targetMinutes % 60}m`
                        : ""
                    } per day`
                  : `${activity.targetMinutes}m per day`}
              </p>
            </button>

            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Delete ${activity.name} and all of its saved sessions?`
                  )
                ) {
                  app.deleteActivity(activity.id);
                }
              }}
              className="rounded-xl p-3 text-stone-400 hover:bg-red-50 hover:text-red-600"
              aria-label={`Delete ${activity.name}`}
            >
              <Trash2 size={20} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}