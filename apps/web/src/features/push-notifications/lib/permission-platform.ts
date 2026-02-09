import { isIosUserAgent, isMobileUserAgent } from '@/src/shared/lib/device/user-agent';

export type PushPermissionPlatform = 'android' | 'desktop' | 'ios';

export function resolvePushPermissionPlatform(userAgent: string): PushPermissionPlatform {
  if (isIosUserAgent(userAgent)) return 'ios';
  if (isMobileUserAgent(userAgent)) return 'android';
  return 'desktop';
}

export function getPushPermissionPlatform(): PushPermissionPlatform {
  if (typeof navigator === 'undefined') return 'desktop';
  return resolvePushPermissionPlatform(navigator.userAgent);
}
