import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { BusinessesPage } from './pages/BusinessesPage';
import { EventsPage } from './pages/EventsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { PrintOrdersPage } from './pages/PrintOrdersPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';
import { BusinessBootstrap } from './components/BusinessBootstrap';
import { useAuthStore } from './store/authStore';

function ProtectedRoute() {
  const isAuth = useAuthStore((s) => !!s.accessToken);
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function PublicOnly() {
  const isAuth = useAuthStore((s) => !!s.accessToken);
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <BusinessBootstrap>
              <Layout />
            </BusinessBootstrap>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/events" element={<EventsPage />} />
          <Route path="/dashboard/events/:eventId" element={<EventDetailPage />} />
          <Route path="/dashboard/certificates" element={<CertificatesPage />} />
          <Route path="/dashboard/verify" element={<VerifyCertificatePage />} />
          <Route path="/dashboard/print-orders" element={<PrintOrdersPage />} />
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/businesses" element={<BusinessesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
