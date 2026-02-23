import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@repo/ui/form-field';
import { toast } from '@repo/ui/toast';
import { useEffect } from 'react';
import { Controller, type FieldErrors, useForm } from 'react-hook-form';

import type { MomentsPostFormValues } from '@/src/shared/types';
import { Divider } from '@/src/shared/ui/divider';
import { TagInputField } from '@/src/shared/ui/tag-input';
import { TextareaField } from '@/src/shared/ui/textarea';

import { MOMENTS_POST_FORM_MESSAGES } from '../config/messages';
import { momentsPostFormSchema } from '../model/moments-post-form-schema';
import { MomentsPostImageField } from './MomentsPostImageField';

interface MomentsPostFormProps {
  id?: string;
  defaultValues: MomentsPostFormValues;
  onFormStateChange?: (state: { isValid: boolean; isSubmitting: boolean }) => void;
  onSubmit: (values: MomentsPostFormValues) => Promise<void>;
}

export function MomentsPostForm({
  id,
  defaultValues,
  onFormStateChange,
  onSubmit,
}: MomentsPostFormProps) {
  const { control, handleSubmit, formState } = useForm<MomentsPostFormValues>({
    mode: 'onChange',
    criteriaMode: 'firstError',
    resolver: zodResolver(momentsPostFormSchema),
    defaultValues,
  });

  useEffect(() => {
    onFormStateChange?.({ isValid: formState.isValid, isSubmitting: formState.isSubmitting });
  }, [formState.isValid, formState.isSubmitting, onFormStateChange]);

  async function handleFormSubmit(values: MomentsPostFormValues) {
    await onSubmit(values);
  }

  function handleInvalid(errors: FieldErrors<MomentsPostFormValues>) {
    const message =
      errors.title?.message ??
      errors.content?.message ??
      MOMENTS_POST_FORM_MESSAGES.TOAST.VALIDATION_ERROR;

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
            placeholder={MOMENTS_POST_FORM_MESSAGES.TITLE.PLACEHOLDER}
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
            placeholder={MOMENTS_POST_FORM_MESSAGES.CONTENT.PLACEHOLDER}
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
          <MomentsPostImageField
            images={field.value}
            onImagesChange={field.onChange}
            variant="borderless"
          />
        )}
      />
    </form>
  );
}

MomentsPostForm.displayName = 'MomentsPostForm';
