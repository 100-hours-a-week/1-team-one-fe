import { Spinner } from '@repo/ui/spinner';
import { Pencil } from 'lucide-react';
import { useRef } from 'react';

interface ProfilePencilBadgeProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  accept?: string;
}

export function ProfilePencilBadge({ onFileSelect, isLoading, accept }: ProfilePencilBadgeProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  return (
    <div className="bg-surface-raised border-bg flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2">
      <button
        type="button"
        onClick={handleClick}
        aria-label="프로필 이미지 변경"
        disabled={isLoading}
        className="flex items-center justify-center"
      >
        {isLoading ? <Spinner size="sm" className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
