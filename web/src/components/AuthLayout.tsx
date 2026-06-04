import { Link, Outlet } from 'react-router-dom';
import { Logo } from './Logo';

export function AuthLayout() {
  return (
    <div className="grain min-h-screen flex">
      <section className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-ink-900 text-parchment-100 flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-seal/30 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-ink-700 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>
        <Logo className="relative z-10 [&_span]:text-parchment-50 [&_p]:text-parchment-200/50 [&_div:first-child]:bg-seal [&_div:first-child]:text-ink-950" />
        <div className="relative z-10 space-y-6 max-w-md">
          <h1 className="font-display text-4xl xl:text-5xl leading-tight text-parchment-50">
            Biznes portalı
          </h1>
          <p className="text-parchment-200/80 text-lg leading-relaxed font-light">
            Tədbir təşkilatçıları üçün: sertifikat buraxılışı, çap sifarişləri və iştirakçı idarəetməsi.
            İstifadəçilər mobil tətbiqdən skan edir.
          </p>
          <ul className="space-y-3 text-sm text-parchment-200/70">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-seal" />
              Tədbir və şablon idarəetməsi
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-seal" />
              Toplu PDF generasiya
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-seal" />
              Print-shop sifarişləri
            </li>
          </ul>
        </div>
        <p className="relative z-10 text-xs text-parchment-200/40">© CertifyApp 2026</p>
      </section>

      <section className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-16">
        <div className="lg:hidden mb-10">
          <Logo />
        </div>
        <div className="w-full max-w-md mx-auto animate-fade-up">
          <Outlet />
        </div>
        <p className="mt-8 text-center text-sm text-ink-700/50 lg:hidden">
          <Link to="/" className="hover:text-ink-900 transition-colors">
            Ana səhifəyə qayıt
          </Link>
        </p>
      </section>
    </div>
  );
}
