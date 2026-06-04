import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { issuedCertificatesApi, type IssuedCertificateResponse } from '../api/client';
import { Alert } from '../components/Alert';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useBusinessStore } from '../store/businessStore';

const statusMap = {
  ISSUED: { label: 'Verilib', type: 'pending' as const },
  AUTHENTIC: { label: 'Təsdiqlənib', type: 'ok' as const },
  REVOKED: { label: 'Saxta / ləğv', type: 'neutral' as const },
};

export function CertificatesPage() {
  const business = useBusinessStore((s) => s.business);
  const [certs, setCerts] = useState<IssuedCertificateResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!business) return;
    issuedCertificatesApi
      .list(business.id)
      .then((r) => setCerts(r.data))
      .catch(() => setError('Sertifikatlar yüklənmədi'));
  }, [business?.id]);

  const quickAuth = async (id: string) => {
    if (!business) return;
    await issuedCertificatesApi.authenticate(business.id, id);
    const { data } = await issuedCertificatesApi.list(business.id);
    setCerts(data);
  };

  const quickRevoke = async (id: string) => {
    if (!business) return;
    await issuedCertificatesApi.revoke(business.id, id, 'Saxta sertifikat');
    const { data } = await issuedCertificatesApi.list(business.id);
    setCerts(data);
  };

  if (!business) return <Alert>Təşkilat tapılmadı</Alert>;

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        title="Verilmiş sertifikatlar"
        description="Konullulara göndərilən sənədlər və doğrulama statusu"
        action={
          <Link to="/dashboard/verify" className="btn-secondary">
            Kod ilə yoxla
          </Link>
        }
      />

      {error && <Alert>{error}</Alert>}

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/8 bg-parchment-100/80 text-left text-ink-700/60">
              <th className="px-6 py-4">Konullu</th>
              <th className="px-6 py-4">Tədbir</th>
              <th className="px-6 py-4">Kod</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {certs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-ink-700/50">
                  Hələ sertifikat yoxdur —{' '}
                  <Link to="/dashboard/events" className="text-seal-dark underline">
                    tədbirdən göndərin
                  </Link>
                </td>
              </tr>
            ) : (
              certs.map((c) => (
                <tr key={c.id} className="border-b border-ink-900/6">
                  <td className="px-6 py-4">
                    <p className="font-medium">{c.holderName}</p>
                    <p className="text-xs text-ink-700/50">{c.holderEmail}</p>
                  </td>
                  <td className="px-6 py-4">{c.eventTitle ?? '—'}</td>
                  <td className="px-6 py-4 font-mono text-xs">{c.verificationCode}</td>
                  <td className="px-6 py-4">
                    <StatusBadge label={statusMap[c.authStatus].label} type={statusMap[c.authStatus].type} />
                  </td>
                  <td className="px-6 py-4">
                    {c.authStatus === 'ISSUED' && (
                      <div className="flex gap-2">
                        <button type="button" className="text-xs text-emerald-700 font-medium" onClick={() => quickAuth(c.id)}>
                          Təsdiq
                        </button>
                        <button type="button" className="text-xs text-red-600 font-medium" onClick={() => quickRevoke(c.id)}>
                          Saxta
                        </button>
                      </div>
                    )}
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
