import { useEffect, useState } from 'react';
import { businessesApi, BusinessResponse } from '../api/client';
import { Alert } from '../components/Alert';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';

export function BusinessesPage() {
  const [items, setItems] = useState<BusinessResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    businessesApi
      .list()
      .then((r) => {
        setItems(r.data);
        setError(null);
      })
      .catch(() => setError('Bizneslər yüklənmədi.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Biznes hesabları</h1>
        <p className="mt-1 text-ink-700/60">Tədbir təşkilatçıları və doğrulama statusu</p>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink-700/50">Yüklənir…</div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Biznes tapılmadı"
            description="Biznes hesabları backend API vasitəsilə yaradılır (rol: BUSINESS)."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/8 bg-parchment-100/50">
                  <th className="px-6 py-3 font-medium text-ink-700/70">Ad</th>
                  <th className="px-6 py-3 font-medium text-ink-700/70">Doğrulanıb</th>
                  <th className="px-6 py-3 font-medium text-ink-700/70">User ID</th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id} className="border-b border-ink-900/5 last:border-0 hover:bg-parchment-50/80">
                    <td className="px-6 py-4 font-medium text-ink-900">{b.name}</td>
                    <td className="px-6 py-4">
                      <StatusBadge label={b.verified ? 'Bəli' : 'Xeyr'} type={b.verified ? 'ok' : 'pending'} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-ink-700/60">{b.userId.slice(0, 8)}…</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
