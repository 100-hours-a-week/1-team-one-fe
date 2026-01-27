import { Button } from '@repo/ui/button';
import { Carousel, CarouselItem } from '@repo/ui/carousel';
import { cn } from '@repo/ui/lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { ROUTES } from '@/src/shared/routes';
import { usePwaInstall } from '@/src/widgets/pwa-install';

import { ONBOARDING_PWA_GUIDE_MESSAGES } from '../config/messages';

const { TITLE, DESCRIPTION, SLIDES, ACTIONS, INDICATOR_LABEL } = ONBOARDING_PWA_GUIDE_MESSAGES;

//TODO: widget 으로 리팩토링
type Platform = 'ios' | 'browser';

type Slide =
  | {
      key: 'intro';
      title: string;
      description: string;
    }
  | {
      key: 'steps';
      title: string;
      steps: ReadonlyArray<string>;
    };

const resolvePlatform = (): Platform => {
  if (typeof navigator === 'undefined') {
    return 'browser';
  }

  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }

  return 'browser';
};

export function OnboardingPwaGuidePage() {
  const router = useRouter();
  const { status } = usePwaInstall();
  const [platform, setPlatform] = useState<Platform>('browser');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setPlatform(resolvePlatform());
  }, []);

  useEffect(() => {
    if (status !== 'installed') {
      return;
    }

    void router.replace(ROUTES.MAIN);
  }, [router, status]);

  const slides = useMemo<Slide[]>(() => {
    const stepTitle = platform === 'ios' ? SLIDES.IOS_TITLE : SLIDES.BROWSER_TITLE;
    const stepItems = platform === 'ios' ? SLIDES.IOS_STEPS : SLIDES.BROWSER_STEPS;

    return [
      {
        key: 'intro',
        title: SLIDES.INTRO_TITLE,
        description: SLIDES.INTRO_DESCRIPTION,
      },
      {
        key: 'steps',
        title: stepTitle,
        steps: stepItems,
      },
    ];
  }, [platform]);

  const shouldShowNonInstallableHint = platform === 'browser' && status === 'guide';

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const handleContinue = () => {
    void router.push(ROUTES.MAIN);
  };

  return (
    <div className="bg-bg text-text flex min-h-dvh flex-col gap-8 px-6 py-8">
      <header className="flex flex-col gap-2">
        <p className="text-brand-600 text-sm font-semibold">PWA</p>
        <h1 className="text-2xl font-semibold">{TITLE}</h1>
        <p className="text-text-muted text-sm">{DESCRIPTION}</p>
      </header>

      <section className="bg-neutral-0 overflow-hidden rounded-2xl border border-neutral-200">
        <Carousel activeIndex={activeIndex}>
          {slides.map((slide) => (
            <CarouselItem key={slide.key} className="px-5 py-6">
              {slide.key === 'intro' && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-lg font-semibold text-neutral-900">{slide.title}</h2>
                  <p className="text-sm text-neutral-600">{slide.description}</p>
                </div>
              )}
              {slide.key === 'steps' && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-lg font-semibold text-neutral-900">{slide.title}</h2>
                  <ol className="list-decimal space-y-2 pl-4 text-sm text-neutral-700">
                    {slide.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  {shouldShowNonInstallableHint && (
                    <div className="bg-brand-50 text-brand-700 rounded-lg px-3 py-2 text-sm">
                      <p className="font-semibold">{SLIDES.NON_INSTALLABLE_TITLE}</p>
                      <p className="mt-1">{SLIDES.NON_INSTALLABLE_DESCRIPTION}</p>
                    </div>
                  )}
                </div>
              )}
            </CarouselItem>
          ))}
        </Carousel>
      </section>

      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={handlePrev} disabled={activeIndex === 0}>
          {ACTIONS.PREV}
        </Button>
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${INDICATOR_LABEL} ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={cn(
                'h-2.5 w-2.5 rounded-full transition-colors',
                activeIndex === index ? 'bg-brand-500' : 'bg-neutral-200',
              )}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={activeIndex === slides.length - 1}
        >
          {ACTIONS.NEXT}
        </Button>
      </div>

      <Button size="lg" fullWidth onClick={handleContinue}>
        {ACTIONS.CONTINUE}
      </Button>
    </div>
  );
}
