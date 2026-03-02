import { Button } from '@repo/ui/button';
import { X } from 'lucide-react';

interface LoginCloseButtonProps {
  onClick: () => void;
}

export function LoginCloseButton({ onClick }: LoginCloseButtonProps) {
  return (
    <Button variant="ghost" aria-label="닫기" className="h-9 w-9 p-0" onClick={onClick}>
      <X className="h-5 w-5" />
    </Button>
  );
}
