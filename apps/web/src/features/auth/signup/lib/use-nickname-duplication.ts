import { useEffect, useRef, useState } from 'react';
import {
  type Control,
  type UseFormClearErrors,
  type UseFormSetError,
  useWatch,
} from 'react-hook-form';

import { useNicknameAvailabilityQuery } from '../api';
import { FORM_MESSAGES } from '../config/form-messages';
import type { SignupFormValues } from '../model/signup-schema';
import type { DupState } from './types';

export function useNicknameDuplication(
  control: Control<SignupFormValues>,
  setError: UseFormSetError<SignupFormValues>,
  clearErrors: UseFormClearErrors<SignupFormValues>,
) {
  const [state, setState] = useState<DupState>({ status: 'idle' });
  const lastCheckedRef = useRef<string | undefined>(undefined);
  const nicknameValue = useWatch({ control, name: 'nickname' });
  const { refetch } = useNicknameAvailabilityQuery(nicknameValue ?? '', { enabled: false });

  useEffect(() => {
    if (nicknameValue !== lastCheckedRef.current && lastCheckedRef.current !== undefined) {
      setState({
        status: 'idle',
        message: FORM_MESSAGES.ERROR.NICKNAME_DUP_CHECK_REQUIRED,
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

    setState({ status: 'checking', message: '확인 중...' });

    try {
      const result = await refetch();
      const available = result.data?.available;

      if (nicknameValue !== currentNickname) {
        console.log('Race condition: nickname changed during check');
        return;
      }

      if (available) {
        setState({
          status: 'available',
          message: '사용 가능한 닉네임입니다.',
        });
        lastCheckedRef.current = currentNickname;
        clearErrors('nickname');
      } else if (available === false) {
        setState({
          status: 'unavailable',
          message: FORM_MESSAGES.ERROR.NICKNAME_UNAVAILABLE,
        });
        setError('nickname', {
          type: 'duplicate',
          message: FORM_MESSAGES.ERROR.NICKNAME_UNAVAILABLE,
        });
      } else {
        setState({
          status: 'error',
          message: FORM_MESSAGES.ERROR.NICKNAME_DUP_CHECK_FAILED,
        });
      }
    } catch (error) {
      if (nicknameValue !== currentNickname) {
        return;
      }

      setState({
        status: 'error',
        message: FORM_MESSAGES.ERROR.NICKNAME_DUP_CHECK_FAILED,
      });
      console.error('Nickname duplication check failed:', error);
    }
  };

  return {
    state,
    handleCheck,
  };
}
