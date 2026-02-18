import { Input } from '@repo/ui/input';
import { TagInput } from '@repo/ui/tag-input';
import { toast } from '@repo/ui/toast';
import { type KeyboardEvent, useRef, useState } from 'react';

import { TAG_INPUT_MESSAGES } from './config/messages';
import { ALLOWED_CHARS, TAG_VALIDATION, VALID_TAG } from './config/validation';

type TagValidatorContext = {
  tags: ReadonlyArray<string>;
  maxTags: number;
};

type TagValidator = {
  check: (trimmed: string, ctx: TagValidatorContext) => boolean;
  message: string;
};

// tag validate 를 위한 registry 방식
const TAG_VALIDATORS: readonly TagValidator[] = [
  {
    check: (_, { tags, maxTags }) => tags.length >= maxTags,
    message: TAG_INPUT_MESSAGES.MAX_TAGS,
  },
  {
    check: (trimmed) => !VALID_TAG.test(trimmed),
    message: TAG_INPUT_MESSAGES.INVALID_FORMAT,
  },
  {
    check: (trimmed, { tags }) => tags.includes(trimmed),
    message: TAG_INPUT_MESSAGES.DUPLICATE,
  },
];

export interface TagInputFieldProps {
  tags: ReadonlyArray<string>;
  onTagsChange: (tags: ReadonlyArray<string>) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  maxTags?: number;
}

export function TagInputField({
  tags,
  onTagsChange,
  label,
  placeholder = '태그 입력 후 스페이스바',
  disabled,
  error,
  errorMessage,
  helperText,
  maxTags = TAG_VALIDATION.MAX_TAGS,
}: TagInputFieldProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const showErrorMessage = (error ?? false) && !!errorMessage;
  const showHelperText = !showErrorMessage && !!helperText;
  const isHelperEmpty = !showErrorMessage && !showHelperText;

  function handleInputChange(value: string) {
    if (!ALLOWED_CHARS.test(value)) return;
    if (value.length > TAG_VALIDATION.MAX_LENGTH) {
      setInputValue(value.slice(0, TAG_VALIDATION.MAX_LENGTH));
      return;
    }
    setInputValue(value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== ' ') return;
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const failed = TAG_VALIDATORS.find(({ check }) => check(trimmed, { tags, maxTags }));
    if (failed) {
      toast({ title: failed.message, variant: 'error' });
      return;
    }

    onTagsChange([...tags, trimmed]);
    setInputValue('');
  }

  function handleTagRemove(index: number) {
    onTagsChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div className="w-full">
      {label && (
        <Input.Root>
          <Input.Label>{label}</Input.Label>
        </Input.Root>
      )}

      <TagInput
        tags={tags}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onTagRemove={handleTagRemove}
        maxTags={maxTags}
        disabled={disabled}
        placeholder={placeholder}
        error={error ?? false}
        inputRef={inputRef}
      />

      <Input.HelperText
        type={showErrorMessage ? 'error' : 'default'}
        className="min-h-5"
        aria-hidden={isHelperEmpty}
      >
        {showErrorMessage ? errorMessage : showHelperText ? helperText : '\u00A0'}
      </Input.HelperText>
    </div>
  );
}
