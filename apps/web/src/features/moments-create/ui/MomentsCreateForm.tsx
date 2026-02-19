import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@repo/ui/toast';
import { useEffect } from 'react';
import { Controller, type FieldErrors, useForm } from 'react-hook-form';

import type { PostCreateDataType } from '@/src/entities/post';
import { ImageUploadField } from '@/src/shared/ui/image-upload';
import { TagInputField } from '@/src/shared/ui/tag-input';
import { TextareaField } from '@/src/shared/ui/textarea';

import { useCreatePostMutation } from '../api/use-create-post-mutation';
import { MOMENTS_CREATE_MESSAGES } from '../config/messages';
import { type MomentsCreateFormValues, momentsCreateSchema } from '../model/moments-create-schema';

interface MomentsCreateFormProps {
  id?: string;
  onFormStateChange?: (state: { isValid: boolean; isSubmitting: boolean }) => void;
  onSuccess?: (data: PostCreateDataType) => void;
}

export function MomentsCreateForm({ id, onFormStateChange, onSuccess }: MomentsCreateFormProps) {
  const { control, handleSubmit, formState } = useForm<MomentsCreateFormValues>({
    mode: 'onChange',
    criteriaMode: 'firstError',
    resolver: zodResolver(momentsCreateSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      images: [],
    },
  });

  const { mutateAsync } = useCreatePostMutation();

  useEffect(() => {
    onFormStateChange?.({ isValid: formState.isValid, isSubmitting: formState.isSubmitting });
  }, [formState.isValid, formState.isSubmitting, onFormStateChange]);

  async function handleFormSubmit(values: MomentsCreateFormValues) {
    const data = await mutateAsync(values, {
      onSuccess: (result) => {
        toast({ title: MOMENTS_CREATE_MESSAGES.TOAST.CREATE_SUCCESS, variant: 'success' });
        onSuccess?.(result);
      },
      onError: () => {
        toast({ title: MOMENTS_CREATE_MESSAGES.TOAST.CREATE_ERROR, variant: 'error' });
      },
    });

    return data;
  }

  function handleInvalid(errors: FieldErrors<MomentsCreateFormValues>) {
    const message =
      errors.title?.message ??
      errors.content?.message ??
      MOMENTS_CREATE_MESSAGES.TOAST.VALIDATION_ERROR;

    toast({ title: message, variant: 'error' });
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit(handleFormSubmit, handleInvalid)}
      className="flex w-full flex-col gap-4"
    >
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextareaField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={MOMENTS_CREATE_MESSAGES.TITLE.PLACEHOLDER}
            maxLength={50}
          />
        )}
      />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <TextareaField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={MOMENTS_CREATE_MESSAGES.CONTENT.PLACEHOLDER}
            variant="with-count"
            maxLength={500}
          />
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagInputField
            tags={field.value}
            onTagsChange={field.onChange}
            label={MOMENTS_CREATE_MESSAGES.TAGS.LABEL}
            helperText={MOMENTS_CREATE_MESSAGES.TAGS.HELPER}
          />
        )}
      />

      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <ImageUploadField images={field.value} onImagesChange={field.onChange} />
        )}
      />
    </form>
  );
}
