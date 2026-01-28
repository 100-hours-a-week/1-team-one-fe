import { PWA_INSTALL_MESSAGES } from '../config/messages';

interface InstallStepsProps {
  isIos: boolean;
}

export function InstallSteps({ isIos }: InstallStepsProps) {
  const title = isIos
    ? PWA_INSTALL_MESSAGES.GUIDE.IOS_TITLE
    : PWA_INSTALL_MESSAGES.GUIDE.DEFAULT_TITLE;
  const steps = isIos
    ? PWA_INSTALL_MESSAGES.GUIDE.IOS_STEPS
    : PWA_INSTALL_MESSAGES.GUIDE.DEFAULT_STEPS;

  return (
    <section className="bg-neutral-0 rounded-xl border border-neutral-200 p-4">
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-neutral-700">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
