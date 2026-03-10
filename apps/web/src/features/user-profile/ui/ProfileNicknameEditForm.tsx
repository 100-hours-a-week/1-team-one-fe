import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { FormField } from '@repo/ui/form-field';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { userByIdQueryOptions, userMeQueryOptions } from '@/src/entities/user';

import { useUpdateProfileImageMutation } from '../api/useUpdateProfileImageMutation';
import { useUpdateProfileNicknameMutation } from '../api/useUpdateProfileNicknameMutation';
import { PROFILE_EDIT_MESSAGES } from '../config/edit-messages';
import { useProfileImageUpload } from '../lib/useProfileImageUpload';
import { useProfileNicknameDupCheck } from '../lib/useProfileNicknameDupCheck';
import {
  profileEditNicknameSchema,
  type ProfileEditNicknameValues,
} from '../model/profile-edit-schema';

interface ProfileNicknameEditFormProps {
  authorId: number;
  initialNickname: string;
  imageUpload: ReturnType<typeof useProfileImageUpload>;
  onDone: () => void;
  onCancel: () => void;
}

export function ProfileNicknameEditForm({
  authorId,
  initialNickname,
  imageUpload,
  onDone,
  onCancel,
}: ProfileNicknameEditFormProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateImageMutateAsync } = useUpdateProfileImageMutation();
  const { mutateAsync: updateNicknameMutateAsync } = useUpdateProfileNicknameMutation();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<ProfileEditNicknameValues>({
    resolver: zodResolver(profileEditNicknameSchema),
    mode: 'onSubmit',
    defaultValues: { nickname: initialNickname },
  });

  const dupCheck = useProfileNicknameDupCheck(control, setError, clearErrors);

  const onSubmit = handleSubmit(async ({ nickname }) => {
    const nicknameChanged = nickname !== initialNickname;

    if (nicknameChanged && dupCheck.state.status !== 'available') {
      setError('nickname', {
        type: 'dup-check-required',
        message: PROFILE_EDIT_MESSAGES.NICKNAME_DUP_CHECK_REQUIRED,
      });
      return;
    }

    const tasks: Promise<unknown>[] = [];
    if (imageUpload.filePath) {
      tasks.push(updateImageMutateAsync({ imagePath: imageUpload.filePath }));
    }
    if (nicknameChanged) {
      tasks.push(updateNicknameMutateAsync({ nickname }));
    }

    if (tasks.length === 0) {
      onDone();
      return;
    }

    await Promise.all(tasks);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: userMeQueryOptions().queryKey }),
      queryClient.invalidateQueries({ queryKey: userByIdQueryOptions(authorId).queryKey }),
    ]);
    onDone();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Controller
        name="nickname"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            {...field}
            variant="borderless"
            placeholder={PROFILE_EDIT_MESSAGES.NICKNAME_PLACEHOLDER}
            error={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            duplicationCheck={{
              enabled: true,
              status: dupCheck.state.status,
              message: dupCheck.state.message,
              buttonText: PROFILE_EDIT_MESSAGES.DUP_CHECK_BUTTON,
              disabled: !field.value || dupCheck.state.status === 'checking',
              onCheck: dupCheck.handleCheck,
            }}
          />
        )}
      />

      <div className="flex gap-2">
        <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
          {PROFILE_EDIT_MESSAGES.SUBMIT_BUTTON}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {PROFILE_EDIT_MESSAGES.CANCEL_BUTTON}
        </Button>
      </div>
    </form>
  );
}
