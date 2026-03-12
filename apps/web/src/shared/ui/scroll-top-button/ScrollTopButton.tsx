import { ChevronUp } from 'lucide-react';

type ScrollTopButtonProps = {
  ariaLabel: string;
};

export function ScrollTopButton({ ariaLabel }: ScrollTopButtonProps) {
  const handleClick = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleClick}
      className="bg-brand-600 text-on-brand fixed right-4 bottom-6 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition active:scale-95"
    >
      <ChevronUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
