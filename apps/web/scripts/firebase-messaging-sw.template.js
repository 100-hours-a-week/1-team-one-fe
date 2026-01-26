importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

firebase.initializeApp(__FIREBASE_CONFIG__);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload?.notification ?? {};
  const title = notification.title ?? '알림';
  const options = {
    body: notification.body ?? '',
    icon: notification.icon ?? '/icons/icon-192.png',
    data: payload?.data ?? {},
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const route = event.notification?.data?.route ?? '/';
  const url = new URL(route.startsWith('/') ? route : `/${route}`, self.location.origin).toString();

  event.waitUntil(
    (async () => {
      const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });

      for (const client of clientList) {
        if ('focus' in client) {
          await client.focus();
          if ('navigate' in client) {
            await client.navigate(url);
          }
          return;
        }
      }

      await clients.openWindow(url);
    })(),
  );
});

function normalizePushData(rawData) {
  return {
    type: rawData.type,
    sessionId: rawData.sessionId,
    routineId: rawData.routineId,
    jobId: rawData.jobId,
    submissionId: rawData.submissionId,
    reason: rawData.reason,
  };
}

function resolvePushRoute(data) {
  if (data.type === 'SESSION_READY' && data.sessionId) {
    return `/stretch/${data.sessionId}`;
  }
  if (data.type === 'ROUTINE_REGEN_DONE') {
    return '/app/plan';
  }
  return '/app/plan';
}
