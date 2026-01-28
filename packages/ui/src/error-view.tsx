export interface ErrorViewProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function ErrorView({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: ErrorViewProps) {
  const action = renderAction(actionLabel, actionHref, onAction);

  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="bg-error-50 text-error-600 flex h-12 w-12 items-center justify-center rounded-full">
        <span className="text-base font-semibold">!</span>
      </div>
      <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
      {description && <p className="text-sm text-neutral-600">{description}</p>}
      {action}
    </section>
  );
}

function renderAction(actionLabel?: string, actionHref?: string, onAction?: () => void) {
  if (!actionLabel) return;

  if (actionHref) {
    return (
      <a
        href={actionHref}
        className="bg-brand-600 hover:bg-brand-700 rounded-md px-4 py-2 text-sm font-medium text-white"
      >
        {actionLabel}
      </a>
    );
  }

  if (!onAction) return;

  return (
    <button
      type="button"
      onClick={onAction}
      className="bg-brand-600 hover:bg-brand-700 rounded-md px-4 py-2 text-sm font-medium text-white"
    >
      {actionLabel}
    </button>
  );
}
