export type CertificateSource = 'scan' | 'gallery' | 'event';

export interface UserCertificate {
  id: string;
  title: string;
  subtitle?: string;
  imageUri: string;
  createdAt: string;
  source: CertificateSource;
  /** Short code for QR verification demo */
  verificationCode: string;
  printedAt?: string;
}
