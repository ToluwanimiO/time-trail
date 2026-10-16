import { useEffect, useState } from "react";

export function EnableNotifications() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function checkPermission() {
      const supported =
        "Notification" in window &&
        window.isSecureContext;

      setVisible(
        supported &&
          Notification.permission !== "granted"
      );
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        checkPermission();
      }
    }

    checkPermission();

    // Recheck if the user changes browser settings and returns.
    window.addEventListener("focus", checkPermission);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener("focus", checkPermission);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  async function enableNotifications() {
    if (!("Notification" in window)) return;

    if (Notification.permission === "denied") {
      setMessage(
        "Notifications are blocked. Allow them in this site's browser settings."
      );
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const permission =
        await Notification.requestPermission();

      if (permission === "granted") {
        setVisible(false);
        return;
      }

      setMessage(
        permission === "denied"
          ? "Notifications were blocked. You can enable them in this site's browser settings."
          : "Permission wasn't granted. You can try again when you're ready."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not request notification permission."
      );
    } finally {
      setBusy(false);
    }
  }

  if (!visible) return null;

  return (
    <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-stone-900">
        Keep your session in sight
      </h2>

      <p className="mt-2 text-sm text-stone-600">
        Allow TimeTrail to show a notification while an
        activity timer is running. Tap it to return to
        your timer.
      </p>

      <button
        type="button"
        onClick={enableNotifications}
        disabled={busy}
        className="mt-4 rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Please wait…" : "Enable notifications"}
      </button>

      {message && (
        <p
          role="status"
          className="mt-3 text-sm text-stone-600"
        >
          {message}
        </p>
      )}
    </section>
  );
}