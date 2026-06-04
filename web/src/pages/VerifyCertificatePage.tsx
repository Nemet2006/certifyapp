import { FormEvent, useState } from 'react';
import {
  issuedCertificatesApi,
  type CertificateAuthStatus,
  type CertificateVerifyResponse,
  type IssuedCertificateResponse,
} from '../api/client';
import { Alert } from '../components/Alert';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useBusinessStore } from '../store/businessStore';

const statusLabel: Record<CertificateAuthStatus, { label: string; type: 'ok' | 'pending' | 'neutral' }> = {
  ISSUED: { label: 'Verilib (təsdiq gözləyir)', type: 'pending' },
  AUTHENTIC: { label: 'Rəsmi təsdiqlənib — həqiqi', type: 'ok' },
  REVOKED: { label: 'Saxta / ləğv', type: 'neutral' },
};

export function VerifyCertificatePage() {
  const business = useBusinessStore((s) => s.business);
  const [code, setCode] = useState('');
  const [result, setResult] = useState<CertificateVerifyResponse | null>(null);
  const [match, setMatch] = useState<IssuedCertificateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setMatch(null);
    try {
      const { data } = await issuedCertificatesApi.verify(code);
      setResult(data);
      if (business && data.found) {
        const list = await issuedCertificatesApi.list(business.id);
        const found = list.data.find((c) => c.verificationCode === data.verificationCode);
        setMatch(found ?? null);
      }
    } catch {
      setError('Yoxlama mümkün olmadı');
    } finally {
      setLoading(false);
    }
  };

  const authenticate = async () => {
    if (!business || !match) return;
    setLoading(true);
    try {
      await issuedCertificatesApi.authenticate(business.id, match.id);
      const { data } = await issuedCertificatesApi.verify(code);
      setResult(data);
      setMatch({ ...match, authStatus: 'AUTHENTIC' });
      setError(null);
    } catch {
      setError('Təsdiq edilmədi');
    } finally {
      setLoading(false);
    }
  };

  const revoke = async () => {
    if (!business || !match) return;
    const reason = window.prompt('Səbəb (saxta sertifikat):', 'Təşkilatımız bu sertifikatı verməyib');
    if (reason === null) return;
    setLoading(true);
    try {
      await issuedCertificatesApi.revoke(business.id, match.id, reason);
      const { data } = await issuedCertificatesApi.verify(code);
      setResult(data);
      setMatch({ ...match, authStatus: 'REVOKED', revokedReason: reason });
    } catch {
      setError('Ləğv edilmədi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up max-w-2xl">
      <PageHeader
        title="Sertifikat doğrulama"
        description="Kimsə saxta sertifikat göstərə bilər — kodu yoxlayın və «biz vermişik» və ya «saxtadır» deyin"
      />

      <form onSubmit={search} className="card-surface p-6 space-y-4">
        <label className="label-text">Doğrulama kodu (məs: CERT-ABC12XY9)</label>
        <input
          className="input-field font-mono uppercase"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CERT-XXXXXXXX"
          required
        />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Yoxlanır…' : 'Kodu yoxla'}
        </button>
      </form>

      {error && <Alert>{error}</Alert>}

      {result && (
        <div
          className={`card-surface p-6 border-l-4 ${
            !result.found
              ? 'border-l-red-400'
              : result.authStatus === 'AUTHENTIC'
                ? 'border-l-emerald-500'
                : result.authStatus === 'REVOKED'
                  ? 'border-l-red-400'
                  : 'border-l-amber-400'
          }`}
        >
          <p className="text-sm text-ink-700/60 mb-2">Nəticə</p>
          <p className="font-display text-xl text-ink-900">{result.message}</p>
          {result.found && result.authStatus && (
            <div className="mt-3">
              <StatusBadge label={statusLabel[result.authStatus].label} type={statusLabel[result.authStatus].type} />
            </div>
          )}
          {result.found && (
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-700/60">Sertifikat</dt>
                <dd className="font-medium text-ink-900">{result.title}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-700/60">Konullu</dt>
                <dd>{result.holderName ?? result.holderEmail}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-700/60">Təşkilat</dt>
                <dd>{result.businessName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-700/60">Tədbir</dt>
                <dd>{result.eventTitle}</dd>
              </div>
            </dl>
          )}

          {business && match && result.found && (
            <div className="mt-8 pt-6 border-t border-ink-900/8 space-y-3">
              <p className="text-sm font-medium text-ink-800">Sizin təşkilatınızın qərarı</p>
              <p className="text-xs text-ink-700/50">
                «Bəli, biz bu sertifikatı verdik» — rəsmi təsdiq. «Saxtadır» — kod ləğv olunur, mobil yoxlamada görünər.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={authenticate}
                  disabled={loading || match.authStatus === 'AUTHENTIC'}
                >
                  Bəli, biz verdik (təsdiq)
                </button>
                <button
                  type="button"
                  className="btn-secondary text-red-700 border-red-200"
                  onClick={revoke}
                  disabled={loading || match.authStatus === 'REVOKED'}
                >
                  Saxta / etibarsız
                </button>
              </div>
            </div>
          )}

          {result.found && business && !match && (
            <p className="mt-4 text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
              Bu kod başqa təşkilata aiddir — yalnız verən təşkilat təsdiq edə bilər.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
