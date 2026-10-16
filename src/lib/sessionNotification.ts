const SESSION_NOTIFICATION_TAG = "timetrail-active-session";

export async function enableSessionNotifications() {
  if (
    !("Notification" in window) ||
    !("serviceWorker" in navigator)
  ) {
    throw new Error(
      "Notifications are not supported in this browser."
    );
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}

export async function showSessionNotification(
  activityName: string,
  startedAt: string
) {
  if (
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;


  await registration.showNotification(
    `${activityName} timer is running`,
    {
      body: `Started at ${startedAt}. Tap to return to your timer.`,
      icon: "/icons/icon-192.png",
      tag: SESSION_NOTIFICATION_TAG,
      data: {
        url: "/timer",
      },
    }
  );
}

export async function removeSessionNotification() {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  const notifications = await registration.getNotifications({
    tag: SESSION_NOTIFICATION_TAG,
  });

  for (const notification of notifications) {
    notification.close();
  }
}