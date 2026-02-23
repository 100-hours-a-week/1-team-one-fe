import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  type ProfileImageUploadUrlDataType,
  type ProfileImageUploadUrlRequestDTO,
  requestProfileImageUploadUrlFn,
} from '@/src/entities/signup';
import { type ApiError } from '@/src/shared/api';

export type ProfileImageUploadMutationOptions = Omit<
  UseMutationOptions<ProfileImageUploadUrlDataType, ApiError, ProfileImageUploadUrlRequestDTO>,
  'mutationFn'
>;

export function useProfileImageUploadMutation(options?: ProfileImageUploadMutationOptions) {
  return useMutation({
    mutationFn: requestProfileImageUploadUrlFn,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
