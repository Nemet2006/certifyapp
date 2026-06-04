import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessesApi, healthApi, usersApi } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { mockCertificates, mockEvents, mockPrintOrders } from '../data/mockBusiness';

export function DashboardPage() {
  const [health, setHealth] = useState<'up' | 'down' | 'loading'>('loading');
  const [userCount, setUserCount] = useState<number | null>(null);
  const [businessCount, setBusinessCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([healthApi.auth(), healthApi.user()])
      .then(() => setHealth('up'))
      .catch(() => setHealth('down'));
    usersApi.list().then((r) => setUserCount(r.data.length)).catch(() => setUserCount(null));
    businessesApi.list().then((r) => setBusinessCount(r.data.length)).catch(() => setBusinessCount(null));
  }, []);

  const liveEvents = mockEvents.filter((e) => e.status === 'live').length;
  const pendingPrint = mockPrintOrders.filter((o) => o.status === 'pending').length;

  const stats = [
    { label: 'Aktiv tədbirlər', value: liveEvents, href: '/dashboard/events', accent: 'border-l-seal' },
    { label: 'Sertifikatlar', value: mockCertificates.length, href: '/dashboard/certificates', accent: 'border-l-ink-700' },
    { label: 'Çap gözləyən', value: pendingPrint, href: '/dashboard/print-orders', accent: 'border-l-amber-500' },
    { label: 'İstifadəçilər (API)', value: userCount ?? '—', href: '/dashboard/users', accent: 'border-l-emerald-500' },
    { label: 'Bizneslər (API)', value: businessCount ?? '—', href: '/dashboard/businesses', accent: 'border-l-ink-700' },
    { label: 'Gateway', value: health === 'loading' ? '…' : health === 'up' ? 'Aktiv' : 'Offline', href: null, accent: health === 'up' ? 'border-l-emerald-500' : 'border-l-red-400' },
  ];

  return (
    <div className="space-y-10 animate-fade-up">
      <PageHeader
        title="Biznes idarə paneli"
        description="Tədbirlər, sertifikat buraxılışı və çap əməliyyatları — yalnız təşkilatlar üçün"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat, i) => {
          const inner = (
            <div
              className={`card-surface p-6 border-l-4 ${stat.accent} transition-transform hover:-translate-y-0.5`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <p className="text-sm font-medium text-ink-700/60">{stat.label}</p>
              <p className="mt-2 font-display text-3xl text-ink-900">{stat.value}</p>
            </div>
          );
          return stat.href ? (
            <Link key={stat.label} to={stat.href} className="block focus:outline-none focus:ring-2 focus:ring-seal/30 rounded-2xl">
              {inner}
            </Link>
          ) : (
            <div key={stat.label}>{inner}</div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-6 md:p-8">
          <h2 className="font-display text-xl text-ink-900 mb-4">Yaxınlaşan tədbirlər</h2>
          <ul className="space-y-3">
            {mockEvents.slice(0, 3).map((e) => (
              <li key={e.id} className="flex justify-between items-center py-2 border-b border-ink-900/6 last:border-0">
                <span className="font-medium text-ink-900">{e.title}</span>
                <StatusBadge label={e.status === 'live' ? 'Aktiv' : e.status} type={e.status === 'live' ? 'ok' : 'neutral'} />
              </li>
            ))}
          </ul>
          <Link to="/dashboard/events" className="inline-block mt-4 text-sm font-medium text-seal-dark hover:text-seal">
            Bütün tədbirlər →
          </Link>
        </section>

        <section className="card-surface p-6 md:p-8">
          <h2 className="font-display text-xl text-ink-900 mb-4">Tez əməliyyatlar</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard/events" className="btn-primary">Tədbir yarat</Link>
            <Link to="/dashboard/certificates" className="btn-secondary">Sertifikat ver</Link>
            <Link to="/dashboard/print-orders" className="btn-secondary">Çap sifarişi</Link>
          </div>
          <div className="mt-8 pt-6 border-t border-ink-900/8">
            <p className="text-sm text-ink-700/50 mb-3">Platform modulları</p>
            <div className="flex flex-wrap gap-2">
              {['Auth', 'Users', 'Gateway', 'Events UI'].map((m) => (
                <StatusBadge key={m} label={m} type="ok" />
              ))}
              {['PDF gen', 'Stripe', 'OCR'].map((m) => (
                <StatusBadge key={m} label={m} type="pending" />
              ))}
            </div>
          </div>
        </section>
      </div>

      <p className="text-xs text-ink-700/40 text-center">
        İstifadəçilər mobil tətbiqdən skan / arxiv / çap edir — bu portal yalnız biznes üçündür.
      </p>
    </div>
  );
}
