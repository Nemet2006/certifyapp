import { mockEvents } from '../data/mockBusiness';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';

const statusMap = {
  draft: { label: 'Qaralama', type: 'pending' as const },
  live: { label: 'Aktiv', type: 'ok' as const },
  ended: { label: 'Bitib', type: 'neutral' as const },
};

export function EventsPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        title="Tədbirlər"
        description="Sertifikat verilən tədbirləri idarə edin"
        action={<button type="button" className="btn-primary">+ Yeni tədbir</button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockEvents.map((ev, i) => (
          <article
            key={ev.id}
            className="card-surface p-6 hover:-translate-y-0.5 transition-transform"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex justify-between items-start gap-2 mb-4">
              <h3 className="font-display text-xl text-ink-900">{ev.title}</h3>
              <StatusBadge label={statusMap[ev.status].label} type={statusMap[ev.status].type} />
            </div>
            <dl className="space-y-2 text-sm text-ink-700/70">
              <div className="flex justify-between">
                <dt>Tarix</dt>
                <dd className="font-medium text-ink-800">{ev.date}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Yer</dt>
                <dd className="font-medium text-ink-800">{ev.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt>İştirakçı</dt>
                <dd className="font-medium text-seal">{ev.participants}</dd>
              </div>
            </dl>
            <button type="button" className="mt-5 text-sm font-medium text-ink-800 hover:text-seal transition-colors">
              Sertifikatları idarə et →
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
