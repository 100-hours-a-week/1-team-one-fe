import Logo from '@/public/icons/logo-with-bg.svg';

export function SplashPage() {
  return (
    <div className="animate-splash-bg from-brand-100 via-brand-200 to-brand-500 text-text-inverse flex min-h-dvh w-full items-center justify-center bg-linear-to-br px-6">
      <div className="animate-splash-fade flex flex-col items-center gap-6 text-center">
        <Logo width={300} height={300} className="animate-logo-float drop-shadow-lg" />
      </div>
    </div>
  );
}
