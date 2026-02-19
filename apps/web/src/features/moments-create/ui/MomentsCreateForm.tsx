import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@repo/ui/form-field';
import { toast } from '@repo/ui/toast';
import { useEffect } from 'react';
import { Controller, type FieldErrors, useForm } from 'react-hook-form';

import type { PostCreateDataType } from '@/src/entities/post';
import { Divider } from '@/src/shared/ui/divider';
import { ImageUploadField } from '@/src/shared/ui/image-upload';
import { TagInputField } from '@/src/shared/ui/tag-input';
import { TextareaField } from '@/src/shared/ui/textarea';

import { useCreatePostMutation } from '../api/useCreatePostMutation';
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
        onSuccess?.(result);
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
      className="flex w-full flex-col"
    >
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <FormField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={MOMENTS_CREATE_MESSAGES.TITLE.PLACEHOLDER}
            maxLength={50}
            variant="borderless"
          />
        )}
      />
      <Divider />

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
            styleVariant="borderless"
            maxLength={500}
            rows={4}
            className="min-h-96"
          />
        )}
      />
      <Divider />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagInputField tags={field.value} onTagsChange={field.onChange} variant="borderless" />
        )}
      />
      <Divider />

      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <ImageUploadField
            images={field.value}
            onImagesChange={field.onChange}
            variant="borderless"
          />
        )}
      />
    </form>
  );
}
