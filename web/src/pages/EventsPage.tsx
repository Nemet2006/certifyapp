import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi, type EventResponse } from '../api/client';
import { Alert } from '../components/Alert';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useBusinessStore } from '../store/businessStore';

export function EventsPage() {
  const business = useBusinessStore((s) => s.business);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    if (!business) return;
    try {
      const { data } = await eventsApi.list(business.id);
      setEvents(data);
    } catch {
      setError('Tədbirlər yüklənmədi — backend işləyir?');
    }
  };

  useEffect(() => {
    load();
  }, [business?.id]);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!business) return;
    try {
      await eventsApi.create(business.id, {
        title,
        description: description || undefined,
        endDate: new Date(endDate).toISOString(),
      });
      setTitle('');
      setDescription('');
      setEndDate('');
      setShowForm(false);
      await load();
    } catch {
      setError('Tədbir yaradılmadı');
    }
  };

  if (!business) {
    return <Alert>Əvvəlcə təşkilat hesabınızı qurun (qeydiyyat və ya Dashboard).</Alert>;
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        title="Tədbirlər"
        description={`${business.name} — konulluları qeyd edin və sertifikat göndərin`}
        action={
          <button type="button" className="btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Bağla' : '+ Yeni tədbir'}
          </button>
        }
      />

      {error && <Alert>{error}</Alert>}

      {showForm && (
        <form onSubmit={create} className="card-surface p-6 space-y-4 max-w-lg">
          <h2 className="font-display text-lg">Yeni tədbir</h2>
          <div>
            <label className="label-text">Ad</label>
            <input className="input-field" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Python Seminar" />
          </div>
          <div>
            <label className="label-text">Təsvir</label>
            <input className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label-text">Bitmə tarixi</label>
            <input className="input-field" type="datetime-local" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary">Yarat</button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((ev) => (
          <article key={ev.id} className="card-surface p-6 hover:-translate-y-0.5 transition-transform">
            <h3 className="font-display text-xl text-ink-900">{ev.title}</h3>
            <p className="text-sm text-ink-700/60 mt-2 line-clamp-2">{ev.description ?? '—'}</p>
            <div className="flex gap-2 mt-4">
              <StatusBadge label={`${ev.attendeeCount} konullu`} type="neutral" />
              <StatusBadge label={`${ev.certificatesIssued} sertifikat`} type="ok" />
            </div>
            <Link
              to={`/dashboard/events/${ev.id}`}
              className="inline-block mt-5 text-sm font-medium text-seal-dark hover:text-seal"
            >
              Konullular və sertifikat →
            </Link>
          </article>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-ink-700/50 py-12">İlk tədbirinizi yaradın — sonra email ilə konullu əlavə edin</p>
      )}
    </div>
  );
}
