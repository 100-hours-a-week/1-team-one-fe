export interface ErrorViewProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  actions?: ReadonlyArray<{
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

export function ErrorView({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  actions,
}: ErrorViewProps) {
  const actionItems = actions ?? toSingleAction(actionLabel, actionHref, onAction);
  const action = renderActions(actionItems);

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

function toSingleAction(
  actionLabel?: string,
  actionHref?: string,
  onAction?: () => void,
): ErrorViewProps['actions'] {
  if (!actionLabel) return;
  return [{ label: actionLabel, href: actionHref, onClick: onAction, variant: 'primary' }];
}

function renderActions(actions?: ErrorViewProps['actions']) {
  if (!actions || actions.length === 0) return;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {actions.map((action) => {
        const className =
          action.variant === 'secondary'
            ? 'border-border text-text hover:bg-bg-subtle rounded-md border px-4 py-2 text-sm font-medium'
            : 'bg-brand-600 hover:bg-brand-700 rounded-md px-4 py-2 text-sm font-medium text-white';

        if (action.href) {
          return (
            <a key={action.label} href={action.href} className={className}>
              {action.label}
            </a>
          );
        }

        if (!action.onClick) {
          return null;
        }

        return (
          <button key={action.label} type="button" onClick={action.onClick} className={className}>
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
