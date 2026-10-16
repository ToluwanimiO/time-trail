import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type DocumentPiP = {
  requestWindow(options?: {
    width?: number;
    height?: number;
  }): Promise<Window>;
};

type PiPWindow = Window & {
  documentPictureInPicture?: DocumentPiP;
};

type Props = {
  activityName: string;
  elapsedSeconds: number;
  dailyProgressLabel: string;
  isRunning: boolean;
  onPause: () => void;
};

function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  return [hours, minutes, remainder]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function FloatingTimer({
  activityName,
  elapsedSeconds,
  dailyProgressLabel,
  isRunning,
  onPause,
}: Props) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [error, setError] = useState("");
  const pipRef = useRef<Window | null>(null);

  const supported =
    typeof window !== "undefined" &&
    "documentPictureInPicture" in window;

  useEffect(() => {
    return () => {
      pipRef.current?.close();
    };
  }, []);

  async function openFloatingTimer() {
    const api = (window as PiPWindow).documentPictureInPicture;

    if (!api) {
      setError("Floating timers are not supported in this browser.");
      return;
    }

    if (pipRef.current && !pipRef.current.closed) {
      pipRef.current.focus();
      return;
    }

    try {
      setError("");

      const pipWindow = await api.requestWindow({
        width: 340,
        height: 280,
      });

      pipRef.current = pipWindow;
      pipWindow.document.title = "TimeTrail timer";

      // Copy the app's styles, including Tailwind's compiled CSS.
      document
        .querySelectorAll('link[rel="stylesheet"], style')
        .forEach((node) => {
          pipWindow.document.head.appendChild(node.cloneNode(true));
        });

      pipWindow.document.body.style.margin = "0";
      pipWindow.document.body.style.background = "#fafaf9";

      const root = pipWindow.document.createElement("div");
      pipWindow.document.body.appendChild(root);

      pipWindow.addEventListener(
        "pagehide",
        () => {
          if (pipRef.current === pipWindow) {
            pipRef.current = null;
            setContainer(null);
          }
        },
        { once: true }
      );

      setContainer(root);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not open the floating timer."
      );
    }
  }

  if (!supported) return null;

  return (
    <>
      <button
        type="button"
        onClick={openFloatingTimer}
        className="rounded-2xl  border border-stone-300 px-4 py-3 mb-5 font-semibold"
      >
        Open floating timer
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {container &&
        createPortal(
          <section className="flex min-h-screen flex-col justify-center bg-stone-50 p-6 text-stone-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
              TimeTrail
            </p>

            <h1 className="mt-2 truncate text-xl font-bold">
              {activityName}
            </h1>

            <p className="mt-4 font-mono text-4xl font-bold tabular-nums">
              {formatClock(elapsedSeconds)}
            </p>

            <p className="mt-2 text-sm text-stone-600">
              {dailyProgressLabel}
            </p>

            <button
              type="button"
              onClick={onPause}
              disabled={!isRunning}
              className="mt-5 rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white disabled:bg-stone-300"
            >
              {isRunning ? "Pause" : "Paused — progress saved"}
            </button>
          </section>,
          container
        )}
    </>
  );
}