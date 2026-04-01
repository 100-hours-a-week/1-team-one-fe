import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  patchProfileImageFn,
  type UpdateProfileImageRequestDTO,
  type UpdateProfileResponseDataType,
  USER_QUERY_KEYS,
} from '@/src/entities/user';
import { type ApiError } from '@/src/shared/api';

export type UpdateProfileImageMutationOptions = Omit<
  UseMutationOptions<UpdateProfileResponseDataType, ApiError, UpdateProfileImageRequestDTO>,
  'mutationFn' | 'mutationKey'
>;

export function useUpdateProfileImageMutation(options?: UpdateProfileImageMutationOptions) {
  return useMutation({
    mutationKey: USER_QUERY_KEYS.updateImage(),
    mutationFn: patchProfileImageFn,
    ...options,
  });
}
