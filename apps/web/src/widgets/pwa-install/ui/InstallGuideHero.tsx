import { PWA_INSTALL_MESSAGES } from '../config/messages';

export function InstallGuideHero() {
  return (
    <section className="flex flex-col gap-2">
      <p className="text-brand-600 text-sm font-semibold">PWA</p>
      <h1 className="text-2xl font-semibold text-neutral-900">{PWA_INSTALL_MESSAGES.HERO.TITLE}</h1>
      <p className="text-sm text-neutral-600">{PWA_INSTALL_MESSAGES.HERO.DESCRIPTION}</p>
    </section>
  );
}
