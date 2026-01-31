importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

firebase.initializeApp(__FIREBASE_CONFIG__);

const messaging = firebase.messaging();

// {
//     "from": "49911282112",
//     "messageId": "6aa0e948-fd17-46a7-8fca-481ca6f671be",
//     "notification": {
//         "title": "운동할 시간이에요",
//         "body": "오늘 루틴을 시작해볼까요?"
//     },
//     "data": {
//         "sessionId": "877",
//         "type": "SESSION_READY",
//         "userId": "12",
//         "ts": "2026-01-31T21:14:00.053557414",
//         "routineId": "23"
//     }
// }

messaging.onBackgroundMessage((payload) => {
  try {
    console.log('[push-sw] raw_payload', payload);
  } catch (error) {
    console.log('[push-sw] raw_payload_log_failed', error);
  }
  const rawData = payload?.data ?? {};
  const data = normalizePushData(rawData);
  const route = resolvePushRoute(data);

  const notification = payload?.notification ?? {};
  const title = notification.title ?? '알림';
  const options = {
    body: notification.body ?? '',
    icon: notification.icon ?? '/icons/icon-192.png',
    data: { ...rawData, ...data, route },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const route = event.notification?.data?.route ?? '/';
  const url = new URL(route.startsWith('/') ? route : `/${route}`, self.location.origin).toString();

  event.waitUntil(
    (async () => {
      try {
        //includeUncontrolled 제거, 컨트롤되는 window client만 반환
        const clientList = await clients.matchAll({ type: 'window' });

        for (const client of clientList) {
          //같은 오리진 탭이면 우선 그 탭으로 이동 시도
          if (client.url.startsWith(self.location.origin)) {
            await client.focus();
            await client.navigate(url);
            return;
          }
        }

        //컨트롤되는 탭이 없으면 새 창
        await clients.openWindow(url);
      } catch (err) {
        //navigate가 뭐든 실패하면 그냥 새 창으로 열게함
        console.log('[push-sw] notificationclick failed -> openWindow', err);
        await clients.openWindow(url);
      }
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
