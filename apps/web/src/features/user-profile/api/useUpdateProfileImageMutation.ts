import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  patchProfileImageFn,
  type UpdateProfileImageRequestDTO,
  type UpdateProfileResponseDataType,
} from '@/src/entities/user';
import { type ApiError } from '@/src/shared/api';

import { USER_PROFILE_QUERY_KEYS } from '../config/query-keys';

export type UpdateProfileImageMutationOptions = Omit<
  UseMutationOptions<UpdateProfileResponseDataType, ApiError, UpdateProfileImageRequestDTO>,
  'mutationFn' | 'mutationKey'
>;

export function useUpdateProfileImageMutation(options?: UpdateProfileImageMutationOptions) {
  return useMutation({
    mutationKey: USER_PROFILE_QUERY_KEYS.updateImage(),
    mutationFn: patchProfileImageFn,
    ...options,
  });
}
