import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { attendeesApi, type AttendeeResponse } from '../api/client';
import { Alert } from '../components/Alert';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useBusinessStore } from '../store/businessStore';

export function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const business = useBusinessStore((s) => s.business);
  const [attendees, setAttendees] = useState<AttendeeResponse[]>([]);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [certTitle, setCertTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!eventId) return;
    try {
      const { data } = await attendeesApi.list(eventId);
      setAttendees(data);
    } catch {
      setError('İştirakçı siyahısı yüklənmədi');
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  const addAttendee = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      await attendeesApi.add(eventId, { email, fullName: fullName || undefined });
      setEmail('');
      setFullName('');
      setSuccess('İştirakçı əlavə olundu');
      await load();
    } catch {
      setError('Əlavə edilmədi');
    } finally {
      setLoading(false);
    }
  };

  const issueAll = async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await attendeesApi.issueAll(eventId, certTitle || undefined);
      setSuccess(`${data.length} sertifikat göndərildi (kodlar yaradıldı)`);
      await load();
    } catch {
      setError('Sertifikat verilmədi');
    } finally {
      setLoading(false);
    }
  };

  const pending = attendees.filter((a) => !a.certificateIssued);

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        title="Tədbir — iştirakçılar"
        description={business ? `${business.name} · konullulara sertifikat göndərin` : 'Təşkilat yüklənir…'}
        action={
          <Link to="/dashboard/events" className="btn-secondary">
            ← Tədbirlər
          </Link>
        }
      />

      {error && <Alert>{error}</Alert>}
      {success && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={addAttendee} className="card-surface p-6 space-y-4">
          <h2 className="font-display text-lg text-ink-900">Konullu əlavə et</h2>
          <p className="text-sm text-ink-700/60">
            Məsələn tələbə təşkilatı: seminar iştirakçısının emailini yazın. Sistem istifadəçi yaradır və ya mövcud hesabı bağlayır.
          </p>
          <div>
            <label className="label-text">Email</label>
            <input className="input-field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="telebe@edu.az" />
          </div>
          <div>
            <label className="label-text">Ad Soyad</label>
            <input className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Aysel Məmmədova" />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            İştirakçı kimi qeyd et
          </button>
        </form>

        <div className="card-surface p-6 space-y-4">
          <h2 className="font-display text-lg text-ink-900">Sertifikat göndər</h2>
          <p className="text-sm text-ink-700/60">
            Bütün qeydə alınmış konullulara unikal doğrulama kodu ilə sertifikat verilir. Mobil tətbiqdə kod ilə yoxlanıla bilər.
          </p>
          <div>
            <label className="label-text">Sertifikat adı (ixtiyari)</label>
            <input
              className="input-field"
              value={certTitle}
              onChange={(e) => setCertTitle(e.target.value)}
              placeholder="Seminar iştirakçısı"
            />
          </div>
          <button type="button" className="btn-primary w-full" onClick={issueAll} disabled={loading || pending.length === 0}>
            {pending.length === 0 ? 'Hamısına verilib' : `${pending.length} konulluya sertifikat göndər`}
          </button>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/8 bg-parchment-100/80 text-left text-ink-700/60">
              <th className="px-6 py-4">Konullu</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Sertifikat</th>
              <th className="px-6 py-4">Doğrulama kodu</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-ink-700/50">
                  Hələ konullu yoxdur — email ilə əlavə edin
                </td>
              </tr>
            ) : (
              attendees.map((a) => (
                <tr key={a.participationId} className="border-b border-ink-900/6">
                  <td className="px-6 py-4 font-medium">{a.fullName ?? '—'}</td>
                  <td className="px-6 py-4">{a.email}</td>
                  <td className="px-6 py-4">
                    {a.certificateIssued ? (
                      <StatusBadge label="Verilib" type="ok" />
                    ) : (
                      <StatusBadge label="Gözləyir" type="pending" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-seal-dark">
                    {a.verificationCode ?? '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
