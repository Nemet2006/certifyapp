import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBusinessStore } from '../store/businessStore';

export function BusinessBootstrap({ children }: { children: React.ReactNode }) {
  const email = useAuthStore((s) => s.email);
  const business = useBusinessStore((s) => s.business);
  const loadForEmail = useBusinessStore((s) => s.loadForEmail);

  useEffect(() => {
    if (email && !business) {
      loadForEmail(email);
    }
  }, [email, business, loadForEmail]);

  return <>{children}</>;
}
