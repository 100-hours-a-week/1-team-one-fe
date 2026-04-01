import { DUP_STATUSES, type DupStatus } from '@repo/ui/form-field';
import { useEffect, useRef, useState } from 'react';
import {
  type Control,
  type UseFormClearErrors,
  type UseFormSetError,
  useWatch,
} from 'react-hook-form';

import { fetchNicknameAvailabilityFn } from '@/src/entities/signup';

import { PROFILE_EDIT_MESSAGES } from '../config/edit-messages';
import type { ProfileEditNicknameValues } from '../model/profile-edit-schema';

interface DupState {
  status: DupStatus;
  message?: string;
}

export function useProfileNicknameDupCheck(
  control: Control<ProfileEditNicknameValues>,
  setError: UseFormSetError<ProfileEditNicknameValues>,
  clearErrors: UseFormClearErrors<ProfileEditNicknameValues>,
) {
  const [state, setState] = useState<DupState>({ status: DUP_STATUSES.idle });
  const lastCheckedRef = useRef<string | undefined>(undefined);
  const currentValue = useWatch({ control, name: 'nickname' });
  const latestValueRef = useRef<string | undefined>(currentValue);
  const prevValueRef = useRef<string | undefined>(currentValue);

  useEffect(() => {
    latestValueRef.current = currentValue;
    const prevValue = prevValueRef.current;

    if (prevValue !== currentValue && state.status !== DUP_STATUSES.idle) {
      setState({ status: DUP_STATUSES.idle });
      lastCheckedRef.current = undefined;
    }

    prevValueRef.current = currentValue;
  }, [currentValue, state.status]);

  const handleCheck = async () => {
    const valueAtCheck = currentValue;

    if (!valueAtCheck) return;
    if (state.status === DUP_STATUSES.checking) return;
    if (lastCheckedRef.current === valueAtCheck && state.status === DUP_STATUSES.available) return;

    setState({ status: DUP_STATUSES.checking, message: PROFILE_EDIT_MESSAGES.DUP_CHECKING });

    try {
      const result = await fetchNicknameAvailabilityFn(valueAtCheck);

      if (latestValueRef.current !== valueAtCheck) return;

      if (result.available) {
        setState({
          status: DUP_STATUSES.available,
          message: PROFILE_EDIT_MESSAGES.NICKNAME_AVAILABLE,
        });
        lastCheckedRef.current = valueAtCheck;
        clearErrors('nickname');
        return;
      }

      setState({
        status: DUP_STATUSES.unavailable,
        message: result.error?.reason ?? PROFILE_EDIT_MESSAGES.NICKNAME_UNAVAILABLE,
      });
      setError('nickname', {
        type: 'duplicate',
        message: result.error?.reason ?? PROFILE_EDIT_MESSAGES.NICKNAME_UNAVAILABLE,
      });
    } catch {
      setState({
        status: DUP_STATUSES.error,
        message: PROFILE_EDIT_MESSAGES.DUP_CHECK_FAILED,
      });
    }
  };

  return { state, handleCheck };
}
