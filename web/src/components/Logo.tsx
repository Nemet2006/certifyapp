export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-seal shadow-glow"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <div>
        <span className="font-display text-2xl tracking-tight text-ink-900">CertifyApp</span>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-700/60">Sertifikat platforması</p>
      </div>
    </div>
  );
}
