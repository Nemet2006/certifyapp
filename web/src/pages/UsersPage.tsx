import { FormEvent, useEffect, useState } from 'react';
import { usersApi, UserResponse } from '../api/client';
import { Alert } from '../components/Alert';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';

export function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const load = () => {
    setLoading(true);
    usersApi
      .list()
      .then((r) => {
        setUsers(r.data);
        setError(null);
      })
      .catch(() => setError('İstifadəçilər yüklənmədi. user-service və gateway işləyir?'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await usersApi.create({ email, fullName: fullName || undefined, role: 'USER' });
      setEmail('');
      setFullName('');
      setShowForm(false);
      load();
    } catch {
      setError('İstifadəçi yaradılmadı (email təkrar ola bilər).');
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-900">İstifadəçilər</h1>
          <p className="mt-1 text-ink-700/60">Sistemdə qeydiyyatdan keçən hesablar</p>
        </div>
        <button type="button" className="btn-primary shrink-0" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Bağla' : '+ Yeni istifadəçi'}
        </button>
      </div>

      {error && <Alert>{error}</Alert>}

      {showForm && (
        <form onSubmit={handleCreate} className="card-surface p-6 space-y-4">
          <h2 className="font-medium text-ink-900">Yeni istifadəçi</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label-text">Ad</label>
              <input
                type="text"
                className="input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Yadda saxla
          </button>
        </form>
      )}

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink-700/50">Yüklənir…</div>
        ) : users.length === 0 ? (
          <EmptyState
            title="Hələ istifadəçi yoxdur"
            description="Yuxarıdakı düymə ilə ilk istifadəçini əlavə edin və ya qeydiyyatdan keçin."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/8 bg-parchment-100/50">
                  <th className="px-6 py-3 font-medium text-ink-700/70">Email</th>
                  <th className="px-6 py-3 font-medium text-ink-700/70">Ad</th>
                  <th className="px-6 py-3 font-medium text-ink-700/70">Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-ink-900/5 last:border-0 hover:bg-parchment-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-ink-900">{u.email}</td>
                    <td className="px-6 py-4 text-ink-700/80">{u.fullName ?? '—'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge label={u.role} />
                    </td>
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
