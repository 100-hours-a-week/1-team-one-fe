import { PUSH_PERMISSION_PROMPT_STORAGE_KEY } from '../config/constants';

export function markPushPermissionPromptNeeded() {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(PUSH_PERMISSION_PROMPT_STORAGE_KEY, '1');
  } catch {
    return;
  }
}

export function consumePushPermissionPrompt(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const value = window.sessionStorage.getItem(PUSH_PERMISSION_PROMPT_STORAGE_KEY);
    if (!value) return false;
    window.sessionStorage.removeItem(PUSH_PERMISSION_PROMPT_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
