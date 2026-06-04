export interface BusinessEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  status: 'draft' | 'live' | 'ended';
}

export interface IssuedCertificate {
  id: string;
  eventTitle: string;
  holderName: string;
  issuedAt: string;
  status: 'issued' | 'pending' | 'revoked';
}

export interface PrintOrder {
  id: string;
  template: string;
  quantity: number;
  status: 'pending' | 'processing' | 'shipped' | 'done';
  createdAt: string;
}

export const mockEvents: BusinessEvent[] = [
  { id: '1', title: 'Rəqəmsal Marketinq Summit', date: '2026-05-12', location: 'Bakı', participants: 142, status: 'ended' },
  { id: '2', title: 'Python Workshop', date: '2026-06-18', location: 'Online', participants: 58, status: 'live' },
  { id: '3', title: 'Leadership Forum', date: '2026-07-02', location: 'Gəncə', participants: 0, status: 'draft' },
];

export const mockCertificates: IssuedCertificate[] = [
  { id: 'c1', eventTitle: 'Python Workshop', holderName: 'Aysel Məmmədova', issuedAt: '2026-06-18', status: 'issued' },
  { id: 'c2', eventTitle: 'Rəqəmsal Marketinq Summit', holderName: 'Orxan Həsənov', issuedAt: '2026-05-12', status: 'issued' },
  { id: 'c3', eventTitle: 'Leadership Forum', holderName: 'Leyla Quliyeva', issuedAt: '2026-06-01', status: 'pending' },
];

export const mockPrintOrders: PrintOrder[] = [
  { id: 'p1', template: 'Premium A4', quantity: 50, status: 'processing', createdAt: '2026-06-01' },
  { id: 'p2', template: 'Minimal sertifikat', quantity: 120, status: 'pending', createdAt: '2026-06-03' },
];
