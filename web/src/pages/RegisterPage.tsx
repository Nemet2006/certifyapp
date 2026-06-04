import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, businessesApi } from '../api/client';
import { Alert } from '../components/Alert';
import { useAuthStore } from '../store/authStore';
import { useBusinessStore } from '../store/businessStore';

export function RegisterPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const loadBusiness = useBusinessStore((s) => s.loadForEmail);
  const [orgName, setOrgName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await authApi.register(email, password, fullName || undefined, 'BUSINESS');
      setTokens(data.accessToken, data.refreshToken, email);
      await businessesApi.setup(email, orgName);
      await loadBusiness(email, orgName);
      navigate('/dashboard');
    } catch {
      setError('Qeydiyyat tamamlanmadı. Backend (api-gateway + auth-service) işə salınıb?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl text-ink-900 mb-2">Biznes hesabı</h2>
      <p className="text-ink-700/60 mb-8">Təşkilatınız üçün idarə paneli yaradın</p>

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="orgName" className="label-text">
            Təşkilat adı
          </label>
          <input
            id="orgName"
            type="text"
            required
            className="input-field"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="məs: BSU Tələbə Konseyi"
          />
        </div>
        <div>
          <label htmlFor="fullName" className="label-text">
            Əlaqə şəxsi (ad)
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className="input-field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ad Soyad"
          />
        </div>
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
          />
        </div>
        <div>
          <label htmlFor="password" className="label-text">
            Şifrə
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Gözləyin…' : 'Qeydiyyatdan keç'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-700/60">
        Artıq hesabınız var?{' '}
        <Link to="/login" className="font-medium text-ink-900 hover:text-seal-dark transition-colors">
          Daxil ol
        </Link>
      </p>
    </div>
  );
}
