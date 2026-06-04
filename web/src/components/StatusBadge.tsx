const roleStyles: Record<string, string> = {
  USER: 'bg-ink-900/8 text-ink-800',
  BUSINESS: 'bg-seal/15 text-seal-dark',
  ADMIN: 'bg-emerald-100 text-emerald-800',
};

export function StatusBadge({
  label,
  type = 'role',
}: {
  label: string;
  type?: 'role' | 'ok' | 'pending' | 'neutral';
}) {
  const className =
    type === 'ok'
      ? 'bg-emerald-100 text-emerald-800'
      : type === 'pending'
        ? 'bg-amber-100 text-amber-800'
        : type === 'neutral'
          ? 'bg-ink-900/8 text-ink-700'
          : roleStyles[label] ?? 'bg-ink-900/8 text-ink-800';

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
