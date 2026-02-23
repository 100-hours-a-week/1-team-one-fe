import { TagInput } from '@repo/ui/tag-input';
import { toast } from '@repo/ui/toast';
import { Search } from 'lucide-react';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

import {
  ALLOWED_CHARS,
  TAG_INPUT_MESSAGES,
  TAG_VALIDATION,
  VALID_TAG,
} from '@/src/shared/ui/tag-input';

import { MOMENTS_TAG_SEARCH_MESSAGES } from '../config/messages';

export interface MomentsTagSearchProps {
  defaultTags?: ReadonlyArray<string>;
  onSearch: (tags: ReadonlyArray<string>) => void;
}

const tagValidators = [
  {
    check: (_value: string, currentTags: ReadonlyArray<string>, maxTags: number) =>
      currentTags.length >= maxTags,
    message: TAG_INPUT_MESSAGES.MAX_TAGS,
  },
  {
    check: (value: string) => !VALID_TAG.test(value),
    message: TAG_INPUT_MESSAGES.INVALID_FORMAT,
  },
  {
    check: (value: string, currentTags: ReadonlyArray<string>) => currentTags.includes(value),
    message: TAG_INPUT_MESSAGES.DUPLICATE,
  },
] as const;

function validateTag(value: string, currentTags: ReadonlyArray<string>, maxTags: number) {
  return tagValidators.find((validator) => validator.check(value, currentTags, maxTags));
}

export function MomentsTagSearch({ defaultTags = [], onSearch }: MomentsTagSearchProps) {
  const [tags, setTags] = useState<ReadonlyArray<string>>(defaultTags);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTags(defaultTags);
  }, [defaultTags]);

  function handleInputChange(value: string) {
    if (!ALLOWED_CHARS.test(value)) return;
    if (value.length > TAG_VALIDATION.MAX_LENGTH) {
      setInputValue(value.slice(0, TAG_VALIDATION.MAX_LENGTH));
      return;
    }
    setInputValue(value);
  }

  function handleSearchTrigger() {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      onSearch(tags);
      return;
    }

    const failed = validateTag(trimmed, tags, TAG_VALIDATION.MAX_TAGS);
    if (failed) {
      toast({ title: failed.message, variant: 'error' });
      return;
    }

    const nextTags = [...tags, trimmed];
    setTags(nextTags);
    setInputValue('');
    onSearch(nextTags);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === ' ') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      const failed = validateTag(trimmed, tags, TAG_VALIDATION.MAX_TAGS);
      if (failed) {
        toast({ title: failed.message, variant: 'error' });
        return;
      }

      setTags([...tags, trimmed]);
      setInputValue('');
      return;
    }

    if (e.key !== 'Enter') return;
    e.preventDefault();
    handleSearchTrigger();
  }

  return (
    <div className="w-full">
      <TagInput
        tags={tags}
        variant="borderless"
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onTagRemove={(index) => setTags(tags.filter((_, i) => i !== index))}
        maxTags={TAG_VALIDATION.MAX_TAGS}
        placeholder={MOMENTS_TAG_SEARCH_MESSAGES.PLACEHOLDER}
        inputRef={inputRef}
        action={
          <button
            type="button"
            aria-label={MOMENTS_TAG_SEARCH_MESSAGES.SEARCH_LABEL}
            onClick={handleSearchTrigger}
            className="text-text-subtle hover:text-text focus-visible:ring-focus-ring flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <Search className="h-4 w-4" />
          </button>
        }
      />
    </div>
  );
}

MomentsTagSearch.displayName = 'MomentsTagSearch';
