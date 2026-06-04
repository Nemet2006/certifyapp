interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-ink-900">{title}</h1>
        {description ? <p className="mt-2 text-ink-700/60 max-w-xl">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
