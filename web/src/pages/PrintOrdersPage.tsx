import { mockPrintOrders } from '../data/mockBusiness';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';

const statusLabel: Record<string, { label: string; type: 'ok' | 'pending' | 'neutral' }> = {
  pending: { label: 'Gözləyir', type: 'pending' },
  processing: { label: 'Emalda', type: 'neutral' },
  shipped: { label: 'Göndərilib', type: 'ok' },
  done: { label: 'Tamamlandı', type: 'ok' },
};

export function PrintOrdersPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        title="Çap sifarişləri"
        description="Print-shop və şablon idarəetməsi"
        action={<button type="button" className="btn-primary">+ Yeni sifariş</button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {mockPrintOrders.map((o) => (
          <div key={o.id} className="card-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-ink-700/50 uppercase tracking-wider">#{o.id}</p>
              <h3 className="font-display text-xl text-ink-900 mt-1">{o.template}</h3>
              <p className="text-sm text-ink-700/60 mt-1">{o.quantity} ədəd · {o.createdAt}</p>
            </div>
            <StatusBadge label={statusLabel[o.status].label} type={statusLabel[o.status].type} />
          </div>
        ))}
      </div>

      <div className="card-surface p-6 border-l-4 border-l-seal">
        <h3 className="font-display text-lg text-ink-900">Print-shop inteqrasiyası</h3>
        <p className="mt-2 text-sm text-ink-700/60">
          Stripe webhook və `POST /api/v1/print-orders` backend stub hazırdır. Tam axın növbəti mərhələdə aktivləşəcək.
        </p>
      </div>
    </div>
  );
}
