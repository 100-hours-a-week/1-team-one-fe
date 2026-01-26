import { ROUTES } from '@/src/shared/routes/routes';

import type { PushNotificationData, PushNotificationType } from '../model/types';

type RouteResolver = (data: PushNotificationData) => string;

const ROUTE_BY_TYPE: Record<PushNotificationType, RouteResolver> = {
  SESSION_READY: (data) => {
    const sessionId = data.sessionId;
    if (sessionId) return `/stretch/${sessionId}`;
    return ROUTES.PLAN;
  },
  ROUTINE_REGEN_DONE: () => ROUTES.PLAN,
};

function logUnknownType(type: string | undefined, data: PushNotificationData): void {
  if (process.env.NODE_ENV === 'production') return;

  console.warn('[push-notifications] unknown_type', {
    type,
    feature: 'push-notifications',
    route: 'resolve-push-route',
    data,
  });
}
//TODO: 타입 상수화
export function resolvePushRoute(type: string | undefined, data: PushNotificationData): string {
  if (type === 'SESSION_READY' || type === 'ROUTINE_REGEN_DONE') {
    return ROUTE_BY_TYPE[type](data);
  }

  logUnknownType(type, data);
  return ROUTES.PLAN;
}
