import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  patchProfileNicknameFn,
  type UpdateProfileNicknameRequestDTO,
  type UpdateProfileResponseDataType,
  USER_QUERY_KEYS,
} from '@/src/entities/user';
import { type ApiError } from '@/src/shared/api';

export type UpdateProfileNicknameMutationOptions = Omit<
  UseMutationOptions<UpdateProfileResponseDataType, ApiError, UpdateProfileNicknameRequestDTO>,
  'mutationFn' | 'mutationKey'
>;

export function useUpdateProfileNicknameMutation(options?: UpdateProfileNicknameMutationOptions) {
  return useMutation({
    mutationKey: USER_QUERY_KEYS.updateNickname(),
    mutationFn: patchProfileNicknameFn,
    ...options,
  });
}
