import { mockCertificates } from '../data/mockBusiness';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';

export function CertificatesPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        title="Verilmiş sertifikatlar"
        description="Tədbir iştirakçılarına buraxılan sənədlər"
        action={<button type="button" className="btn-secondary">Toplu generasiya</button>}
      />

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/8 bg-parchment-100/80 text-left text-ink-700/60">
              <th className="px-6 py-4 font-medium">İştirakçı</th>
              <th className="px-6 py-4 font-medium">Tədbir</th>
              <th className="px-6 py-4 font-medium">Tarix</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockCertificates.map((c) => (
              <tr key={c.id} className="border-b border-ink-900/6 hover:bg-parchment-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-ink-900">{c.holderName}</td>
                <td className="px-6 py-4 text-ink-800">{c.eventTitle}</td>
                <td className="px-6 py-4 text-ink-700/70">{c.issuedAt}</td>
                <td className="px-6 py-4">
                  <StatusBadge
                    label={c.status === 'issued' ? 'Verilib' : c.status === 'pending' ? 'Gözləyir' : 'Ləğv'}
                    type={c.status === 'issued' ? 'ok' : 'pending'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
