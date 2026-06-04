import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { Alert } from '../components/Alert';
import { useAuthStore } from '../store/authStore';
import { useBusinessStore } from '../store/businessStore';

export function LoginPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const loadBusiness = useBusinessStore((s) => s.loadForEmail);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      setTokens(data.accessToken, data.refreshToken, email);
      await loadBusiness(email);
      navigate('/dashboard');
    } catch {
      setError('Giriş uğursuz oldu. API işləyir? Email və şifrəni yoxlayın.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl text-ink-900 mb-2">Biznes girişi</h2>
      <p className="text-ink-700/60 mb-8">Təşkilat hesabınızla idarə panelinə daxil olun</p>

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="label-text">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="siz@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="label-text">
            Şifrə
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Gözləyin…' : 'Daxil ol'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-700/60">
        Hesabınız yoxdur?{' '}
        <Link to="/register" className="font-medium text-ink-900 hover:text-seal-dark transition-colors">
          Qeydiyyat
        </Link>
      </p>
    </div>
  );
}
