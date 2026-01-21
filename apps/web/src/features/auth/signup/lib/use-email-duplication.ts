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

export function useEmailDuplication(
  control: Control<SignupFormValues>,
  checkFn: (email: string) => Promise<{ available: boolean }>,
  setError: UseFormSetError<SignupFormValues>,
  clearErrors: UseFormClearErrors<SignupFormValues>,
) {
  const [state, setState] = useState<DupState>({ status: 'idle' });
  const lastCheckedRef = useRef<string | undefined>(undefined);
  const emailValue = useWatch({ control, name: 'email' });

  useEffect(() => {
    if (emailValue !== lastCheckedRef.current && lastCheckedRef.current !== undefined) {
      setState({
        status: 'idle',
        message: FORM_MESSAGES.EMAIL.DUP_CHECK_REQUIRED,
      });
    }
  }, [emailValue]);

  const handleCheck = async () => {
    const currentEmail = emailValue;

    if (!currentEmail) {
      return;
    }

    if (state.status === 'checking') {
      return;
    }

    if (lastCheckedRef.current === currentEmail && state.status === 'available') {
      return;
    }

    setState({ status: 'checking', message: FORM_MESSAGES.EMAIL.DUP_CHECKING });

    try {
      const result = await checkFn(currentEmail);

      if (emailValue !== currentEmail) {
        console.log('Race condition: email changed during check');
        return;
      }

      if (result.available) {
        setState({
          status: 'available',
          message: FORM_MESSAGES.EMAIL.AVAILABLE,
        });
        lastCheckedRef.current = currentEmail;
        clearErrors('email');
      } else {
        setState({
          status: 'unavailable',
          message: FORM_MESSAGES.EMAIL.UNAVAILABLE,
        });
        setError('email', {
          type: 'duplicate',
          message: FORM_MESSAGES.EMAIL.UNAVAILABLE,
        });
      }
    } catch (error) {
      if (emailValue !== currentEmail) {
        return;
      }

      setState({
        status: 'error',
        message: FORM_MESSAGES.EMAIL.DUP_CHECK_FAILED,
      });
      console.error('Email duplication check failed:', error);
    }
  };

  return {
    state,
    handleCheck,
  };
}
