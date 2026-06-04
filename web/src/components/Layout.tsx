import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuthStore } from '../store/authStore';
import { useBusinessStore } from '../store/businessStore';

const nav = [
  { to: '/dashboard', label: 'İdarə paneli', icon: '◆' },
  { to: '/dashboard/events', label: 'Tədbirlər & konullular', icon: '◇' },
  { to: '/dashboard/certificates', label: 'Verilmiş sertifikatlar', icon: '◇' },
  { to: '/dashboard/verify', label: 'Doğrulama (saxta?)', icon: '◇' },
  { to: '/dashboard/print-orders', label: 'Çap', icon: '◇' },
  { to: '/dashboard/users', label: 'İstifadəçilər', icon: '◇' },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, logout } = useAuthStore();
  const business = useBusinessStore((s) => s.business);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="grain min-h-screen flex bg-parchment-50">
      <aside className="hidden lg:flex w-72 flex-col border-r border-ink-900/8 bg-ink-950 text-parchment-100 shrink-0">
        <div className="p-6 border-b border-white/8">
          <Logo className="[&_span]:text-parchment-50 [&_p]:text-parchment-200/50 [&_div:first-child]:bg-seal [&_div:first-child]:text-ink-950" />
          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-seal-light/80 font-medium">
            Biznes portalı
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-0.5">
          {nav.map((item) => {
            const active =
              location.pathname === item.to ||
              (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? 'bg-seal/20 text-seal-light shadow-glow'
                    : 'text-parchment-200/75 hover:bg-white/6 hover:text-parchment-50'
                }`}
              >
                <span className="text-seal-light/60 text-xs">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 m-4 rounded-xl bg-white/5 border border-white/8">
          <p className="text-[10px] uppercase tracking-wider text-parchment-200/40">Təşkilat</p>
          <p className="text-sm truncate mt-1 text-parchment-100 font-medium">{business?.name ?? '—'}</p>
          <p className="text-xs text-parchment-200/40 truncate mt-0.5">{email ?? '—'}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 text-sm text-parchment-200/70 hover:text-seal-light transition-colors"
          >
            Çıxış
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-ink-900/8 bg-parchment-50/95 backdrop-blur-md px-4 py-3">
          <div>
            <Logo />
            <p className="text-[10px] text-ink-700/50 uppercase tracking-wider mt-0.5">Biznes</p>
          </div>
          <button type="button" onClick={handleLogout} className="text-sm font-medium text-ink-700">
            Çıxış
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
