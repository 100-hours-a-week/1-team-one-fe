import { useEffect, useRef, useState } from 'react';
import {
  type Control,
  type UseFormClearErrors,
  type UseFormSetError,
  useWatch,
} from 'react-hook-form';

import { FORM_MESSAGES } from '../config/form-messages';
import type { SignupFormValues } from '../model/signup-schema';
import type { DupState } from './types';

export function useNicknameDuplication(
  control: Control<SignupFormValues>,
  checkFn: (nickname: string) => Promise<{ available: boolean }>,
  setError: UseFormSetError<SignupFormValues>,
  clearErrors: UseFormClearErrors<SignupFormValues>,
) {
  const [state, setState] = useState<DupState>({ status: 'idle' });
  const lastCheckedRef = useRef<string | undefined>(undefined);
  const nicknameValue = useWatch({ control, name: 'nickname' });

  useEffect(() => {
    if (nicknameValue !== lastCheckedRef.current && lastCheckedRef.current !== undefined) {
      setState({
        status: 'idle',
        message: FORM_MESSAGES.NICKNAME.DUP_CHECK_REQUIRED,
      });
    }
  }, [nicknameValue]);

  const handleCheck = async () => {
    const currentNickname = nicknameValue;

    if (!currentNickname) {
      return;
    }

    if (state.status === 'checking') {
      return;
    }

    if (lastCheckedRef.current === currentNickname && state.status === 'available') {
      return;
    }

    setState({ status: 'checking', message: FORM_MESSAGES.NICKNAME.DUP_CHECKING });

    try {
      const result = await checkFn(currentNickname);

      if (nicknameValue !== currentNickname) {
        console.log('Race condition: nickname changed during check');
        return;
      }

      if (result.available) {
        setState({
          status: 'available',
          message: FORM_MESSAGES.NICKNAME.AVAILABLE,
        });
        lastCheckedRef.current = currentNickname;
        clearErrors('nickname');
      } else {
        setState({
          status: 'unavailable',
          message: FORM_MESSAGES.NICKNAME.UNAVAILABLE,
        });
        setError('nickname', {
          type: 'duplicate',
          message: FORM_MESSAGES.NICKNAME.UNAVAILABLE,
        });
      }
    } catch (error) {
      if (nicknameValue !== currentNickname) {
        return;
      }

      setState({
        status: 'error',
        message: FORM_MESSAGES.NICKNAME.DUP_CHECK_FAILED,
      });
      console.error('Nickname duplication check failed:', error);
    }
  };

  return {
    state,
    handleCheck,
  };
}
