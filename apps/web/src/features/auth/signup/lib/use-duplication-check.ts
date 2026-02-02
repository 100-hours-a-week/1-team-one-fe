import { DUP_STATUSES } from '@repo/ui/form-field';
import { useEffect, useRef, useState } from 'react';
import {
  type Control,
  type UseFormClearErrors,
  type UseFormSetError,
  useWatch,
} from 'react-hook-form';

import type { AvailabilityResult } from '../api/types';
import type { SignupFormValues } from '../model/signup-schema';
import type { DupState } from './types';

type DuplicationField = 'email' | 'nickname';

type DuplicationMessages = {
  required: string;
  checking: string;
  available: string;
  unavailable: string;
  failed: string;
};

type AvailabilityQuery = (
  value: string,
  options?: { enabled?: boolean },
) => {
  refetch: () => Promise<{ data?: AvailabilityResult }>;
};

type UseDuplicationCheckArgs = {
  control: Control<SignupFormValues>;
  setError: UseFormSetError<SignupFormValues>;
  clearErrors: UseFormClearErrors<SignupFormValues>;
  field: DuplicationField;
  messages: DuplicationMessages;
  useAvailabilityQuery: AvailabilityQuery;
};

export function useDuplicationCheck({
  control,
  setError,
  clearErrors,
  field,
  messages,
  useAvailabilityQuery,
}: UseDuplicationCheckArgs) {
  const [state, setState] = useState<DupState>({ status: DUP_STATUSES.idle });
  const lastCheckedRef = useRef<string | undefined>(undefined);
  const currentValue = useWatch({ control, name: field });
  const latestValueRef = useRef<string | undefined>(currentValue);
  const prevValueRef = useRef<string | undefined>(currentValue);
  const { refetch } = useAvailabilityQuery(currentValue ?? '', { enabled: false });

  useEffect(() => {
    latestValueRef.current = currentValue;
    const prevValue = prevValueRef.current;
    if (prevValue !== currentValue && state.status !== DUP_STATUSES.idle) {
      setState({
        status: DUP_STATUSES.idle,
        message: currentValue ? messages.required : undefined,
      });
    }

    if (prevValue !== currentValue) {
      lastCheckedRef.current = undefined;
    }

    prevValueRef.current = currentValue;
  }, [currentValue, messages.required, state.status]);

  const handleCheck = async () => {
    const valueAtCheck = currentValue;

    if (!valueAtCheck) return;
    if (state.status === DUP_STATUSES.checking) return;
    if (lastCheckedRef.current === valueAtCheck && state.status === DUP_STATUSES.available) {
      return;
    }

    setState({ status: DUP_STATUSES.checking, message: messages.checking });

    try {
      const result = await refetch();
      const availability = result.data;
      const available = availability?.available;

      if (latestValueRef.current !== valueAtCheck) {
        console.log('Race condition: value changed during check');
        return;
      }

      if (available === true) {
        setState({
          status: DUP_STATUSES.available,
          message: messages.available,
        });
        lastCheckedRef.current = valueAtCheck;
        clearErrors(field);
        return;
      }

      if (available === false) {
        setState({
          status: DUP_STATUSES.unavailable,
          message: messages.unavailable,
        });
        setError(field, {
          type: 'duplicate',
          message: messages.unavailable,
        });
        return;
      }

      setState({
        status: DUP_STATUSES.error,
        message: messages.failed,
      });
    } catch (error) {
      setState({
        status: DUP_STATUSES.error,
        message: messages.failed,
      });
      console.error('Duplication check failed:', error);
    }
  };

  return {
    state,
    handleCheck,
  };
}
