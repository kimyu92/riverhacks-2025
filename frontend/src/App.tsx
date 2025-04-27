import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import HeaderWrapper from './components/layout/HeaderWrapper'
import { useUserStore } from './stores/useUserStore'

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Results = lazy(() => import('./pages/Results'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Organizations = lazy(() => import('./pages/Organizations'))
const OrganizationDetail = lazy(() => import('./pages/OrganizationDetail'))
const OrganizationNew = lazy(() => import('./pages/OrganizationNew'))

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin-only protected route
interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <>
      <HeaderWrapper />
      <Suspense fallback={<div className="flex items-center justify-center h-screen w-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/results" element={<Results />} />

          {/* Protected routes */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/organizations"
            element={
              <AdminRoute>
                <Organizations />
              </AdminRoute>
            }
          />
          <Route
            path="/organizations/new"
            element={
              <AdminRoute>
                <OrganizationNew />
              </AdminRoute>
            }
          />
          <Route
            path="/organizations/:id"
            element={
              <AdminRoute>
                <OrganizationDetail />
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
